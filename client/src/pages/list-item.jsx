import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function listItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const { listId, listTitle } = location.state || {};
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [itemStatus, setItemStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await axios.post(`${API_URL}/get-items`, { listId });
      setItems(response.data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async () => {
    if (!desc.trim()) {
      setError("Please enter a description");
      return;
    }
    
    setAddingItem(true);
    setError("");
    try {
      const response = await axios.post(`${API_URL}/add-items`, { listId, desc, status: itemStatus });
      setDesc("");
      setItemStatus("pending");
      setError("");
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
      setError(error.response?.data?.message || "Error adding item");
    } finally {
      setAddingItem(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item.id);
    setEditDesc(item.description);
  };

  const handleSaveEdit = async () => {
    if (!editDesc.trim()) {
      setError("Description cannot be empty");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/edit-items`, { id: editingItem, desc: editDesc });
      setEditingItem(null);
      setError("");
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
      setError(error.response?.data?.message || "Error updating item");
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditDesc("");
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.post(`${API_URL}/delete-items`, { id });
        setError("");
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
        setError(error.response?.data?.message || "Error deleting item");
      }
    }
  };

  useEffect(() => {
    if (listId) {
      fetchItems();
    }
  }, [listId]);

  if (!listId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">No list selected.</p>
        <button
          onClick={() => navigate('/home')}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          Back to Lists
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{listTitle}</h1>
        <button
          onClick={() => navigate('/home')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
        >
          Back to Lists
        </button>
      </div>

      {error && (
        <p className="mb-4 text-red-600 text-sm">{error}</p>
      )}

      {/* Add Item Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">Add New Item</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
              if (error) setError("");
            }}
          />
          <select
            className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            value={itemStatus}
            onChange={(e) => setItemStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={handleAddItem}
            disabled={addingItem}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {addingItem ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      {/* Items Section */}
      <h2 className="text-lg font-bold mb-3">Items ({items.length})</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 py-4">No items yet. Add one above!</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 text-left">
              <th className="py-2">Description</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3">
                  {editingItem === item.id ? (
                    <input
                      type="text"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    item.description
                  )}
                </td>
                <td className="py-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs">
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-right space-x-2">
                  {editingItem === item.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default listItem;
