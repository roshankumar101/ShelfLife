import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <div className="navbar-brand">📚 ShelfLife</div>
      <div className="navbar-links">
        <Link to="/books" className={isActive('/books') ? 'nav-link active' : 'nav-link'}>
          Books
        </Link>
        <Link to="/borrow" className={isActive('/borrow') ? 'nav-link active' : 'nav-link'}>
          Issue Book
        </Link>
        <Link to="/members" className={isActive('/members') ? 'nav-link active' : 'nav-link'}>
          Members
        </Link>
        <button className="btn btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
