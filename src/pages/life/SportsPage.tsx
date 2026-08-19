import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  formatDistance,
  sportActivities,
  sportFilters,
  typeLabel,
  type SportActivity,
  type SportType,
} from '../../data/sports'
import { LifePageShell } from '../../components/life/LifePageShell'
import { SwimBoard } from '../../components/life/SwimBoard'
import { TrackMap } from '../../components/life/TrackMap'
import './SportsPage.css'

const ease = [0.22, 1, 0.36, 1] as const

export function SportsPage() {
  const reduce = useReducedMotion()
  const [filter, setFilter] = useState<'all' | SportType>('all')
  const filtered = useMemo(
    () =>
      filter === 'all'
        ? sportActivities
        : sportActivities.filter((a) => a.type === filter),
    [filter],
  )
  const [selectedId, setSelectedId] = useState<string>(filtered[0]?.id ?? '')
  const selected: SportActivity | undefined =
    filtered.find((a) => a.id === selectedId) ?? filtered[0]

  const enter = (delay = 0) =>
    reduce
      ? undefined
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease },
        }

  return (
    <LifePageShell
      title="Sports"
      lead="Selected walks, runs, rides, and pool sessions."
    >
      <motion.div
        className="sports-filters"
        role="tablist"
        aria-label="Sport type"
        {...enter(0.05)}
      >
        {sportFilters.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            className={`sports-filters__btn ${filter === item.id ? 'is-active' : ''}`}
            onClick={() => {
              setFilter(item.id)
              const next =
                item.id === 'all'
                  ? sportActivities[0]
                  : sportActivities.find((a) => a.type === item.id)
              if (next) setSelectedId(next.id)
            }}
          >
            {item.label}
          </button>
        ))}
      </motion.div>

      <div className="sports-layout">
        <motion.div className="sports-list-wrap" {...enter(0.12)}>
          <ul className="sports-list">
            {filtered.map((activity, i) => {
              const active = selected?.id === activity.id
              return (
                <motion.li
                  key={activity.id}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: reduce ? 0 : 0.16 + Math.min(i, 12) * 0.035,
                    ease,
                  }}
                >
                  <button
                    type="button"
                    className={`sports-list__item ${active ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(activity.id)}
                  >
                    <div className="sports-list__top">
                      <span className="sports-list__type">
                        {typeLabel(activity.type)}
                      </span>
                      <time dateTime={activity.date}>{activity.date}</time>
                    </div>
                    <div className="sports-list__stats">
                      <span>{formatDistance(activity.distanceKm)}</span>
                      <span>{activity.durationLabel}</span>
                    </div>
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </motion.div>

        <motion.div className="sports-detail" {...enter(0.22)}>
          {selected ? (
            <>
              <div className="sports-detail__meta">
                <h2>
                  {typeLabel(selected.type)} · {selected.date}
                </h2>
                <p>
                  {selected.type === 'swimming'
                    ? (selected.venue ?? '')
                    : [
                        formatDistance(selected.distanceKm),
                        selected.durationLabel,
                        selected.venue,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                </p>
              </div>
              {selected.geojson ? (
                <TrackMap
                  key={selected.geojson}
                  geojsonUrl={selected.geojson}
                  className="sports-detail__map"
                />
              ) : selected.type === 'swimming' ? (
                <SwimBoard key={selected.id} activity={selected} />
              ) : (
                <div className="sports-detail__empty">
                  No map available for this activity.
                </div>
              )}
            </>
          ) : (
            <div className="sports-detail__empty">No activities in this filter.</div>
          )}
        </motion.div>
      </div>
    </LifePageShell>
  )
}
