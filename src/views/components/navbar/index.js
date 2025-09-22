// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Settings, User } from "react-feather";
import { Button, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
// ** Utils
import { isUserLoggedIn } from '@utils'
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
import logo from '@src/assets/images/icons/logo.png'



const prefix_url = process.env.ENVIRONMENT == 'uat' ? '/uat' : ''
const ThemeNavbar = props => {
  // ** Props
  const { menuVisibility, setMenuVisibility } = props; 
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  // ** Store Vars
  const dispatch = useDispatch()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  
  const handleVisibleChange = () => {
    setMenuVisibility(!menuVisibility)
  }
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }
  const Logout = () => {
    dispatch(handleLogout());
    navigate(prefix_url + '/login');
  }
  const isLinkActive = (linkUrl) => {
    return location.pathname === linkUrl;
  };
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', handleWindowWidth)
    }
  }, [windowWidth])

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    } else {
      dispatch(handleLogout());
      navigate(prefix_url + '/login');
    }
  }, [])
  return (
    <Fragment>
      <nav className="navbar navbar-top fixed-top navbar-expand">
        <div className="collapse navbar-collapse justify-content-between">
          <div className="navbar-logo">
            <button className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse" aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation" onClick={() => handleVisibleChange()}><span className="navbar-toggle-icon"><i className="toggle-line"></i></span></button>
            <a className="navbar-brand me-1 me-sm-3">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center"><img src={logo} alt="frdfund" width="50" />
                  <h5 className="logo-text ms-2 d-none d-sm-block">ระบบจัดการหนี้</h5>
                </div>
              </div>
            </a>
          </div>
          <UncontrolledDropdown tag='ul' className='navbar-nav navbar-nav-icons flex-row'>
            <DropdownToggle href='/' tag='a' className='nav-link lh-1 pe-0' onClick={e => e.preventDefault()}>
              <div className='user-nav d-sm-flex d-none'>
                <div className="avatar avatar-l ">
                  <img className="rounded-circle " src="/assets/img/team/user.png" alt="" />
                </div>
              </div>
            </DropdownToggle>
            <DropdownMenu end style={{ minWidth: 250 }}>
              <div className="card-body p-0">
                <div className="text-center pb-3">
                  <h6 className="mt-2 text-body-emphasis">{userData?.role_detail ?? 'ผู้ใช้งาน'}</h6>
                </div>
              </div>
              <DropdownItem tag={Link} to={prefix_url + '/profile'}>
                <User className="me-2 text-body align-bottom" size={16} />ข้อมูลโปรไฟล์
              </DropdownItem>
              {userData?.role == 1 && (
                <DropdownItem tag={Link} to={prefix_url + '/settings'}>
                  <Settings className="me-2 text-body align-bottom" size={16} />ตั้งค่าระบบ
                </DropdownItem>
              )}
              <DropdownItem divider />
              <div className="card-footer">
                <div className="px-3"> 
                  <Button className="btn btn-phoenix-secondary d-flex flex-center w-100" onClick={() => Logout()}>
                    <LogOut className="me-2" size={16} />
                    ออกจากระบบ
                  </Button>
                </div>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
          {/* <ul className="navbar-nav navbar-nav-icons flex-row">
            <li className="nav-item dropdown">
              <a className="nav-link lh-1 pe-0" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
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
                      <li className="nav-item">
                        <NavLink tag={Link} active={isLinkActive('/profile')} className="nav-link px-3 d-block" to="/profile"> 
                          <User className="me-2 text-body align-bottom" size={16} />ข้อมูลโปรไฟล์
                        </NavLink>
                      </li>                 
                      <li className="nav-item">
                        <NavLink tag={Link} active={isLinkActive('/settings')} className="nav-link px-3 d-block" to="/settings">
                          <Settings className="me-2 text-body align-bottom" size={16} />ตั้งค่าระบบ
                        </NavLink>
                      </li>
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
          </ul> */}
        </div>
      </nav>
    </Fragment>
  )
}

export default ThemeNavbar
