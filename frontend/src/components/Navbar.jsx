import { Bell, ChevronDown } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">iMeeting</span>
      </div>
      <div className="navbar-actions">
        <button className="navbar-icon-btn" aria-label="Notifikasi">
          <Bell size={18} />
        </button>
        <button className="navbar-user">
          <span className="navbar-avatar">JD</span>
          <span className="navbar-username">John Doe</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}
