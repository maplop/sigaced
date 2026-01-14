import { Card, CardContent } from "@renderer/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@renderer/components/ui/dialog"
import { Eye, FileText, User } from "lucide-react"
import { useState } from "react"
import { SpotFull, Applicant } from "src/shared/types"

interface ApplicantsRequestsModalProps {
  applicant: Applicant,
  spots: SpotFull[],
  loadingSpots: boolean
}

export function ApplicantsRequestsModal({ applicant, spots, loadingSpots }: ApplicantsRequestsModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="border border-gray-400 p-1 rounded-md cursor-pointer">
          <Eye className="opacity-70 w-3.5 h-auto" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Solicitudes de {applicant.name} {applicant.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {applicant.requests?.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Este aspirante no tiene solicitudes registradas.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {applicant.requests?.map((request, index) => {
                const spot = spots.find(s => s.spotId === request.spotId)

                return (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <span className="flex justify-center items-center w-5 h-5 bg-primary rounded-sm text-white text-xs font-normal">
                      {request.preferenceOrder}
                    </span>
                    <span className="text-sm">
                      {loadingSpots
                        ? "Cargando..."
                        : spot
                          ? `${spot.careerName} en ${spot.locationName}`
                          : "Nombre no disponible"}
                    </span>
                  </div>
                )
              })}

            </div>
          )}

          {(() => {
            const requestsCount = applicant.requests?.length ?? 0;
            if (requestsCount > 0) {
              return (
                <p className="text-xs text-muted-foreground text-center">
                  {requestsCount} de 3 solicitudes máximas
                </p>
              );
            }
            return null;
          })()}
        </div>
      </DialogContent>
    </Dialog>
  )
}