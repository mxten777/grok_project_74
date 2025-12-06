import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { type LeaveRequest, type UserData } from '../types';

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', auth.currentUser.uid)));
        if (!userDoc.empty) {
          setUserData(userDoc.docs[0].data() as UserData);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;
    const fetchRequests = async () => {
      const q = query(collection(db, 'leaveRequests'), where('companyId', '==', userData.companyId || 'default-company'));
      const querySnapshot = await getDocs(q);
      const reqs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
      setRequests(reqs);
    };
    fetchRequests();
  }, [userData]);

  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, 'leaveRequests', id), { status: 'approved' });
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'approved' } : req));
  };

  const handleReject = async (id: string) => {
    await updateDoc(doc(db, 'leaveRequests', id), { status: 'rejected' });
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'rejected' } : req));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">신청 관리</h1>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/20">
          {requests.length === 0 ? (
            <p className="text-lg">대기 중인 신청이 없습니다.</p>
          ) : (
            <ul className="space-y-6">
              {requests.map(req => (
                <li key={req.id} className="bg-gray-50 p-6 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-lg font-medium">사용자 ID: {req.userId}</p>
                      <p className="text-lg">시작일: {new Date(req.startDate).toLocaleDateString('ko-KR')}</p>
                      <p className="text-lg">종료일: {new Date(req.endDate).toLocaleDateString('ko-KR')}</p>
                      <p className="text-gray-600 mt-2">사유: {req.reason}</p>
                      {req.attachmentUrl && (
                        <p className="text-blue-600 mt-2">
                          첨부파일: <a href={req.attachmentUrl} target="_blank" rel="noopener noreferrer" className="underline">다운로드</a>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === 'approved' ? 'bg-green-100 text-green-800' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status === 'approved' ? '승인됨' : req.status === 'rejected' ? '반려됨' : '대기 중'}
                      </span>
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(req.id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">승인</button>
                          <button onClick={() => handleReject(req.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">반려</button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;