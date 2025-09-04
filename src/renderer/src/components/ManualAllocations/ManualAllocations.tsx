import AllocationsSectionWrapper from "../common/AllocationsSectionWrapper"

const ManualAllocationsView = () => {
  return (
    <AllocationsSectionWrapper
      title="Otorgamiento Manual"
      subtitle="Gestión de plazas y asignaciones del otorgamiento manual."
      tabs={[
        {
          label: "Plazas",
          value: "spot",
          children: <div>Gestión de plazas aquí</div>,
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
export default ManualAllocationsView