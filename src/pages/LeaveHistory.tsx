import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { CheckCircle, XCircle, Clock, History } from 'lucide-react';
import { type LeaveRequest } from '../types';

const LeaveHistory: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    // 알림 권한 요청
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (!auth.currentUser) return;
    const q = query(collection(db, 'leaveRequests'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reqs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
      // 상태 변경 감지 및 알림
      reqs.forEach(newReq => {
        const oldReq = requests.find(r => r.id === newReq.id);
        if (oldReq && oldReq.status !== newReq.status && newReq.status !== 'pending') {
          if (Notification.permission === 'granted') {
            new Notification('연차 신청 상태 변경', {
              body: `신청이 ${newReq.status === 'approved' ? '승인' : '반려'}되었습니다.`,
              icon: '/vite.svg'
            });
          }
        }
      });
      setRequests(reqs);
    });
    return unsubscribe;
  }, [requests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-4">
            <History className="w-12 h-12" />
            연차 신청 내역
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">지난 휴가 신청 기록을 확인하세요</p>
        </div>
        <div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/20">
              {requests.length === 0 ? (
                <p className="text-xl text-center text-gray-500 dark:text-gray-400">신청 내역이 없습니다.</p>
              ) : (
                <ul className="space-y-6">
                  {requests.map((req) => (
                    <li 
                      key={req.id} 
                      className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
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
                        <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                          req.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          req.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {req.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                           req.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                           <Clock className="w-4 h-4" />}
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
    </div>
  );
};

export default LeaveHistory;