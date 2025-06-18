import { useState } from "react"
import AnimatedCurrency from "./AnimatedCurrency" // se você colocou em outro lugar, ajuste
import { Wallet } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";

export function RevenueStatCard({
  byService,
  estimatedRevenue,
}: {
  byService: { name: string; price: number; count: number }[]
  estimatedRevenue: number
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      onClick={() => setExpanded((prev) => !prev)}
      className="cursor-pointer flex flex-col p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 shadow-sm transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="bg-white dark:bg-zinc-800 p-2 rounded-full shadow">
          <Wallet className="w-6 h-6 text-rose-500" />
        </div>
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Receita Estimada</p>
          <p className="text-xl font-bold text-zinc-800 dark:text-white">
            <AnimatedCurrency value={estimatedRevenue} />
          </p>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
          {byService.length === 0 && <p>Nenhum agendamento no mês</p>}
          {byService.map((service) => (
            <div key={service.name} className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
              <span>{service.name} ({service.count})</span>
              <span>{formatCurrency((service.price * service.count) / 100)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
