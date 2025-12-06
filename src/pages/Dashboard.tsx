import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import EmployeeDashboard from '../components/EmployeeDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { type UserData } from '../types';
import { useDarkMode } from '../contexts/DarkModeContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          // 기본 데이터 설정 및 저장
          const defaultData: UserData = { name: 'Default User', role: 'user', annualLeaveTotal: 20, annualLeaveUsed: 0, companyId: 'default-company', createdAt: new Date() };
          await setDoc(docRef, defaultData);
          setUserData(defaultData);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">사용자 데이터 로딩 중...</h1>
          <p>잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl mx-auto text-center">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold text-primary-600 dark:text-primary-400 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">대시보드</h1>
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <p className="text-2xl mb-12 text-gray-700 dark:text-gray-300 text-center">환영합니다, <span className="font-semibold text-primary-600">{userData.name}</span></p>
        {userData.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard userData={userData} />}
        <div className="mt-12 flex justify-center">
          <button onClick={handleLogout} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium">로그아웃</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;