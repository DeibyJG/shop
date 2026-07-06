import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { FiShield, FiUserPlus, FiX } from 'react-icons/fi';

const AdminAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el modal de nuevo admin
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await apiClient.get('/users');
      // Filtramos para mostrar solo los que tienen rol admin
      const adminUsers = response.data.filter(user => user.role === 'admin');
      setAdmins(adminUsers);
    } catch (err) {
      setError('Error al cargar la lista de administradores.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      await apiClient.post('/auth/register-admin', formData);
      // Recargar lista y cerrar modal
      await fetchAdmins();
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', phone: '', address: '' });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Ocurrió un error al registrar el administrador.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Administradores</h1>
          <p className="text-slate-500 mt-1">Gestiona los usuarios con acceso al panel administrativo.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <FiUserPlus className="text-lg" />
          Nuevo Admin
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {admins.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
              <FiShield className="text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No hay administradores</h2>
            <p className="text-slate-500">No se encontraron usuarios con el rol de admin.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-medium">ID / Fecha de Registro</th>
                  <th className="p-4 font-medium">Nombre</th>
                  <th className="p-4 font-medium">Contacto</th>
                  <th className="p-4 font-medium">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => (
                  <tr key={admin._id || admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800 text-sm">#{admin._id?.slice(-6).toUpperCase() || admin.id}</p>
                      <p className="text-xs text-slate-500">
                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-800">{admin.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-800">{admin.email}</p>
                      <p className="text-xs text-slate-500">{admin.phone || 'Sin teléfono'}</p>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm font-medium w-max">
                        <FiShield /> Admin
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Nuevo Administrador */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Registrar Nuevo Admin</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                  {submitError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="ejemplo@admin.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Ej. 12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Ej. Ciudad, País"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    'Registrar Admin'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdminsPage;
