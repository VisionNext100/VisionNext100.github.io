import {
  formatDistance,
  formatPacePer100m,
  type SportActivity,
} from '../../data/sports'
import './SwimBoard.css'

type Props = {
  activity: SportActivity
}

/** Map SWOLF onto a 0–1 “efficiency” bar (lower SWOLF → fuller bar). */
function swolfScore(swolf: number) {
  const min = 70
  const max = 140
  const clamped = Math.min(max, Math.max(min, swolf))
  return 1 - (clamped - min) / (max - min)
}

export function SwimBoard({ activity }: Props) {
  const distanceM = Math.round(activity.distanceKm * 1000)
  const pace = formatPacePer100m(activity.distanceKm, activity.durationSec)
  const swolf = activity.swolf
  const efficiency = swolf != null ? swolfScore(swolf) : 0
  // Visual “laps” hint for a 50m pool
  const laps = Math.max(1, Math.round(distanceM / 50))
  const laneFill = Math.min(100, (distanceM / 2000) * 100)

  return (
    <div className="swim-board">
      <div className="swim-board__water" aria-hidden="true" />

      <div className="swim-board__top">
        <p className="swim-board__eyebrow">Pool session</p>
      </div>

      <div className="swim-board__hero">
        <div className="swim-board__swolf">
          <span className="swim-board__swolf-label">Avg SWOLF</span>
          <strong className="swim-board__swolf-value">
            {swolf != null ? swolf : '—'}
          </strong>
          <span className="swim-board__swolf-hint">lower is better</span>
          {swolf != null ? (
            <div
              className="swim-board__swolf-meter"
              role="meter"
              aria-valuemin={70}
              aria-valuemax={140}
              aria-valuenow={swolf}
              aria-label="SWOLF efficiency"
            >
              <span style={{ width: `${Math.round(efficiency * 100)}%` }} />
            </div>
          ) : null}
        </div>

        <ul className="swim-board__stats">
          <li>
            <span>Distance</span>
            <strong>{formatDistance(activity.distanceKm)}</strong>
          </li>
          <li>
            <span>Time</span>
            <strong>{activity.durationLabel}</strong>
          </li>
          <li>
            <span>Pace</span>
            <strong>{pace}</strong>
          </li>
          <li>
            <span>Est. lengths</span>
            <strong>{laps} × 50m</strong>
          </li>
        </ul>
      </div>

      <div className="swim-board__lane" aria-hidden="true">
        <div className="swim-board__lane-rail" />
        <div className="swim-board__lane-fill" style={{ width: `${laneFill}%` }}>
          <span className="swim-board__lane-glow" />
        </div>
        <div className="swim-board__lane-markers">
          <span>0</span>
          <span>500m</span>
          <span>1000m</span>
          <span>1500m</span>
          <span>2000m</span>
        </div>
      </div>

      <p className="swim-board__note">
        Indoor pool — no outdoor GPS track. SWOLF averages strokes + seconds per
        length.
      </p>
    </div>
  )
}
