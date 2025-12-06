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
          const defaultData = { name: 'Default User', role: 'user', annualLeaveTotal: 20, annualLeaveUsed: 0, createdAt: new Date() };
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
    <div className="min-h-screen bg-primary-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">대시보드</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <p className="text-xl mb-8">환영합니다, {userData.name}</p>
        {userData.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard userData={userData} />}
        <div className="mt-8">
          <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 text-lg">로그아웃</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;