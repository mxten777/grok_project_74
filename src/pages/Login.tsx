import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error: unknown) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-secondary-300 rounded-md"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-secondary-300 rounded-md"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-primary-500 text-white p-3 rounded-md hover:bg-primary-600"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default Login;