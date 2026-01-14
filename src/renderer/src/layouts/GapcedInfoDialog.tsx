import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@renderer/components/ui/dialog";
import { Button } from "@renderer/components/ui/button";
import { Card, CardContent } from "@renderer/components/ui/card";
import { Separator } from "@renderer/components/ui/separator";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Info } from "lucide-react";

type GAPCEDInfoDialogProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

export default function GAPCEDInfoDialog({ open, onOpenChange }: GAPCEDInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="bg-[#F1F5F9] rounded-sm p-1.5 cursor-pointer">
          <Info size={16} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl w-[95%] max-h-[90vh] p-4">
        <DialogHeader>
          <DialogTitle>Infomación de la aplicación — GAPCED</DialogTitle>
          <DialogDescription>
            Información general del sistema, fases de otorgamiento, datos gestionados y roles.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-3" />

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold">Qué es GAPCED</h3>
                <p className="mt-2 text-sm leading-6">
                  GAPCED (Gestión de Otorgamiento de Plazas del Curso por Encuentro y a Distancia) es un sistema desarrollado para
                  la Universidad Central “Marta Abreu” de Las Villas que automatiza el proceso de asignación de plazas para las
                  modalidades Curso por Encuentro y Curso a Distancia.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold">Datos que gestiona</h3>
                <ul className="mt-2 ml-5 list-disc text-sm leading-6">
                  <li>
                    <strong>Carreras:</strong> nombre, abreviatura, facultad.
                  </li>
                  <li>
                    <strong>Ubicaciones:</strong> nombre del centro o sede.
                  </li>
                  <li>
                    <strong>Plazas:</strong> combinación Carrera + Ubicación y número de cupos.
                  </li>
                  <li>
                    <strong>Aspirantes:</strong> CI, nombre, apellidos, nota, municipio, género y hasta 3 opciones de plaza (mínimo 1,
                    máximo 3), sin repeticiones entre opciones.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold">Fases del otorgamiento</h3>

                <div className="mt-3 space-y-3 text-sm leading-6">
                  <div>
                    <strong>Primera fase — Otorgamiento automático inicial:</strong>
                    <p className="mt-1">Todos los aspirantes con al menos una solicitud se ordenan por nota (descendente) y se asignan plazas según disponibilidad y preferencia.</p>
                  </div>

                  <div>
                    <strong>Segunda fase — Otorgamiento automático complementario:</strong>
                    <p className="mt-1">Se ofertan las plazas restantes. Los aspirantes vuelven a presentar opciones entre las plazas disponibles; la institución puede añadir o editar plazas.</p>
                  </div>

                  <div>
                    <strong>Tercera fase — Otorgamiento manual:</strong>
                    <p className="mt-1">Asignación manual a aspirantes ordenados por nota; el operador selecciona la plaza disponible adecuada. Finaliza el proceso.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold">Visualización y exportes</h3>
                <p className="mt-2 text-sm leading-6">
                  Todos los registros (Carreras, Ubicaciones, Plazas, Aspirantes, Otorgamientos) son visibles en tablas con búsqueda y
                  filtros. Los listados y consultas relevantes pueden exportarse a PDF por fase o de forma consolidada.
                </p>

                <div className="mt-3">
                  <strong>Reportes sugeridos:</strong>
                  <ul className="mt-2 ml-5 list-disc text-sm leading-6">
                    <li>Listado consolidado de plazas por carrera.</li>
                    <li>Demanda por carrera (solicitudes totales).</li>
                    <li>Relación aspirantes–plazas por ubicación.</li>
                    <li>Aspirantes no asignados por fase.</li>
                    <li>Plazas restantes por carrera/ubicación.</li>
                    <li>Histórico de asignaciones por aspirante.</li>
                    <li>Ranking general de aspirantes.</li>
                    <li>Plazas creadas/modificadas por fase.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold">Dashboard y métricas</h3>
                <p className="mt-2 text-sm leading-6">
                  Panel con indicadores por fase: fase actual, top 5 aspirantes, top 10 carreras más demandadas (todas las opciones 1–3
                  consideradas), total aspirantes, promedio de notas, plazas disponibles, plazas asignadas y plazas restantes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold">Roles de usuario</h3>
                <ul className="mt-2 ml-5 list-disc text-sm leading-6">
                  <li>
                    <strong>Administrador:</strong> control total (CRUD completo, ejecución de otorgamientos, eliminaciones masivas).
                  </li>
                  <li>
                    <strong>Supervisor / Viewer:</strong> acceso limitado (sin ejecución de otorgamientos y sin eliminaciones masivas).
                  </li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </ScrollArea>

        <DialogFooter className="mt-3 flex items-center justify-end gap-2">
          <Button onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
