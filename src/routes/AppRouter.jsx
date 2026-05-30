import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import WorkOrders from '../pages/WorkOrders'
import WorkOrderForm from '../pages/WorkOrderForm'
import WorkOrderDetail from '../pages/WorkOrderDetail'
import Purchases from '../pages/Purchases'
import PurchaseForm from '../pages/PurchaseForm'
import PurchaseDetail from '../pages/PurchaseDetail'
import EquipmentList from '../pages/EquipmentList'
import EquipmentDetail from '../pages/EquipmentDetail'
import Technicians from '../pages/Technicians'
import Calendar from '../pages/Calendar'
import Reports from '../pages/Reports'
import Profile from '../pages/Profile'
import ResetPassword from '../pages/ResetPassword'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/ordenes" element={<WorkOrders />} />
          <Route path="/ordenes/nueva" element={<WorkOrderForm />} />
          <Route path="/ordenes/:id" element={<WorkOrderDetail />} />
          <Route path="/compras" element={<Purchases />} />
          <Route path="/compras/nueva" element={<PurchaseForm />} />
          <Route path="/compras/:id" element={<PurchaseDetail />} />
          <Route path="/equipos" element={<EquipmentList />} />
          <Route path="/equipos/:id" element={<EquipmentDetail />} />
          <Route path="/tecnicos" element={<Technicians />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/reportes" element={<Reports />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
