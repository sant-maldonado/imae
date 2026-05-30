import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCompra, useDeleteCompra } from '../hooks/useMockData'
import { estadosCompra } from '../lib/constants'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const statusColors = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  en_curso: 'bg-blue-50 text-blue-700 border-blue-200',
  recibido: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function PurchaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: compra, isLoading } = useCompra(id)
  const deleteCompra = useDeleteCompra()

  if (isLoading) return <div className="text-slate-500">Cargando compra...</div>
  if (!compra) return <div className="text-slate-500">Compra no encontrada</div>

  const handleDelete = async () => {
    if (confirm('¿Eliminar esta orden de compra?')) {
      await deleteCompra.mutateAsync(id)
      navigate('/compras')
    }
  }

  const generarPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('Orden de Compra', 14, 22)

    doc.setFontSize(10)
    doc.text(`N° ${compra.id}`, 14, 30)
    doc.text(`Fecha de solicitud: ${compra.fechaSolicitud}`, 14, 36)

    doc.setFontSize(12)
    doc.text('Proveedor:', 14, 48)
    doc.setFontSize(10)
    doc.text(compra.proveedor, 14, 54)

    doc.setFontSize(12)
    doc.text('Artículo:', 14, 66)
    doc.setFontSize(10)
    doc.text(compra.articulo, 14, 72)

    autoTable(doc, {
      startY: 84,
      head: [['Cantidad', 'Unidad']],
      body: [[compra.cantidad, compra.unidad]],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    })

    const estado = estadosCompra[compra.estado]
    doc.text(`Estado: ${estado}`, 14, doc.lastAutoTable.finalY + 10)

    if (compra.fechaEntrega) {
      doc.text(`Fecha estimada de entrega: ${compra.fechaEntrega}`, 14, doc.lastAutoTable.finalY + 18)
    }

    doc.save(`orden_compra_${compra.id}.pdf`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/compras" className="hover:text-blue-600">Compras</Link>
        <span>/</span>
        <span className="text-slate-800">#{compra.id}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-semibold text-slate-800">{compra.articulo}</h3>
            <p className="text-sm text-slate-500 mt-1">Solicitada el {compra.fechaSolicitud}</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={generarPDF}
              className="bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              PDF
            </button>
            <button
              onClick={handleDelete}
              className="border border-red-300 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Estado</p>
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[compra.estado]}`}>
              {estadosCompra[compra.estado]}
            </span>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Proveedor</p>
            <p className="font-medium text-slate-700">{compra.proveedor}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Cantidad</p>
            <p className="font-medium text-slate-700">{compra.cantidad} {compra.unidad}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Fecha de entrega</p>
            <p className="font-medium text-slate-700">{compra.fechaEntrega || 'Pendiente'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
