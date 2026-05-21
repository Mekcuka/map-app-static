function SidebarRight({
  objects,
  connections,
  selObjId,
  selPipeId,
  mode,
  getObjectIcon,
  deleteObject,
  deletePipe,
  openEditObject,
  openEditPipe,
  setSelObjId,
  setSelPipeId
}) {
  return (
    <div className="sidebar-right">
      <div className="section-title">Объекты</div>
      {objects.length === 0 ? (
        <p className="empty-message">Нет объектов</p>
      ) : (
        objects.map(obj => (
          <div
            key={obj.id}
            className="object-item"
            style={{ borderColor: selObjId === obj.id ? '#007bff' : '#ddd' }}
            onClick={() => {
              setSelObjId(obj.id)
              setSelPipeId(null)
            }}
          >
            <div className="object-header">
              <span className="object-name">
                {getObjectIcon(obj.type)} {obj.name}
              </span>
            </div>
            <div className="object-type">{obj.type}</div>
            {mode !== 'view' && (
              <div className="object-actions">
                <button className="btn-edit" onClick={() => openEditObject(obj)}>
                  ✏️ Редактировать
                </button>
                <button className="btn-delete" onClick={() => deleteObject(obj.id)}>
                  🗑️ Удалить
                </button>
              </div>
            )}
          </div>
        ))
      )}

      <div className="section-title" style={{ marginTop: '16px' }}>Трубопроводы</div>
      {connections.length === 0 ? (
        <p className="empty-message">Нет трубопроводов</p>
      ) : (
        connections.map(conn => (
          <div
            key={conn.id}
            className="pipe-item"
            style={{ borderColor: selPipeId === conn.id ? '#007bff' : '#ddd' }}
            onClick={() => {
              setSelPipeId(conn.id)
              setSelObjId(null)
            }}
          >
            <div className="pipe-header">
              <span className="pipe-name">🔧 {conn.name}</span>
            </div>
            <div className="pipe-info">
              ⌀{conn.od}/{conn.idm} мм
            </div>
            {mode !== 'view' && (
              <div className="pipe-actions">
                <button className="btn-edit" onClick={() => openEditPipe(conn)}>
                  ✏️ Редактировать
                </button>
                <button className="btn-delete" onClick={() => deletePipe(conn.id)}>
                  🗑️ Удалить
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default SidebarRight
