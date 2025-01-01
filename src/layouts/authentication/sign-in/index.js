import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import BasicLayout from "layouts/authentication/components/BasicLayout";

import logo from "assets/images/logo-2.png";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useAuth } from "context/AuthContext";

function Basic() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      // Using toastId to ensure only one error toast is shown at a time
      toast.error("Please enter both email and password.", {
        toastId: "error-empty-fields", // Unique toast ID
      });
      return;
    }

    try {
      const response = await axios.post("https://ecosphere-pakistan-backend.co-m.pk/api/login", {
        email: username,
        password: password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const userRole = response.data?.info?.role; // Assuming the role is returned in the response

        // If the role is admin, proceed with login
        if (userRole !== "admin") {
          toast.error("You do not have permission to log in.", {
            toastId: "error-no-permission", // Unique toast ID
          });
          return;
        }

        if (token) {
          localStorage.setItem("authToken", token);
          login(token);
        }

        localStorage.setItem("userData", JSON.stringify(response.data));
        toast.success("Login Successful!", {
          toastId: "success-login", // Unique toast ID
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        toast.error(response.data.message || "Login failed. Unexpected response from server.", {
          toastId: "error-server-response", // Unique toast ID
        });
      }
    } catch (err) {
      // Handle error cases
      if (err.response) {
        if (err.response.status === 400) {
          toast.error("Invalid email or password.", {
            toastId: "error-invalid-credentials", // Unique toast ID
          });
        } else if (err.response.status === 500) {
          toast.error("Internal Server Error. Please try again later.", {
            toastId: "error-server-error", // Unique toast ID
          });
        } else {
          toast.error(err.response.data.message || "An error occurred. Please try again.", {
            toastId: "error-general", // Unique toast ID
          });
        }
      } else if (err.request) {
        toast.error("No response from server. Please check your internet connection.", {
          toastId: "error-no-response", // Unique toast ID
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          toastId: "error-unknown", // Unique toast ID
        });
      }
      console.error(err);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <ToastContainer
        position="top-right"
        autoClose={3000} // This makes each toast disappear after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1} // Ensures only one toast is shown at a time
      />
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDBox
            component="img"
            src={logo}
            alt="background"
            borderRadius="lg"
            width="60%"
            height="60"
            sx={{ objectFit: "cover" }}
          />
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="User Name"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Login
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
