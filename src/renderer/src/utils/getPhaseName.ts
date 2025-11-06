export const getPhaseName = (phaseId: number) => {
  switch (phaseId) {
    case 1:
      return "Primer Otorgamiento"
    case 2:
      return "Segundo Otorgamiento"
    case 3:
      return "Otorgamiento Manual"
    default:
      return phaseId
  }
}
