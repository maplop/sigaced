import { getPhases } from "./queries/phase"
import { getInferredCurrentPhase } from "./queries/statistics"

export async function phaseGetAll() {
  try {
    return await getPhases()
  } catch {
    return []
  }
}

export function statsGetInferredCurrentPhase(): 1 | 2 | 3 {
  try {
    return getInferredCurrentPhase()
  } catch {
    return 1
  }
}
