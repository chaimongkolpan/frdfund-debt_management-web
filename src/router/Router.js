import { lazy } from 'react'
import { useRoutes, Navigate } from 'react-router-dom'

import BlankLayout from '../layouts/BlankLayout'
import VerticalLayout from '../layouts/VerticalLayout'

import { getUserData } from '../utility/Utils'

const Error = lazy(() => import('../views/pages/Error'))
const Version = lazy(() => import('../views/pages/Version'))
const Login = lazy(() => import('../views/pages/authentication/Login'))
const Setting = lazy(() => import('../views/pages/setting'))
const Profile = lazy(() => import('../views/pages/profile'))
const DebtRegister = lazy(() => import('../views/pages/debt-register'))
const DebtRegisterNpa = lazy(() => import('../views/pages/debt-register/npa'))
const ClassifyImport = lazy(() => import('../views/pages/classify/import'))
const ClassifySearch = lazy(() => import('../views/pages/classify/search'))
const ClassifySearchDetail = lazy(() => import('../views/pages/classify/searchDetail'))
const ProposeForApprovalBranchOfferNPA = lazy(() => import('../views/pages/proposeForApproval/branchOfferNPA'))
const ProposeForApprovalBranchOfferNPL = lazy(() => import('../views/pages/proposeForApproval/branchOfferNPL'))

const ClassifySearchNpa = lazy(() => import('../views/pages/classify/searchNpa'))
const ClassifySearchNpaDetail = lazy(() => import('../views/pages/classify/searchNpaDetail'))
const BranchOfferNpl = lazy(() => import('../views/pages/branch/offer/npl'))
const BranchOfferNpa = lazy(() => import('../views/pages/branch/offer/npa'))
const BranchPrepareNpl = lazy(() => import('../views/pages/branch/prepare/npl'))
const BranchPrepareNpa = lazy(() => import('../views/pages/branch/prepare/npa'))
const CommitteePrepareNpl = lazy(() => import('../views/pages/committee/prepare/npl'))
const CommitteePrepareNpa = lazy(() => import('../views/pages/committee/prepare/npa'))
const CommitteeWaitingNpl = lazy(() => import('../views/pages/committee/waiting/npl'))
const CommitteeWaitingNpa = lazy(() => import('../views/pages/committee/waiting/npa'))
const CommitteeUpdateNpl = lazy(() => import('../views/pages/committee/update/npl'))
const CommitteeUpdateNpa = lazy(() => import('../views/pages/committee/update/npa'))
const ApprovalMakePetitionNpl = lazy(() => import('../views/pages/approval/make-petition/npl'))
const ApprovalMakePetitionNpa = lazy(() => import('../views/pages/approval/make-petition/npa'))
const ApprovalDisbursementStatusNpl = lazy(() => import('../views/pages/approval/disbursement-status/npl'))
const ApprovalDisbursementStatusNpa = lazy(() => import('../views/pages/approval/disbursement-status/npa'))
const ApprovalAdditionalActionNpl = lazy(() => import('../views/pages/approval/additional-action/npl'))
const ApprovalAdditionalActionNpa = lazy(() => import('../views/pages/approval/additional-action/npa'))

