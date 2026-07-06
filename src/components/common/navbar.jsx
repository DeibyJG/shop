import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { CartContext } from '../../context/cartContext';
import { FiShoppingCart, FiSearch } from 'react-icons/fi'; 

const Navbar = ({ toggleMobileSidebar }) => {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const { totalItems } = useContext(CartContext);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 shadow-sm h-16 flex-shrink-0">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        
        {/* Lado Izquierdo: Botón Móvil */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button 
            onClick={toggleMobileSidebar}
            className="md:hidden flex items-center justify-center p-1 -ml-1 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
            title="Abrir menú"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm transform -rotate-6 transition-transform hover:scale-105">
              S
            </div>
          </button>
          <h2 className="text-slate-700 font-semibold text-lg tracking-tight truncate">
            {role === 'admin' ? 'Panel de Administrador' : 'Catálogo de Productos'}
          </h2>
        </div>

        {/* Centro: Barra de Búsqueda */}
        <div className="hidden sm:flex justify-center flex-1 px-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all sm:text-sm"
              placeholder="Buscar..."
            />
          </div>
        </div>

        {/* Lado Derecho */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* El icono siempre se muestra para el cliente */}
          {role === 'cliente' && (
            <Link 
              to="/cart" 
              className="relative p-2 rounded-full text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              title="Ir al carrito"
            >
              <FiShoppingCart className="text-2xl" />
              
              {/* El contador solo se muestra si hay productos (totalItems > 0) */}
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;