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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
        <p className="text-gray-600 mb-4 text-lg font-medium">No list selected.</p>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-3 text-white font-bold hover:opacity-90 transition"
          style={{ backgroundColor: '#FF6347' }}
        >
          Back to Lists
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-orange-100 to-red-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black" style={{ color: '#FF6347' }}>{listTitle}</h1>
      </div>

      {error && (
        <p className="mb-4 text-red-600 text-sm font-semibold bg-red-50 p-3">{error}</p>
      )}

      {/* Add Item Section */}
      <div className="mb-6 bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FF6347' }}>Add New Item</h2>
        <div className="flex gap-3 flex-wrap items-center">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="flex-1 min-w-48 px-4 py-3 border-2 border-gray-300 focus:outline-none transition font-medium"
            style={{ borderColor: '#FF6347' }}
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
              if (error) setError("");
            }}
          />
          <select
            className="px-4 py-3 border-2 border-gray-300 focus:outline-none transition font-medium"
            style={{ borderColor: '#FF6347' }}
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
            className="px-6 py-3 text-white font-bold hover:opacity-90 disabled:opacity-50 transition"
            style={{ backgroundColor: '#FF6347' }}
          >
            {addingItem ? 'Adding...' : '+ Add'}
          </button>
          <button
            onClick={() => navigate('/home')}
            className="text-white px-6 py-3 font-bold hover:opacity-90 transition"
            style={{ backgroundColor: '#FF6347' }}
          >
            Back
          </button>
        </div>
      </div>

      {/* Items Section */}
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#FF6347' }}>Items ({items.length})</h2>
      {items.length === 0 ? (
        <p className="text-gray-600 py-8 text-lg font-medium bg-white p-6">No items yet. Add one above!</p>
      ) : (
        <div className="bg-white shadow-lg p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{ borderColor: '#FF6347' }}>
                <th className="py-3 text-left font-bold" style={{ color: '#FF6347' }}>Description</th>
                <th className="py-3 text-left font-bold" style={{ color: '#FF6347' }}>Status</th>
                <th className="py-3 text-right font-bold" style={{ color: '#FF6347' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 font-medium">
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-3 py-2 border-2 focus:outline-none transition"
                        style={{ borderColor: '#FF6347' }}
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td className="py-3">
                    <span className="px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: '#FF6347' }}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    {editingItem === item.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-white px-4 py-1 text-sm font-bold hover:opacity-90 transition"
                          style={{ backgroundColor: '#28a745' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 text-sm font-bold transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-white px-4 py-1 text-sm font-bold hover:opacity-90 transition"
                          style={{ backgroundColor: '#ffc107' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-white px-4 py-1 text-sm font-bold hover:opacity-90 transition"
                          style={{ backgroundColor: '#dc3545' }}
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
        </div>
      )}
    </div>
  );
}

export default listItem;
