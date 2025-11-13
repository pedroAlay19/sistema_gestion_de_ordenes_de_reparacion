import { useState, useEffect } from "react";
import { WrenchScrewdriverIcon, CubeIcon } from "@heroicons/react/24/outline";
import { services, technicians, spareParts, auth } from "../../../api";
import { uploadImage } from "../../../api/supabase";
import type { MaintenanceService } from "../../../types";
import type { CreateRepairOrderDetailDto, CreateRepairOrderPartDto, Technician, SparePart } from "../../../api";
import {
  AvailableServicesList,
  AvailablePartsList,
  SelectedServicesList,
  SelectedPartsList,
} from "../assignDetails";

interface AssignDetailsFormProps {
  onSave: (details: CreateRepairOrderDetailDto[], parts: CreateRepairOrderPartDto[]) => Promise<void>;
}

interface ServiceSelection {
  service: MaintenanceService;
  technicianId: string;
  unitPrice: number;
  discount: number;
  notes: string;
}

interface PartSelection {
  part: SparePart;
  quantity: number;
  imageFile: File | null;
  imagePreview: string | null;
  imgUrl: string;
}

export function AssignDetailsForm({ onSave }: AssignDetailsFormProps) {
  const [availableServices, setAvailableServices] = useState<MaintenanceService[]>([]);
  const [availableTechnicians, setAvailableTechnicians] = useState<Technician[]>([]);
  const [availableParts, setAvailableParts] = useState<SparePart[]>([]);
  const [isEvaluator, setIsEvaluator] = useState(false);
  
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([]);
  const [selectedParts, setSelectedParts] = useState<PartSelection[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No hay sesión activa");
        return;
      }

      const [servicesData, techniciansData, partsData, profile] = await Promise.all([
        services.getAll(),
        technicians.getAll(),
        spareParts.getAll(),
        auth.getProfile(token),
      ]);
      setAvailableServices(servicesData);
      // Filtrar solo técnicos activos y NO evaluadores
      setAvailableTechnicians(techniciansData.filter(t => t.active && !t.isEvaluator));
      setAvailableParts(partsData);
      // Verificar si el usuario actual es evaluador
      const userTechnician = techniciansData.find(t => t.id === profile.id);
      setIsEvaluator(userTechnician?.isEvaluator || false);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar los datos. Verifique que el backend esté corriendo.");
    }
  };

  // Servicios
  const addService = (service: MaintenanceService) => {
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
        imageFile: null,
        imagePreview: null,
        imgUrl: "",
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

  const handleImageSelect = (partId: string, file: File | null) => {
    if (!file) {
      setSelectedParts(
        selectedParts.map(p =>
          p.part.id === partId
            ? { ...p, imageFile: null, imagePreview: null }
            : p
        )
      );
      return;
    }

    // Validar tipo
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Solo se permiten imágenes JPG, PNG o WEBP");
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedParts(
        selectedParts.map(p =>
          p.part.id === partId
            ? { ...p, imageFile: file, imagePreview: reader.result as string }
            : p
        )
      );
    };
    reader.readAsDataURL(file);
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
      // Subir imágenes de piezas
      const partsWithUrls: PartSelection[] = [];
      if (selectedParts.length > 0) {
        setUploadingImages(true);
        for (const sel of selectedParts) {
          let imgUrl = "";
          if (sel.imageFile) {
            imgUrl = await uploadImage(sel.imageFile, "repair-parts");
          }
          partsWithUrls.push({ ...sel, imgUrl });
        }
        setUploadingImages(false);
      }

      // Preparar DTOs
      const details: CreateRepairOrderDetailDto[] = selectedServices.map(sel => ({
        serviceId: sel.service.id,
        technicianId: sel.technicianId,
      }));

      const parts: CreateRepairOrderPartDto[] = partsWithUrls.map(sel => ({
        partId: sel.part.id,
        quantity: sel.quantity,
        imgUrl: sel.imgUrl || undefined,
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
      setUploadingImages(false);
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
            onImageSelect={handleImageSelect}
          />

          <AvailablePartsList
            parts={availableParts}
            selectedPartIds={selectedParts.map(p => p.part.id)}
            onSelectPart={addPart}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <button
          onClick={handleSave}
          disabled={loading || !canSave}
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {uploadingImages ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Subiendo imágenes...
            </>
          ) : loading ? (
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
