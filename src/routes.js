import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

import Icon from "@mui/material/Icon";
import DepositList from "layouts/depositList";
import AllUsers from "layouts/userList";
import GeneratedPassword from "layouts/generatePassword";
import WithDrawList from "layouts/withDrawList";
import ViewRequestPins from "layouts/viewRequestPins";
import AllUsersPins from "layouts/allUsersPins";

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
    component: <AllUsers />,
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
    route: "/withdraw-list",
    component: <WithDrawList />,
  },
  {
    type: "collapse",
    name: "View Requested Pins",
    key: "view-requested-pins",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/view-requested-pins",
    component: <ViewRequestPins />,
  },
  {
    type: "collapse",
    name: "All User Pins",
    key: "all-user-pins",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/all-user-pins",
    component: <AllUsersPins />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Generated Password ",
    key: "Generated Password ",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/generated-password ",
    component: <GeneratedPassword />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
