import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, breadcrumb }) {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      <button
        type="button"
        className="page-back-btn"
        onClick={() => navigate('/')}
        aria-label="Kembali"
      >
        <ChevronLeft size={18} />
      </button>
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-breadcrumb">{breadcrumb}</p>
      </div>
    </div>
  );
}
