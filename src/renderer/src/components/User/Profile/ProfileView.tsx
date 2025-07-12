import PageContainer from "@renderer/components/common/PageContainer"
import PageTitle from "@renderer/components/common/PageTitle"
import Details from "./Details"
import EditProfile from "./EditProfile"
import ChangePassword from "./ChangePassword"

const ProfileView = () => {
  return (
    <PageContainer>
      <PageTitle title="Perfil" subtitle="Administra tu información personal y credenciales." />
      <div className="flex justify-between gap-5 h-full">
        <Details />
        <EditProfile />
        <ChangePassword />
      </div>
    </PageContainer>
  )
}
export default ProfileView
