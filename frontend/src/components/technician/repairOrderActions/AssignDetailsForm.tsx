import { useState, useEffect } from "react";
import { WrenchScrewdriverIcon, CubeIcon } from "@heroicons/react/24/outline";
import { services, spareParts, users, repairOrders } from "../../../api";
import type { Service } from "../../../types/service.types";
import type { RepairOrder } from "../../../types/repair-order.types";
import type { CreateRepairOrderDetailDto } from "../../../types/repair-order-detail.types";
import type { CreateRepairOrderPartDto } from "../../../types/repair-order-part.types";
import type { Technician } from "../../../types/technician.types";
import type { SparePart } from "../../../types/spare-part.types";
import {
  AvailableServicesList,
  AvailablePartsList,
  SelectedServicesList,
  SelectedPartsList,
} from "../assignDetails";

// Tipos locales para el formulario (incluyen estado UI)
interface ServiceSelection {
  service: Service;
  technicianId: string;
  unitPrice: number;
  discount: number;
  notes: string;
}

interface PartSelection {
  part: SparePart;
  quantity: number;
}

interface AssignDetailsFormProps {
  order: RepairOrder
  onSave: (details: CreateRepairOrderDetailDto[], parts: CreateRepairOrderPartDto[]) => Promise<void>;  onCostCalculated?: (cost: number) => void;}

export function AssignDetailsForm({ order, onSave, onCostCalculated }: AssignDetailsFormProps) {
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [availableTechnicians, setAvailableTechnicians] = useState<Technician[]>([]);
  const [availableParts, setAvailableParts] = useState<SparePart[]>([]);
  const [isEvaluator, setIsEvaluator] = useState(false);
  
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([]);
  const [selectedParts, setSelectedParts] = useState<PartSelection[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalCost, setFinalCost] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Calcular costo final automáticamente cuando cambie la orden
    if (order?.id) {
      calculateFinalCost();
    }
  }, [order.id, order.repairOrderDetails?.length, order.repairOrderParts?.length]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No hay sesión activa");
        return;
      }

      // Validar que order.equipment existe
      if (!order?.equipment?.id) {
        setError("Error: No se pudo cargar la información del equipo");
        return;
      }

      const [servicesData, techniciansData, partsData, myProfile] = await Promise.all([
        services.getApplicableServices(order.equipment.id),
        users.findTechnicians(),
        spareParts.getAll(),
        users.getMyProfile(), // Usar users.getMyProfile() en lugar de auth.getProfile()
      ]);
      setAvailableServices(servicesData);
      // Filtrar solo técnicos activos y NO evaluadores
      setAvailableTechnicians(techniciansData.filter((t: Technician) => t.active && !t.isEvaluator));
      setAvailableParts(partsData);
      // Verificar si el usuario actual es evaluador (myProfile ya incluye isEvaluator si es técnico)
      setIsEvaluator((myProfile as Technician)?.isEvaluator === true);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar los datos. Verifique que el backend esté corriendo.");
    }
  };

  // Servicios
  const addService = (service: Service) => {
    if (selectedServices.find(s => s.service.id === service.id)) return;
    setSelectedServices([
      ...selectedServices,
      {
        service,
        technicianId: "",
        unitPrice: Number(service.basePrice),
        discount: 0,
        notes: "",
      },
    ]);
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.service.id !== serviceId));
  };

  const updateService = (serviceId: string, updates: Partial<ServiceSelection>) => {
    setSelectedServices(
      selectedServices.map(s =>
        s.service.id === serviceId ? { ...s, ...updates } : s
      )
    );
  };

  // Piezas
  const addPart = (part: SparePart) => {
    if (selectedParts.find(p => p.part.id === part.id)) return;
    setSelectedParts([
      ...selectedParts,
      {
        part,
        quantity: 1,
      },
    ]);
  };

  const removePart = (partId: string) => {
    setSelectedParts(selectedParts.filter(p => p.part.id !== partId));
  };

  const updateQuantity = (partId: string, delta: number) => {
    setSelectedParts(
      selectedParts.map(p => {
        if (p.part.id === partId) {
          const newQuantity = Math.max(1, Math.min(p.quantity + delta, p.part.stock));
          return { ...p, quantity: newQuantity };
        }
        return p;
      })
    );
  };

  const calculateFinalCost = async () => {
    if (!order?.id) return;
    
    try {
      const cost = await repairOrders.getByFinalCost(order.id);
      setFinalCost(cost);
      if (onCostCalculated) {
        onCostCalculated(cost);
      }
    } catch (err) {
      console.error("Error calculando costo final:", err);
    }
  };

  const handleSave = async () => {
    setError(null);

    // Validar servicios
    for (const sel of selectedServices) {
      if (!sel.technicianId) {
        setError(`Debe asignar un técnico al servicio "${sel.service.serviceName}"`);
        return;
      }
      // Solo validar notas si NO es evaluador
      if (!isEvaluator && !sel.notes.trim()) {
        setError(`Debe agregar notas al servicio "${sel.service.serviceName}"`);
        return;
      }
    }

    setLoading(true);

    try {
      // Preparar DTOs
      const details: CreateRepairOrderDetailDto[] = selectedServices.map(sel => ({
        serviceId: sel.service.id,
        technicianId: sel.technicianId,
      }));

      const parts: CreateRepairOrderPartDto[] = selectedParts.map(sel => ({
        partId: sel.part.id,
        quantity: sel.quantity,
      }));

      await onSave(details, parts);
      
      // Limpiar formulario
      setSelectedServices([]);
      setSelectedParts([]);
    } catch (err) {
      console.error("Error guardando detalles:", err);
      setError(err instanceof Error ? err.message : "Error al guardar los detalles");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const canSave = selectedServices.length > 0 || selectedParts.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
        <h3 className="text-xl font-bold">Asignar Detalles a la Orden</h3>
        <p className="text-sm text-blue-100 mt-1">Seleccione servicios y piezas para esta reparación</p>
      </div>

      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="p-6 grid grid-cols-2 gap-6 max-h-[calc(100vh-280px)] overflow-y-auto">
        {/* COLUMNA IZQUIERDA: SERVICIOS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-bold text-gray-900">Servicios</h4>
          </div>

          <SelectedServicesList
            selections={selectedServices}
            technicians={availableTechnicians}
            onRemove={removeService}
            onUpdate={updateService}
            isEvaluator={isEvaluator}
          />

          <AvailableServicesList
            services={availableServices}
            selectedServiceIds={selectedServices.map(s => s.service.id)}
            onSelectService={addService}
          />
        </div>

        {/* COLUMNA DERECHA: PIEZAS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <CubeIcon className="w-6 h-6 text-purple-600" />
            <h4 className="text-lg font-bold text-gray-900">Piezas</h4>
          </div>

          <SelectedPartsList
            selections={selectedParts}
            onRemove={removePart}
            onUpdateQuantity={updateQuantity}
          />

          <AvailablePartsList
            parts={availableParts}
            selectedPartIds={selectedParts.map(p => p.part.id)}
            onSelectPart={addPart}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 space-y-3">
        {finalCost !== null && (
          <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Costo Final de la Orden:</span>
              <span className="text-2xl font-bold text-green-700">${finalCost.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        <button
          onClick={handleSave}
          disabled={loading || !canSave}
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            `Asignar Detalles a la Orden (${selectedServices.length + selectedParts.length})`
          )}
        </button>
      </div>
    </div>
  );
}
