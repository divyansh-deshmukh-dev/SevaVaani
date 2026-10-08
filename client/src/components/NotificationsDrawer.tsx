import { X, Bell, Check, Trash2, ShieldCheck, Info } from 'lucide-react';
import type { NotificationItem } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (item: NotificationItem) => void;
  t: (key: string, fallback?: string) => string;
}

export function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onSelectNotification,
  t
}: NotificationsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'subtle-fade-in 0.2s ease-out'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            backgroundColor: '#0d4436',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#a7f3d0" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
              {t('notifications', 'नागरिक सूचनाएं')}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '12.5px'
          }}
        >
          <button
            onClick={onMarkAllRead}
            style={{
              background: 'none',
              border: 'none',
              color: '#0d4436',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Check size={14} />
            सब पढ़े चिह्नित करें
          </button>
          <button
            onClick={onClearAll}
            style={{
              background: 'none',
              border: 'none',
              color: '#b91c1c',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={14} />
            {t('clearAll', 'सभी साफ करें')}
          </button>
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '14px' }}>
              <Info size={32} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
              {t('noNotifications', 'कोई नई सूचना नहीं है')}
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotification(item)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: item.read ? '#ffffff' : '#f0fdf4',
                  border: item.read ? '1px solid #e2e8f0' : '1.5px solid #86efac',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  position: 'relative'
                }}
              >
                {!item.read && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981'
                    }}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <ShieldCheck size={14} color="#0d4436" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0d4436' }}>
                    {item.title}
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.45, marginBottom: '6px' }}>
                  {item.message}
                </p>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {item.timestamp}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
