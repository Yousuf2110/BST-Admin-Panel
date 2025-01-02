import Dashboard from "layouts/dashboard";
import Notifications from "layouts/notifications";

import Icon from "@mui/material/Icon";
import AllUsers from "layouts/userList";
import WithDrawList from "layouts/withDrawList";
import ViewRequestPins from "layouts/viewRequestPins";
import AllUsersPins from "layouts/allUsersPins";
import ApprovePasswordRequest from "layouts/approvePasswordRequest";
import CompanyAccountInfo from "layouts/companyAccountInfo";
import ChangePassword from "layouts/changePassword";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>, // "dashboard" icon for dashboard
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "User List",
    key: "user-list",
    icon: <Icon fontSize="small">group</Icon>, // "group" icon for user list
    route: "/user-list",
    component: <AllUsers />,
  },
  {
    type: "collapse",
    name: "Withdraw List",
    key: "withdraw-list",
    icon: <Icon fontSize="small">account_balance_wallet</Icon>, // "account_balance_wallet" icon for withdraw list
    route: "/withdraw-list",
    component: <WithDrawList />,
  },
  {
    type: "collapse",
    name: "All Pins List",
    key: "all-pins-lists",
    icon: <Icon fontSize="small">pin</Icon>, // "pin" icon for all pins list
    route: "/all-pins-lists",
    component: <ViewRequestPins />,
  },
  {
    type: "collapse",
    name: "Password Request",
    key: "password-request",
    icon: <Icon fontSize="small">lock</Icon>, // "lock" icon for password request
    route: "/password-request",
    component: <ApprovePasswordRequest />,
  },
  {
    type: "collapse",
    name: "Requested Pins List",
    key: "requested-pins-list",
    icon: <Icon fontSize="small">push_pin</Icon>, // "push_pin" icon for requested pins list
    route: "/requested-pins-list",
    component: <AllUsersPins />,
  },
  {
    type: "collapse",
    name: "Company Account Info",
    key: "company-account-info",
    icon: <Icon fontSize="small">business</Icon>, // "business" icon for company account info
    route: "/company-account-info",
    component: <CompanyAccountInfo />,
  },
  {
    type: "collapse",
    name: "Change Password",
    key: "change-password",
    icon: <Icon fontSize="small">key</Icon>, // "key" icon for change password
    route: "change-password",
    component: <ChangePassword />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications_active</Icon>, // "notifications_active" for notifications
    route: "/notifications",
    component: <Notifications />,
  },
];

export default routes;
