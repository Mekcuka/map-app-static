import { Polyline } from 'react-leaflet'
import { useMemo } from 'react'
import WaypointMarker from './WaypointMarker'

const PipeLine = ({ conn, mode, moveWaypoint, removeWaypoint }) => {
  const waypoints = useMemo(() => {
    if (conn.pts.length <= 2) return null
    
    return conn.pts.slice(1, -1).map((pt, idx) => (
      <WaypointMarker
        key={idx}
        position={pt}
        pipeId={conn.id}
        waypointIdx={idx}
        mode={mode}
        moveWaypoint={moveWaypoint}
        removeWaypoint={removeWaypoint}
      />
    ))
  }, [conn.pts, conn.id, mode, moveWaypoint, removeWaypoint])

  return (
    <>
      <Polyline
        positions={conn.pts}
        color="#007bff"
        weight={4}
        opacity={0.8}
      />
      {waypoints}
    </>
  )
}

export default PipeLine
