import DottedMap from 'dotted-map'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const map = new DottedMap({ height: 60, grid: 'diagonal' })
const jsonString = map.getPoints()

writeFileSync(
  join(__dirname, '..', 'src', 'data', 'world-map.json'),
  JSON.stringify(jsonString),
  'utf-8'
)

console.log(`Generated world-map.json with ${jsonString.length} points`)
