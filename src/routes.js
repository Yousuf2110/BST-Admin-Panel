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
import AddProduct from "layouts/addProduct";
import ProductList from "layouts/productList";
import ProductRequest from "layouts/productRequest";

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
    icon: <Icon fontSize="small">group</Icon>,
    route: "/user-list",
    component: <AllUsers />,
  },
  {
    type: "collapse",
    name: "Withdraw List",
    key: "withdraw-list",
    icon: <Icon fontSize="small">account_balance_wallet</Icon>,
    route: "/withdraw-list",
    component: <WithDrawList />,
  },
  {
    type: "collapse",
    name: "Product List",
    key: "product-list",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/product-list",
    component: <ProductList />,
  },
  {
    type: "collapse",
    name: "Product Request",
    key: "product-request",
    icon: <Icon fontSize="small">add_shopping_cart</Icon>,
    route: "/product-request",
    component: <ProductRequest />,
  },
  {
    type: "collapse",
    name: "Add Product",
    key: "add-product",
    icon: <Icon fontSize="small">add_circle</Icon>,
    route: "/add-product",
    component: <AddProduct />,
  },
  {
    type: "collapse",
    name: "All Pins List",
    key: "all-pins-lists",
    icon: <Icon fontSize="small">pin</Icon>,
    route: "/all-pins-lists",
    component: <ViewRequestPins />,
  },
  {
    type: "collapse",
    name: "Password Request",
    key: "password-request",
    icon: <Icon fontSize="small">lock</Icon>,
    route: "/password-request",
    component: <ApprovePasswordRequest />,
  },
  {
    type: "collapse",
    name: "Requested Pins List",
    key: "requested-pins-list",
    icon: <Icon fontSize="small">push_pin</Icon>,
    route: "/requested-pins-list",
    component: <AllUsersPins />,
  },
  {
    type: "collapse",
    name: "Company Account Info",
    key: "company-account-info",
    icon: <Icon fontSize="small">business</Icon>,
    route: "/company-account-info",
    component: <CompanyAccountInfo />,
  },
  {
    type: "collapse",
    name: "Change Password",
    key: "change-password",
    icon: <Icon fontSize="small">key</Icon>,
    route: "change-password",
    component: <ChangePassword />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications_active</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
];

export default routes;
