import generated from './sports.generated.json'

export type SportType = 'walking' | 'running' | 'cycling' | 'swimming'

export type SportActivity = {
  id: string
  type: SportType
  date: string
  distanceKm: number
  durationSec: number
  durationLabel: string
  geojson?: string
  venue?: string
  /** Average SWOLF (swim only); lower is generally better */
  swolf?: number
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}'${String(s).padStart(2, '0')}''`
}

const swimming: SportActivity[] = [
  {
    id: 'swim-2026-07-18',
    type: 'swimming',
    date: '2026-07-18',
    distanceKm: 1,
    durationSec: 39 * 60 + 4,
    durationLabel: formatDuration(39 * 60 + 4),
    venue: 'ECNU Putuo Campus Swimming Pool',
    swolf: 119,
  },
  {
    id: 'swim-2026-07-19',
    type: 'swimming',
    date: '2026-07-19',
    distanceKm: 1.25,
    durationSec: 41 * 60 + 17,
    durationLabel: formatDuration(41 * 60 + 17),
    venue: 'ECNU Putuo Campus Swimming Pool',
    swolf: 96,
  },
  {
    id: 'swim-2026-07-25',
    type: 'swimming',
    date: '2026-07-25',
    distanceKm: 1.2,
    durationSec: 37 * 60 + 52,
    durationLabel: formatDuration(37 * 60 + 52),
    venue: 'ECNU Putuo Campus Swimming Pool',
    swolf: 90,
  },
  {
    id: 'swim-2026-08-01',
    type: 'swimming',
    date: '2026-08-01',
    distanceKm: 1.9,
    durationSec: 51 * 60 + 1,
    durationLabel: formatDuration(51 * 60 + 1),
    venue: 'ECNU Putuo Campus Swimming Pool',
    swolf: 75,
  },
  {
    id: 'swim-2026-08-20',
    type: 'swimming',
    date: '2026-08-20',
    distanceKm: 1.8,
    durationSec: 46 * 60 + 39,
    durationLabel: formatDuration(46 * 60 + 39),
    venue: 'ECNU Putuo Campus Swimming Pool',
    swolf: 74,
  },
  {
    id: 'swim-2026-08-23',
    type: 'swimming',
    date: '2026-08-23',
    distanceKm: 2.0,
    durationSec: 48 * 60 + 7,
    durationLabel: formatDuration(48 * 60 + 7),
    venue: 'ECNU Putuo Campus Swimming Pool',
    swolf: 66,
  },
]

export function formatPacePer100m(distanceKm: number, durationSec: number) {
  const meters = distanceKm * 1000
  if (meters <= 0) return '—'
  const secPer100 = durationSec / (meters / 100)
  return formatDuration(secPer100) + ' /100m'
}

export const sportActivities: SportActivity[] = [
  ...(generated as SportActivity[]),
  ...swimming,
].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

export const sportFilters: { id: 'all' | SportType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'walking', label: 'Walking' },
  { id: 'running', label: 'Running' },
  { id: 'cycling', label: 'Cycling' },
  { id: 'swimming', label: 'Swimming' },
]

export function formatDistance(km: number) {
  if (km >= 10) return `${km.toFixed(1)} km`
  if (km >= 1) return `${km.toFixed(2)} km`
  return `${Math.round(km * 1000)} m`
}

export function typeLabel(type: SportType) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}
