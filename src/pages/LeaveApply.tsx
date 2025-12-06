import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase/config';
import { DayPicker } from 'react-day-picker';
import { type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const LeaveApply: React.FC = () => {
  const [range, setRange] = useState<DateRange | undefined>();
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !range?.from || !range?.to) return;

    let attachmentUrl = '';
    if (file) {
      const storageRef = ref(storage, `leave-requests/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      attachmentUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'leaveRequests'), {
      userId: auth.currentUser.uid,
      startDate: range.from.toISOString(),
      endDate: range.to.toISOString(),
      reason,
      status: 'pending',
      createdAt: new Date(),
      attachmentUrl: attachmentUrl || null,
    });

    alert('연차 신청이 완료되었습니다.');
    setRange(undefined);
    setReason('');
    setFile(null);
  };

    <div className="min-h-screen bg-primary-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-600 mb-6">연차 신청</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium">휴가 기간 선택</label>
            <DayPicker mode="range" selected={range} onSelect={setRange} className="mx-auto" />
          </div>
          <textarea
            placeholder="사유"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 mb-6 border border-secondary-300 rounded-md text-lg"
            rows={4}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4"
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
          <p className="text-sm text-gray-500 mb-6">첨부파일 (선택사항): PDF, DOC, 이미지 파일 (최대 10MB)</p>
          <button type="submit" className="w-full bg-primary-500 text-white p-4 rounded-md hover:bg-primary-600 text-lg">신청하기</button>
        </form>
      </div>
    </div>
};

export default LeaveApply;