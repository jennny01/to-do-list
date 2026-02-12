import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function home() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/logout`);
      console.log(response.data);
      alert(response.data?.message || "Logged out Successfully");
      navigate("/");
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  const handleSubmit = async () => {
    try {
      let response;
      if (editingItem) {
        response = await axios.post(`${API_URL}/edit-list`, {
          id: editingItem.id,
          title,
          status,
        });
        alert(response.data?.message || "List Updated successfully");
      } else {
        response = await axios.post(`${API_URL}/add-list`, {
          title,
          status,
        });
        alert(response.data?.message || "List Added successfully");
      }
      console.log(response.data);
      fetchList();
      setTitle("");
      setStatus("");
      setEditingItem(null);
      setShowDialog(false);
      navigate("/home");
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        const response = await axios.post(`${API_URL}/delete-list`, { id });
        console.log(response.data);
        alert(response.data?.message || "List Deleted successfully");
        fetchList();
      } catch (error) {
        console.error(
          "There was an error!",
          error.response?.data || error.message,
        );
        alert(
          error.response?.data?.message || error.message || "An error occurred",
        );
      }
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setStatus(item.status);
    setEditingItem(item);
    setShowDialog(true);
  };

  const handleOpen = (item) => {
    navigate('/list-item', { state: { listId: item.id, listTitle: item.title } });
  };
/*   const handleEditlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/edit-list`, {
        title,
        stats,
      });
      setLists(response.data);
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  }; */

  const fetchList = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-list`);
      console.log(response.data);
      setLists(response.data.list);
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-orange-100 to-red-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black" style={{ color: '#FF6347' }}>My Daily Tasks</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDialog(true)}
            className="text-white px-6 py-2 font-bold hover:opacity-90 transition"
            style={{ backgroundColor: '#FF6347' }}
          >
             Add
          </button>
          <button
            onClick={handleLogout}
            className="text-white px-6 py-2 font-bold hover:opacity-90 transition"
            style={{ backgroundColor: '#FF6347' }}
          >
            Logout
          </button>
        </div>
      </div>

      {lists.length === 0 ? (
        <p className="text-gray-600 py-8 text-lg font-medium">No lists yet. Create your first list to get started!</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#FF6347' }}>Your Lists</h2>
          <div className="bg-white shadow-lg p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{ borderColor: '#FF6347' }}>
                <th className="py-3 text-left font-bold" style={{ color: '#FF6347' }}>Title</th>
                <th className="py-3 text-left font-bold" style={{ color: '#FF6347' }}>Status</th>
                <th className="py-3 text-right font-bold" style={{ color: '#FF6347' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((item, index) => (
                <tr key={item.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 font-medium">{item.title}</td>
                  <td className="py-3">
                    <span className="px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: '#FF6347' }}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpen(item)}
                      className="text-white px-4 py-1 text-sm font-bold hover:opacity-90 transition"
                      style={{ backgroundColor: '#28a745' }}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-white px-4 py-1 text-sm font-bold hover:opacity-90 transition"
                      style={{ backgroundColor: '#ffc107' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-white px-4 py-1 text-sm font-bold hover:opacity-90 transition"
                      style={{ backgroundColor: '#dc3545' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}

      {showDialog && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-8 rounded-lg shadow-2xl">
            <h3 className="text-2xl font-black text-center mb-4" style={{ color: '#FF6347' }}>
              {editingItem ? "Edit List" : "New List"}
            </h3>
            <input
              type="text"
              placeholder="List name"
              className="w-full px-4 py-3 mb-4 border-2 border-gray-300 focus:outline-none transition font-medium"
              style={{ borderColor: '#FF6347', outlineColor: '#FF6347' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="w-full px-4 py-3 mb-6 border-2 border-gray-300 focus:outline-none transition font-medium"
              style={{ borderColor: '#FF6347' }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select status...</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setEditingItem(null);
                  setTitle("");
                  setStatus("");
                }}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 text-white font-bold hover:opacity-90 transition"
                style={{ backgroundColor: '#FF6347' }}
              >
                {editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default home;
