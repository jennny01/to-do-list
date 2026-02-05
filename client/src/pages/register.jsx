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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        <h1 className="text-xl font-bold text-center mb-6">Create Account</h1>

        {error && (
          <p className="mb-4 text-red-600 text-sm">{error}</p>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-3 py-2 mb-3 border border-gray-300 focus:outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 mb-3 border border-gray-300 focus:outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
          />

          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            className="w-full px-3 py-2 mb-3 border border-gray-300 focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-3 py-2 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500"
            value={confirmPass}
            onChange={(e) => {
              setConfirmPass(e.target.value);
              if (error) setError('');
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/" className="text-blue-600 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default register;