import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { type UserData } from '../types';
import { Dialog } from '@headlessui/react';

const AdminEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<UserData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    annualLeaveTotal: 20,
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'user'));
      const querySnapshot = await getDocs(q);
      const emps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
      setEmployees(emps);
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      await updateDoc(doc(db, 'users', editingEmployee.id!), {
        name: formData.name,
        annualLeaveTotal: formData.annualLeaveTotal,
      });
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...emp, ...formData } : emp));
    } else {
      await addDoc(collection(db, 'users'), {
        ...formData,
        role: 'user',
        annualLeaveUsed: 0,
        createdAt: new Date(),
      });
      // 새로고침 필요
    }
    setIsOpen(false);
    setEditingEmployee(null);
    setFormData({ name: '', email: '', annualLeaveTotal: 20 });
  };

  const handleEdit = (employee: UserData) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: '', // 이메일은 Auth에서 관리
      annualLeaveTotal: employee.annualLeaveTotal,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'users', id));
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-600 mb-6">직원 관리</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="mb-6 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600"
        >
          직원 추가
        </button>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연차 총일수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 연차</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">남은 연차</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.annualLeaveTotal}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.annualLeaveUsed}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.annualLeaveTotal - employee.annualLeaveUsed}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:text-blue-900 mr-4">편집</button>
                    <button onClick={() => handleDelete(employee.id!)} className="text-red-600 hover:text-red-900">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
              <Dialog.Title className="text-lg font-medium mb-4">
                {editingEmployee ? '직원 편집' : '직원 추가'}
              </Dialog.Title>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">이름</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                {!editingEmployee && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">연차 총일수</label>
                  <input
                    type="number"
                    value={formData.annualLeaveTotal}
                    onChange={(e) => setFormData({ ...formData, annualLeaveTotal: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                  >
                    {editingEmployee ? '저장' : '추가'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminEmployees;