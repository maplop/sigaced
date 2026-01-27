import PageContainer from "@renderer/components/common/PageContainer"
import PageTitle from "@renderer/components/common/PageTitle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { AllocationsSectionType } from "@renderer/utils/types"

const AllocationsSectionWrapper = ({ title, subtitle, tabs }: AllocationsSectionType) => {
  return (
    <PageContainer>
      <PageTitle title={title} subtitle={subtitle} />
      <div className="w-full">
        <Tabs defaultValue={tabs[0].value} className="w-full">
          <TabsList className="w-full">
            {tabs.map((tab, index) => (
              <TabsTrigger key={index} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab, index) => (
            <TabsContent key={index} value={tab.value}>
              {tab.children}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  )
}
export default AllocationsSectionWrapper
