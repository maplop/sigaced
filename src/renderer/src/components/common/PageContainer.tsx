interface PageContainerProps {
  children: React.ReactNode
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {children}
    </div>
  )
}
export default PageContainer
