import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import EmployeeDashboard from '../components/EmployeeDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { type UserData } from '../types';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

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

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">사용자 데이터 로딩 중...</h1>
          <p className="text-gray-600 dark:text-gray-400">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-6xl mx-auto text-center">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">대시보드</h1>
        </div>
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300 text-center">환영합니다, <span className="font-semibold text-blue-600 dark:text-blue-400">{userData.name}</span></p>
        {userData.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard userData={userData} />}
      </div>
    </div>
  );
};

export default Dashboard;