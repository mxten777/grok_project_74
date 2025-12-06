import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { type LeaveRequest } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Papa from 'papaparse';

const AdminStatistics: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, 'leaveRequests'));
      const reqs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
      setRequests(reqs);

      // 월별 데이터
      const monthly = reqs.reduce((acc: any, req) => {
        const month = new Date(req.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});
      setMonthlyData(Object.entries(monthly).map(([month, count]) => ({ month, count })));

      // 상태별 데이터
      const status = reqs.reduce((acc: any, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      }, {});
      setStatusData(Object.entries(status).map(([status, count]) => ({ status, count })));
    };
    fetchRequests();
  }, []);

  const handleDownloadCSV = () => {
    const csvData = requests.map(req => ({
      '사용자 ID': req.userId,
      '시작일': new Date(req.startDate).toLocaleDateString('ko-KR'),
      '종료일': new Date(req.endDate).toLocaleDateString('ko-KR'),
      '사유': req.reason,
      '상태': req.status === 'approved' ? '승인됨' : req.status === 'rejected' ? '반려됨' : '대기 중',
      '신청일': new Date(req.createdAt).toLocaleDateString('ko-KR'),
      '첨부파일': req.attachmentUrl ? '있음' : '없음',
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leave_requests_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-primary-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-600 mb-6">휴가 통계</h1>
        <button
          onClick={handleDownloadCSV}
          className="mb-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          CSV 다운로드
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 월별 신청 통계 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">월별 신청 현황</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 상태별 통계 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">신청 상태 분포</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">요약 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{requests.length}</div>
              <div className="text-gray-600">총 신청</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{requests.filter(r => r.status === 'approved').length}</div>
              <div className="text-gray-600">승인됨</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{requests.filter(r => r.status === 'rejected').length}</div>
              <div className="text-gray-600">반려됨</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</div>
              <div className="text-gray-600">대기 중</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;