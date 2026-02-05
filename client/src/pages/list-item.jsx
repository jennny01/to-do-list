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
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No list selected.</p>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            Back to Lists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
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
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Add Item Section */}
          <div className="bg-white border border-gray-300 p-6">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Description</label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                  value={desc}
                  onChange={(e) => {
                    setDesc(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                  value={itemStatus}
                  onChange={(e) => setItemStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button
                onClick={handleAddItem}
                disabled={addingItem}
                className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingItem ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white border border-gray-300 p-6">
            <h2 className="text-xl font-bold mb-4">Items ({items.length})</h2>
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No items yet. Add one above to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-300 p-4">
                    {editingItem === item.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex-1 px-3 py-2 bg-green-600 text-white hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 px-3 py-2 bg-gray-400 text-white hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-semibold mb-1">{item.description}</p>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs">
                            {item.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="px-3 py-2 bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-3 py-2 bg-red-600 text-white hover:bg-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default listItem;
