import { useState, type FormEvent } from 'react';
import { addMember } from '../services/api';
import axios from 'axios';

const AddMemberPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    membershipId: '',
    joinedDate: new Date().toISOString().split('T')[0],
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const data = await addMember(form);
      setSuccess(`Member "${data.member.name}" (ID: ${data.member.membershipId}) registered successfully!`);
      setForm({
        name: '',
        email: '',
        membershipId: '',
        joinedDate: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to register member. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Register New Member</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="membershipId">Membership ID *</label>
            <input
              id="membershipId"
              name="membershipId"
              type="text"
              value={form.membershipId}
              onChange={handleChange}
              placeholder="MEM-001"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="joinedDate">Joined Date</label>
            <input
              id="joinedDate"
              name="joinedDate"
              type="date"
              value={form.joinedDate}
              onChange={handleChange}
            />
          </div>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register Member'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemberPage;
