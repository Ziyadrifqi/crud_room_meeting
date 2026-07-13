import { Home, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-icon active" aria-label="Ruang Meeting">
        <Home size={18} />
      </Link>
      <div className="sidebar-icon" aria-hidden="true">
        <User size={18} />
      </div>
    </aside>
  );
}
