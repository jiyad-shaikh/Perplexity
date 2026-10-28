import Icon from '../Icon/Icon';
import './Sidebar.css';

export default function Sidebar({
  history,
  open,
  onClose,
  onNewSearch,
  onSelect,
}) {
  return (
    <>
      <div
        className={'backdrop ' + (open ? 'open' : '')}
        onClick={onClose}
      />
      <aside className={'sidebar ' + (open ? 'open' : '')}>
        <div className="brand">
          <span>✦</span> lumina
          <button className="mobile-only close" onClick={onClose}>×</button>
        </div>
        <button className="new-search" onClick={onNewSearch}>
          <Icon name="plus" /> New search
        </button>
        <p className="sidebar-label">Recent</p>
        <nav>
          {history.map((item) => (
            <button
              className="history-item"
              key={item.id}
              onClick={() => onSelect(item)}
            >
              <span>{item.title}</span>
              <small>{item.time}</small>
            </button>
          ))}
        </nav>
        <div className="profile">
          <span className="avatar">JD</span>
          <span>
            <b>Jiyad</b>
            <small>Personal space</small>
          </span>
        </div>
      </aside>
    </>
  );
}
