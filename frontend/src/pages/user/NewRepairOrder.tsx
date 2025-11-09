import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEquipments, createRepairOrder } from "../../api/api";
import type { Equipment } from "../../types/equipment.types";
import { uploadImage } from "../../api/supabase";

export default function NewRepairOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const data = await getEquipments();
        setEquipments(data);
      } catch (error) {
        console.error("Error al cargar equipos:", error);
      }
    };
    loadEquipments();
  }, []);

  const handleSubmit = async () => {
    if (!selectedEquipmentId || !problemDescription.trim()) return;

    setLoading(true);
    setUploadingImages(true);

    try {
      let uploadedUrls: string[] = [];

      // Upload images to Supabase if there are any
      if (imageFiles.length > 0) {
        console.log(`📤 Uploading ${imageFiles.length} images to Supabase...`);

        const uploadPromises = imageFiles.map((file) => uploadImage(file));
        uploadedUrls = await Promise.all(uploadPromises);

        console.log("✅ All images uploaded successfully:", uploadedUrls);
      }

      // Create repair order with uploaded image URLs
      await createRepairOrder({
        equipmentId: selectedEquipmentId,
        problemDescription: problemDescription.trim(),
        imageUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
      });

      navigate("/user/repair-orders");
    } catch (error) {
      console.error("Error al crear orden:", error);
      alert("Error al crear la orden de reparación. Intenta nuevamente.");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    // Validate file types
    const validFiles = newFiles.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        alert(
          `${file.name}: Tipo de archivo no válido. Solo se permiten imágenes.`
        );
        return false;
      }

      // Validate size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`${file.name}: La imagen es muy grande. Tamaño máximo: 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setImageFiles([...imageFiles, ...validFiles]);
    }

    // Reset input
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const selectedEquipment = equipments.find(
    (e) => e.id === selectedEquipmentId
  );

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Nueva Orden de Reparación
            </h1>
            <p className="text-sm text-gray-600">
              Paso {step} de 3 -{" "}
              {step === 1
                ? "Seleccionar equipo"
                : step === 2
                ? "Describir problema"
                : "Confirmar"}
            </p>
          </div>
          <button
            onClick={() => navigate("/user/repair-orders")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`flex-1 h-2 rounded-full ${
                step >= 1 ? "bg-black" : "bg-gray-200"
              }`}
            />
            <div
              className={`flex-1 h-2 rounded-full ${
                step >= 2 ? "bg-black" : "bg-gray-200"
              }`}
            />
            <div
              className={`flex-1 h-2 rounded-full ${
                step >= 3 ? "bg-black" : "bg-gray-200"
              }`}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Select Equipment */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Selecciona el Equipo
              </h2>

              {equipments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No tienes equipos registrados
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Primero debes registrar un equipo
                  </p>
                  <button
                    onClick={() => navigate("/user/equipments/new")}
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                  >
                    Registrar Equipo
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {equipments.map((equipment) => (
                      <button
                        key={equipment.id}
                        onClick={() => setSelectedEquipmentId(equipment.id)}
                        className={`text-left p-6 rounded-lg border-2 transition-all ${
                          selectedEquipmentId === equipment.id
                            ? "border-black bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                              selectedEquipmentId === equipment.id
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {equipment.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {equipment.brand} - {equipment.model}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              <span>{equipment.type}</span>
                            </div>
                          </div>
                          {selectedEquipmentId === equipment.id && (
                            <svg
                              className="w-6 h-6 text-black shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedEquipmentId}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 2: Describe Problem */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Describe el Problema
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  ¿Qué problema presenta tu equipo?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="Describe detalladamente el problema que presenta tu equipo. Por ejemplo: 'La pantalla no enciende y hace un pitido al iniciar', 'No reconoce el disco duro', etc."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Mínimo 20 caracteres. Sé lo más específico posible para un
                  diagnóstico más preciso.
                </p>
              </div>

              {/* Images Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Imágenes del Daño (Opcional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Agrega fotos del equipo o del problema para ayudar al técnico
                  con el diagnóstico.
                </p>

                {/* File Input */}
                <div className="mb-4">
                  <label className="block w-full">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Haz clic para seleccionar imágenes
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP o GIF (máx. 5MB cada una)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image List */}
                {imageFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Imágenes seleccionadas ({imageFiles.length}):
                    </p>
                    {imageFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        {/* Image Preview */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-red-600 hover:text-red-700 transition-colors p-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={problemDescription.trim().length < 20}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && selectedEquipment && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Confirmar Solicitud
              </h2>

              <div className="space-y-6 mb-8">
                {/* Equipment Info */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Equipo
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedEquipment.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedEquipment.brand} - {selectedEquipment.model}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tipo: {selectedEquipment.type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Descripción del Problema
                  </h3>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {problemDescription}
                  </p>
                </div>

                {/* Images - Only show if images were added */}
                {imageFiles.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Imágenes del Daño ({imageFiles.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imageFiles.map((file, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">¿Qué sigue?</p>
                    <p>
                      Un técnico revisará tu solicitud y te contactará para
                      coordinar la revisión del equipo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                >
                  {loading
                    ? uploadingImages
                      ? `Subiendo imágenes (${imageFiles.length})...`
                      : "Creando orden..."
                    : "Confirmar y Enviar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
