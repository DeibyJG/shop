import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Si no hay usuario autenticado, lo enviamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, pero su rol no está permitido en esta ruta, lo redirigimos a su zona segura
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/shop" replace />;
  }

  // Si pasa todas las validaciones, renderizamos la ruta solicitada
  return <Outlet />;
};

export default ProtectedRoute;