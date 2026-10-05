import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../services/api';
import DataTable, { type Column } from '../components/DataTable';
import type { Book } from '../types';
import axios from 'axios';

const GENRES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Mystery', 'Fantasy'];

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [titleSearch, setTitleSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBooks({
        page,
        limit: 10,
        title: titleSearch || undefined,
        genre: genreFilter || undefined,
      });
      setBooks(data.books);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to load books.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, genreFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenreFilter(e.target.value);
    setPage(1);
  };

  const columns: Column<Book>[] = [
    { header: 'Title', accessor: 'title' },
    { header: 'Author', accessor: 'author' },
    { header: 'ISBN', accessor: 'ISBN' },
    { header: 'Genre', accessor: 'genre' },
    { header: 'Total Copies', accessor: 'totalCopies' },
    {
      header: 'Available',
      accessor: (row) => (
        <span className={row.availableCopies === 0 ? 'badge badge-danger' : 'badge badge-success'}>
          {row.availableCopies}
        </span>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Books</h2>
        <Link to="/books/add" className="btn btn-primary">
          + Add Book
        </Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <form onSubmit={handleSearch} className="filter-form">
          <input
            type="text"
            placeholder="Search by title..."
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            className="filter-input"
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>

        <select value={genreFilter} onChange={handleGenreChange} className="filter-select">
          <option value="">All Genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <DataTable<Book>
        columns={columns}
        data={books}
        keyExtractor={(b) => b._id}
        loading={loading}
        emptyMessage="No books found."
      />

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="pagination">
          <span className="pagination-info">
            Showing page {page} of {totalPages} ({total} total)
          </span>
          <div className="pagination-controls">
            <button
              className="btn btn-secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
