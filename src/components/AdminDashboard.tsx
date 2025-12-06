import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileText, BarChart3, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { type LeaveRequest, type UserData } from '../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    approvedThisMonth: 0,
    totalLeaveDays: 0
  });
  const [recentActivity, setRecentActivity] = useState<LeaveRequest[]>([]);
  const [companyId, setCompanyId] = useState<string>('default-company');

  useEffect(() => {
    if (!auth.currentUser) return;

    // 관리자의 companyId 가져오기
    const fetchCompanyId = async () => {
      const userDoc = await import('firebase/firestore').then(({ doc, getDoc }) =>
        getDoc(doc(db, 'users', auth.currentUser!.uid))
      );
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        setCompanyId(userData.companyId || 'default-company');
      }
    };

    fetchCompanyId();
  }, []);

  useEffect(() => {
    if (!companyId) return;

    // 실시간 통계 업데이트
    const requestsQuery = query(
      collection(db, 'leaveRequests'),
      where('companyId', '==', companyId)
    );

    const usersQuery = query(
      collection(db, 'users'),
      where('companyId', '==', companyId)
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => doc.data()) as LeaveRequest[];

      const pending = requests.filter(r => r.status === 'pending').length;
      const approvedThisMonth = requests.filter(r => {
        if (r.status !== 'approved') return false;
        const requestDate = new Date(r.createdAt);
        const now = new Date();
        return requestDate.getMonth() === now.getMonth() && requestDate.getFullYear() === now.getFullYear();
      }).length;

      const totalLeaveDays = requests
        .filter(r => r.status === 'approved')
        .reduce((total, r) => {
          const start = new Date(r.startDate);
          const end = new Date(r.endDate);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          return total + days;
        }, 0);

      setStats(prev => ({
        ...prev,
        pendingRequests: pending,
        approvedThisMonth,
        totalLeaveDays
      }));

      // 최근 활동 (최근 5개)
      const sortedRequests = requests
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentActivity(sortedRequests);
    });

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      setStats(prev => ({
        ...prev,
        totalEmployees: snapshot.size
      }));
    });

    return () => {
      unsubscribeRequests();
      unsubscribeUsers();
    };
  }, [companyId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
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
              <p className="text-sm opacity-90">총 직원 수</p>
              <p className="text-3xl font-bold">{stats.totalEmployees}</p>
            </div>
            <Users className="w-8 h-8 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">대기중 신청</p>
              <p className="text-3xl font-bold">{stats.pendingRequests}</p>
            </div>
            <AlertTriangle className="w-8 h-8 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">이번달 승인</p>
              <p className="text-3xl font-bold">{stats.approvedThisMonth}</p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">총 휴가일수</p>
              <p className="text-3xl font-bold">{stats.totalLeaveDays}</p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 최근 활동 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            최근 활동
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.reason} • {new Date(request.createdAt).toLocaleDateString()}
                      </p>
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
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">아직 활동 내역이 없습니다.</p>
            )}
          </div>
        </motion.div>

        {/* 빠른 관리 액션 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            빠른 관리
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/admin/requests"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all duration-300 border border-blue-200 dark:border-blue-700"
              >
                <div className="bg-blue-500 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">신청 관리</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">연차 신청 승인/거절 처리</p>
                  {stats.pendingRequests > 0 && (
                    <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {stats.pendingRequests}건 대기중
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/admin/employees"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 transition-all duration-300 border border-green-200 dark:border-green-700"
              >
                <div className="bg-green-500 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">직원 관리</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">직원 정보 및 연차 설정</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {stats.totalEmployees}명 관리중
                  </span>
                </div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/admin/statistics"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 transition-all duration-300 border border-purple-200 dark:border-purple-700"
              >
                <div className="bg-purple-500 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">통계 및 리포트</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">휴가 사용 통계 분석</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    상세 분석
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;