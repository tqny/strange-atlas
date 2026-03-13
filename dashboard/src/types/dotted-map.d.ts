declare module 'dotted-map/without-countries' {
  interface MapPoint {
    x: number
    y: number
    lat: number
    lng: number
  }

  interface PinOptions {
    lat: number
    lng: number
    svgOptions?: {
      color?: string
      radius?: number
    }
    data?: unknown
  }

  interface GetSVGOptions {
    shape?: 'circle' | 'hexagon'
    backgroundColor?: string
    color?: string
    radius?: number
  }

  export default class DottedMap {
    constructor(options: { map: unknown })
    addPin(options: PinOptions): void
    getSVG(options?: GetSVGOptions): string
    getPoints(): MapPoint[]
  }
}
