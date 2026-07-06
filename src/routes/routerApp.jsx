import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../components/auth/login";
import Register from "../components/auth/register";
import ProtectedRoute from "../components/common/protectedRoute";
import Layout from "../components/common/layout";
import ShopPage from "../pages/shopPage";
import AdminPage from "../pages/adminPage";
import CartPage from "../pages/cartPage"; 
import OrdersPage from "../pages/ordersPage";
import AdminProductsPage from '../pages/adminProductsPage';
import AdminOrdersPage from '../pages/adminOrdersPage';
import AdminClientsPage from '../pages/adminClientsPage';
import AdminAdminsPage from '../pages/adminAdminsPage';

export const RouterApp = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        {/* Rutas exclusivas de Cliente */}
        <Route element={<ProtectedRoute allowedRoles={["cliente"]} />}>
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />{" "}
          <Route path="/orders" element={<OrdersPage />} />
          
        </Route>

        {/* Rutas exclusivas de Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path='/admin/products' element={<AdminProductsPage />} />
          <Route path='/admin/orders' element={<AdminOrdersPage />} />
          <Route path='/admin/clients' element={<AdminClientsPage />} />
          <Route path='/admin/admins' element={<AdminAdminsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
