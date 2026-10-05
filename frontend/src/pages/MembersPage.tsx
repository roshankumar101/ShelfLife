import { useState } from 'react';
import AddMemberPage from './AddMemberPage';
import MemberHistoryPage from './MemberHistoryPage';

type Tab = 'register' | 'history';

const MembersPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('register');

  return (
    <div className="page">
      <div className="page-header">
        <h2>Members</h2>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register Member
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Borrow History
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'register' ? (
          <AddMemberPage />
        ) : (
          <MemberHistoryPage />
        )}
      </div>
    </div>
  );
};

export default MembersPage;
