"use client"

import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts"
import {
  CalendarCheck, BriefcaseMedical, CalendarDays, Wallet,
} from "lucide-react"
import { RevenueStatCard } from "./RevenueStatCard"
import { exportToExcel }  from "@/utils/export/exportToExcel"
import { ResultPermissionProp } from "@/utils/permissions/canPermission"
import { redirect } from "next/navigation"

type ByService = {
  name: string
  count: number
  price: number
}

type ByDate = {
  date: string
  count: number
}

interface TrialBannerProps {
  userId: string
  permissions: ResultPermissionProp
}

export default function ClinicStats({ userId, permissions }: TrialBannerProps) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  if(permissions.planId === "TRIAL" ){
    redirect('/')
  }
  

  useEffect(() => {
  fetch(`/api/clinic/reports/${userId}?month=${selectedMonth}`)
    .then((res) => res.json())
    .then((data) => setStats(data))
}, [userId, selectedMonth])

  const [stats, setStats] = useState<{
  totalAppointments: number
  byService: ByService[]
  byDate: ByDate[]
} | null>(null);

  if (!stats) return <p className="text-center text-gray-500">Carregando estatísticas...</p>

  // Simulação de receita estimada (pode ser substituído por cálculo real)
  const estimatedRevenue = stats.byService.reduce((total, service) => {
  return total + service.count * service.price
}, 0)

  function handleExportExcel() {
  if (stats) {
    exportToExcel({
      byService: stats.byService,
      byDate: stats.byDate,
    })
  }
}

  return (
    <>
    

    <div className="p-6 bg-white dark:bg-[rgb(24,24,27)] rounded-2xl shadow-lg space-y-8" >
      <div className="flex justify-between items-center gap-4 mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Relatorios</h1>
        <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Mês:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:[rgb(24,24,27)] text-zinc-800 dark:text-white"
        />
        </div>
      </div>
      {/* Botões de exportação */}
      <div className="flex gap-2 justify-end mb-4">
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Exportar Excel
        </button>
      </div>

      {/* Cards resumo */}
      <div id="report-section" className="bg-white text-black dark:bg-white dark:text-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Agendamentos"
          value={stats.totalAppointments.toString()}
          icon={<CalendarCheck className="w-6 h-6 text-emerald-600" />}
          color="emerald"
        />
        <StatCard
          title="Serviços Ativos"
          value={stats.byService.length.toString()}
          icon={<BriefcaseMedical className="w-6 h-6 text-indigo-600" />}
          color="indigo"
        />
        <StatCard
          title="Dias com Agendamentos"
          value={stats.byDate.length.toString()}
          icon={<CalendarDays className="w-6 h-6 text-orange-500" />}
          color="orange"
        />
        <RevenueStatCard
  byService={stats.byService}
  estimatedRevenue={estimatedRevenue}
/>
      </div>

      {stats.byDate.length === 0 && stats.byService.length === 0 ? (
        <div className="text-center text-zinc-500 py-12">
          <p className="text-lg">Nenhum agendamento encontrado para este mês.</p>
        </div>
      ) : (
        <>
          {/* Gráfico por serviço */}
          <div >
            <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-200 mb-2">
              Agendamentos por Serviço
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#888" }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4ade80" name="Agendamentos" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico por dia */}
          <div>
            <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-200 mb-2">
              Agendamentos do mês
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "#888" }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" name="Agendamentos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      </div>
    </div>
    </>
  )
}

function StatCard({
  title,
  value,
  icon,
  color = "emerald",
}: {
  title: string
  value: React.ReactNode
  icon: React.ReactNode
  color?: string
}) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 shadow-sm`}>
      <div className="bg-white dark:bg-[rgb(24,24,27)] p-2 rounded-full shadow">
        {icon}
      </div>
      <div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{title}</p>
        <p className="text-xl font-bold text-zinc-800 dark:text-white">{value}</p>
      </div>
    </div>
  )
}
