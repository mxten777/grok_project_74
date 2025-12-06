import React, { useState } from 'react';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase/config';
import { DayPicker } from 'react-day-picker';
import { type DateRange } from 'react-day-picker';
import { motion } from 'framer-motion';
import { Calendar, FileText, Send } from 'lucide-react';
import 'react-day-picker/dist/style.css';

const LeaveApply: React.FC = () => {
  const [range, setRange] = useState<DateRange | undefined>();
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !range?.from || !range?.to) return;

    // 사용자 데이터에서 companyId 가져오기
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const userData = userDoc.data();
    const companyId = userData?.companyId || 'default-company';

    let attachmentUrl = '';
    if (file) {
      const storageRef = ref(storage, `leave-requests/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      attachmentUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'leaveRequests'), {
      userId: auth.currentUser.uid,
      companyId,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">연차 신청</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">휴가를 신청하고 편안한 휴식을 즐겨보세요</p>
        </div>
        <motion.form 
          onSubmit={handleSubmit} 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/20"
        >
          <div className="mb-10">
            <label className="block mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-primary-500" />
              휴가 기간 선택
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl">
              <DayPicker mode="range" selected={range} onSelect={setRange} className="mx-auto" />
            </div>
          </div>
          <div className="mb-10">
            <label className="block mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <FileText className="w-7 h-7 text-primary-500" />
              사유
            </label>
            <textarea
              placeholder="휴가 사유를 입력해주세요..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300"
              rows={5}
            />
          </div>
          <div className="mb-10">
            <label className="block mb-4 text-xl font-medium text-gray-700 dark:text-gray-300">첨부파일 (선택사항)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:border-primary-500 transition-colors duration-300"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">PDF, DOC, 이미지 파일 (최대 10MB)</p>
          </div>
          <motion.button 
            type="submit" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 text-xl font-semibold flex items-center justify-center gap-3"
          >
            <Send className="w-6 h-6" />
            신청하기
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default LeaveApply;