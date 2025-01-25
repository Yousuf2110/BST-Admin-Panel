import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-2.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "protectedRoutes";
import SignIn from "layouts/authentication/sign-in";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  const userData = localStorage.getItem("userData");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backend.salespronetworks.com/api/sidebar-pending",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("xx-res", response.data);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      }
    };

    fetchData();
  }, [token]);

  const user = userData ? JSON.parse(userData) : null;

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        // if (route.key === "sign-in") {
        // return <Route exact path={route.route} element={route.component} key={route.key} />;
        // } else {
        return (
          <Route
            exact
            path={route.route}
            element={<ProtectedRoute>{route.component}</ProtectedRoute>}
            key={route.key}
          />
        );
        // }
      }

      return null;
    });

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName={
                <>
                  {user?.info?.name}
                  <br />
                  {user?.info?.email}
                  <br />
                  {user?.info?.mobile}
                </>
              }
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          <Route exact path="/authentication/sign-in" element={<SignIn />} />
          {getRoutes(routes)}
          <Route exact path="*" element={<Navigate to="/authentication/sign-in" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <AuthProvider>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName={
                <>
                  {user?.info?.name}
                  <br />
                  {user?.info?.email}
                  <br />
                  {user?.info?.mobile}
                </>
              }
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          <Route exact path="/authentication/sign-in" element={<SignIn />} />
          {getRoutes(routes)}
          <Route exact path="*" element={<Navigate to="/authentication/sign-in" />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}
