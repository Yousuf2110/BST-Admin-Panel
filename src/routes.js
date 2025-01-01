import Dashboard from "layouts/dashboard";
import Notifications from "layouts/notifications";

import Icon from "@mui/material/Icon";
import AllUsers from "layouts/userList";
import WithDrawList from "layouts/withDrawList";
import ViewRequestPins from "layouts/viewRequestPins";
import AllUsersPins from "layouts/allUsersPins";
import ApprovePasswordRequest from "layouts/approvePasswordRequest";
import CompanyAccountInfo from "layouts/companyAccountInfo";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "User List",
    key: "user-list",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/user-list",
    component: <AllUsers />,
  },
  {
    type: "collapse",
    name: "Withdraw List",
    key: "withdraw-list",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/withdraw-list",
    component: <WithDrawList />,
  },
  {
    type: "collapse",
    name: "All Pins List",
    key: "all-pins-lists",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/all-pins-lists",
    component: <ViewRequestPins />,
  },
  {
    type: "collapse",
    name: "Password Request",
    key: "password-request",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/password-request",
    component: <ApprovePasswordRequest />,
  },
  {
    type: "collapse",
    name: "Requested Pins List",
    key: "requested-pins-list",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/requested-pins-list",
    component: <AllUsersPins />,
  },
  {
    type: "collapse",
    name: "Company Account Info",
    key: "company-account-info",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/company-account-info",
    component: <CompanyAccountInfo />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
];

export default routes;
