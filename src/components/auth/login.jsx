import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Asignacion de valores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Validacion de campos
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        newErrors.email = 'El correo es requerido';
      } else if (!emailRegex.test(value)) {
        newErrors.email = 'Formato de correo invalido';
      }
    }

    if (name === 'password') {
      if (!value) {
        newErrors.password = 'La contraseña es requerida';
      }
    }

    setErrors(newErrors);
  };

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Procesamiento del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!formData.email || !formData.password || errors.email || errors.password) {
      setApiError('Por favor complete todos los campos correctamente');
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Lado Izquierdo: Formulario */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Bienvenido de nuevo</h2>
            <p className="text-slate-500 mt-2 text-sm">Ingresa a tu cuenta para continuar explorando</p>
          </div>
          
          {apiError && (
            <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 text-center">
              {apiError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
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
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                      : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-300'
                  }`}
                  placeholder="tu@correo.com"
                />
              </div>
              {errors.email && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.email}</p>}
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
                  className={`block w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                      : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            {/* Boton Submit */}
            <button
              type="submit"
              className="w-full mt-4 py-3.5 px-4 text-white font-medium bg-indigo-400 rounded-2xl hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transform active:scale-[0.98] transition-all duration-300 shadow-sm"
            >
              Ingresar
            </button>
          </form>

          {/* Enlace de Registro */}
          <div className="mt-8 text-center text-sm text-slate-500">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-600 transition-colors">
              Crea una cuenta aquí
            </Link>
          </div>

        </div>
      </div>

      {/* Lado Derecho: Branding (Oculto en moviles) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 relative overflow-hidden items-center justify-center rounded-l-[3rem] shadow-inner">
        
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 filter blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2 scale-150"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 opacity-30 filter blur-3xl rounded-full transform translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 p-12 text-center text-slate-700 max-w-lg">
          <div className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-sm border border-white/60 transform rotate-12">
            <span className="text-4xl font-black text-indigo-400 transform -rotate-12">Shop</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-800">
            La mejor experiencia de compra
          </h1>
          <p className="text-lg font-medium text-slate-600 leading-relaxed">
            Descubre productos increíbles con una interfaz diseñada pensando en ti. Todo lo que necesitas, a un clic de distancia.
          </p>
        </div>

      </div>

    </div>
  );
};

export default Login;