import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, History, Clock } from 'lucide-react';
import { type UserData } from '../types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface EmployeeDashboardProps {
  userData: UserData;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ userData }) => {
  const remainingLeave = userData.annualLeaveTotal - userData.annualLeaveUsed;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl mb-8 border border-white/20"
    >
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200 flex items-center gap-3">
        <Clock className="w-8 h-8 text-primary-500" />
        직원 대시보드
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-xl text-white shadow-lg"
        >
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
            <CalendarDays className="w-6 h-6" />
            남은 연차
          </h3>
          <p className="text-4xl font-bold">{remainingLeave} 일</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-gray-500 to-gray-600 p-8 rounded-xl text-white shadow-lg"
        >
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
            <History className="w-6 h-6" />
            사용한 연차
          </h3>
          <p className="text-4xl font-bold">{userData.annualLeaveUsed} 일</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary-500" />
            휴가 캘린더
          </h3>
          <Calendar className="w-full" />
        </motion.div>
      </div>
      <div className="flex gap-6 justify-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/leave/apply" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium inline-block">
            연차 신청
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/leave/history" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium inline-block">
            내역 조회
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;