import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { FiUsers, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const AdminClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Petición al backend para listar todos los usuarios
        const response = await apiClient.get('/users');
        
        // Filtramos para mostrar solo a los clientes y excluir a otros administradores
        const onlyClients = response.data.filter(user => user.role === 'cliente' || !user.role);
        setClients(onlyClients);
      } catch (err) {
        setError('Error al cargar el directorio de clientes.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Directorio de Clientes</h1>
        <p className="text-slate-500 mt-1">Visualiza y contacta a los usuarios registrados en tu tienda.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {clients.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
              <FiUsers className="text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No hay clientes</h2>
            <p className="text-slate-500">Aún no se han registrado usuarios en la plataforma.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-medium">Cliente</th>
                  <th className="p-4 font-medium">Contacto</th>
                  <th className="p-4 font-medium">Dirección</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client._id || client.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Columna: Nombre e ID */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                          {client.name ? client.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{client.name || 'Usuario Sin Nombre'}</p>
                          <p className="text-xs text-slate-500">ID: {client._id?.slice(-6).toUpperCase() || client.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Columna: Email y Teléfono */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiMail className="text-slate-400" />
                          <span className="text-sm">{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <FiPhone className="text-slate-400" />
                            <span className="text-sm">{client.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Columna: Dirección */}
                    <td className="p-4">
                      {client.address ? (
                        <div className="flex items-start gap-2 text-slate-600">
                          <FiMapPin className="text-slate-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm max-w-xs truncate" title={client.address}>
                            {client.address}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">No registrada</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClientsPage;