import { beforeEach, describe, expect, it, vi } from "vitest"
import { createAllocation } from "@renderer/api/allocation"
import { addApplicantToPhase } from "@renderer/api/applicant"
import { createSpot } from "@renderer/api/spot"
import type { Applicant, SpotFull } from "src/shared/types"
import { copySpots, handleAllocate } from "@renderer/utils/allocations"

vi.mock("@renderer/api/allocation", () => ({
  createAllocation: vi.fn().mockResolvedValue(undefined)
}))
vi.mock("@renderer/api/applicant", () => ({
  addApplicantToPhase: vi.fn().mockResolvedValue(undefined)
}))
vi.mock("@renderer/api/spot", () => ({
  createSpot: vi.fn().mockResolvedValue(undefined)
}))

const spot = (overrides: Partial<SpotFull> = {}): SpotFull => ({
  spotId: 1,
  careerId: 10,
  careerName: "Carrera",
  locationId: 20,
  locationName: "Sede",
  phaseId: 1,
  phaseName: "Fase 1",
  availableQuantity: 1,
  ...overrides
})

const applicant = (overrides: Partial<Applicant> & { requests?: { spotId: number; preferenceOrder: 1 | 2 | 3 }[] } = {}): Applicant =>
  ({
    id: 1,
    ci: "123",
    name: "A",
    lastName: "B",
    grade: 5,
    gender: "M",
    municipality: "X",
    phaseId: 1,
    requests: [],
    ...overrides
  }) as Applicant

describe("copySpots", () => {
  it("no muta el array original", () => {
    const spots = [spot({ spotId: 1, availableQuantity: 2 })]
    copySpots(spots)
    expect(spots[0].availableQuantity).toBe(2)
  })

  it("la copia tiene la misma estructura que los originales", () => {
    const spots = [spot({ spotId: 3, availableQuantity: 5 })]
    const copied = copySpots(spots)
    expect(copied).toHaveLength(1)
    expect(copied[0].spotId).toBe(3)
    expect(copied[0].availableQuantity).toBe(5)
    expect(copied[0].careerId).toBe(spots[0].careerId)
    expect(copied[0].locationId).toBe(spots[0].locationId)
  })
})

describe("handleAllocate", () => {
  const phaseId = 2

  beforeEach(() => {
    vi.mocked(createAllocation).mockClear()
    vi.mocked(addApplicantToPhase).mockClear()
    vi.mocked(createSpot).mockClear()
  })

  it("applicants null retorna sin lanzar y sin llamar a las APIs", async () => {
    const s = [spot()]
    await handleAllocate(null as unknown as Applicant[], s, phaseId)
    expect(createAllocation).not.toHaveBeenCalled()
    expect(addApplicantToPhase).not.toHaveBeenCalled()
    expect(createSpot).not.toHaveBeenCalled()
  })

  it("spots null retorna sin lanzar y sin llamar a las APIs", async () => {
    const a = [applicant()]
    await handleAllocate(a, null as unknown as SpotFull[], phaseId)
    expect(createAllocation).not.toHaveBeenCalled()
    expect(addApplicantToPhase).not.toHaveBeenCalled()
    expect(createSpot).not.toHaveBeenCalled()
  })

  it("aspirante con requests y plaza libre: createAllocation y se reduce availableQuantity en la copia", async () => {
    const s = [spot({ spotId: 100, availableQuantity: 1 })]
    const a = [applicant({ id: 50, requests: [{ spotId: 100, preferenceOrder: 1 }] })]
    await handleAllocate(a, s, phaseId)
    expect(createAllocation).toHaveBeenCalledTimes(1)
    expect(createAllocation).toHaveBeenCalledWith({ applicantId: 50, spotId: 100 })
    expect(addApplicantToPhase).not.toHaveBeenCalled()
  })

  it("dos aspirantes y una plaza: el primero createAllocation, el segundo addApplicantToPhase", async () => {
    const s = [spot({ spotId: 100, availableQuantity: 1 })]
    const a = [
      applicant({ id: 1, requests: [{ spotId: 100, preferenceOrder: 1 }] }),
      applicant({ id: 2, requests: [{ spotId: 100, preferenceOrder: 1 }] })
    ]
    await handleAllocate(a, s, phaseId)
    expect(createAllocation).toHaveBeenCalledTimes(1)
    expect(createAllocation).toHaveBeenCalledWith({ applicantId: 1, spotId: 100 })
    expect(addApplicantToPhase).toHaveBeenCalledTimes(1)
    expect(addApplicantToPhase).toHaveBeenCalledWith(2, phaseId)
  })

  it("aspirante sin requests: addApplicantToPhase, no createAllocation", async () => {
    const s = [spot({ availableQuantity: 1 })]
    const a = [applicant({ id: 1, requests: undefined })]
    await handleAllocate(a, s, phaseId)
    expect(createAllocation).not.toHaveBeenCalled()
    expect(addApplicantToPhase).toHaveBeenCalledWith(1, phaseId)
  })

  it("aspirante con requests pero sin plaza disponible: addApplicantToPhase, no createAllocation", async () => {
    const s = [spot({ spotId: 100, availableQuantity: 0 })]
    const a = [applicant({ id: 1, requests: [{ spotId: 100, preferenceOrder: 1 }] })]
    await handleAllocate(a, s, phaseId)
    expect(createAllocation).not.toHaveBeenCalled()
    expect(addApplicantToPhase).toHaveBeenCalledWith(1, phaseId)
  })

  it("onProgress se invoca con (i+1, total) en cada iteración", async () => {
    const onProgress = vi.fn()
    const a = [
      applicant({ id: 1, requests: [] }),
      applicant({ id: 2, requests: [] })
    ]
    await handleAllocate(a, [spot()], phaseId, onProgress)
    expect(onProgress).toHaveBeenCalledTimes(2)
    expect(onProgress).toHaveBeenNthCalledWith(1, 1, 2)
    expect(onProgress).toHaveBeenNthCalledWith(2, 2, 2)
  })

  it("al final, createSpot se llama por cada spot con availableQuantity > 0 en la copia", async () => {
    const s = [
      spot({ spotId: 1, careerId: 10, locationId: 20, availableQuantity: 2 }),
      spot({ spotId: 2, careerId: 11, locationId: 21, availableQuantity: 0 })
    ]
    // Un aspirante consume 1 del primer spot; queda 1 en el primero. El segundo ya tiene 0.
    const a = [applicant({ id: 1, requests: [{ spotId: 1, preferenceOrder: 1 }] })]
    await handleAllocate(a, s, phaseId)
    expect(createSpot).toHaveBeenCalledTimes(1)
    expect(createSpot).toHaveBeenCalledWith({
      careerId: 10,
      locationId: 20,
      phaseId,
      availableQuantity: 1
    })
  })

  it("varios spots con sobrante: createSpot se llama una vez por cada uno", async () => {
    const s = [
      spot({ spotId: 1, careerId: 10, locationId: 20, availableQuantity: 1 }),
      spot({ spotId: 2, careerId: 11, locationId: 21, availableQuantity: 1 })
    ]
    await handleAllocate([], s, phaseId)
    expect(createSpot).toHaveBeenCalledTimes(2)
    expect(createSpot).toHaveBeenNthCalledWith(1, {
      careerId: 10,
      locationId: 20,
      phaseId,
      availableQuantity: 1
    })
    expect(createSpot).toHaveBeenNthCalledWith(2, {
      careerId: 11,
      locationId: 21,
      phaseId,
      availableQuantity: 1
    })
  })
})
