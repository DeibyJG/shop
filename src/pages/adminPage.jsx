import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [stats, setStats] = useState({
    clients: 0,
    orders: 0,
    products: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          apiClient.get('/users'),
          apiClient.get('/orders'),
          apiClient.get('/products')
        ]);

        const clientsCount = usersRes.data.filter(u => u.role === 'cliente').length;
        
        const allOrders = ordersRes.data;
        // Pedidos activos (que no han sido entregados ni cancelados)
        const activeOrdersCount = allOrders.filter(o => o.status?.toLowerCase() !== 'entregado' && o.status?.toLowerCase() !== 'cancelado').length;
        
        // Calcular ingresos solo de pedidos entregados o aprobados
        const revenue = allOrders
          .filter(o => o.status?.toLowerCase() === 'entregado' || o.status?.toLowerCase() === 'aprobado')
          .reduce((sum, order) => sum + (order.total || 0), 0);

        setStats({
          clients: clientsCount,
          orders: activeOrdersCount,
          products: productsRes.data.length,
          revenue: revenue
        });

        // Obtener los 5 pedidos más recientes
        const sortedOrders = [...allOrders].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date);
          const dateB = new Date(b.createdAt || b.date);
          return dateB - dateA;
        });
        setRecentOrders(sortedOrders.slice(0, 5));
      } catch (err) {
        setError('No se pudo cargar la información del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'entregado':
        return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-medium w-max"><FiCheckCircle /> Entregado</span>;
      case 'cancelado':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full text-xs font-medium w-max"><FiXCircle /> Cancelado</span>;
      default:
        return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs font-medium w-max"><FiClock /> En Proceso</span>;
    }
  };

  const statCards = [
    { title: 'Total Clientes', value: stats.clients, icon: <FiUsers />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pedidos Activos', value: stats.orders, icon: <FiPackage />, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Total Productos', value: stats.products, icon: <FiShoppingBag />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Ingresos Totales', value: `$${stats.revenue.toLocaleString('en-US')}`, icon: <FiDollarSign />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

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
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Administrativo</h1>
        <p className="text-slate-500 mt-1">Resumen general del estado de la tienda en tiempo real.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}
      
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} text-2xl flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Sección para actividad reciente */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Últimos Pedidos</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Ver Todos
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Aún no se han registrado compras en la tienda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-medium pl-6">ID Pedido / Fecha</th>
                  <th className="p-4 font-medium">Cliente</th>
                  <th className="p-4 font-medium">Monto</th>
                  <th className="p-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
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
                      {getStatusBadge(order.status)}
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

export default AdminPage;