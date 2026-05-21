import { Marker } from 'react-leaflet'
import L from 'leaflet'

const waypointIcon = L.divIcon({
  html: '<div style="width:12px;height:12px;background:#007bff;border:2px solid white;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>',
  className: 'waypoint-marker',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
})

function WaypointMarker({ position, pipeId, waypointIdx, mode, moveWaypoint, removeWaypoint }) {
  const eventHandlers = {
    dragend: (e) => {
      const marker = e.target
      const newPos = marker.getLatLng()
      moveWaypoint?.(pipeId, waypointIdx, newPos.lat, newPos.lng)
    },
    contextmenu: (e) => {
      e.originalEvent.preventDefault()
      if (mode === 'edit') {
        removeWaypoint?.(pipeId, waypointIdx)
      }
    }
  }

  if (mode !== 'edit') return null

  return (
    <Marker
      draggable={true}
      position={position}
      icon={waypointIcon}
      eventHandlers={eventHandlers}
    />
  )
}

export default WaypointMarker
