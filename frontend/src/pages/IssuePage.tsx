import { useState, useEffect, type FormEvent } from 'react';
import { getMembers, getBooks, borrowBook } from '../services/api';
import type { Member, Book } from '../types';
import axios from 'axios';

const IssuePage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load members and books on mount for the dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        const [membersData, booksData] = await Promise.all([
          getMembers(),
          getBooks({ limit: 100 }),
        ]);
        setMembers(membersData.members);
        setBooks(booksData.books);
      } catch {
        setError('Failed to load data. Please refresh.');
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, []);

  const selectedBookData = books.find((b) => b._id === selectedBook);
  const isBookUnavailable = selectedBookData !== undefined && selectedBookData.availableCopies === 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!selectedMember || !selectedBook) {
      setError('Please select both a member and a book.');
      return;
    }

    if (isBookUnavailable) {
      setError('This book has no available copies.');
      return;
    }

    setLoading(true);
    try {
      const data = await borrowBook({ bookId: selectedBook, memberId: selectedMember });
      setSuccess(`Book issued successfully! Due date: ${new Date(data.borrowRecord.dueDate).toLocaleDateString()}`);
      // Update available copies in local state
      setBooks((prev) =>
        prev.map((b) =>
          b._id === selectedBook ? { ...b, availableCopies: data.availableCopies } : b
        )
      );
      setSelectedMember('');
      setSelectedBook('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to issue book. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="page">
        <div className="page-header"><h2>Issue Book</h2></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Issue Book</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="member-select">Select Member *</label>
            <select
              id="member-select"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              required
            >
              <option value="">-- Choose a member --</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.membershipId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="book-select">Select Book *</label>
            <select
              id="book-select"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              required
            >
              <option value="">-- Choose a book --</option>
              {books.map((b) => (
                <option key={b._id} value={b._id} disabled={b.availableCopies === 0}>
                  {b.title} — {b.author} ({b.availableCopies} available)
                </option>
              ))}
            </select>
          </div>

          {selectedBookData && (
            <div className={`book-info-box ${isBookUnavailable ? 'unavailable' : 'available'}`}>
              <strong>{selectedBookData.title}</strong>
              <span>Available: {selectedBookData.availableCopies} / {selectedBookData.totalCopies}</span>
              {isBookUnavailable && (
                <span className="badge badge-danger">No copies available</span>
              )}
            </div>
          )}

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || isBookUnavailable}
          >
            {loading ? 'Issuing...' : 'Issue Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IssuePage;
