import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

import Icon from "@mui/material/Icon";
import DepositList from "layouts/depositList";

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
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/user-list",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Deposit List",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/deposit-list",
    component: <DepositList />,
  },
  {
    type: "collapse",
    name: "Withdraw List",
    key: "withdraw-list",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/sign-in",
  //   component: <SignIn />,
  // },
];

export default routes;
