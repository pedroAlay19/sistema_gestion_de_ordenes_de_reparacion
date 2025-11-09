import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRepairOrders } from '../../api/api';
import type { RepairOrder } from '../../types/repair-order.types';

type FilterType = 'all' | 'status' | 'messages' | 'warranty';

interface Notification {
  id: string;
  type: 'status' | 'message' | 'warranty';
  title: string;
  message: string;
  icon: string;
  timestamp: string;
  read: boolean;
  relatedOrderId?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Simular notificaciones desde las órdenes
      const orders = await getRepairOrders();
      
      const notifs: Notification[] = orders.flatMap((order: RepairOrder) => {
        const items: Notification[] = [];
        
        // Notificación de estado
        items.push({
          id: `status-${order.id}`,
          type: 'status',
          title: `Orden #${order.id} - Actualización de Estado`,
          message: `Tu orden está en estado: ${
            order.status === 'OPEN' ? 'Solicitado' :
            order.status === 'IN_PROGRESS' ? 'En Reparación' :
            order.status === 'RESOLVED' ? 'Listo para Entrega' : 'Entregado'
          }`,
          icon: '🛠️',
          timestamp: order.updatedAt,
          read: false,
          relatedOrderId: order.id,
        });

        // Notificación de diagnóstico
        if (order.diagnosis) {
          items.push({
            id: `diagnosis-${order.id}`,
            type: 'message',
            title: 'Diagnóstico Completado',
            message: `El técnico ha completado el diagnóstico de tu ${order.equipment.name}`,
            icon: '💬',
            timestamp: order.updatedAt,
            read: false,
            relatedOrderId: order.id,
          });
        }

        // Notificación de costo
        if (order.estimatedCost > 0) {
          items.push({
            id: `cost-${order.id}`,
            type: 'message',
            title: 'Costo Estimado Disponible',
            message: `Costo estimado: $${order.estimatedCost.toFixed(2)}`,
            icon: '💸',
            timestamp: order.updatedAt,
            read: false,
            relatedOrderId: order.id,
          });
        }

        return items;
      });

      setNotifications(notifs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-900 text-xl font-medium">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Notificaciones</h1>
            <p className="text-gray-600">
              {unreadCount > 0 
                ? `Tienes ${unreadCount} notificaciones sin leer` 
                : 'Todas las notificaciones están al día'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Marcar todo como leído
            </button>
          )}
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Todas <span className="ml-2 opacity-70">({notifications.length})</span>
            </button>
            <button
              onClick={() => setFilter('status')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'status'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              🛠️ Estado <span className="ml-2 opacity-70">({notifications.filter(n => n.type === 'status').length})</span>
            </button>
            <button
              onClick={() => setFilter('messages')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'messages'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              💬 Mensajes <span className="ml-2 opacity-70">({notifications.filter(n => n.type === 'message').length})</span>
            </button>
            <button
              onClick={() => setFilter('warranty')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'warranty'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              💸 Garantía <span className="ml-2 opacity-70">({notifications.filter(n => n.type === 'warranty').length})</span>
            </button>
          </div>

          {/* Notifications Feed */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔔</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No hay notificaciones</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No tienes notificaciones en este momento'
                  : `No tienes notificaciones de tipo ${filter === 'status' ? 'Estado' : filter === 'messages' ? 'Mensajes' : 'Garantía'}`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const content = (
                  <div
                    className={`flex items-start gap-4 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      notification.read
                        ? 'bg-white border-gray-200 hover:border-gray-300'
                        : 'bg-blue-50 border-blue-200 hover:border-blue-300 hover:shadow-lg'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      notification.read ? 'bg-gray-100' : 'bg-white shadow-md'
                    }`}>
                      {notification.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`font-bold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-3 h-3 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className={`text-sm mb-3 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(notification.timestamp).toLocaleString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.type === 'status' ? 'bg-purple-100 text-purple-800' :
                          notification.type === 'message' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {notification.type === 'status' ? 'Estado' :
                           notification.type === 'message' ? 'Mensaje' : 'Garantía'}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    {notification.relatedOrderId && (
                      <svg className="w-5 h-5 text-gray-400 shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                );

                return notification.relatedOrderId ? (
                  <Link key={notification.id} to={`/user/repair-orders/${notification.relatedOrderId}`}>
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
