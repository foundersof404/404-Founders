import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Trash2, 
  Eye, 
  EyeOff,
  Users,
  MessageSquare,
  TrendingUp,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchContacts();
  }, [navigate, currentPage]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/contacts?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        setContacts(data.contacts);
        setPagination(data.pagination);
        
        // Calculate stats
        const totalContacts = data.pagination.totalContacts;
        const unreadContacts = data.contacts.filter(contact => !contact.is_read).length;
        setStats({
          totalContacts,
          unreadContacts,
          readContacts: totalContacts - unreadContacts
        });
      } else {
        setError(data.message || 'Failed to fetch contacts');
      }
    } catch (error) {
      setError('Connection error. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const deleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchContacts(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete contact');
      }
    } catch (error) {
      setError('Failed to delete contact');
    }
  };

  const toggleReadStatus = async (contactId, isRead) => {
    if (isRead) return; // Already read, no need to toggle

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/contacts/${contactId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchContacts(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update read status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-cyber-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 via-transparent to-cyber-purple/5" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-neon rounded-lg flex items-center justify-center cyber-glow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-cyber font-bold text-white">
                Admin <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="text-text-secondary">Welcome back, {adminUser.username}</p>
            </div>
          </div>
          
          <motion.button
            onClick={handleLogout}
            className="cyber-button px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:border-red-500/50 rounded-lg transition-all duration-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Messages', value: stats.totalContacts || 0, icon: MessageSquare, color: 'cyber-blue' },
            { label: 'Unread Messages', value: stats.unreadContacts || 0, icon: Mail, color: 'cyber-orange' },
            { label: 'Read Messages', value: stats.readContacts || 0, icon: Eye, color: 'cyber-green' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-lg p-6 border border-dark-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}/20 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Contact Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-lg border border-dark-border overflow-hidden"
        >
          <div className="p-6 border-b border-dark-border">
            <h2 className="text-xl font-semibold text-white">Contact Messages</h2>
            <p className="text-text-secondary text-sm">
              {pagination.totalContacts} total messages • Page {pagination.currentPage} of {pagination.totalPages}
            </p>
          </div>

          <div className="divide-y divide-dark-border">
            <AnimatePresence>
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 hover:bg-dark-card/50 transition-all duration-300 ${!contact.is_read ? 'border-l-4 border-l-cyber-orange' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                        {!contact.is_read && (
                          <span className="px-2 py-1 bg-cyber-orange/20 text-cyber-orange text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2 text-text-secondary">
                          <Mail className="w-4 h-4" />
                          <span>{contact.email}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center space-x-2 text-text-secondary">
                            <Phone className="w-4 h-4" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.company && (
                          <div className="flex items-center space-x-2 text-text-secondary">
                            <Building className="w-4 h-4" />
                            <span>{contact.company}</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className={`text-white ${expandedMessage === contact.id ? '' : 'line-clamp-2'}`}>
                          {contact.message}
                        </p>
                        {contact.message.length > 100 && (
                          <button
                            onClick={() => setExpandedMessage(expandedMessage === contact.id ? null : contact.id)}
                            className="text-cyber-blue hover:text-cyber-purple text-sm mt-2 transition-colors"
                          >
                            {expandedMessage === contact.id ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(contact.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        onClick={() => toggleReadStatus(contact.id, contact.is_read)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          contact.is_read 
                            ? 'text-cyber-green bg-cyber-green/10' 
                            : 'text-text-secondary hover:text-cyber-blue hover:bg-cyber-blue/10'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title={contact.is_read ? 'Read' : 'Mark as read'}
                      >
                        {contact.is_read ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </motion.button>
                      
                      <motion.button
                        onClick={() => deleteContact(contact.id)}
                        className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-6 border-t border-dark-border flex items-center justify-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    page === currentPage
                      ? 'bg-cyber-blue text-white'
                      : 'text-text-secondary hover:text-white hover:bg-dark-card'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {contacts.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
            <p className="text-text-secondary">Contact messages will appear here when users submit the form.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
