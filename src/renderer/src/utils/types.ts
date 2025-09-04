export type AllocationsSectionType = {
  title: string
  subtitle: string
  tabs: TabsType[]
}

type TabsType = {
  label: string
  value: string
  children: React.ReactNode
}

export type PhaseType = 1 | 2 | 3
