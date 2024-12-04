import DashboardLayout from "./DashboardLayout";
import {HomeOutlined, ImportContactsOutlined} from "@mui/icons-material"

const AdminDashboardLayout = () => {
  return <DashboardLayout sideBarData={[
    {
      icon: <HomeOutlined />,
      text: "Dashboard",
      path: "dashboard",
    },
    
  ]} />;
};

export default AdminDashboardLayout;