import { useState, useMemo, useCallback } from 'react'
import './App.css'
import SidebarLeft from './components/SidebarLeft'
import SidebarRight from './components/SidebarRight'
import MapView from './components/MapView'
import Modal from './components/Modal'

const OBJECT_TYPES = {
  wellpad: { name: 'Куст скважин', icon: '🛢️', param: 'Уровень добычи', unit: 'т.н/год' },
  upsv: { name: 'УПСВ', icon: '⚙️', param: 'Производительность', unit: 'т.н/год' },
  kns: { name: 'КНС', icon: '💧', param: 'Производительность', unit: 'т.ж/год' },
  cps: { name: 'ЦПС', icon: '🏭', param: 'Производительность', unit: 'т.н/год' },
  node: { name: 'Узел', icon: '🔵', param: null, unit: null }
}

function App() {
  const [objects, setObjects] = useState([])
  const [connections, setConnections] = useState([])
  const [objIdSeq, setObjIdSeq] = useState(1)
  const [pipeIdSeq, setPipeIdSeq] = useState(1)
  
  const [mode, setMode] = useState('view')
  const [addType, setAddType] = useState(null)
  const [addClick, setAddClick] = useState(false)
  
  const [pipeFrom, setPipeFrom] = useState(null)
  const [pipeTo, setPipeTo] = useState(null)
  const [pipeWaypoints, setPipeWaypoints] = useState([])
  
  const [showLayers, setShowLayers] = useState({ map: true, objects: true, pipes: true })
  
  const [selObjId, setSelObjId] = useState(null)
  const [selPipeId, setSelPipeId] = useState(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const addObject = useCallback((lat, lng, type) => {
    const newObj = {
      id: objIdSeq,
      type,
      name: `${OBJECT_TYPES[type].name} ${objIdSeq}`,
      center: [lat, lng],
      params: OBJECT_TYPES[type].param ? { [OBJECT_TYPES[type].param]: 0 } : {}
    }
    setObjects(prev => [...prev, newObj])
    setObjIdSeq(prev => prev + 1)
    setAddClick(false)
    setAddType(null)
    setMode('view')
  }, [objIdSeq])

  const handlePipeClick = useCallback((obj) => {
    if (!pipeFrom) {
      setPipeFrom(obj)
    } else if (!pipeTo && pipeFrom.id !== obj.id) {
      setPipeTo(obj)
      setIsModalOpen(true)
      setIsEditing(false)
      setEditData({
        name: `Труба ${pipeIdSeq}`,
        od: 500,
        idm: 480
      })
    }
  }, [pipeFrom, pipeTo, pipeIdSeq])

  const handleIntermediateClick = useCallback((lat, lng) => {
    if (pipeFrom && !pipeTo) {
      setPipeWaypoints(prev => [...prev, [lat, lng]])
    }
  }, [pipeFrom, pipeTo])

  const handleDblClick = useCallback((lat, lng) => {
    if (pipeFrom && !pipeTo && pipeWaypoints.length > 0) {
      const newNode = {
        id: objIdSeq,
        type: 'node',
        name: `Узел ${objIdSeq}`,
        center: [lat, lng],
        params: {}
      }
      setObjects(prev => [...prev, newNode])
      setObjIdSeq(prev => prev + 1)
      
      const newConn = {
        id: pipeIdSeq,
        name: `Труба ${pipeIdSeq}`,
        from: pipeFrom.id,
        to: newNode.id,
        pts: [pipeFrom.center, ...pipeWaypoints, [lat, lng]],
        od: 500,
        idm: 480
      }
      setConnections(prev => [...prev, newConn])
      setPipeIdSeq(prev => prev + 1)
      
      setPipeFrom(null)
      setPipeTo(null)
      setPipeWaypoints([])
    }
  }, [pipeFrom, pipeTo, pipeWaypoints, objIdSeq, pipeIdSeq])

  const confirmPipe = useCallback((data) => {
    if (!pipeFrom || !pipeTo) return
    
    const allPoints = [pipeFrom.center, ...pipeWaypoints, pipeTo.center]
    
    const newConn = {
      id: pipeIdSeq,
      name: data.name,
      from: pipeFrom.id,
      to: pipeTo.id,
      pts: allPoints,
      od: parseInt(data.od),
      idm: parseInt(data.idm)
    }
    
    setConnections(prev => [...prev, newConn])
    setPipeIdSeq(prev => prev + 1)
    setPipeFrom(null)
    setPipeTo(null)
    setPipeWaypoints([])
    setIsModalOpen(false)
  }, [pipeFrom, pipeTo, pipeWaypoints, pipeIdSeq])

  const cancelPipe = useCallback(() => {
    setPipeFrom(null)
    setPipeTo(null)
    setPipeWaypoints([])
    setIsModalOpen(false)
  }, [])

  const moveObject = useCallback((id, lat, lng) => {
    setObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, center: [lat, lng] } : obj
    ))
    
    setConnections(prev => prev.map(conn => {
      if (conn.from === id || conn.to === id) {
        const newPts = [...conn.pts]
        if (conn.from === id) newPts[0] = [lat, lng]
        if (conn.to === id) newPts[newPts.length - 1] = [lat, lng]
        return { ...conn, pts: newPts }
      }
      return conn
    }))
  }, [])

  const moveWaypoint = useCallback((pipeId, waypointIdx, lat, lng) => {
    setConnections(prev => prev.map(conn => {
      if (conn.id === pipeId) {
        const newPts = [...conn.pts]
        newPts[waypointIdx + 1] = [lat, lng]
        return { ...conn, pts: newPts }
      }
      return conn
    }))
  }, [])

  const removeWaypoint = useCallback((pipeId, waypointIdx) => {
    if (!window.confirm('Удалить точку изгиба?')) return
    
    setConnections(prev => prev.map(conn => {
      if (conn.id === pipeId) {
        const newPts = [...conn.pts]
        newPts.splice(waypointIdx + 1, 1)
        return { ...conn, pts: newPts }
      }
      return conn
    }))
  }, [])

  const deleteObject = useCallback((id) => {
    setObjects(prev => prev.filter(obj => obj.id !== id))
    setConnections(prev => prev.filter(conn => conn.from !== id && conn.to !== id))
    if (selObjId === id) setSelObjId(null)
  }, [selObjId])

  const deletePipe = useCallback((id) => {
    setConnections(prev => prev.filter(conn => conn.id !== id))
    if (selPipeId === id) setSelPipeId(null)
  }, [selPipeId])

  const openEditObject = useCallback((obj) => {
    setIsEditing(true)
    setEditData({
      name: obj.name,
      ...obj.params
    })
    setIsModalOpen(true)
    setSelObjId(obj.id)
  }, [])

  const saveEditObject = useCallback((data) => {
    if (!selObjId) return
    
    const params = {}
    const objType = objects.find(o => o.id === selObjId)?.type
    if (objType && OBJECT_TYPES[objType].param) {
      params[OBJECT_TYPES[objType].param] = parseFloat(data[OBJECT_TYPES[objType].param]) || 0
    }
    
    setObjects(prev => prev.map(obj =>
      obj.id === selObjId ? { ...obj, name: data.name, params } : obj
    ))
    setIsModalOpen(false)
    setSelObjId(null)
  }, [selObjId, objects])

  const openEditPipe = useCallback((conn) => {
    setIsEditing(true)
    setEditData({
      name: conn.name,
      od: conn.od,
      idm: conn.idm
    })
    setIsModalOpen(true)
    setSelPipeId(conn.id)
  }, [])

  const saveEditPipe = useCallback((data) => {
    if (!selPipeId) return
    
    setConnections(prev => prev.map(conn =>
      conn.id === selPipeId
        ? { ...conn, name: data.name, od: parseInt(data.od), idm: parseInt(data.idm) }
        : conn
    ))
    setIsModalOpen(false)
    setSelPipeId(null)
  }, [selPipeId])

  const resetGeometry = useCallback(() => {
    if (!selPipeId) return
    
    setConnections(prev => prev.map(conn => {
      if (conn.id === selPipeId) {
        const fromObj = objects.find(o => o.id === conn.from)
        const toObj = objects.find(o => o.id === conn.to)
        if (fromObj && toObj) {
          return { ...conn, pts: [fromObj.center, toObj.center] }
        }
      }
      return conn
    }))
  }, [selPipeId, objects])

  const handleLayerToggle = useCallback((layer) => {
    setShowLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }, [])

  const getObjectIcon = useCallback((type) => {
    return OBJECT_TYPES[type]?.icon || '📍'
  }, [])

  const getObjectColor = useCallback((type) => {
    const colors = {
      wellpad: '#28a745',
      upsv: '#007bff',
      kns: '#17a2b8',
      cps: '#dc3545',
      node: '#6c757d'
    }
    return colors[type] || '#6c757d'
  }, [])

  const callbacks = useMemo(() => ({
    setMode,
    setAddType,
    setAddClick,
    handlePipeClick,
    handleIntermediateClick,
    handleDblClick,
    confirmPipe,
    cancelPipe,
    moveObject,
    moveWaypoint,
    removeWaypoint,
    deleteObject,
    deletePipe,
    openEditObject,
    saveEditObject,
    openEditPipe,
    saveEditPipe,
    resetGeometry,
    handleLayerToggle,
    setSelObjId,
    setSelPipeId,
    setIsModalOpen,
    setEditData,
    setIsEditing
  }), [handlePipeClick, handleIntermediateClick, handleDblClick, confirmPipe, cancelPipe, moveObject, moveWaypoint, removeWaypoint, deleteObject, deletePipe, openEditObject, saveEditObject, openEditPipe, saveEditPipe, resetGeometry, handleLayerToggle])

  return (
    <>
      <SidebarLeft
        mode={mode}
        addType={addType}
        showLayers={showLayers}
        setMode={callbacks.setMode}
        setAddType={callbacks.setAddType}
        setAddClick={callbacks.setAddClick}
        onLayerToggle={callbacks.handleLayerToggle}
      />
      
      <MapView
        objects={objects}
        connections={connections}
        selObjId={selObjId}
        mode={mode}
        addType={addType}
        addClick={addClick}
        pipeFrom={pipeFrom}
        pipeWaypoints={pipeWaypoints}
        showLayers={showLayers}
        getObjectIcon={getObjectIcon}
        getObjectColor={getObjectColor}
        onMapClick={addClick ? (lat, lng) => addObject(lat, lng, addType) : (pipeFrom && !pipeTo ? handleIntermediateClick : () => {})}
        onMapDblClick={handleDblClick}
        onObjectClick={(obj) => pipeFrom ? handlePipeClick(obj) : null}
        onMoveObject={moveObject}
        moveWaypoint={moveWaypoint}
        removeWaypoint={removeWaypoint}
      />
      
      <SidebarRight
        objects={objects}
        connections={connections}
        selObjId={selObjId}
        selPipeId={selPipeId}
        mode={mode}
        getObjectIcon={getObjectIcon}
        deleteObject={deleteObject}
        deletePipe={deletePipe}
        openEditObject={openEditObject}
        openEditPipe={openEditPipe}
        setSelObjId={setSelObjId}
        setSelPipeId={setSelPipeId}
      />
      
      <Modal
        isOpen={isModalOpen}
        onClose={cancelPipe}
        onSubmit={isEditing ? (editData && objects.find(o => o.id === selObjId) ? saveEditObject : saveEditPipe) : confirmPipe}
        pipeFrom={pipeFrom}
        pipeTo={pipeTo}
        pipeIdSeq={pipeIdSeq}
        editData={editData}
        setEditData={setEditData}
        onResetGeom={resetGeometry}
        isEdit={isEditing}
        isPipe={isEditing && !!selPipeId}
        objects={objects}
      />
    </>
  )
}

export default App
