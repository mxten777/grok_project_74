import React from 'react';

const AdminStatistics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">휴가 통계</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">통계 기능은 현재 개발 중입니다. 다중 회사 지원이 적용되었습니다.</p>
      </div>
    </div>
  );
};

export default AdminStatistics;