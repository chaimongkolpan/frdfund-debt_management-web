// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Settings, User } from "react-feather";
import { Button } from "reactstrap";
// ** Utils
import { isUserLoggedIn } from '@utils'
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
import logo from '@src/assets/images/icons/logo.png'



const ThemeNavbar = props => {
  // ** Props
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  // ** Store Vars
  const dispatch = useDispatch()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }
  const Logout = () => {
    dispatch(handleLogout());
    navigate('/login');
  }
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', handleWindowWidth)
    }
  }, [windowWidth])

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])
  return (
    <Fragment>
      <nav className="navbar navbar-top fixed-top navbar-expand" id="navbarDefault">
        <div className="collapse navbar-collapse justify-content-between">
          <div className="navbar-logo">
            <button className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse" aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation"><span className="navbar-toggle-icon"><i className="toggle-line"></i></span></button>
            <a className="navbar-brand me-1 me-sm-3">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center"><img src={logo} alt="frdfund" width="50" />
                  <h5 className="logo-text ms-2 d-none d-sm-block">ระบบการ์ดลูกหนี้เกษตรกร</h5>
                </div>
              </div>
            </a>
          </div>
          <ul className="navbar-nav navbar-nav-icons flex-row">
            <li className="nav-item dropdown"><a className="nav-link lh-1 pe-0" id="navbarDropdownUser" href="#!" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                <div className="avatar avatar-l ">
                  <img className="rounded-circle " src="/assets/img/team/user.png" alt="" />
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border" aria-labelledby="navbarDropdownUser">
                <div className="card position-relative border-0">
                  <div className="card-body p-0">
                    <div className="text-center pt-4 pb-3">
                      <h6 className="mt-2 text-body-emphasis">ผู้ดูแลระบบ</h6>
                    </div>
                  </div>
                  <div className="overflow-auto scrollbar" style={{ height: "5rem" }}>
                    
                  <ul className="nav d-flex flex-column mb-2 pb-1">
                    <li className="nav-item"><NavLink className="nav-link px-3 d-block" to="/profile"> <User className="me-2 text-body align-bottom" size={16} />ข้อมูลโปรไฟล์</NavLink></li>                 
                    <li className="nav-item"><NavLink className="nav-link px-3 d-block" to="/settings"><Settings className="me-2 text-body align-bottom" size={16} />ตั้งค่าระบบ</NavLink></li>
                  </ul>
                  </div>
                  <div className="card-footer">
                    <div className="px-3"> 
                      <Button className="btn btn-phoenix-secondary d-flex flex-center w-100" onClick={() => Logout()}>
                        <LogOut className="me-2" size={16} />
                        ออกจากระบบ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </Fragment>
  )
}

export default ThemeNavbar
