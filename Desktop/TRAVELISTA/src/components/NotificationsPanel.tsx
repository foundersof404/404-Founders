import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: number;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  transparent?: boolean;
  isScrolled?: boolean;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose, transparent, isScrolled, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://localhost:5003/api/notifications?user_id=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
            if (onUnreadCountChange) {
              onUnreadCountChange(data.filter((n: Notification) => !n.read).length);
            }
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, user?.id, onUnreadCountChange]);

  const handleNotificationClick = async (id: number) => {
    try {
      await fetch(`http://localhost:5003/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (onUnreadCountChange) {
        onUnreadCountChange(notifications.filter((n) => n.id !== id && !n.read).length);
      }
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <SheetTitle className="text-xl font-semibold">Notifications</SheetTitle>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
              <Bell className="w-12 h-12 mb-4" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel; 