// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

// ** Store & Actions
import { useDispatch } from 'react-redux'

import NavbarComponent from '@views/components/navbar'
import SidebarComponent from '@views/components/sidemenu'

import { isUserLoggedIn } from "@utils";
import { handleLogout } from '@store/authentication'

import "@assets/css/theme.css"
const prefix_url = process.env.ENVIRONMENT == 'uat' ? '/uat' : ''

const VerticalLayout = props => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ** States
  const [isHide, setIsHide] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [menuVisibility, setMenuVisibility] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }

  // ** Vars
  const location = useLocation()
  const handleMenuCollapsed = (flagHide) => {
    setIsHide(flagHide);
  }

  //** This function will detect the Route Change and will hide the menu on menu item click
  useEffect(() => {
    if (menuVisibility && windowWidth < 1200) {
      setMenuVisibility(false)
    }
  }, [location])

  //** Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', handleWindowWidth)
    }
  }, [windowWidth])

  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', handleWindowWidth)
    }
  }, [windowWidth])
  useEffect(() => {
    if (window !== undefined) {
      if (isHide) {
        $('#root').addClass('navbar-vertical-collapsed');
        localStorage.setItem('phoenixIsNavbarVerticalCollapsed', true);
      } else {
        $('#root').removeClass('navbar-vertical-collapsed');
        localStorage.setItem('phoenixIsNavbarVerticalCollapsed', false);
      }
    }
  }, [isHide])
  useEffect(() => {
    if (isMounted) {
      $('<script src="./assets/js/config.js"></script>').appendTo('body');
      $('<script src="./assets/js/phoenix.js"></script>').appendTo('body');
      if (!localStorage.getItem('phoenixIsNavbarVerticalCollapsed')) localStorage.setItem('phoenixIsNavbarVerticalCollapsed', false);
    }
    return () => {}
  }, [isMounted])
  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() == null) {
      dispatch(handleLogout());
      navigate(`${prefix_url}/login`);
    }
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])
  if (!isMounted) {
    return null
  }

  return (
    <Fragment>
      <SidebarComponent
        menuCollapsed={isHide}
        setMenuCollapsed={handleMenuCollapsed}
        menuVisibility={menuVisibility}
        setMenuVisibility={setMenuVisibility}
      />
      <NavbarComponent setMenuVisibility={setMenuVisibility} />
      <Outlet />
    </Fragment>
  )
}

export default VerticalLayout
