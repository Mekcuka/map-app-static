import { MapContainer, TileLayer } from 'react-leaflet'
import { useMemo } from 'react'
import DraggableMarker from './DraggableMarker'
import PipeLine from './PipeLine'
import MapEvents from './MapEvents'

function MapView({
  objects,
  connections,
  selObjId,
  mode,
  addType,
  addClick,
  showLayers,
  getObjectIcon,
  getObjectColor,
  onMapClick,
  onMapDblClick,
  onObjectClick,
  onMoveObject,
  moveWaypoint,
  removeWaypoint
}) {
  const markers = useMemo(() => 
    objects.map(obj => (
      <DraggableMarker
        key={obj.id}
        id={obj.id}
        position={obj.center}
        icon={getObjectIcon(obj.type)}
        color={getObjectColor(obj.type)}
        isPreview={addClick && addType === obj.type}
        isSelected={selObjId === obj.id}
        mode={mode}
        onClick={() => onObjectClick?.(obj)}
        onMove={(lat, lng) => onMoveObject(obj.id, lat, lng)}
      />
    )),
    [objects, addClick, addType, selObjId, mode, getObjectIcon, getObjectColor, onObjectClick, onMoveObject]
  )

  const pipes = useMemo(() =>
    connections.map(conn => (
      <PipeLine
        key={conn.id}
        conn={conn}
        mode={mode}
        moveWaypoint={moveWaypoint}
        removeWaypoint={removeWaypoint}
      />
    )),
    [connections, mode, moveWaypoint, removeWaypoint]
  )

  return (
    <div className="map-container">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        {showLayers.map && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        
        {showLayers.objects && markers}
        {showLayers.pipes && pipes}
        
        <MapEvents
          onMapClick={onMapClick}
          onMapDblClick={onMapDblClick}
        />
      </MapContainer>
    </div>
  )
}

export default MapView
