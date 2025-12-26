import { useState, useEffect } from 'react';
import { services as servicesAPI } from '../../api/services';
import { PlusIcon, TrashIcon, WrenchScrewdriverIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { Service, CreateMaintenanceServiceDto, UpdateMaintenanceServiceDto } from '../../types/service.types';
import { EquipmentType } from '../../types/equipment.types';
import { ServiceModal } from '../../components/admin/ServiceModal';

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<EquipmentType | 'ALL'>('ALL');

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

  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedEquipmentType === 'ALL' || 
                        service.applicableEquipmentTypes.includes(selectedEquipmentType);
    return matchesSearch && matchesType;
  });


  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Servicios de Mantenimiento</h1>
            <p className="text-gray-400">
              Gestión de {services.length} servicios disponibles
            </p>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Servicio
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre del servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              />
            </div>
            
            {/* Equipment Type Filter */}
            <div className="relative sm:w-64">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedEquipmentType}
                onChange={(e) => setSelectedEquipmentType(e.target.value as EquipmentType | 'ALL')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">Todos los tipos</option>
                {Object.values(EquipmentType).map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Servicio
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tipos Aplicables
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Precio
                      </span>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Estado
                      </span>
                    </th>
                    <th className="px-6 py-4 text-right">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Acciones
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                            <WrenchScrewdriverIcon className="w-8 h-8 text-gray-600" />
                          </div>
                          <p className="text-gray-500 font-medium">No se encontraron servicios</p>
                          <p className="text-sm text-gray-600">Intenta con otros filtros o crea un nuevo servicio</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                              <WrenchScrewdriverIcon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{service.serviceName}</div>
                              <div className="text-xs text-gray-400 max-w-md truncate mt-0.5">
                                {service.description || '-'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {service.applicableEquipmentTypes.slice(0, 3).map((type) => (
                              <span
                                key={type}
                                className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded"
                              >
                                {type.replace(/_/g, ' ')}
                              </span>
                            ))}
                            {service.applicableEquipmentTypes.length > 3 && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded">
                                +{service.applicableEquipmentTypes.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-emerald-400 font-semibold">
                            ${service.basePrice}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleActive(service)}
                            className={`px-3 py-1 inline-flex text-xs font-medium rounded-lg transition-all ${
                              service.active
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            }`}
                          >
                            {service.active ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleDelete(service.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Eliminar servicio"
                            >
                              <TrashIcon className="w-4 h-4" />
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
    </div>
  );
}
