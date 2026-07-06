import { useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';
import { FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../context/cartContext';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Consumimos la API utilizando tu apiClient ya configurado
        const response = await apiClient.get('/products');
        setProducts(response.data);
      } catch (err) {
        setError('Error al cargar el catálogo de productos. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Catálogo de Productos</h1>
        <p className="text-slate-500 mt-1">Descubre nuestra selección de artículos.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
          No hay productos disponibles en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id || product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col">
              
              {/* Imagen del producto */}
              <div className="h-48 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <span className="text-slate-400 font-medium">Sin imagen</span>
                )}
              </div>

              {/* Información del producto */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2 flex-1">
                  {product.short_description}
                </p>
                
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xl font-extrabold text-indigo-600">
                    ${typeof product.price === 'number' ? product.price.toLocaleString('en-US') : product.price}
                  </span>
                  
                  {/* Botón de Agregar al carrito (Requerimiento 2.2) */}
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white focus:ring-2 focus:ring-indigo-200 transition-colors"
                    title="Agregar al carrito"
                  >
                    <FiShoppingCart className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;