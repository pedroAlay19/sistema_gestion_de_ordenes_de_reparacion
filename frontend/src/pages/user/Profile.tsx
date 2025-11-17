import { useState, useEffect } from "react";
import { users, getProfile, type UpdateUserDto } from "../../api/api";
import type { User } from "../../types";

export function Profile() {
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (token) {
        const profile = await getProfile(token);
        setProfileData(profile);
        setFormData({
          name: profile.name || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
        });
      }
    } catch (err) {
      console.error("Error al cargar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updateData: UpdateUserDto = {};

      if (formData.name !== profileData?.name) {
        updateData.name = formData.name;
      }
      if (formData.lastName !== profileData?.lastName) {
        updateData.lastName = formData.lastName;
      }
      if (formData.email !== profileData?.email) {
        updateData.email = formData.email;
      }
      if (formData.phone !== profileData?.phone) {
        updateData.phone = formData.phone;
      }
      if (formData.address !== profileData?.address) {
        updateData.address = formData.address;
      }

      await users.updateProfile(updateData);
      await loadUserProfile();
      setSuccess(true);
      setIsEditing(false);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      setError(err?.message || "Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profileData?.name || "",
      lastName: profileData?.lastName || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      address: profileData?.address || "",
    });
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-lg">Cargando información...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-slate-900 border-b border-gray-800 px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold text-white">
            Información del Perfil
          </h1>
          <p className="text-gray-200 mt-1">
            Administra tu información personal
          </p>
        </div>
      </div>

      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Mensajes */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✓ Perfil actualizado correctamente
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">✕ {error}</p>
            </div>
          )}

          {/* Tarjeta de Información */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Datos Personales
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Información básica de tu cuenta
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Editar
                </button>
              )}
            </div>

            {/* Contenido */}
            <div className="p-8">
              <div className="space-y-6">
                {/* ID y Rol */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID de Usuario
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-mono text-sm">
                      {profileData?.id}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 capitalize">
                      {profileData?.role}
                    </div>
                  </div>
                </div>

                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Ingresa tu apellido"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Email y Teléfono */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 text-gray-600"
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
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="+593 99 123 4567"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="Ingresa tu dirección completa"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  />
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuenta creada
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm">
                      {profileData?.createdAt
                        ? new Date(profileData.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Última actualización
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm">
                      {profileData?.updatedAt
                        ? new Date(profileData.updatedAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              {isEditing && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
