import React from 'react';
import { Link } from 'react-router-dom';
import { type UserData } from '../types';

interface EmployeeDashboardProps {
  userData: UserData;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ userData }) => {
  const remainingLeave = userData.annualLeaveTotal - userData.annualLeaveUsed;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
      <h2 className="text-3xl font-semibold mb-6">직원 대시보드</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary-100 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-2">남은 연차</h3>
          <p className="text-3xl font-bold text-primary-600">{remainingLeave} 일</p>
        </div>
        <div className="bg-secondary-100 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-2">사용한 연차</h3>
          <p className="text-3xl font-bold text-secondary-600">{userData.annualLeaveUsed} 일</p>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <Link to="/leave/apply" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 text-lg inline-block">연차 신청</Link>
        <Link to="/leave/history" className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 text-lg inline-block">내역 조회</Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;