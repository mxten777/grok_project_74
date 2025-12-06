import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
      <h2 className="text-3xl font-semibold mb-6">관리자 대시보드</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/employees" className="bg-primary-500 text-white p-6 rounded-lg hover:bg-primary-600 text-center text-lg font-medium inline-block">
          직원 관리
        </Link>
        <Link to="/admin/requests" className="bg-secondary-500 text-white p-6 rounded-lg hover:bg-secondary-600 text-center text-lg font-medium inline-block">
          신청 관리
        </Link>
        <Link to="/admin/statistics" className="bg-accent-500 text-white p-6 rounded-lg hover:bg-accent-600 text-center text-lg font-medium inline-block">
          통계 보기
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;