import { lazy } from 'react'
import { useRoutes, Navigate } from 'react-router-dom'

import BlankLayout from '../layouts/BlankLayout'
import VerticalLayout from '../layouts/VerticalLayout'

import { getUserData } from '../utility/Utils'

const Error = lazy(() => import('../views/pages/Error'))
const Version = lazy(() => import('../views/pages/Version'))
const Login = lazy(() => import('../views/pages/authentication/Login'))
const DebtRegister = lazy(() => import('../views/pages/debt-register'))
const ClassifyImport = lazy(() => import('../views/pages/classify/import'))
const ClassifySearch = lazy(() => import('../views/pages/classify/search'))
const ClassifySearchDetail = lazy(() => import('../views/pages/classify/searchDetail'))
const Router = () => {
    const getHomeRoute = () => {
        const user = getUserData()
        if (user) {
            return '/debt'
        } else {
            return '/login'
        }
    }
    const routes = useRoutes([
        {
            path: '/',
            index: true,
            element: <Navigate replace to={getHomeRoute()} />
        },
        {
            path: '/login',
            element: <BlankLayout />,
            children: [{ path: '/login', element: <Login /> }]
        },
        {
            path: '/debt',
            element: <VerticalLayout />,
            children: [{ path: '/debt', element: <DebtRegister /> }]
        },
        {
            path: '/classify/import',
            element: <VerticalLayout />,
            children: [{ path: '/classify/import', element: <ClassifyImport /> }]
        },
        {
            path: '/classify/searchNPL',
            element: <VerticalLayout />,
            children: [{ path: '/classify/searchNPL', element: <ClassifySearch /> }]
        },
        {
            path: '/classify/searchNPL/detail/:idcard',
            element: <VerticalLayout />,
            children: [{ path: '/classify/searchNPL/detail/:idcard', element: <ClassifySearchDetail /> }]
        },
        {
            path: '/version',
            element: <BlankLayout />,
            children: [{ path: '/version', element: <Version /> }]
        },
        {
            path: '*',
            element: <BlankLayout />,
            children: [{ path: '*', element: <Error /> }]
        },
    ])
    return routes
}
export default Router