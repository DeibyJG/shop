import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import {
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiGrid,
  FiUser,
  FiLogOut,
  FiBox,
  FiShield,
} from "react-icons/fi";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  isMobileOpen,
  toggleMobileSidebar,
}) => {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;

  const adminLinks = [
    {
      to: "/admin",
      icon: <FiGrid className="text-xl" />,
      label: "Dashboard",
      end: true,
    },
    {
      to: "/admin/products",
      icon: <FiBox className="text-xl" />,
      label: "Productos",
    },
    {
      to: "/admin/clients",
      icon: <FiUsers className="text-xl" />,
      label: "Clientes",
    },
    {
      to: "/admin/orders",
      icon: <FiPackage className="text-xl" />,
      label: "Pedidos",
    },
    {
      to: "/admin/admins",
      icon: <FiShield className="text-xl" />,
      label: "Administradores",
    },
  ];

  const clientLinks = [
    {
      to: "/shop",
      icon: <FiShoppingBag className="text-xl" />,
      label: "Tienda",
    },
    {
      to: "/orders",
      icon: <FiPackage className="text-xl" />,
      label: "Mis Pedidos",
    },
  ];

  const links = role === "admin" ? adminLinks : clientLinks;

  return (
    <aside
      className={`
        bg-white border-r border-slate-200 shadow-sm flex flex-col transition-transform duration-300 ease-in-out
        fixed inset-y-0 left-0 z-50 h-full w-64
        md:relative md:translate-x-0 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        ${isOpen ? "md:w-64" : "md:w-20"}
      `}
    >
      {/* Logo interactivo (DESKTOP) */}
      <div
        onClick={toggleSidebar}
        className="hidden md:flex h-16 items-center justify-center border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
        title="Ocultar/Mostrar menú"
      >
        <div
          className={`flex items-center gap-2 ${!isOpen && "justify-center"}`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm transform -rotate-6 transition-transform hover:scale-105">
            S
          </div>
          {isOpen && (
            <span className="font-extrabold text-xl tracking-tight text-slate-800">
              Shop
            </span>
          )}
        </div>
      </div>

      {/* Logo estático (MÓVIL) */}
      <div className="flex md:hidden h-16 items-center justify-center border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm transform -rotate-6">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800">
            Shop
          </span>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            end={link.end}
            onClick={() => {
              if (window.innerWidth < 768) toggleMobileSidebar();
            }}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              } ${!isOpen && "md:justify-center"}`
            }
          >
            {link.icon}
            <span
              className={`whitespace-nowrap md:${isOpen ? "block" : "hidden"}`}
            >
              {link.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Sección de Perfil y Logout */}
      <div className="p-4 border-t border-slate-100">
        <div
          className={`flex items-center ${isOpen ? "gap-3 mb-4 md:justify-start" : "md:justify-center mb-4"}`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-pink-200 flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
            <FiUser className="text-lg" />
          </div>
          <div className={`overflow-hidden md:${isOpen ? "block" : "hidden"}`}>
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.name || "Usuario"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {role === "admin" ? "Administrador" : "Cliente"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className={`w-full flex items-center py-2.5 text-sm font-semibold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-xl transition-all duration-300 ${isOpen ? "justify-start gap-3 px-3" : "md:justify-center"}`}
        >
          <FiLogOut className="text-xl flex-shrink-0" />
          <span className={`md:${isOpen ? "block" : "hidden"}`}>Salir</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
