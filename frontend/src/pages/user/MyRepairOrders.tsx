import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRepairOrders } from '../../api/api';
import type { RepairOrder } from '../../types/repair-order.types';

type FilterType = 'all' | 'active' | 'completed';

export default function MyRepairOrders() {
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getRepairOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'active') {
      return orders.filter((o) => o.status === 'OPEN' || o.status === 'IN_PROGRESS');
    }
    if (filter === 'completed') {
      return orders.filter((o) => o.status === 'CLOSED' || o.status === 'RESOLVED');
    }
    return orders;
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      OPEN: { 
        label: 'Solicitado', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '🟡',
        progress: 25
      },
      IN_PROGRESS: { 
        label: 'En Reparación', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '🔵',
        progress: 50
      },
      RESOLVED: { 
        label: 'Listo para Entrega', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '🟣',
        progress: 75
      },
      CLOSED: { 
        label: 'Entregado', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '🟢',
        progress: 100
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.OPEN;
  };

  const filteredOrders = getFilteredOrders();

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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Seguimiento de Reparaciones</h1>
            <p className="text-gray-600">Visual y claro como un rastreador de pedidos</p>
          </div>
          <Link
            to="/user/repair-orders/new"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Reparación
          </Link>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
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
              Todas <span className="ml-2 opacity-70">({orders.length})</span>
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'active'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Activas <span className="ml-2 opacity-70">({orders.filter((o) => o.status === 'OPEN' || o.status === 'IN_PROGRESS').length})</span>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Completadas <span className="ml-2 opacity-70">({orders.filter((o) => o.status === 'CLOSED' || o.status === 'RESOLVED').length})</span>
            </button>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🛠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {filter === 'all' ? 'No tienes órdenes de reparación' : 
                 filter === 'active' ? 'No tienes órdenes activas' : 
                 'No tienes órdenes completadas'}
              </h3>
              <p className="text-gray-600 mb-8">Solicita tu primera reparación para comenzar</p>
              <Link
                to="/user/repair-orders/new"
                className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Solicitar Reparación
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <Link
                    key={order.id}
                    to={`/user/repair-orders/${order.id}`}
                    className="block bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all overflow-hidden group"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                            {statusInfo.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                Orden #ORD-{order.id.toString().padStart(5, '0')}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-1">{order.equipment.name}</p>
                            <p className="text-sm text-gray-500">
                              {order.equipment.brand} - {order.equipment.model}
                            </p>
                          </div>
                        </div>
                        
                        {/* Cost Badge */}
                        {order.estimatedCost > 0 && (
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Costo Estimado</p>
                            <p className="text-2xl font-bold text-gray-900">${order.estimatedCost.toFixed(2)}</p>
                          </div>
                        )}
                      </div>

                      {/* Timeline Horizontal */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          {[
                            { label: 'Solicitado', step: 1 },
                            { label: 'En Reparación', step: 2 },
                            { label: 'Listo', step: 3 },
                            { label: 'Entregado', step: 4 },
                          ].map((item, index) => {
                            const isCompleted = statusInfo.progress >= (item.step * 25);
                            const isCurrent = statusInfo.progress === (item.step * 25);
                            
                            return (
                              <div key={item.step} className="flex-1 flex items-center">
                                <div className="flex flex-col items-center flex-1">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                    isCompleted 
                                      ? 'bg-black text-white shadow-lg scale-110' 
                                      : isCurrent 
                                      ? 'bg-blue-500 text-white shadow-lg scale-110 animate-pulse' 
                                      : 'bg-gray-200 text-gray-400'
                                  }`}>
                                    {isCompleted ? (
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    ) : item.step}
                                  </div>
                                  <p className={`text-xs mt-2 font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {item.label}
                                  </p>
                                </div>
                                {index < 3 && (
                                  <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                                    statusInfo.progress > (item.step * 25) ? 'bg-black' : 'bg-gray-200'
                                  }`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Creada: {new Date(order.createdAt).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Actualizada: {new Date(order.updatedAt).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-900 transition-colors">
                          <span className="text-sm font-medium">Ver seguimiento</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
