import { useState } from "react";
import axios from 'axios';
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      console.log(response.data);
      navigate("/home")
    } catch (error) {
      console.error('There was an error!', error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 to-red-100">
      <div className="w-full max-w-4xl bg-white shadow-2xl p-12">
        <h1 className="text-4xl font-black text-center mb-2" style={{ color: '#FF6347' }}>
          Welcome
        </h1>
        <p className="text-center text-gray-600 font-light text-sm mb-6">Get your tasks done efficiently</p>

        {error && (
          <p className="mb-4 text-red-600 text-sm font-semibold bg-red-50 p-3 rounded">{error}</p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-4 py-3 mb-4 border-2 border-gray-300 focus:outline-none focus:border-red-400 transition font-medium"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-4 py-3 mb-6 border-2 border-gray-300 focus:outline-none focus:border-red-400 transition font-medium"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition text-lg"
            style={{ backgroundColor: loading ? '#FF6347' : 'linear-gradient(to right, #FF6347, #FF5349)' }}
          >
            {loading ? 'Logging in...' : 'Start Your Day'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-gray-600">
          New here?{' '}
          <a href="/register" className="font-bold" style={{ color: '#FF6347' }}>Create an account</a>
        </p>
      </div>
    </div>
  );
}

export default App;
