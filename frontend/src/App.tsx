import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import BooksPage from './pages/BooksPage';
import AddBookPage from './pages/AddBookPage';
import IssuePage from './pages/IssuePage';
import MembersPage from './pages/MembersPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with Navbar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Navigate to="/books" replace />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/books/add" element={<AddBookPage />} />
                    <Route path="/borrow" element={<IssuePage />} />
                    <Route path="/members" element={<MembersPage />} />
                    <Route path="*" element={<Navigate to="/books" replace />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;