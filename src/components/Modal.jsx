function Modal({
  isOpen,
  onClose,
  onSubmit,
  pipeFrom,
  pipeTo,
  pipeIdSeq,
  editData,
  setEditData,
  onResetGeom,
  isEdit,
  isPipe
}) {
  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(editData)
  }

  const handleChange = (field, value) => {
    setEditData?.(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {isEdit
            ? (isPipe ? 'Редактировать трубопровод' : 'Редактировать объект')
            : 'Создание трубопровода'}
        </h2>

        {!isEdit && pipeFrom && pipeTo && (
          <>
            <p style={{ marginBottom: '16px', color: '#666' }}>
              От: {pipeFrom.name} → До: {pipeTo.name}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  value={editData?.name || `Труба ${pipeIdSeq}`}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Название трубопровода"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Внешний ⌀ (мм)</label>
                  <input
                    type="number"
                    value={editData?.od || 500}
                    onChange={(e) => handleChange('od', e.target.value)}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Внутренний ⌀ (мм)</label>
                  <input
                    type="number"
                    value={editData?.idm || 480}
                    onChange={(e) => handleChange('idm', e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Отмена
                </button>
                <button type="submit" className="btn-submit">
                  Создать трубопровод
                </button>
              </div>
            </form>
          </>
        )}

        {isEdit && isPipe && editData && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название</label>
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Внешний ⌀ (мм)</label>
                <input
                  type="number"
                  value={editData.od || 500}
                  onChange={(e) => handleChange('od', e.target.value)}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Внутренний ⌀ (мм)</label>
                <input
                  type="number"
                  value={editData.idm || 480}
                  onChange={(e) => handleChange('idm', e.target.value)}
                  min="1"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-reset" onClick={onResetGeom}>
                ↺ Сбросить геометрию
              </button>
              <button type="button" className="btn-cancel" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="btn-submit">
                Сохранить
              </button>
            </div>
          </form>
        )}

        {isEdit && !isPipe && editData && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название</label>
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            {Object.entries(editData).filter(([key]) => key !== 'name').map(([key, value]) => (
              <div className="form-group" key={key}>
                <label>{key}</label>
                <input
                  type="number"
                  value={value || 0}
                  onChange={(e) => handleChange(key, parseFloat(e.target.value) || 0)}
                />
              </div>
            ))}

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="btn-submit">
                Сохранить
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Modal
