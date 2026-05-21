import { useMapEvents } from 'react-leaflet'

function MapEvents({ onMapClick, onMapDblClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick?.(e.latlng.lat, e.latlng.lng)
    },
    dblclick: (e) => {
      onMapDblClick?.(e.latlng.lat, e.latlng.lng)
    }
  })
  
  return null
}

export default MapEvents
