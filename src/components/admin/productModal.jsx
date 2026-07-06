import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const ProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    price: '',
    image: ''
  });

  // Si hay un producto para editar, llenamos el formulario al abrir el modal
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        short_description: productToEdit.short_description || '',
        price: productToEdit.price || '',
        image: productToEdit.image || ''
      });
    } else {
      // Limpiar formulario si es un producto nuevo
      setFormData({ name: '', short_description: '', price: '', image: '' });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir el precio a número antes de enviar
    onSave({ ...formData, price: Number(formData.price) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL de la Imagen</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-sm"
            >
              Guardar Producto
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProductModal;