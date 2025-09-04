import { phases } from "@renderer/utils/rqKeys"
import AllocationsSectionWrapper from "../common/AllocationsSectionWrapper"
import SpotView from "../common/Spot/SpotView"
import { PhaseType } from "@renderer/utils/types"

const SecondAllocationsView = () => {
  return (
    <AllocationsSectionWrapper
      title="Segundo Otorgamiento"
      subtitle="Gestión de plazas y asignaciones de la segunda fase."
      tabs={[
        {
          label: "Plazas",
          value: "spot",
          children: <SpotView phase={phases.SECOND as PhaseType} />
        },
        {
          label: "Aspirantes",
          value: "applicants",
          children: <div>Lista de aspirantes aquí</div>,
        },
        {
          label: "Otorgamiento",
          value: "allocation",
          children: <div>Proceso de otorgamiento aquí</div>,
        },
      ]}
    />
  )
}
export default SecondAllocationsView