const Close = lazy(() => import('../views/pages/close'))
const Report = lazy(() => import('../views/pages/report'))
const ReportAsset = lazy(() => import('../views/pages/report/asset'))
const ReportRestruct = lazy(() => import('../views/pages/report/restruct'))
const ReportPostpone = lazy(() => import('../views/pages/report/postpone'))
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
            path: '/profile',
            element: <VerticalLayout />,
            children: [{ path: '/profile', element: <Profile /> }]
        },
        {
            path: '/settings',
            element: <VerticalLayout />,
            children: [{ path: '/settings', element: <Setting /> }]
        },
        {
            path: '/debt',
            element: <VerticalLayout />,
            children: [{ path: '/debt', element: <DebtRegister /> }]
        },
        {
            path: '/debt/npa',
            element: <VerticalLayout />,
            children: [{ path: '/debt/npa', element: <DebtRegisterNpa /> }]
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
            path: '/classify/searchNPA',
            element: <VerticalLayout />,
            children: [{ path: '/classify/searchNPA', element: <ClassifySearchNpa /> }]
        },
        {
            path: '/classify/searchNPA/detail/:idcard',
            element: <VerticalLayout />,
            children: [{ path: '/classify/searchNPA/detail/:idcard', element: <ClassifySearchNpaDetail /> }]
        },
        {
            path: '/proposeForApproval/branchOfferNPA',
            element: <VerticalLayout />,
            children: [{ path: '/proposeForApproval/branchOfferNPA', element: <ProposeForApprovalBranchOfferNPA /> }]
        },
        {
            path: '/proposeForApproval/branchOfferNPL',
            element: <VerticalLayout />,
            children: [{ path: '/proposeForApproval/branchOfferNPL', element: <ProposeForApprovalBranchOfferNPL /> }]
        },
        {
            path: '/branch/offer/npl',
            element: <VerticalLayout />,
            children: [{ path: '/branch/offer/npl', element: <ProposeForApprovalBranchOfferNPL /> }]
        },
        {
            path: '/branch/offer/npa',
            element: <VerticalLayout />,
            children: [{ path: '/branch/offer/npa', element: <ProposeForApprovalBranchOfferNPA /> }]
        },
        {
            path: '/branch/prepare/npl',
            element: <VerticalLayout />,
            children: [{ path: '/branch/prepare/npl', element: <BranchPrepareNpl /> }]
        },
        {
            path: '/branch/prepare/npa',
            element: <VerticalLayout />,
            children: [{ path: '/branch/prepare/npa', element: <BranchPrepareNpa /> }]
        },
        {
            path: '/committee/prepare-list/npl',
            element: <VerticalLayout />,
            children: [{ path: '/committee/prepare-list/npl', element: <CommitteePrepareNpl /> }]
        },
        {
            path: '/committee/prepare-list/npa',
            element: <VerticalLayout />,
            children: [{ path: '/committee/prepare-list/npa', element: <CommitteePrepareNpa /> }]
        },
        {
            path: '/committee/waiting-list/npl',
            element: <VerticalLayout />,
            children: [{ path: '/committee/waiting-list/npl', element: <CommitteeWaitingNpl /> }]
        },
        {
            path: '/committee/waiting-list/npa',
            element: <VerticalLayout />,
            children: [{ path: '/committee/waiting-list/npa', element: <CommitteeWaitingNpa /> }]
        },
        {
            path: '/committee/update-list/npl',
            element: <VerticalLayout />,
            children: [{ path: '/committee/update-list/npl', element: <CommitteeUpdateNpl /> }]
        },
        {
            path: '/committee/update-list/npa',
            element: <VerticalLayout />,
            children: [{ path: '/committee/update-list/npa', element: <CommitteeUpdateNpa /> }]
        },
        {
            path: '/approval/make-petition/npl',
            element: <VerticalLayout />,
            children: [{ path: '/approval/make-petition/npl', element: <ApprovalMakePetitionNpl /> }]
        },
        {
            path: '/approval/make-petition/npa',
            element: <VerticalLayout />,
            children: [{ path: '/approval/make-petition/npa', element: <ApprovalMakePetitionNpa /> }]
        },
        {
            path: '/approval/disbursement-status/npl',
            element: <VerticalLayout />,
            children: [{ path: '/approval/disbursement-status/npl', element: <ApprovalDisbursementStatusNpl /> }]
        },
        {
            path: '/approval/disbursement-status/npa',
            element: <VerticalLayout />,
            children: [{ path: '/approval/disbursement-status/npa', element: <ApprovalDisbursementStatusNpa /> }]
        },
        {
            path: '/approval/additional-action/npl',
            element: <VerticalLayout />,
            children: [{ path: '/approval/additional-action/npl', element: <ApprovalAdditionalActionNpl /> }]
        },
        {
            path: '/approval/additional-action/npa',
            element: <VerticalLayout />,
            children: [{ path: '/approval/additional-action/npa', element: <ApprovalAdditionalActionNpa /> }]
        },
        {
            path: '/close',
            element: <VerticalLayout />,
            children: [{ path: '/close', element: <Close /> }]
        },
        {
            path: '/report',
            element: <VerticalLayout />,
            children: [{ path: '/report', element: <Report /> }]
        },
        {
            path: '/report/asset',
            element: <VerticalLayout />,
            children: [{ path: '/report/asset', element: <ReportAsset /> }]
        },
        {
            path: '/report/restruct',
            element: <VerticalLayout />,
            children: [{ path: '/report/restruct', element: <ReportRestruct /> }]
        },
        {
            path: '/report/postpone',
            element: <VerticalLayout />,
            children: [{ path: '/report/postpone', element: <ReportPostpone /> }]
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