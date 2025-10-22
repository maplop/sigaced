import { phases } from "@renderer/utils/rqKeys"
import { PhaseType } from "@renderer/utils/types"
import AllocationsSectionWrapper from "../common/AllocationsSectionWrapper"
import ApplicantsView from "../common/Applicants/ApplicantView"
import SpotView from "../common/Spot/SpotView"
import AllocationsView from "../common/Allocations/AllocationsView"

const SecondAllocationsView = () => {
  return (
    <AllocationsSectionWrapper
      title="Segundo Otorgamiento"
      subtitle="Gestión de plazas y otorgamientos de la segunda fase."
      tabs={[
        {
          label: "Plazas",
          value: "spot",
          children: <SpotView phase={phases.SECOND as PhaseType} />
        },
        {
          label: "Aspirantes",
          value: "applicants",
          children: <ApplicantsView phase={phases.SECOND as PhaseType} />,
        },
        {
          label: "Otorgamiento",
          value: "allocation",
          children: <AllocationsView phase={phases.SECOND as PhaseType} />,
        },
      ]}
    />
  )
}
export default SecondAllocationsView