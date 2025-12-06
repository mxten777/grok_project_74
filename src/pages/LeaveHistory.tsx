import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { type LeaveRequest } from '../types';

const LeaveHistory: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!auth.currentUser) return;
      const q = query(collection(db, 'leaveRequests'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const reqs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(reqs);
    };
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-primary-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-600 mb-6">연차 신청 내역</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {requests.length === 0 ? (
            <p className="text-lg">신청 내역이 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {requests.map(req => (
                <li key={req.id} className="bg-gray-50 p-6 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium">시작일: {new Date(req.startDate).toLocaleDateString('ko-KR')}</p>
                      <p className="text-lg font-medium">종료일: {new Date(req.endDate).toLocaleDateString('ko-KR')}</p>
                      <p className="text-gray-600 mt-2">사유: {req.reason}</p>
                      {req.attachmentUrl && (
                        <p className="text-blue-600 mt-2">
                          첨부파일: <a href={req.attachmentUrl} target="_blank" rel="noopener noreferrer" className="underline">다운로드</a>
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      req.status === 'approved' ? 'bg-green-100 text-green-800' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {req.status === 'approved' ? '승인됨' : req.status === 'rejected' ? '반려됨' : '대기 중'}
                    </span>
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

export default LeaveHistory;