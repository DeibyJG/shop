import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiMapPin } from 'react-icons/fi';

const Register = () => {
  // Estado inicial requerido por el documento
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  // Asignacion de valores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Validacion de campos en tiempo real al perder el foco
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) newErrors.name = 'El nombre es requerido';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'El correo es requerido';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Formato de correo invalido';
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 6) {
          newErrors.password = 'Minimo 6 caracteres';
        }
        break;
      case 'phone':
        if (!value.trim()) newErrors.phone = 'El telefono es requerido';
        break;
      case 'address':
        if (!value.trim()) newErrors.address = 'La direccion es requerida';
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Procesamiento del formulario y conexion a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validacion general antes de enviar
    const hasEmptyFields = Object.values(formData).some(val => val === '');
    const hasErrors = Object.values(errors).some(val => val !== '');

    if (hasEmptyFields || hasErrors) {
      setApiError('Por favor complete todos los campos correctamente');
      return;
    }

    try {
      // Consumo del endpoint de registro de cliente
      await apiClient.post('/auth/register', formData);
      navigate('/login');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Error al registrar el usuario');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Lado Izquierdo: Branding (Oculto en moviles, ahora del lado opuesto) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 relative overflow-hidden items-center justify-center rounded-r-[3rem] shadow-inner">
        
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-full h-full bg-white opacity-20 filter blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2 scale-150"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 opacity-30 filter blur-3xl rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 p-12 text-center text-slate-700 max-w-lg">
          <div className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-sm border border-white/60 transform -rotate-12">
            <span className="text-4xl font-black text-pink-400 transform rotate-12">Shop</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-800">
            Únete a nuestra comunidad
          </h1>
          <p className="text-lg font-medium text-slate-600 leading-relaxed">
            Crea tu cuenta en segundos y empieza a disfrutar de beneficios exclusivos y las mejores ofertas.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario de Registro */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 sm:p-1">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 my-8">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Crear Cuenta</h2>
            <p className="text-slate-500 mt-2 text-sm">Completa tus datos para registrarte</p>
          </div>
          
          {apiError && (
            <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 text-center">
              {apiError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Campo Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1 ml-1">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className={`text-lg ${errors.name ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                    errors.name ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-pink-100 focus:border-pink-300'
                  }`}
                  placeholder="Juan Perez"
                />
              </div>
              {errors.name && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.name}</p>}
            </div>

            {/* Campo Correo */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1 ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className={`text-lg ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                    errors.email ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-pink-100 focus:border-pink-300'
                  }`}
                  placeholder="tu@correo.com"
                />
              </div>
              {errors.email && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            {/* Campo Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-1 ml-1">
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiPhone className={`text-lg ${errors.phone ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                    errors.phone ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-pink-100 focus:border-pink-300'
                  }`}
                  placeholder="300 000 0000"
                />
              </div>
              {errors.phone && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.phone}</p>}
            </div>

            {/* Campo Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-600 mb-1 ml-1">
                Dirección
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMapPin className={`text-lg ${errors.address ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                    errors.address ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-pink-100 focus:border-pink-300'
                  }`}
                  placeholder="Calle Principal 123"
                />
              </div>
              {errors.address && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.address}</p>}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className={`text-lg ${errors.password ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                    errors.password ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-pink-100 focus:border-pink-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-pink-400 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            {/* Boton Submit */}
            <button
              type="submit"
              className="w-full mt-6 py-3.5 px-4 text-white font-medium bg-pink-400 rounded-2xl hover:bg-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transform active:scale-[0.98] transition-all duration-300 shadow-sm"
            >
              Registrarse
            </button>
          </form>

          {/* Enlace de Login */}
          <div className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold text-pink-400 hover:text-pink-600 transition-colors">
              Inicia sesión aquí
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;