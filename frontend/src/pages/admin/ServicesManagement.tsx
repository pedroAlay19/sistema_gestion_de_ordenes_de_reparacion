import { useState, useEffect } from 'react';
import { services as servicesAPI } from '../../api/services';
import { PlusIcon, TrashIcon, WrenchScrewdriverIcon, PencilIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import type { Service, CreateMaintenanceServiceDto, UpdateMaintenanceServiceDto } from '../../types';
import { ServiceModal } from '../../components/admin/ServiceModal';

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;
    
    try {
      await servicesAPI.delete(id);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error al eliminar el servicio');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedService(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setSelectedService(service);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const updatedService = await servicesAPI.update(service.id, { active: !service.active });
      setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
    } catch (error) {
      console.error('Error toggling service status:', error);
      alert('Error al cambiar el estado del servicio');
    }
  };

  const handleSaveService = async (serviceData: CreateMaintenanceServiceDto | UpdateMaintenanceServiceDto) => {
    if (modalMode === 'create') {
      const newService = await servicesAPI.create(serviceData as CreateMaintenanceServiceDto);
      setServices([...services, newService]);
    } else if (selectedService) {
      const updatedService = await servicesAPI.update(selectedService.id, serviceData as UpdateMaintenanceServiceDto);
      setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
    }
  };

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Servicios</h1>
          <p className="text-gray-400 mt-1">Gestión de servicios ofrecidos</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
              const sidebar = document.querySelector('.lg\\:fixed.lg\\:inset-y-0') as HTMLElement;
              const mainContent = document.querySelector('.lg\\:pl-64') as HTMLElement;
              if (sidebar && mainContent) {
                if (!sidebarCollapsed) {
                  sidebar.style.display = 'none';
                  mainContent.style.paddingLeft = '0';
                } else {
                  sidebar.style.display = 'flex';
                  mainContent.style.paddingLeft = '16rem';
                }
              }
            }}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-5 h-5" />
            {sidebarCollapsed ? 'Mostrar' : 'Ocultar'} Menú
          </button>
          <button 
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Servicio
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Servicios</p>
          <p className="text-2xl font-bold text-white mt-1">{services.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Servicios Activos</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {services.filter(s => s.active).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Servicios Inactivos</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            {services.filter(s => s.active === false).length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No se encontraron servicios
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                            <WrenchScrewdriverIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{service.serviceName}</div>
                            <div className="text-xs text-gray-400 max-w-md truncate">
                              {service.description || '-'}
                            </div>
                            {service.estimatedTimeMinutes && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                ⏱️ {service.estimatedTimeMinutes} minutos
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {service.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-green-400 font-semibold text-lg">
                          ${service.basePrice}
                        </div>
                        {service.requiresParts && (
                          <div className="text-xs text-yellow-500 mt-0.5">
                            + Repuestos
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleActive(service)}
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-all ${
                            service.active
                              ? 'bg-green-900/50 text-green-300 hover:bg-green-900/70'
                              : 'bg-red-900/50 text-red-300 hover:bg-red-900/70'
                          }`}
                        >
                          {service.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(service)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Editar servicio"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                            title="Eliminar servicio"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
        service={selectedService}
        mode={modalMode}
      />
    </div>
  );
}
