interface PageTitleProps {
  title: string
  subtitle?: string
}

const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
export default PageTitle
