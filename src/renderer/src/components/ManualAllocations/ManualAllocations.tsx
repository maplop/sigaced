import { phases } from "@renderer/utils/rqKeys"
import { PhaseType } from "@renderer/utils/types"
import ApplicantsView from "../common/Applicants/ApplicantView"
import SpotView from "../common/Spot/SpotView"
import ManualAllocationView from "./ManualAllocationView"
import AllocationsSectionWrapper from "../common/AllocationsSectionWrapper"

const ManualAllocationsView = () => {
  return (
    <AllocationsSectionWrapper
      title="Otorgamiento Manual"
      subtitle="Gestión de plazas y otorgamientos de la tercera fase."
      tabs={[
        {
          label: "Plazas",
          value: "spot",
          children: <SpotView phase={phases.MANUAL as PhaseType} />
        },
        {
          label: "Aspirantes",
          value: "applicants",
          children: <ApplicantsView phase={phases.MANUAL as PhaseType} />,
        },
        {
          label: "Otorgamiento",
          value: "allocation",
          children: <ManualAllocationView phase={phases.MANUAL as PhaseType} />,
        },
      ]}
    />
  )
}
export default ManualAllocationsView