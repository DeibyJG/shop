import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import Sidebar from './sidebar';

const Layout = () => {
  // Estado para desktop (contraer/expandir)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Estado para móvil (oculto/visible)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Overlay oscuro para móvil: Cierra el menú al hacer clic fuera */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Barra Lateral */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        isMobileOpen={isMobileOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Pasamos la función al Navbar para que el botón de móvil funcione */}
        <Navbar toggleMobileSidebar={toggleMobileSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;