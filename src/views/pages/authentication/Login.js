// ** React Imports
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Third Party Components
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { CheckCircle, X } from "react-feather";

// ** Actions
import { handleLogin, handleLogout } from "@store/authentication";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";

// ** Reactstrap Imports
import { Button } from "reactstrap";

// ** Styles
import "@assets/css/login.css";

import { login } from "@src/services/api";

const ToastContent = ({ t, name, role }) => {
  return (
    <div className="d-flex align-items-center">
      <div className="me-1">
        <Avatar size="sm" color="success" icon={<CheckCircle size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{name}</h6>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>เข้าสู่ระบบสำเร็จ</span>
      </div>
    </div>
  );
};

const ToastError = ({ t, message }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="danger" icon={<X size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{message}</h6>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  // ** Hooks
  const email = localStorage.getItem("email");
  const [defaultValues, setDefault] = useState({
    password: "",
    username: email ?? "",
  });
  const [errors, setErrors] = useState({
    password: null,
    username: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ability = useContext(AbilityContext);

  const setError = (key, value) => {
    try {
      setErrors((prevState) => {
        return {
          ...prevState,
          [key]: value,
        };
      });
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmit = async(data) => {
    try {
      localStorage.setItem("email", data.username);
      try {
        const res = await login({ username: data.username, password: data.password });
        if (res.isSuccess) {
          const userData = {
            ...res.data,
          };
          const data = {
            ...userData,
            accessToken: res.token,
            refreshToken: res.token,
          };
          dispatch(handleLogin(data));
          ability.update('admin');
          navigate(getHomeRouteForLoggedInUser('admin'));
        } else {
          // if (res.data.message == "รหัสผ่านไม่ถูกต้อง") {
          //   setError("password", {
          //     type: "manual",
          //     message: res.data.message,
          //   });
          //   setError("username", null);
          // } else {
          //   setError("username", {
          //     type: "manual",
          //     message: res.data.message,
          //   });
          //   setError("password", null);
          // }
        }
      } catch (err) {
        console.log("try", err);
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      // alert("เกิดข้อผิดพลาด: " + (err?.message || "ไม่ทราบสาเหตุ"));
    }
  };
  
  const onChange = (key, val) => {
    const newval = val?.target.value ?? '';
    setDefault((prevState) => ({
      ...prevState,
      ...({[key]: newval})
    }))
  }
  useEffect(() => {
    try {
      dispatch(handleLogout());
      $('.js-tilt').tilt()
    } catch { }
  },[]);
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-pic js-tilt" data-tilt>
              <img src="assets/img/icons/login.jpg" alt="IMG" width={'100%'} />
            </div>
            <div className="login100-form">
              <span className="login100-form-title">
                <b>เข้าสู่ระบบ</b>
              </span>
              <div className="login100-form-title">
                <img src="assets/img/icons/logo.png" alt="IMG" width="120"/>
              </div>
              <div className="wrap-input100 validate-input">
                
                <input className="input100" type="username" name="username" placeholder="ชื่อผู้ใช้งาน" onChange={(newval) => onChange('username', newval)} value={defaultValues.username} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </span>
              </div>
                {errors.username && (
                  <span style={{ color: 'red', fontSize: 'smaller' }}>{errors.username}</span>
                )}

              <div className="wrap-input100 validate-input" data-validate="Password is required">
                <input className="input100" type="password" name="password" placeholder="รหัสผ่าน" onChange={(newval) => onChange('password', newval)} value={defaultValues.password} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>
                {errors.password && (
                  <span style={{ color: 'red', fontSize: 'smaller' }}>{errors.password}</span>
                )}
              <div className="container-login100-form-btn">
                <Button
                  className="login100-form-btn"
                  color="primary"
                  type="button"
                  onClick={() => onSubmit(defaultValues)}
                >
                  เข้าสู่ระบบ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
