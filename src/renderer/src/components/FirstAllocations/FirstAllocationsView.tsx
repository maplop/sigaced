import { phases } from "@renderer/utils/rqKeys"
import { PhaseType } from "@renderer/utils/types"
import AllocationsSectionWrapper from "../common/AllocationsSectionWrapper"
import SpotView from "../common/Spot/SpotView"
import ApplicantsView from "../common/Applicants/ApplicantView"
import AllocationsView from "../common/Allocations/AllocationsView"


const FirstAllocationsView = () => {
  return (
    <AllocationsSectionWrapper
      title="Primer Otorgamiento"
      subtitle="Gestión de plazas y otorgamientos de la primera fase."
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
          children: <AllocationsView phase={phases.FIRST as PhaseType} />,
        },
      ]}
    />
  )
}
export default FirstAllocationsView
