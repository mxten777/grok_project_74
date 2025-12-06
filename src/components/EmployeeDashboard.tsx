import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, History, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { type UserData, type LeaveRequest } from '../types';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface EmployeeDashboardProps {
  userData: UserData;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ userData }) => {
  const remainingLeave = userData.annualLeaveTotal - userData.annualLeaveUsed;
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    // 최근 신청 내역 가져오기
    const q = query(
      collection(db, 'leaveRequests'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaveRequest[];
      setRecentRequests(requests);

      // 통계 계산
      const pending = requests.filter(r => r.status === 'pending').length;
      const approved = requests.filter(r => r.status === 'approved').length;
      const rejected = requests.filter(r => r.status === 'rejected').length;
      setStats({ pending, approved, rejected });
    });

    return unsubscribe;
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '승인됨';
      case 'rejected': return '거절됨';
      default: return '대기중';
    }
  };

  return (
    <div className="space-y-8">
      {/* 메인 통계 카드들 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">남은 연차</p>
              <p className="text-3xl font-bold">{remainingLeave} 일</p>
            </div>
            <CalendarDays className="w-8 h-8 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-500 to-gray-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">사용한 연차</p>
              <p className="text-3xl font-bold">{userData.annualLeaveUsed} 일</p>
            </div>
            <History className="w-8 h-8 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">대기중</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <AlertCircle className="w-8 h-8 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">승인됨</p>
              <p className="text-3xl font-bold">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 최근 신청 내역 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            최근 신청 내역
          </h3>
          <div className="space-y-3">
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{request.reason}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {getStatusText(request.status)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">아직 신청 내역이 없습니다.</p>
            )}
          </div>
          <Link
            to="/leave/history"
            className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
          >
            전체 내역 보기 →
          </Link>
        </motion.div>

        {/* 휴가 캘린더 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            휴가 캘린더
          </h3>
          <Calendar className="w-full border-none" />
        </motion.div>
      </div>

      {/* 빠른 액션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          빠른 액션
        </h3>
        <div className="flex flex-wrap gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/leave/apply"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 font-medium inline-flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              연차 신청
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/leave/history"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 font-medium inline-flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              내역 조회
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeDashboard;