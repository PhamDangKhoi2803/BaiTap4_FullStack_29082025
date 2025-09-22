// src/App.jsx
import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";
import './styles/global.css';

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setAppLoading(true);
        const res = await axios.get(`/v1/api/user`);

        if (res && !res.message) {
          // Nếu là mảng (user thường), lấy phần tử đầu tiên
          const userData = Array.isArray(res) ? res[0] : res;
          setAuth({
            isAuthenticated: true,
            user: {
              email: userData.email,
              name: userData.name,
              _id: userData._id,
              role: userData.role,
            },
          });
        }
      } catch (error) {
        console.error("Fetch account failed:", error);
      } finally {
        setAppLoading(false);
      }
    };

    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
