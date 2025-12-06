import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeaveApply from './pages/LeaveApply';
import LeaveHistory from './pages/LeaveHistory';
import AdminRequests from './pages/AdminRequests';
import AdminEmployees from './pages/AdminEmployees';
import AdminStatistics from './pages/AdminStatistics';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return user ? <>{children}</> : <Login />;
};

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/leave/apply" element={<ProtectedRoute><LeaveApply /></ProtectedRoute>} />
          <Route path="/leave/history" element={<ProtectedRoute><LeaveHistory /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute><AdminRequests /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute><AdminEmployees /></ProtectedRoute>} />
          <Route path="/admin/statistics" element={<ProtectedRoute><AdminStatistics /></ProtectedRoute>} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
