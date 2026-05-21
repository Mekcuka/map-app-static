function SidebarLeft({ mode, addType, showLayers, setMode, setAddType, setAddClick, onLayerToggle }) {
  const OBJECT_TYPES = {
    wellpad: { name: 'Куст скважин', icon: '🛢️' },
    upsv: { name: 'УПСВ', icon: '⚙️' },
    kns: { name: 'КНС', icon: '💧' },
    cps: { name: 'ЦПС', icon: '🏭' },
    node: { name: 'Узел', icon: '🔵' }
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    if (newMode !== 'place') {
      setAddType(null)
      setAddClick(false)
    }
  }

  const handleObjectTypeSelect = (type) => {
    if (addType === type) {
      setAddType(null)
      setAddClick(false)
      setMode('view')
    } else {
      setAddType(type)
      setAddClick(true)
      setMode('place')
    }
  }

  return (
    <div className="sidebar-left">
      <div className="mode-buttons">
        <div className="section-title">Режимы</div>
        <button
          className={mode === 'view' ? 'active' : ''}
          onClick={() => handleModeChange('view')}
        >
          👁️ Просмотр
        </button>
        <button
          className={mode === 'edit' ? 'active' : ''}
          onClick={() => handleModeChange('edit')}
        >
          ✏️ Редактор
        </button>
      </div>

      <div className="object-types">
        <div className="section-title">Добавить объект</div>
        {Object.entries(OBJECT_TYPES).map(([type, { name, icon }]) => (
          <button
            key={type}
            className={addType === type ? 'active' : ''}
            onClick={() => handleObjectTypeSelect(type)}
          >
            {icon} {name}
          </button>
        ))}
      </div>

      <div className="pipe-button">
        <div className="section-title">🔧 Трубопровод</div>
        <button>
          Соединить объекты
        </button>
      </div>

      <div className="layers">
        <div className="section-title">Слои</div>
        <label>
          <input
            type="checkbox"
            checked={showLayers.map}
            onChange={() => onLayerToggle('map')}
          />
          🗺️ Карта OpenStreetMap
        </label>
        <label>
          <input
            type="checkbox"
            checked={showLayers.objects}
            onChange={() => onLayerToggle('objects')}
          />
          📦 Объекты
        </label>
        <label>
          <input
            type="checkbox"
            checked={showLayers.pipes}
            onChange={() => onLayerToggle('pipes')}
          />
          🔧 Трубопроводы
        </label>
      </div>
    </div>
  )
}

export default SidebarLeft
