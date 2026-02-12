import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !username.trim() || !password.trim() || !confirmPass.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPass) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, { name, username, password, confirm: confirmPass });
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error('There was an error!', error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 to-red-100">
      <div className="w-full max-w-4xl bg-white shadow-2xl p-12">
        <h1 className="text-4xl font-black text-center mb-2" style={{ color: '#FF6347' }}>
          Create Account
        </h1>
        <p className="text-center text-gray-600 font-light text-sm mb-6">Start organizing your day today</p>

        {error && (
          <p className="mb-4 text-red-600 text-sm font-semibold bg-red-50 p-3">{error}</p>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Your Full Name"
            className="w-full px-4 py-3 mb-4 border-2 border-gray-300 focus:outline-none focus:border-red-400 transition font-medium"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 mb-4 border-2 border-gray-300 focus:outline-none focus:border-red-400 transition font-medium"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
          />

          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            className="w-full px-4 py-3 mb-4 border-2 border-gray-300 focus:outline-none focus:border-red-400 transition font-medium"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 mb-6 border-2 border-gray-300 focus:outline-none focus:border-red-400 transition font-medium"
            value={confirmPass}
            onChange={(e) => {
              setConfirmPass(e.target.value);
              if (error) setError('');
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition text-lg"
            style={{ backgroundColor: loading ? '#FF6347' : 'linear-gradient(to right, #FF6347, #FF5349)' }}
          >
            {loading ? 'Creating account...' : 'Get Started'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-gray-600">
          Already have an account?{' '}
          <a href="/" className="font-bold" style={{ color: '#FF6347' }}>Sign in instead</a>
        </p>
      </div>
    </div>
  );
}

export default register;