import L from 'leaflet'

type Basemap = {
  url: string
  options: L.TileLayerOptions
}

const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const STREET_BASEMAPS: Basemap[] = [
  {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    },
  },
  {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      attribution: OSM_ATTR,
      maxZoom: 19,
    },
  },
  {
    url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    options: {
      attribution: `${OSM_ATTR}, Tiles &copy; OpenStreetMap France`,
      subdomains: 'abc',
      maxZoom: 19,
    },
  },
]

const TRACK_BASEMAPS: Basemap[] = [
  {
    url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    options: {
      attribution: `${OSM_ATTR} &copy; <a href="https://www.cyclosm.org">CyclOSM</a>`,
      subdomains: 'abc',
      maxZoom: 20,
    },
  },
  {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      attribution: OSM_ATTR,
      maxZoom: 19,
    },
  },
  {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    },
  },
]

const FAIL_TILE_COUNT = 3
const SETTLE_MS = 2800

function loadedTileCount(map: L.Map) {
  const tiles = map.getContainer().querySelectorAll('img.leaflet-tile')
  let good = 0
  tiles.forEach((node) => {
    const img = node as HTMLImageElement
    if (img.complete && img.naturalWidth > 0) good += 1
  })
  return { good, total: tiles.length }
}

function addBasemapWithFallback(map: L.Map, layers: Basemap[]) {
  let layer: L.TileLayer | null = null
  let index = 0
  let errors = 0
  let switching = false
  let timeoutId: number | null = null

  const clearTimer = () => {
    if (timeoutId == null) return
    window.clearTimeout(timeoutId)
    timeoutId = null
  }

  const coverageFailed = () => {
    const { good, total } = loadedTileCount(map)
    if (total === 0) return true
    return good < Math.max(4, Math.ceil(total * 0.5))
  }

  const tryNext = () => {
    if (switching || index >= layers.length - 1) return
    switching = true
    mount(index + 1)
  }

  const onTileError = () => {
    errors += 1
    if (errors >= FAIL_TILE_COUNT) tryNext()
  }

  const mount = (i: number) => {
    const spec = layers[i]
    clearTimer()
    if (layer) {
      layer.off('tileerror', onTileError)
      layer.remove()
    }
    errors = 0
    switching = false
    index = i
    layer = L.tileLayer(spec.url, spec.options)
    layer.on('tileerror', onTileError)
    layer.addTo(map)
    if (i < layers.length - 1) {
      timeoutId = window.setTimeout(() => {
        if (coverageFailed()) tryNext()
      }, SETTLE_MS)
    }
  }

  const onZoomEnd = () => {
    if (index >= layers.length - 1) return
    clearTimer()
    timeoutId = window.setTimeout(() => {
      if (coverageFailed()) tryNext()
    }, SETTLE_MS)
  }

  mount(0)
  map.on('zoomend', onZoomEnd)
  return () => {
    map.off('zoomend', onZoomEnd)
    clearTimer()
    if (layer) {
      layer.off('tileerror', onTileError)
      layer.remove()
    }
    layer = null
  }
}

export function addStreetBasemap(map: L.Map) {
  return addBasemapWithFallback(map, STREET_BASEMAPS)
}

export function addTrackBasemap(map: L.Map) {
  return addBasemapWithFallback(map, TRACK_BASEMAPS)
}
