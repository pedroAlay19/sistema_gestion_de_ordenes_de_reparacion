import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRepairOrder, createReview } from '../../api/api';
import type { RepairOrder } from '../../types/repair-order.types';

export default function RepairOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<RepairOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    try {
      const data = await getRepairOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !comment.trim()) return;

    setSubmittingReview(true);
    try {
      await createReview(id, {
        rating,
        comment: comment.trim(),
      });
      alert('¡Gracias por tu reseña!');
      setShowReviewForm(false);
      loadOrder();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar la reseña');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getTimelineSteps = () => {
    if (!order) return [];
    
    const steps = [
      {
        label: 'Solicitado',
        icon: '🔔',
        status: 'completed',
        date: order.createdAt,
        description: 'Orden creada y registrada en el sistema'
      },
      {
        label: 'En Diagnóstico',
        icon: '🔍',
        status: order.status === 'OPEN' ? 'current' : ['IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(order.status) ? 'completed' : 'pending',
        date: order.status !== 'OPEN' ? order.updatedAt : undefined,
        description: 'Técnico revisando el equipo'
      },
      {
        label: 'Esperando Aprobación',
        icon: '🟠',
        status: order.diagnosis && order.status === 'OPEN' ? 'current' : order.status === 'IN_PROGRESS' || order.status === 'RESOLVED' || order.status === 'CLOSED' ? 'completed' : 'pending',
        date: order.diagnosis ? order.updatedAt : undefined,
        description: 'Diagnóstico listo, esperando confirmación'
      },
      {
        label: 'En Reparación',
        icon: '🔧',
        status: order.status === 'IN_PROGRESS' ? 'current' : order.status === 'RESOLVED' || order.status === 'CLOSED' ? 'completed' : 'pending',
        date: order.status === 'IN_PROGRESS' ? order.updatedAt : undefined,
        description: 'Técnico trabajando en la reparación'
      },
      {
        label: 'Listo para Entrega',
        icon: '🟣',
        status: order.status === 'RESOLVED' ? 'current' : order.status === 'CLOSED' ? 'completed' : 'pending',
        date: order.status === 'RESOLVED' ? order.updatedAt : undefined,
        description: 'Reparación completada'
      },
      {
        label: 'Entregado',
        icon: '✅',
        status: order.status === 'CLOSED' ? 'completed' : 'pending',
        date: order.status === 'CLOSED' ? order.updatedAt : undefined,
        description: 'Equipo entregado al cliente'
      },
    ];

    return steps;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-900 text-xl font-medium">Cargando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Orden no encontrada</h2>
          <Link to="/user/repair-orders" className="text-black hover:underline">
            Volver a mis órdenes
          </Link>
        </div>
      </div>
    );
  }

  const timelineSteps = getTimelineSteps();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/user/repair-orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a órdenes
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Orden #ORD-{order.id.toString().padStart(5, '0')}
              </h1>
              <p className="text-gray-600">
                Creada el {new Date(order.createdAt).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              order.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
              order.status === 'RESOLVED' ? 'bg-purple-100 text-purple-800' :
              'bg-green-100 text-green-800'
            }`}>
              {order.status === 'OPEN' ? 'Solicitado' :
               order.status === 'IN_PROGRESS' ? 'En Reparación' :
               order.status === 'RESOLVED' ? 'Listo para Entrega' : 'Entregado'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline Vertical */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Estado de la Reparación</h2>
              
              <div className="relative">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="flex gap-6 pb-12 last:pb-0">
                    {/* Line */}
                    {index < timelineSteps.length - 1 && (
                      <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200" 
                           style={{ height: 'calc(100% - 3.5rem)' }} />
                    )}
                    
                    {/* Icon */}
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${
                      step.status === 'completed' ? 'bg-green-500 shadow-lg' :
                      step.status === 'current' ? 'bg-blue-500 shadow-lg animate-pulse' :
                      'bg-gray-200'
                    }`}>
                      {step.status === 'completed' ? (
                        <span className="text-white">✓</span>
                      ) : step.status === 'current' ? (
                        <span>{step.icon}</span>
                      ) : (
                        <span className="text-gray-400">{step.icon}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3 className={`text-lg font-bold mb-1 ${
                        step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {step.label}
                      </h3>
                      <p className={`text-sm mb-2 ${
                        step.status === 'pending' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {step.description}
                      </p>
                      {step.date && (
                        <p className="text-xs text-gray-500">
                          {new Date(step.date).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnosis */}
            {order.diagnosis && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Diagnóstico Técnico</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-900 whitespace-pre-wrap">{order.diagnosis}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            {order.status === 'OPEN' && order.diagnosis && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Acciones Requeridas</h3>
                <p className="text-gray-600 mb-6">
                  El técnico ha completado el diagnóstico. Por favor, aprueba o rechaza el servicio.
                </p>
                <div className="flex gap-4">
                  <button className="flex-1 bg-black text-white px-6 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                    ✓ Aprobar Reparación
                  </button>
                  <button className="px-6 py-4 rounded-lg font-medium text-red-600 border-2 border-red-600 hover:bg-red-50 transition-colors">
                    ✗ Rechazar Servicio
                  </button>
                </div>
              </div>
            )}

            {/* Review Form */}
            {(order.status === 'RESOLVED' || order.status === 'CLOSED') && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Califica el Servicio</h3>
                
                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full bg-black text-white px-6 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">⭐</span>
                    Dejar una Reseña
                  </button>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Calificación
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-125"
                          >
                            <span className={`text-4xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ⭐
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Comentario
                      </label>
                      <textarea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                        placeholder="Cuéntanos sobre tu experiencia..."
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        disabled={submittingReview}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReview || !comment.trim()}
                        className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-300"
                      >
                        {submittingReview ? 'Enviando...' : 'Enviar Reseña'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Equipment Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Equipo</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Nombre</p>
                  <p className="font-semibold text-gray-900">{order.equipment.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Marca y Modelo</p>
                  <p className="font-semibold text-gray-900">{order.equipment.brand} - {order.equipment.model}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tipo</p>
                  <p className="font-semibold text-gray-900">{order.equipment.type}</p>
                </div>
              </div>
            </div>

            {/* Problem */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Problema</h3>
              </div>
              <p className="text-gray-700 text-sm">{order.problemDescription}</p>
            </div>

            {/* Cost */}
            {order.estimatedCost > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Costo</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Estimado</p>
                    <p className="text-2xl font-bold text-gray-900">${order.estimatedCost.toFixed(2)}</p>
                  </div>
                  {order.finalCost && order.finalCost > 0 && (
                    <div>
                      <p className="text-xs text-gray-500">Final</p>
                      <p className="text-2xl font-bold text-green-600">${order.finalCost.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Warranty */}
            {order.warrantyStartDate && order.warrantyEndDate && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-green-900">Garantía</h3>
                </div>
                <p className="text-sm text-green-800 mb-3">Esta reparación incluye garantía</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-green-700">Inicio</p>
                    <p className="font-semibold text-green-900">
                      {new Date(order.warrantyStartDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700">Fin</p>
                    <p className="font-semibold text-green-900">
                      {new Date(order.warrantyEndDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Download Button */}
            <button className="w-full bg-gray-900 text-white px-6 py-4 rounded-lg font-medium hover:bg-black transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar Comprobante
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
