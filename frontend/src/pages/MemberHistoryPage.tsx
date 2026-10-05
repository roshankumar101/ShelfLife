import { useState, useEffect } from 'react';
import { getMembers, getMemberHistory, returnBook } from '../services/api';
import DataTable, { type Column } from '../components/DataTable';
import type { Member, BorrowRecord, Book } from '../types';
import axios from 'axios';

const MemberHistoryPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(true);
  const [error, setError] = useState('');
  const [returnMessages, setReturnMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    getMembers()
      .then((data) => setMembers(data.members))
      .catch(() => setError('Failed to load members.'))
      .finally(() => setMembersLoading(false));
  }, []);

  const handleMemberChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedMemberId(id);
    setRecords([]);
    setError('');
    setReturnMessages({});

    if (!id) {
      setSelectedMember(null);
      return;
    }

    setLoading(true);
    try {
      const data = await getMemberHistory(id);
      setSelectedMember(data.member);
      setRecords(data.records);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to load member history.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowId: string) => {
    try {
      const data = await returnBook(borrowId);
      // Update the record in local state
      setRecords((prev) =>
        prev.map((r) =>
          r._id === borrowId
            ? { ...r, status: 'returned', returnDate: data.borrowRecord.returnDate }
            : r
        )
      );
      setReturnMessages((prev) => ({
        ...prev,
        [borrowId]: `Returned! Available copies: ${data.availableCopies}`,
      }));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setReturnMessages((prev) => ({ ...prev, [borrowId]: `Error: ${err.response!.data.error}` }));
      } else {
        setReturnMessages((prev) => ({ ...prev, [borrowId]: 'Return failed.' }));
      }
    }
  };

  const today = new Date();

  /**
   * Determine display status:
   * If status is 'issued' and dueDate < today, show as overdue.
   */
  const getDisplayStatus = (record: BorrowRecord): 'issued' | 'returned' | 'overdue' => {
    if (record.status === 'returned') return 'returned';
    if (new Date(record.dueDate) < today && !record.returnDate) return 'overdue';
    return 'issued';
  };

  const columns: Column<BorrowRecord>[] = [
    {
      header: 'Book',
      accessor: (row) => {
        const book = row.book as Book;
        return book?.title || 'Unknown';
      },
    },
    {
      header: 'Issue Date',
      accessor: (row) => new Date(row.issueDate).toLocaleDateString(),
    },
    {
      header: 'Due Date',
      accessor: (row) => new Date(row.dueDate).toLocaleDateString(),
    },
    {
      header: 'Return Date',
      accessor: (row) => (row.returnDate ? new Date(row.returnDate).toLocaleDateString() : '—'),
    },
    {
      header: 'Status',
      accessor: (row) => {
        const status = getDisplayStatus(row);
        return (
          <span className={`badge badge-${status === 'returned' ? 'success' : status === 'overdue' ? 'danger' : 'warning'}`}>
            {status.toUpperCase()}
          </span>
        );
      },
    },
    {
      header: 'Action',
      accessor: (row) => {
        if (row.status === 'returned') {
          return returnMessages[row._id] ? (
            <small className="text-success">{returnMessages[row._id]}</small>
          ) : (
            <span className="text-muted">—</span>
          );
        }
        return (
          <div>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleReturn(row._id)}
            >
              Return
            </button>
            {returnMessages[row._id] && (
              <small className="text-success" style={{ display: 'block', marginTop: '4px' }}>
                {returnMessages[row._id]}
              </small>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Member Borrow History</h2>
      </div>

      <div className="filters" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group" style={{ maxWidth: '400px' }}>
          <label htmlFor="member-history-select">Select Member</label>
          <select
            id="member-history-select"
            value={selectedMemberId}
            onChange={handleMemberChange}
            disabled={membersLoading}
          >
            <option value="">-- Choose a member --</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.membershipId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMember && (
        <div className="member-info-box">
          <strong>{selectedMember.name}</strong>
          <span>Email: {selectedMember.email}</span>
          <span>Member ID: {selectedMember.membershipId}</span>
          <span>Joined: {new Date(selectedMember.joinedDate).toLocaleDateString()}</span>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {selectedMemberId && (
        <DataTable<BorrowRecord>
          columns={columns}
          data={records}
          keyExtractor={(r) => r._id}
          loading={loading}
          emptyMessage="No borrow records for this member."
        />
      )}
    </div>
  );
};

export default MemberHistoryPage;
