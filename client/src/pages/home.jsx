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
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Your Lists</h2>
        <button
          onClick={() => setShowDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
        >
          + Add New List
        </button>
      </div>

      {lists.length === 0 ? (
        <p className="text-gray-500 py-4">No lists yet. Create your first list!</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 text-left">
              <th className="py-2">Title</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((item, index) => (
              <tr key={item.id || index} className="border-b border-gray-200">
                <td className="py-3">{item.title}</td>
                <td className="py-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs">
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-right space-x-2">
                  <button
                    onClick={() => handleOpen(item)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-center mb-4">
              {editingItem ? "Edit List" : "New List"}
            </h3>
            <input
              type="text"
              placeholder="List name"
              className="w-full px-3 py-2 mb-3 border border-gray-300 focus:outline-none focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="w-full px-3 py-2 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500"
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
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
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
