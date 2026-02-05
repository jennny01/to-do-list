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
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
          >
            Logout
          </button>
        </div>

        <div className="bg-white border border-gray-300 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Lists</h2>
            <button
              onClick={() => setShowDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
            >
              + Add New List
            </button>
          </div>

          {lists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No lists yet. Create your first list to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lists.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border border-gray-300 p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{item.title}</h3>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">Click Open to view items</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleOpen(item)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm"
                    >
                      Open List
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-center mb-4">
              {editingItem ? "Edit List" : "Create New List"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm mb-1">List Title</label>
              <input
                type="text"
                placeholder="Enter list name..."
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select status...</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setEditingItem(null);
                  setTitle("");
                  setStatus("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
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
