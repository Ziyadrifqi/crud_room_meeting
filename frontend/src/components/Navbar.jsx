import { Bell, ChevronDown, Search } from 'lucide-react';
import logo from '../assets/logo.png';
import profilePic from '../assets/profile.png';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="iMeeting Logo" className="navbar-logo-img" />
        <span className="navbar-logo">iMeeting</span>
      </div>

      <div className="navbar-search">
        <Search size={15} className="navbar-search-icon" />
        <input type="text" placeholder="Cari ruangan, unit, atau tanggal…" />
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon-btn" aria-label="Notifikasi">
          <Bell size={18} />
          <span className="navbar-badge" />
        </button>
        <div className="navbar-divider" />
        <button className="navbar-user">
          <img src={profilePic} alt="John Doe" className="navbar-avatar-img" />
          <span className="navbar-user-info">
            <span className="navbar-username">John Doe</span>
            <span className="navbar-userrole">Admin</span>
          </span>
          <ChevronDown size={16} className="navbar-chevron" />
        </button>
      </div>
    </header>
  );
}