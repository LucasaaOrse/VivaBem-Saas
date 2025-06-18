"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Plus, X } from "lucide-react"
import { DialogService } from "./diaolog-services"
import { Service } from "@/generated/prisma"
import { formatCurrency} from "@/utils/format-currency"
import { deleteService } from "../_actions/delete-service"
import { toast } from "sonner"
import { ResultPermissionProp } from "@/utils/permissions/canPermission"
import { useRouter } from "next/navigation"
import { SubscriptionExpiredCard } from "../../_components/subscription-expired-card"
import { TrialBanner } from "../../_components/TrialBanner"

interface ServicesListProps {
  services: Service[],
  permissions: ResultPermissionProp
}

export function ServicesList({ services, permissions }: ServicesListProps) {
  
  const [isDailogOpen, setIsDailogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const canAddService = !permissions.expired && services.length < permissions.plan?.maxServices!;

  const router = useRouter()


  async function  handleDeleteService(serviceId: string) {
    const response = await deleteService({serviceId: serviceId})

    if(response?.error){
      toast.error(response.error)
      return
    }

    toast.success("Serviço deletado com sucesso")
    setSelectedService(null)
  }

  function handleEditService(service: Service) {
    setEditingService(service)
    setIsDailogOpen(true)
  }

  if (permissions.planId === "TRIAL" && permissions.expired) {
  return <SubscriptionExpiredCard />
}

  return (
    <>

    {permissions.planId === "TRIAL" && !permissions.expired && (
        <TrialBanner permissions={permissions} />
      )}
    

    <Dialog 
      open={isDailogOpen} 
      onOpenChange={(open) => {
        setIsDailogOpen(open)
        if(!open) setEditingService(null)
      
      }}
      
    >
      <div className="mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl md:text-2xl font-bold">Serviços</CardTitle>
            {canAddService ? (
              <DialogTrigger asChild>
                <Button> 
                  <Plus className="w-4 h-4"/> 
                </Button>  
              </DialogTrigger>
            ) : (
              <Button disabled variant="outline" title="Limite de serviços atingido">
                Limite atingido
              </Button>
            )}

            <DialogContent onInteractOutside={(e) => {e.preventDefault(); setIsDailogOpen(false); setEditingService(null)}}>
              <DialogService 
                closeModal={() => {setIsDailogOpen(false); setEditingService(null)}}
                serviceId={editingService ? editingService.id : undefined}
                initialValues={editingService ? {
                  name: editingService.name,
                  price: (editingService.price / 100).toFixed(2).replace('.', ','),
                  hours: Math.floor(editingService.duration / 60).toString(),
                  minutes: (editingService.duration % 60).toString()
                }: undefined}
              />
            </DialogContent>

            

          </CardHeader>
          <CardContent>
              <section className="space-y-4 mt-5">
                {services.map(service => (
                  <article key={service.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-gray-500">-</span>
                      <span className="font-medium text-gray-500">{formatCurrency((service.price / 100))}</span>
                    </div>
                    <div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditService(service)}
                        
                        >
                        <Pencil className="w-4 h-4"/>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedService(service)}
                        
                        >
                        <X className="w-4 h-4"/>
                      </Button>

                    </div>

                  </article>
                ))}
              </section>
            </CardContent>
        </Card>
      </div>
      </Dialog>
      {/* <DialogDelete> */}
      <Dialog open={!!selectedService} onOpenChange={(open) => {
        if(!open) setSelectedService(null)
        
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar deleção</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o serviço {" "}
              <strong>{selectedService?.name}</strong>?
              Essa opção não pode ser desfeita
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedService(null)} >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteService(selectedService?.id || "")}
            >
              Deletar
            </Button>
          </div>
        </DialogContent>

      </Dialog>
    
    </>
  )
}