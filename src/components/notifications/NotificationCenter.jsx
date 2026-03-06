import React, { useState } from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';

export default function NotificationCenter({ notifications = [], onMarkRead, onDelete, onClose }) {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'deadline_alert':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'new_movement':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'process_synced':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed right-4 top-20 w-96 max-h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Notificações</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 border-b border-gray-100">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              filter === f
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'unread' ? 'Não lidas' : 'Lidas'}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Bell size={32} className="mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                !notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => !notification.read && onMarkRead(notification.id)}
            >
              <div className="flex gap-3">
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.timestamp).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Marcar todas como lidas
          </button>
        </div>
      )}
    </div>
  );
}