#!/usr/bin/env python3
"""Build globe-preview.html with inline data from a template."""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')

# Load topo (land for dots, countries for border lines)
topo = json.dumps(json.load(open(os.path.join(DATA, 'world-110m.json'))), separators=(',',':'))
countries_topo = json.dumps(json.load(open(os.path.join(DATA, 'countries-110m.json'))), separators=(',',':'))

# Load categories
files = {
    'volcanoes': 'volcanoes.json',
    'shipwrecks': 'shipwrecks.json',
    'bigfoot': 'bigfoot.json',
    'fireballs': 'fireballs.json',
    'earthquakes': 'earthquakes.json',
    'thermal-springs': 'thermal-springs.json',
    'haunted-places': 'haunted-places.json',
    'meteorites': 'meteorites.json',
    'ufo-sightings': 'ufo-sightings-2010.json',
    'ghost-towns': 'ghost-towns.json',
}

cat_chunks = []
for cid, fname in files.items():
    data = json.dumps(json.load(open(os.path.join(DATA, fname))), separators=(',',':'))
    cat_chunks.append(f"  '{cid}': {data}")

cat_data_str = 'const CATEGORY_DATA = {\n' + ',\n'.join(cat_chunks) + '\n};'
inline_data = f'const WORLD_TOPO = {topo};\nconst COUNTRIES_TOPO = {countries_topo};\n{cat_data_str}'

# Read chat API proxy URL from environment
chat_api_url = os.environ.get('CHAT_API_URL', '')
chat_api_js = f"const CHAT_API_URL = {json.dumps(chat_api_url)};"

# Read template
template = open(os.path.join(ROOT, 'globe-template.html')).read()
output = template.replace('%%INLINE_DATA%%', inline_data)
output = output.replace('%%CHAT_API_URL%%', chat_api_js)

outname = sys.argv[1] if len(sys.argv) > 1 else 'globe-preview.html'
outpath = os.path.join(ROOT, outname)
open(outpath, 'w').write(output)
print(f'Built {outpath}: {os.path.getsize(outpath)/1024/1024:.1f}MB')
if chat_api_url:
    print(f'Chat API URL: {chat_api_url}')
else:
    print('Chat API URL: not set (chat will show error). Set CHAT_API_URL env var to enable.')
