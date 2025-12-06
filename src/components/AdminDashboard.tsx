import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileText, BarChart3 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl mb-8 border border-white/20"
    >
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200 flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-primary-500" />
        관리자 대시보드
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/admin/employees" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 text-center text-lg font-medium inline-block w-full h-full flex flex-col items-center justify-center gap-3">
            <Users className="w-12 h-12" />
            직원 관리
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/admin/requests" className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 text-center text-lg font-medium inline-block w-full h-full flex flex-col items-center justify-center gap-3">
            <FileText className="w-12 h-12" />
            신청 관리
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/admin/statistics" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-center text-lg font-medium inline-block w-full h-full flex flex-col items-center justify-center gap-3">
            <BarChart3 className="w-12 h-12" />
            통계 보기
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;