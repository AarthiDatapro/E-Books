import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  getAffiliatorsRoute,
  deleteAffiliatorRoute,
  updateAffiliatorRoute,
  resetCommissionsRoute,
} from '../../utils/APIRoutes';
import '../../styles/ViewAffiliator.css';

function ViewAffiliator() {
  const [affiles, setAffiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAffile, setCurrentAffile] = useState(null);

  useEffect(() => {
    fetchAffiliators();
  }, []);

  const fetchAffiliators = () => {
    axios
      .get(getAffiliatorsRoute)
      .then((res) => setAffiles(res.data.affiles))
      .catch((err) => console.error('Error fetching affiliators:', err));
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this affiliator?');
    if (!confirm) return;

    try {
      await axios.delete(`${deleteAffiliatorRoute}/${id}`);
      fetchAffiliators(); // Refresh the list
    } catch (err) {
      console.error('Error deleting affiliator:', err);
    }
  };

  const handleEdit = (affile) => {
    setCurrentAffile({ ...affile }); // Clone to avoid direct mutation
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${updateAffiliatorRoute}/${currentAffile._id}`, currentAffile);
      fetchAffiliators();
      setIsEditing(false);
      setCurrentAffile(null);
    } catch (err) {
      console.error('Error updating affiliator:', err);
    }
  };


  const handleResets = async () => {
    const confirm = window.confirm('Are you sure you want to reset all commissions?');
    if (!confirm) return;

    try {
      await axios.post(resetCommissionsRoute);
      fetchAffiliators(); // Refresh the list
      alert('Commissions reset successfully!');
    } catch (err) {
      console.error('Error resetting commissions:', err);
    }
  }

  return (
    <div className="table-container">
      {affiles.length === 0 ? (
        <p className="no-data">No affiliators found.</p>
      ) : (
        <div className="table-wrapper">
          <button className='handlereset-commisions' onClick={handleResets}>Reset Commissions</button>
          <table className="affiliator-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Commission</th>
                <th>City</th>
                <th>State</th>
                <th>Short URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {affiles.map((affile) => (
                <tr key={affile._id}>
                  <td>{affile.username}</td>
                  <td>{affile.email}</td>
                  <td>{affile.phoneNumber}</td>
                  <td>₹ {affile.commission}</td>
                  <td>{affile.city}</td>
                  <td>{affile.state}</td>
                  <td>
                    <a href={affile.shortUrl} target="_blank" rel="noreferrer">
                      {affile.shortUrl}
                    </a>
                  </td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(affile)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(affile._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditing && currentAffile && (
        <div className="edit-modal">
          <h3>Edit Affiliator</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={currentAffile.username}
              onChange={(e) => setCurrentAffile({ ...currentAffile, username: e.target.value })}
              placeholder="Username"
              required
            />
            <input
              type="email"
              value={currentAffile.email}
              onChange={(e) => setCurrentAffile({ ...currentAffile, email: e.target.value })}
              placeholder="Email"
              required
            />
            <input
              type="text"
              value={currentAffile.phoneNumber}
              onChange={(e) => setCurrentAffile({ ...currentAffile, phoneNumber: e.target.value })}
              placeholder="Phone"
              required
            />
            <input
              type="text"
              value={currentAffile.city}
              onChange={(e) => setCurrentAffile({ ...currentAffile, city: e.target.value })}
              placeholder="City"
              required
            />
            <input
              type="text"
              value={currentAffile.state}
              onChange={(e) => setCurrentAffile({ ...currentAffile, state: e.target.value })}
              placeholder="State"
              required
            />
            <div className="edit-actions">
              <button type="submit" className="edit-btn">
                Save
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentAffile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ViewAffiliator;
