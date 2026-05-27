import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/Dashboard'
import WorkOrders from '../pages/WorkOrders'
import WorkOrderForm from '../pages/WorkOrderForm'
import WorkOrderDetail from '../pages/WorkOrderDetail'
import EquipmentList from '../pages/EquipmentList'
import EquipmentDetail from '../pages/EquipmentDetail'
import Technicians from '../pages/Technicians'
import Calendar from '../pages/Calendar'
import Reports from '../pages/Reports'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ordenes" element={<WorkOrders />} />
          <Route path="/ordenes/nueva" element={<WorkOrderForm />} />
          <Route path="/ordenes/:id" element={<WorkOrderDetail />} />
          <Route path="/equipos" element={<EquipmentList />} />
          <Route path="/equipos/:id" element={<EquipmentDetail />} />
          <Route path="/tecnicos" element={<Technicians />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/reportes" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
