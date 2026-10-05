import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../services/api';
import axios from 'axios';

const GENRES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Mystery', 'Fantasy'];

const AddBookPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    author: '',
    ISBN: '',
    genre: '',
    totalCopies: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const copies = parseInt(form.totalCopies);
      if (isNaN(copies) || copies < 1) {
        setError('Total copies must be a positive integer.');
        setLoading(false);
        return;
      }

      const data = await addBook({
        title: form.title,
        author: form.author,
        ISBN: form.ISBN,
        genre: form.genre,
        totalCopies: copies,
      });

      setSuccess(`Book "${data.book.title}" added successfully!`);
      setForm({ title: '', author: '', ISBN: '', genre: '', totalCopies: '' });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to add book. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Add New Book</h2>
        <button className="btn btn-outline" onClick={() => navigate('/books')}>
          ← Back to Books
        </button>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Book title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              id="author"
              name="author"
              type="text"
              value={form.author}
              onChange={handleChange}
              placeholder="Author name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ISBN">ISBN *</label>
            <input
              id="ISBN"
              name="ISBN"
              type="text"
              value={form.ISBN}
              onChange={handleChange}
              placeholder="978-0-000-00000-0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre *</label>
            <select id="genre" name="genre" value={form.genre} onChange={handleChange} required>
              <option value="">Select a genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="totalCopies">Total Copies *</label>
            <input
              id="totalCopies"
              name="totalCopies"
              type="number"
              min="1"
              value={form.totalCopies}
              onChange={handleChange}
              placeholder="1"
              required
            />
          </div>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;
