import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

function createCustomIcon(icon, color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 32 16 32s16-23.163 16-32c0-8.837-7.163-16-16-16zm0 24a8 8 0 110-16 8 8 0 010 16z"/>
      <text x="16" y="22" text-anchor="middle" font-size="14" fill="#fff">${icon}</text>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48]
  })
}

function DraggableMarker({ id, position, icon, color, isPreview, mode, onClick, onMove }) {
  const eventHandlers = {
    click: (e) => {
      if (mode !== 'edit' && !isPreview) {
        e.originalEvent.stopPropagation()
        onClick?.()
      }
    },
    dragend: (e) => {
      const marker = e.target
      const newPos = marker.getLatLng()
      onMove?.(newPos.lat, newPos.lng)
    }
  }

  return (
    <Marker
      draggable={mode === 'edit'}
      position={position}
      icon={createCustomIcon(icon, color)}
      eventHandlers={eventHandlers}
    >
      {mode !== 'edit' && !isPreview && (
        <Popup>
          <div className="info-popup">
            <h3>{icon} {id}</h3>
            <p>Координаты: {position[0].toFixed(4)}, {position[1].toFixed(4)}</p>
            <span className="type-badge">{color}</span>
          </div>
        </Popup>
      )}
    </Marker>
  )
}

export default DraggableMarker
