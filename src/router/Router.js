import { lazy } from 'react'
import { useRoutes, Navigate } from 'react-router-dom'

import BlankLayout from '../layouts/BlankLayout'
import VerticalLayout from '../layouts/VerticalLayout'

import { getUserData } from '../utility/Utils'
const prefix_url = process.env.ENVIRONMENT == 'uat' ? '/uat' : ''
console.log('pre', prefix_url, process.env.ENVIRONMENT)
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
const ApprovalMakePetitionBranchNpl = lazy(() => import('../views/pages/approval/make-petition/branch-npl'))
const ApprovalMakePetitionBranchNpa = lazy(() => import('../views/pages/approval/make-petition/branch-npa'))
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
            return prefix_url + '/debt'
        } else {
            return prefix_url + '/login'
        }
    }
    const routes = useRoutes([
        {
            path: prefix_url + '/',
            index: true,
            element: <Navigate replace to={getHomeRoute()} />
        },
        {
            path: prefix_url + '/login',
            element: <BlankLayout />,
            children: [{ path: prefix_url + '/login', element: <Login /> }]
        },
        {
            path: prefix_url + '/profile',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/profile', element: <Profile /> }]
        },
        {
            path: prefix_url + '/settings',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/settings', element: <Setting /> }]
        },
        {
            path: prefix_url + '/debt',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/debt', element: <DebtRegister /> }]
        },
        {
            path: prefix_url + '/debt/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/debt/npa', element: <DebtRegisterNpa /> }]
        },
        {
            path: prefix_url + '/classify/import',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/classify/import', element: <ClassifyImport /> }]
        },
        {
            path: prefix_url + '/classify/searchNPL',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/classify/searchNPL', element: <ClassifySearch /> }]
        },
        {
            path: prefix_url + '/classify/searchNPL/detail/:idcard',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/classify/searchNPL/detail/:idcard', element: <ClassifySearchDetail /> }]
        },
        {
            path: prefix_url + '/classify/searchNPA',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/classify/searchNPA', element: <ClassifySearchNpa /> }]
        },
        {
            path: prefix_url + '/classify/searchNPA/detail/:idcard',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/classify/searchNPA/detail/:idcard', element: <ClassifySearchNpaDetail /> }]
        },
        {
            path: prefix_url + '/proposeForApproval/branchOfferNPA',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/proposeForApproval/branchOfferNPA', element: <ProposeForApprovalBranchOfferNPA /> }]
        },
        {
            path: prefix_url + '/proposeForApproval/branchOfferNPL',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/proposeForApproval/branchOfferNPL', element: <ProposeForApprovalBranchOfferNPL /> }]
        },
        {
            path: prefix_url + '/branch/offer/npl',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/branch/offer/npl', element: <ProposeForApprovalBranchOfferNPL /> }]
        },
        {
            path: prefix_url + '/branch/offer/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/branch/offer/npa', element: <ProposeForApprovalBranchOfferNPA /> }]
        },
        {
            path: prefix_url + '/branch/prepare/npl',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/branch/prepare/npl', element: <BranchPrepareNpl /> }]
        },
        {
            path: prefix_url + '/branch/prepare/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/branch/prepare/npa', element: <BranchPrepareNpa /> }]
        },
        {
            path: prefix_url + '/committee/prepare-list/npl',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/committee/prepare-list/npl', element: <CommitteePrepareNpl /> }]
        },
        {
            path: prefix_url + '/committee/prepare-list/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/committee/prepare-list/npa', element: <CommitteePrepareNpa /> }]
        },
        {
            path: prefix_url + '/committee/waiting-list/npl',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/committee/waiting-list/npl', element: <CommitteeWaitingNpl /> }]
        },
        {
            path: prefix_url + '/committee/waiting-list/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/committee/waiting-list/npa', element: <CommitteeWaitingNpa /> }]
        },
        {
            path: prefix_url + '/committee/update-list/npl',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/committee/update-list/npl', element: <CommitteeUpdateNpl /> }]
        },
        {
            path: prefix_url + '/committee/update-list/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/committee/update-list/npa', element: <CommitteeUpdateNpa /> }]
        },
        {
            path: prefix_url + '/approval/make-petition/npl',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/approval/make-petition/npl', element: <ApprovalMakePetitionNpl /> }]
        },
        {
            path: prefix_url + '/approval/make-petition/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/approval/make-petition/npa', element: <ApprovalMakePetitionNpa /> }]
        },
        {
            path: prefix_url + '/approval/make-branch-petition/npl',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/approval/make-branch-petition/npl', element: <ApprovalMakePetitionBranchNpl /> }]
        },
        {
            path: prefix_url + '/approval/make-branch-petition/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/approval/make-branch-petition/npa', element: <ApprovalMakePetitionBranchNpa /> }]
        },
        {
            path: prefix_url + '/approval/disbursement-status/npl',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/approval/disbursement-status/npl', element: <ApprovalDisbursementStatusNpl /> }]
        },
        {
            path: prefix_url + '/approval/disbursement-status/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/approval/disbursement-status/npa', element: <ApprovalDisbursementStatusNpa /> }]
        },
        {
            path: prefix_url + '/approval/additional-action/npl',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/approval/additional-action/npl', element: <ApprovalAdditionalActionNpl /> }]
        },
        {
            path: prefix_url + '/approval/additional-action/npa',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/approval/additional-action/npa', element: <ApprovalAdditionalActionNpa /> }]
        },
        {
            path: prefix_url + '/close',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/close', element: <Close /> }]
        },
        {
            path: prefix_url + '/report',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/report', element: <Report /> }]
        },
        {
            path: prefix_url + '/report/asset',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/report/asset', element: <ReportAsset /> }]
        },
        {
            path: prefix_url + '/report/restruct',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/report/restruct', element: <ReportRestruct /> }]
        },
        {
            path: prefix_url + '/report/postpone',
            element: <VerticalLayout />,
            children: [{ path: prefix_url + '/report/postpone', element: <ReportPostpone /> }]
        },
        {
            path: prefix_url + '/version',
            element: <BlankLayout />,
            children: [{ path: prefix_url + '/version', element: <Version /> }]
        },
        {
            path: prefix_url + '*',
            element: <BlankLayout />,
            children: [{ path: prefix_url + '*', element: <Error /> }]
        },
    ])
    return routes
}
export default Router