import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiEye, FiX } from 'react-icons/fi';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el modal de detalles
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // El administrador obtiene TODOS los pedidos de la tienda
      const response = await apiClient.get('/orders'); 
      setOrders(response.data);
    } catch (err) {
      setError('Error al cargar el registro general de pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Petición para actualizar el estado del pedido
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      
      // Actualizamos el estado local para reflejar el cambio inmediatamente
      setOrders(orders.map(order => 
        (order._id || order.id) === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert('Hubo un error al actualizar el estado del pedido.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'entregado': return <FiCheckCircle className="text-emerald-500" />;
      case 'cancelado': return <FiXCircle className="text-red-500" />;
      default: return <FiClock className="text-amber-500" />;
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Pedidos</h1>
        <p className="text-slate-500 mt-1">Administra y actualiza el estado de las ventas.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
              <FiPackage className="text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No hay pedidos</h2>
            <p className="text-slate-500">Aún no se han registrado compras en la tienda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-medium">ID Pedido / Fecha</th>
                  <th className="p-4 font-medium">Cliente</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800 text-sm">#{order._id?.slice(-6).toUpperCase() || order.id}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt || order.date).toLocaleDateString('es-ES')}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-800 font-medium">{order.userId?.name || 'Cliente'}</p>
                      <p className="text-xs text-slate-500">{order.userId?.email || 'N/A'}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      ${typeof order.total === 'number' ? order.total.toLocaleString('en-US') : order.total}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium capitalize text-slate-700">
                          {order.status || 'En Proceso'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => openDetails(order)}
                          className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Ver detalles del pedido"
                        >
                          <FiEye className="text-xl" />
                        </button>
                        <select
                        value={order.status || 'en proceso'}
                        onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                        className="text-sm bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                      >
                        <option value="en proceso">En Proceso</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalles del Pedido */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
            
            {/* Cabecera del Modal */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Detalles del Pedido #{selectedOrder._id?.slice(-6).toUpperCase() || selectedOrder.id}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Cliente: {selectedOrder.userId?.name} ({selectedOrder.userId?.email})
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors self-start">
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Contenido del Modal (Productos) */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Productos</h3>
              <div className="space-y-4">
                {selectedOrder.products?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sin img</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500">Cantidad: {item.quantity} x ${item.price?.toLocaleString('en-US')}</p>
                    </div>
                    <div className="font-bold text-slate-800 text-lg">
                      ${(item.price * item.quantity).toLocaleString('en-US')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-slate-600 font-medium">Total Pagado:</span>
              <span className="text-2xl font-extrabold text-indigo-600">
                ${selectedOrder.total?.toLocaleString('en-US')}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrdersPage;