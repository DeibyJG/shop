import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiEye, FiX } from 'react-icons/fi';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Suponiendo que la API devuelve los pedidos del usuario autenticado
        const response = await apiClient.get('/orders/user');
        setOrders(response.data);
      } catch (err) {
        setError('No pudimos cargar tu historial de pedidos. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Función para determinar el estilo y el icono según el estado del pedido
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'entregado':
        return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium"><FiCheckCircle /> Entregado</span>;
      case 'cancelado':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium"><FiXCircle /> Cancelado</span>;
      default:
        return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium"><FiClock /> En Proceso</span>;
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
    <div className="max-w-5xl mx-auto mt-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Mis Pedidos</h1>
        <p className="text-slate-500 mt-1">Revisa el historial y estado de tus compras.</p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
            <FiPackage className="text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Aún no tienes pedidos</h2>
          <p className="text-slate-500">Cuando realices una compra, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id || order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Cabecera del pedido */}
              <div className="bg-slate-50 p-4 sm:px-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Pedido #{order._id?.slice(-6).toUpperCase() || order.id}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(order.createdAt || order.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Total</p>
                    <p className="font-bold text-slate-800">${typeof order.total === 'number' ? order.total.toLocaleString('en-US') : order.total}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Botón para abrir el modal */}
              <div className="p-4 sm:px-6 bg-white flex justify-end">
                <button
                  onClick={() => openDetails(order)}
                  className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <FiEye className="text-lg" />
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  Fecha: {new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
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

export default OrdersPage;