#!/usr/bin/env python3
"""
build-dashboard-data.py

Reads per-category JSON data files + US states GeoJSON.
Computes aggregated dashboard statistics:
  - Category counts and US counts
  - Timeline (year-bucketed counts per category)
  - Per-state counts per category
  - Top state per category

Outputs dashboard/public/dashboard-stats.json (~50-100KB).
"""
import json
import os
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
OUT = os.path.join(ROOT, 'dashboard', 'public', 'dashboard-stats.json')

# Category definitions (must match globe CATEGORIES)
CATEGORIES = [
    {'id': 'volcanoes',        'display': 'Volcanoes',        'color': '#E8632B', 'file': 'volcanoes.json'},
    {'id': 'shipwrecks',       'display': 'Shipwrecks',       'color': '#1B6B8A', 'file': 'shipwrecks.json'},
    {'id': 'bigfoot',          'display': 'Bigfoot Sightings','color': '#3D7A3D', 'file': 'bigfoot.json'},
    {'id': 'fireballs',        'display': 'Fireballs',        'color': '#E82E2E', 'file': 'fireballs.json'},
    {'id': 'earthquakes',      'display': 'Earthquakes',      'color': '#D4920B', 'file': 'earthquakes.json'},
    {'id': 'thermal-springs',  'display': 'Thermal Springs',  'color': '#2DA67A', 'file': 'thermal-springs.json'},
    {'id': 'haunted-places',   'display': 'Haunted Places',   'color': '#A855E8', 'file': 'haunted-places.json'},
    {'id': 'meteorites',       'display': 'Meteorites',       'color': '#4A6FA5', 'file': 'meteorites.json'},
    {'id': 'ufo-sightings',    'display': 'UFO Sightings',    'color': '#0EAEBE', 'file': 'ufo-sightings-2010.json'},
    {'id': 'ghost-towns',      'display': 'Ghost Towns',      'color': '#C45C6A', 'file': 'ghost-towns.json'},
]

# State name → abbreviation lookup
STATE_ABBR = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
}


# ── Point-in-Polygon ─────────────────────────────────────────────────

def bbox(ring):
    """Compute bounding box [min_lng, min_lat, max_lng, max_lat] for a ring."""
    lngs = [p[0] for p in ring]
    lats = [p[1] for p in ring]
    return [min(lngs), min(lats), max(lngs), max(lats)]


def point_in_ring(lng, lat, ring):
    """Ray-casting algorithm for point-in-polygon."""
    n = len(ring)
    inside = False
    j = n - 1
    for i in range(n):
        xi, yi = ring[i]
        xj, yj = ring[j]
        if ((yi > lat) != (yj > lat)) and (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside


def point_in_polygon(lng, lat, geometry):
    """Check if point is in a Polygon or MultiPolygon geometry."""
    if geometry['type'] == 'Polygon':
        coords = geometry['coordinates']
        # Check bbox of outer ring first
        outer = coords[0]
        bb = bbox(outer)
        if lng < bb[0] or lng > bb[2] or lat < bb[1] or lat > bb[3]:
            return False
        if not point_in_ring(lng, lat, outer):
            return False
        # Check holes
        for hole in coords[1:]:
            if point_in_ring(lng, lat, hole):
                return False
        return True
    elif geometry['type'] == 'MultiPolygon':
        for polygon_coords in geometry['coordinates']:
            outer = polygon_coords[0]
            bb = bbox(outer)
            if lng < bb[0] or lng > bb[2] or lat < bb[1] or lat > bb[3]:
                continue
            if not point_in_ring(lng, lat, outer):
                continue
            in_hole = False
            for hole in polygon_coords[1:]:
                if point_in_ring(lng, lat, hole):
                    in_hole = True
                    break
            if not in_hole:
                return True
        return False
    return False


# ── Date parsing ──────────────────────────────────────────────────────

def parse_year(date_str, category_id):
    """Extract year from various date formats. Returns int or None."""
    if not date_str or not isinstance(date_str, str):
        return None

    # Earthquake dates: epoch_ms concatenated with "-01-01"
    # e.g. "1766311037089-01-01"
    if category_id == 'earthquakes':
        try:
            epoch_part = date_str.split('-')[0]
            epoch_ms = int(epoch_part)
            # Convert ms to year (rough: ms / 1000 / 86400 / 365.25 + 1970)
            year = int(epoch_ms / 1000 / 86400 / 365.25) + 1970
            if 1800 <= year <= 2030:
                return year
        except (ValueError, IndexError):
            pass
        return None

    # Standard YYYY-MM-DD or YYYY
    try:
        year = int(date_str[:4])
        if 1800 <= year <= 2030:
            return year
    except (ValueError, IndexError):
        pass
    return None


# ── Main ──────────────────────────────────────────────────────────────

def main():
    # Load US states
    print('Loading US states GeoJSON...')
    with open(os.path.join(DATA, 'us-states.geojson')) as f:
        states_geo = json.load(f)

    # Pre-compute bboxes for quick rejection
    states = []
    for feat in states_geo['features']:
        name = feat['properties']['name']
        abbr = STATE_ABBR.get(name)
        if not abbr:
            # Skip Puerto Rico etc. if not in our lookup
            continue
        geom = feat['geometry']
        # Compute overall bbox
        all_coords = []
        if geom['type'] == 'Polygon':
            all_coords = geom['coordinates'][0]
        elif geom['type'] == 'MultiPolygon':
            for poly in geom['coordinates']:
                all_coords.extend(poly[0])
        bb = bbox(all_coords) if all_coords else [0, 0, 0, 0]
        states.append({
            'name': name,
            'abbr': abbr,
            'geometry': geom,
            'bbox': bb,
        })
    print(f'  Loaded {len(states)} states')

    # US bounding box for quick pre-filter
    US_BBOX = [-180, 17, -65, 72]  # includes Alaska and Hawaii

    def find_state(lng, lat):
        """Find which US state a point is in. Returns state dict or None."""
        if lng < US_BBOX[0] or lng > US_BBOX[2] or lat < US_BBOX[1] or lat > US_BBOX[3]:
            return None
        for st in states:
            bb = st['bbox']
            if lng < bb[0] or lng > bb[2] or lat < bb[1] or lat > bb[3]:
                continue
            if point_in_polygon(lng, lat, st['geometry']):
                return st
        return None

    # Process each category
    total_count = 0
    us_count = 0
    cat_stats = []
    timeline_data = defaultdict(lambda: defaultdict(int))  # year → {cat_id: count}
    state_counts = defaultdict(lambda: defaultdict(int))  # state_abbr → {cat_id: count}
    state_names = {}  # abbr → name

    for cat in CATEGORIES:
        filepath = os.path.join(DATA, cat['file'])
        with open(filepath) as f:
            records = json.load(f)

        count = len(records)
        total_count += count
        cat_us = 0
        cat_state_counts = defaultdict(int)

        for r in records:
            lat = r.get('latitude')
            lng = r.get('longitude')

            # Parse year for timeline
            year = parse_year(r.get('date', ''), cat['id'])
            if year:
                timeline_data[year][cat['id']] += 1

            # State assignment
            if lat is not None and lng is not None:
                st = find_state(lng, lat)
                if st:
                    cat_us += 1
                    state_counts[st['abbr']][cat['id']] += 1
                    state_names[st['abbr']] = st['name']
                    cat_state_counts[st['abbr']] += 1

        us_count += cat_us

        # Find top state for this category
        top_state = ''
        if cat_state_counts:
            top_abbr = max(cat_state_counts, key=cat_state_counts.get)
            top_state = state_names.get(top_abbr, top_abbr)

        cat_stats.append({
            'id': cat['id'],
            'display': cat['display'],
            'color': cat['color'],
            'count': count,
            'usCount': cat_us,
            'topState': top_state,
        })

        pct = (cat_us / count * 100) if count else 0
        print(f'  {cat["display"]:20s} {count:>8,} total  {cat_us:>8,} US ({pct:.0f}%)  top: {top_state}')

    # Build timeline array (sorted by year, only years with data)
    timeline = []
    for year in sorted(timeline_data.keys()):
        entry = {'year': year}
        for cat in CATEGORIES:
            val = timeline_data[year].get(cat['id'], 0)
            if val:
                entry[cat['id']] = val
        timeline.append(entry)

    # Build states array
    states_out = []
    for abbr in sorted(state_counts.keys()):
        total = sum(state_counts[abbr].values())
        states_out.append({
            'name': state_names[abbr],
            'abbr': abbr,
            'total': total,
            'categories': dict(state_counts[abbr]),
        })
    # Sort by total descending
    states_out.sort(key=lambda s: s['total'], reverse=True)

    # Assemble output
    output = {
        'totalCount': total_count,
        'usCount': us_count,
        'categories': cat_stats,
        'timeline': timeline,
        'states': states_out,
    }

    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUT), exist_ok=True)

    with open(OUT, 'w') as f:
        json.dump(output, f, separators=(',', ':'))

    size_kb = os.path.getsize(OUT) / 1024
    print(f'\nTotal: {total_count:,} records, {us_count:,} in US')
    print(f'States with data: {len(states_out)}')
    print(f'Timeline years: {len(timeline)} ({timeline[0]["year"] if timeline else "?"}-{timeline[-1]["year"] if timeline else "?"})')
    print(f'Output: {OUT} ({size_kb:.1f} KB)')


if __name__ == '__main__':
    main()
