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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-300 p-6">
          <h1 className="text-xl font-bold text-center mb-6">Create Account</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Create a password (min. 6 characters)"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <a href="/" className="text-blue-600 hover:underline">
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default register;