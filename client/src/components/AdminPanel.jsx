import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminPanel = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleReset = async () => {
        if (!window.confirm('Are you sure you want to reset all bookings?')) return;

        setLoading(true);
        try {
            const response = await api.delete('/booking/reset');
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user?.isAdmin) return null;

    return (
        <div className="admin-panel">
            <h2>Admin Controls</h2>
            <button
                onClick={handleReset}
                disabled={loading}
                className="reset-button"
            >
                {loading ? 'Resetting...' : 'Reset All Bookings'}
            </button>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AdminPanel;