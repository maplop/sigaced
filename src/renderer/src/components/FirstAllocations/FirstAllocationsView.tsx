import { phases } from "@renderer/utils/rqKeys"
import AllocationsSectionWrapper from "../common/AllocationsSectionWrapper"
import SpotView from "../common/Spot/SpotView"
import { PhaseType } from "@renderer/utils/types"
import ApplicantsView from "../common/Applicants/ApplicantView"

const FirstAllocationsView = () => {
  return (
    <AllocationsSectionWrapper
      title="Primer Otorgamiento"
      subtitle="Gestión de plazas y asignaciones de la primera fase."
      tabs={[
        {
          label: "Plazas",
          value: "spot",
          children: <SpotView phase={phases.FIRST as PhaseType} />
        },
        {
          label: "Aspirantes",
          value: "applicants",
          children: <ApplicantsView phase={phases.FIRST as PhaseType} />,
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
export default FirstAllocationsView
