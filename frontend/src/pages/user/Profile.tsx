import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getEquipments, getRepairOrders } from '../../api/api';
import type { RepairOrder } from '../../types/repair-order.types';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  // Activity stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    totalEquipments: 0,
    lastServiceDate: '',
  });

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = async () => {
    try {
      const [equipments, orders] = await Promise.all([
        getEquipments(),
        getRepairOrders(),
      ]);

      const completedOrders = orders.filter((o: RepairOrder) => o.status === 'CLOSED');
      const totalSpent = completedOrders.reduce(
        (sum: number, order: RepairOrder) => sum + (order.finalCost || order.estimatedCost || 0),
        0
      );
      
      const lastOrder = orders
        .filter((o: RepairOrder) => o.status === 'CLOSED')
        .sort((a: RepairOrder, b: RepairOrder) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

      setStats({
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalSpent,
        totalEquipments: equipments.length,
        lastServiceDate: lastOrder?.updatedAt || '',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // TODO: Implement update user API call
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
    });
    setIsEditing(false);
  };

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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y revisa tu actividad</p>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-linear-to-br from-black to-gray-800 p-8 text-white">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                    <p className="text-white/70">Cliente desde {new Date().getFullYear()}</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      ✏️ Editar
                    </button>
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-lg ${
                        isEditing
                          ? 'border-gray-300 focus:border-black focus:outline-none'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-lg ${
                        isEditing
                          ? 'border-gray-300 focus:border-black focus:outline-none'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Ej: +593 99 123 4567"
                      className={`w-full px-4 py-3 border-2 rounded-lg ${
                        isEditing
                          ? 'border-gray-300 focus:border-black focus:outline-none'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Tu dirección"
                      className={`w-full px-4 py-3 border-2 rounded-lg ${
                        isEditing
                          ? 'border-gray-300 focus:border-black focus:outline-none'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                    >
                      💾 Guardar Cambios
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 rounded-lg font-medium border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Seguridad</h3>
              <div className="space-y-4">
                <button className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        🔒
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Cambiar Contraseña</p>
                        <p className="text-sm text-gray-600">Última actualización: Nunca</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Activity Summary */}
          <div className="space-y-8">
            {/* Activity Stats */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-gray-900 p-6 text-white">
                <h3 className="text-lg font-bold">Resumen de Actividad</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      📋
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Total Órdenes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      ✅
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Completadas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      💻
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Equipos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalEquipments}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      💰
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Total Gastado</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${stats.totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Service */}
            {stats.lastServiceDate && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Último Servicio</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(stats.lastServiceDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
