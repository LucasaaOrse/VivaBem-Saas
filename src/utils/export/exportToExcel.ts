import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export function exportToExcel(data: {
  byService: { name: string; price: number; count: number }[]
  byDate: { date: string; count: number }[]
}) {
  const serviceSheet = data.byService.map((s) => ({
    Serviço: s.name,
    "Preço Unitário (R$)": (s.price / 100).toFixed(2),
    Quantidade: s.count,
    "Receita Total (R$)": ((s.price * s.count) / 100).toFixed(2),
  }))

  const dateSheet = data.byDate.map((d) => ({
    Data: d.date,
    "Total de Agendamentos": d.count,
  }))

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(serviceSheet), "Por Serviço")
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dateSheet), "Por Dia")

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  })

  const file = new Blob([excelBuffer], { type: "application/octet-stream" })
  saveAs(file, `relatorio-clinica-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
