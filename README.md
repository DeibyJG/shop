# 🛒 E-Commerce Shop App

## 📝 Descripción del proyecto
Este proyecto es una aplicación web de comercio electrónico (E-commerce) desarrollada en **React** utilizando **Vite** y **Tailwind CSS**. La aplicación ofrece una experiencia completa con rutas protegidas, permitiendo a los usuarios navegar por los productos, gestionar un carrito de compras y realizar pedidos. Además, cuenta con un panel de administración (dashboard) para gestionar productos, clientes, órdenes y administradores.

## 🚀 Instrucciones de instalación y ejecución

Para correr este proyecto en tu entorno local, asegúrate de tener [Node.js](https://nodejs.org/) instalado y sigue estos pasos:

1. **Clona el repositorio** (si aún no lo has hecho) y navega a la carpeta del proyecto:
   ```bash
   git clone https://github.com/DeibyJG/shop.git
   cd shop
   ```

2. **Instala las dependencias** necesarias utilizando npm:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
4. **Abre tu navegador** e ingresa a la URL local que indica la terminal (usualmente `http://localhost:5173`).

## 🔐 Credenciales de prueba

Para acceder y probar los distintos roles dentro de la aplicación, puedes utilizar las siguientes credenciales:

### Rol de Administrador
Permite el acceso al panel de control (Dashboard) para gestionar inventario, usuarios y ventas.
- **Correo:** `deiby@gmail.com`
- **Contraseña:** `Shop1234`

### Rol de Cliente
Permite el acceso a la tienda, agregar productos al carrito y generar nuevas órdenes.
- **Correo:** `jeison@gmail.com`
- **Contraseña:** `Shop1234`

*(Nota: Estas son credenciales sugeridas para el entorno de pruebas, asegúrate de ajustarlas en caso de que en la base de datos tengas configurados otros usuarios de prueba).*

## 🔗 Enlace a la API utilizada

Todo el backend y la persistencia de datos (productos, usuarios, órdenes, etc.) son provistos por la siguiente API alojada en Render:

👉 **URL de la API:** [https://api-shop-k0ei.onrender.com]
