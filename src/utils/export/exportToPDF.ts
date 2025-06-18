// exportToPDF.ts
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// 👇 Adiciona manualmente o tipo ao protótipo de jsPDF
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export function exportToPDFManually(stats: {
  byService: { name: string; price: number; count: number }[]
  byDate: { date: string; count: number }[]
}) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text("Relatório da Clínica", 14, 20)

  doc.setFontSize(12)
  doc.text("Agendamentos por Serviço:", 14, 30)

  doc.autoTable({
    startY: 35,
    head: [["Serviço", "Valor", "Agendamentos"]],
    body: stats.byService.map(service => [
      service.name,
      `R$ ${service.price.toFixed(2)}`,
      service.count.toString()
    ])
  })

  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.text("Agendamentos por Dia:", 14, finalY)

  doc.autoTable({
    startY: finalY + 5,
    head: [["Data", "Agendamentos"]],
    body: stats.byDate.map(item => [
      item.date,
      item.count.toString()
    ])
  })

  doc.save(`relatorio-clinica-${new Date().toISOString().slice(0, 10)}.pdf`)
}
