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

const ToastContent = ({ t, name }) => {
  return (
    <div className="d-flex align-items-center">
      <div className="me-1"><CheckCircle size={12} color="success" /></div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6 style={{ color: '#1c6c09' }}>{name}</h6>
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
      <div className="me-1"><X size={12} color="danger" /></div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6 style={{ color: '#fa3b1d' }}>{message}</h6>
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
  const keyDownHandle = async(e) => {
    if(e.keyCode == 13){
      await onSubmit(defaultValues);
    }
  }
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
            fullName: userData.firstname + ' ' + userData.lastname,
            accessToken: res.token,
            refreshToken: res.token,
          };
          dispatch(handleLogin(data));
          ability.update('admin');
          navigate(getHomeRouteForLoggedInUser('admin'));
          toast((t) => (
            <ToastContent t={t} name={data.fullName} />
          ));
        } else {
          setError("password", {
            type: "manual",
            message: res.message,
          });
          toast((t) => (
            <ToastError t={t} message={res.message} />
          ));
        }
      } catch (err) {
        console.log("try", err);
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast((t) => (
        <ToastError t={t} message={'เข้าสู่ระบบไม่สำเร็จ'} />
      ));
      // alert("เกิดข้อผิดพลาด: " + (err?.message || "ไม่ทราบสาเหตุ"));
    }
  };
  
  const onChange = (key, val) => {
    const newval = val?.target.value ?? '';
    setError('password', null);
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
                
                <input className={`input100 ${errors?.password ? 'border-error' : ''}`} type="username" name="username" placeholder="ชื่อผู้ใช้งาน" onChange={(newval) => onChange('username', newval)} value={defaultValues.username} onKeyDown={keyDownHandle}/>
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </span>
              </div>
                {/* {errors.username && (
                  <span style={{ color: 'red', fontSize: 'smaller' }}>{errors.username}</span>
                )} */}

              <div className="wrap-input100 validate-input" data-validate="Password is required">
                <input className={`input100 ${errors?.password ? 'border-error' : ''}`} type="password" name="password" placeholder="รหัสผ่าน" onChange={(newval) => onChange('password', newval)} value={defaultValues.password} onKeyDown={keyDownHandle} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>
                {errors?.password && (
                  <span style={{ color: 'red', fontSize: 'smaller' }}>{errors.password.message}</span>
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
