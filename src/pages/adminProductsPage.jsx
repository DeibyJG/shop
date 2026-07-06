import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { FiEdit, FiTrash2, FiPlus, FiBox } from 'react-icons/fi';
import ProductModal from '../components/admin/productModal'; // <-- Importamos el modal

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar el inventario de productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await apiClient.delete(`/products/${id}`);
        setProducts(products.filter((product) => (product._id || product.id) !== id));
      } catch (err) {
        alert('Hubo un error al intentar eliminar el producto.');
      }
    }
  };

  // Función unificada para crear o actualizar desde el modal
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Actualizar producto existente (PUT)
        const id = editingProduct._id || editingProduct.id;
        const response = await apiClient.put(`/products/${id}`, productData);
        setProducts(products.map(p => (p._id || p.id) === id ? response.data : p));
      } else {
        // Crear nuevo producto (POST)
        const response = await apiClient.post('/products', productData);
        setProducts([...products, response.data]);
      }
      setIsModalOpen(false); // Cerrar el modal al finalizar
    } catch (err) {
      alert('Error al guardar el producto. Verifica tu conexión.');
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
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
      {/* Encabezado y botón de agregar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Productos</h1>
          <p className="text-slate-500 mt-1">Administra el inventario de tu tienda.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          <FiPlus className="text-lg" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Tabla de Productos */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
              <FiBox className="text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Inventario vacío</h2>
            <p className="text-slate-500">Comienza agregando tu primer producto a la tienda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium">Precio</th>
                  <th className="p-4 font-medium text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product._id || product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">Sin img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{product.short_description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      ${typeof product.price === 'number' ? product.price.toLocaleString('en-US') : product.price}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar producto"
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id || product.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Formulario */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
};

export default AdminProductsPage;