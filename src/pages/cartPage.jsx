import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { AuthContext } from '../context/authContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiLoader } from 'react-icons/fi';
import apiClient from '../api/apiClient';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const orderPayload = {
        userId: user?.id || user?._id,
        products: cart.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        total: totalPrice
      };
      await apiClient.post('/orders', orderPayload);
      alert('Pedido realizado con éxito');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error(error);
      alert('Error al crear el pedido. Intenta nuevamente.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-400 mb-6">
          <FiShoppingBag className="text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 mb-8">Parece que aún no has agregado ningún producto.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Ir a la Tienda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Carrito de Compras</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lista de Productos */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 bg-slate-50 rounded-xl flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sin imagen</div>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                <p className="text-indigo-600 font-semibold mt-1">${item.price.toLocaleString('en-US')}</p>
              </div>

              {/* Controles de Cantidad */}
              <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="font-medium text-slate-700 w-6 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>

              <div className="text-right ml-4">
                <p className="text-sm text-slate-500 mb-1">Subtotal</p>
                <p className="font-bold text-slate-800">${(item.price * item.quantity).toLocaleString('en-US')}</p>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg ml-2 transition-colors"
                title="Eliminar producto"
              >
                <FiTrash2 className="text-xl" />
              </button>
            </div>
          ))}
        </div>

        {/* Resumen del Pedido */}
        <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Resumen</h2>
          
          <div className="space-y-3 text-sm text-slate-600 border-b border-slate-100 pb-4 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toLocaleString('en-US')}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="text-emerald-500 font-medium">Gratis</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-slate-800">Total</span>
            <span className="text-2xl font-extrabold text-indigo-600">${totalPrice.toLocaleString('en-US')}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-75"
          >
            {isCheckingOut ? <FiLoader className="animate-spin text-xl" /> : 'Realizar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;