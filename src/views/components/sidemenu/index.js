// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { PieChart } from 'react-feather'
import { Link } from "react-router-dom"
import moment from 'moment';
// ** Third Party Components
// import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  getAlertSide,
} from "@src/services/api";

// ** Utils
import { getUserData } from '@utils'
const prefix_url = process.env.ENVIRONMENT == 'uat' ? '/uat' : ''
const Sidebar = props => {
  const user = getUserData();
  const branchList = [1,4]; // [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
  const officeList = [1,2,3,5,6,7,8,9,10,11,12,13,14];
  const importList = [1,2,4,7,8,9];
  // ** Props
  const { menuCollapsed,setMenuCollapsed, menuVisibility, windowWidth } = props
  const path = window.location.pathname
  const [alert, setAlert] = useState(null);
  const handleHide = async(flag) => {
    await setMenuCollapsed(flag);
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAlertSide();
        if (result.isSuccess) {
          setAlert(result.data);
        }
      } catch(e) {
        console.error('error', e);
      }
    };
    fetchData();
  }, [path])
  useEffect(() => {
    async function fetchData() {
      try {
        if (!alert || moment().diff(moment(alert?.updateDate), 'minutes') > 5) {
          const result = await getAlertSide();
          if (result.isSuccess) {
            setAlert(result.data);
          }
        }
      } catch(e) {
        console.error('error', e);
      }
    };
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [alert])
  return (
    <Fragment>
      <nav className={`navbar navbar-vertical navbar-expand-lg ${(windowWidth < 992 && !menuVisibility) ? "d-none" : ""}`} style={{ position: 'fixed', backgroundColor: 'transparent' }}>
        <div className="collapse navbar-collapse" id="navbarVerticalCollapse" style={{ backgroundColor: '#ffffff' }}>
          {/* scrollbar removed*/}
          <div className="navbar-vertical-content">
            <ul className="navbar-nav flex-column" id="navbarVerticalNav">
              {/* หัวข้อ การจัดการหนี้*/}
              <li className="nav-item">
                {/* label*/}
                <p className="navbar-vertical-label">การจัดการหนี้</p>
                {/* parent pages จัดทำรายชื่อเกษตรกร*/}
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/debt') ? 'active' : ''}`}  href="#nv-MakeList" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-MakeList">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper"><span className="fas fa-caret-right dropdown-indicator-icon"></span></div><span className="nav-link-icon"><span className="far fa-address-book"></span></span><span className="nav-link-text">จัดทำรายชื่อเกษตรกร</span>
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-MakeList">
                      <li className="collapsed-nav-item-title d-none">จัดทำรายชื่อเกษตรกร</li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path == '/debt' || path == '/' ? 'active' : ''}`} to={`${prefix_url + "/debt"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">NPL</span></div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path == '/debt/npa' ? 'active' : ''}`} to={`${prefix_url + "/debt/npa"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">NPA</span></div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* parent pages จำแนกมูลหนี้*/}
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/classify') ? 'active' : ''}`} href="#nv-ClassifyDebt" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-ClassifyDebt">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon">
                        <i className="fas fa-file-signature"></i>
                      </span>
                      <span className="nav-link-text">จำแนกมูลหนี้</span>
                      {(alert && alert?.classify && alert.classify.total > 0) && (
                        <span className="badge ms-2 badge badge-phoenix badge-phoenix-danger nav-link-badge">{numberWithCommas(alert.classify.total)}</span>
                      )}
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-ClassifyDebt">
                      <li className="collapsed-nav-item-title d-none">จำแนกมูลหนี้
                      </li>
                      {importList.includes(user?.role) && (
                        <li className="nav-item">
                          <Link className={`nav-link ${path == '/classify/import' ? 'active' : ''}`} to={`${prefix_url + "/classify/import"}`}>
                            <div className="d-flex align-items-center"><span className="nav-link-text">นำไฟล์เข้าระบบ</span></div>
                          </Link>
                          {/* more inner pages*/}
                        </li>
                      )}
                      <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/classify/search') ? 'active' : ''}`} href="#nv-Search" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-Search">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">ค้นหา</span>
                            {(alert && alert?.classify && alert.classify.search?.total > 0) && (
                              <span className="badge ms-2 badge badge-phoenix badge-phoenix-danger nav-link-badge">{numberWithCommas(alert.classify.search?.total)}</span>
                            )}
                          </div>
                        </a>
                        {/* more inner pages*/}
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-Search">
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/classify/searchNPL') ? 'active' : ''}`} to={`${prefix_url + "/classify/searchNPL"}`}>
                                <div className="d-flex align-items-center">
                                  <span className="nav-link-text">NPL</span>
                                  {(alert && alert?.classify && alert.classify.search?.npl > 0) && (
                                    <span className="badge ms-2 badge badge-phoenix badge-phoenix-danger nav-link-badge">{numberWithCommas(alert.classify.search?.npl)}</span>
                                  )}
                                </div>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/classify/searchNPA') ? 'active' : ''}`} to={`${prefix_url + "/classify/searchNPA"}`}>
                                <div className="d-flex align-items-center">
                                  <span className="nav-link-text">NPA</span>
                                  {(alert && alert?.classify && alert.classify.search?.npa > 0) && (
                                    <span className="badge ms-2 badge badge-phoenix badge-phoenix-danger nav-link-badge">{numberWithCommas(alert.classify.search?.npa)}</span>
                                  )}
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* parent pages เสนอขออนุมัติรายชื่อ*/}
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/branch') ? 'active' : ''}`} href="#nv-ProposeForApproval" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-ProposeForApproval">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon">
                        <i className="fas fa-file-invoice"></i>
                      </span>
                      <span className="nav-link-text">เสนอขออนุมัติรายชื่อ</span>
                    {(alert && alert?.branch && alert.branch.total > 0) && (
                      <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.branch.total)}</span>
                    )}
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-ProposeForApproval">
                      <li className="collapsed-nav-item-title d-none">เสนอขออนุมัติรายชื่อ</li>
                      <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/branch/offer') ? 'active' : ''}`} href="#nv-BranchOffer" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-BranchOffer">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">สาขาเสนอ</span>
                            {(alert && alert?.branch && alert.branch.request?.total > 0) && (
                              <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.branch.request?.total)}</span>
                            )}
                          </div>
                        </a>
                        {/* more inner pages*/}
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-BranchOffer">
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/branch/offer/npl') ? 'active' : ''}`} to={`${prefix_url + "/branch/offer/npl"}`}>
                                <div className="d-flex align-items-center">
                                  <span className="nav-link-text">NPL</span>
                                  {(alert && alert?.branch && alert.branch.request?.npl > 0) && (
                                    <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.branch.request?.npl)}</span>
                                  )}
                                </div>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/branch/offer/npa') ? 'active' : ''}`} to={`${prefix_url + "/branch/offer/npa"}`}>
                                <div className="d-flex align-items-center">
                                  <span className="nav-link-text">NPA</span>
                                  {(alert && alert?.branch && alert.branch.request?.npa > 0) && (
                                    <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.branch.request?.npa)}</span>
                                  )}
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/branch/prepare') ? 'active' : ''}`} href="#nv-PrepareForPresent" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-PrepareForPresent">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">รวบรวมเตรียมนำเสนอ</span>
                            {(alert && alert?.branch && alert.branch.prepare?.total > 0) && (
                              <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.branch.prepare?.total)}</span>
                            )}
                          </div>
                        </a>
                        {/* more inner pages*/}
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-PrepareForPresent">
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/branch/prepare/npl') ? 'active' : ''}`} to={`${prefix_url + "/branch/prepare/npl"}`}>
                                <div className="d-flex align-items-center">
                                  <span className="nav-link-text">NPL</span>
                                  {(alert && alert?.branch && alert.branch.prepare?.npl > 0) && (
                                    <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.branch.prepare?.npl)}</span>
                                  )}
                                </div>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/branch/prepare/npa') ? 'active' : ''}`} to={`${prefix_url + "/branch/prepare/npa"}`}>
                                <div className="d-flex align-items-center">
                                  <span className="nav-link-text">NPA</span>
                                  {(alert && alert?.branch && alert.branch.prepare?.npa > 0) && (
                                    <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.branch.prepare?.npa)}</span>
                                  )}
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* parent pages เสนอคณะกรรมการจัดการหนี้*/}
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/committee') ? 'active' : ''}`}  href="#nv-ProposeCommittee" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-ProposeCommittee">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon">
                        <i className="fab fa-readme"></i>
                      </span>
                      <span className="nav-link-text">เสนอคณะกรรมการจัดการหนี้</span>
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-ProposeCommittee">
                      <li className="collapsed-nav-item-title d-none">เสนอคณะกรรมการจัดการหนี้</li>
                      <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/committee/prepare-list') ? 'active' : ''}`} href="#nv-ProposeCommitteePrepareList" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-ProposeCommitteePrepareList">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">จัดทำรายชื่อเสนอ</span>
                          </div>
                        </a>
                        {/* more inner pages*/}
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-ProposeCommitteePrepareList">
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/committee/prepare-list/npl') ? 'active' : ''}`} to={`${prefix_url + "/committee/prepare-list/npl"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPL</span></div>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/committee/prepare-list/npa') ? 'active' : ''}`} to={`${prefix_url + "/committee/prepare-list/npa"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPA</span></div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                      {/* more inner pages *  /}
                      <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/committee/waiting-list') ? 'active' : ''}`} href="#nv-ProposeCommitteeWaitingList" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-ProposeCommitteeWaitingList">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">รายชื่อรอเสนอ</span>
                          </div>
                        </a>
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-ProposeCommitteeWaitingList">
                            <li className="nav-item">
                              <a className={`nav-link ${path.includes('/committee/waiting-list/npl') ? 'active' : ''}`} href="/committee/waiting-list/npl">
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPL</span>
                                </div>
                              </a>
                            </li>
                            <li className="nav-item">
                              <a className={`nav-link ${path.includes('/committee/waiting-list/npa') ? 'active' : ''}`} href="/committee/waiting-list/npa">
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPA</span>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </li>
                      */}
                      <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/committee/update-list') ? 'active' : ''}`} href="#nv-ProposeCommitteeUpdateList" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-ProposeCommitteeUpdateList">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">ปรับปรุงรายชื่อ</span>
                          </div>
                        </a>
                        {/* more inner pages*/}
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-ProposeCommitteeUpdateList">
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/committee/update-list/npl') ? 'active' : ''}`} to={`${prefix_url + "/committee/update-list/npl"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPL</span></div>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/committee/update-list/npa') ? 'active' : ''}`} to={`${prefix_url + "/committee/update-list/npa"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPA</span></div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* parent pages สาขาตรวจสอบยืนยันยอด*/}
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/confirm-committee') ? 'active' : ''}`}  href="#nv-ConfirmCommittee" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-ConfirmCommittee">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon">
                        <i className="fas fa-clipboard-check"></i>
                      </span>
                      <span className="nav-link-text">ยืนยันยอด</span>
                      {(alert && alert?.confirm && alert.confirm.total > 0) && (
                        <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.confirm.total)}</span>
                      )}
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-ConfirmCommittee">
                      <li className="collapsed-nav-item-title d-none">สาขายืนยันยอด</li>
                      <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/confirm-committee/prepare-list') ? 'active' : ''}`} href="#nv-ConfirmCommitteePrepareList" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-ConfirmCommitteePrepareList">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">สาขายืนยันยอด</span>
                          </div>
                        </a>
                        {/* more inner pages*/}
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-ConfirmCommitteePrepareList">
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/confirm-committee/prepare-list/npl') ? 'active' : ''}`} to={`${prefix_url + "/confirm-committee/prepare-list/npl"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPL</span></div>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/confirm-committee/prepare-list/npa') ? 'active' : ''}`} to={`${prefix_url + "/confirm-committee/prepare-list/npa"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPA</span></div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/confirm-committee/confirm-list') ? 'active' : ''}`} href="#nv-ConfirmCommitteeConfirmList" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-ConfirmCommitteeConfirmList">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">รวบรวมยืนยันยอด</span>
                            {(alert && alert?.confirm && alert.confirm.list?.total > 0) && (
                              <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.confirm.list?.total)}</span>
                            )}
                          </div>
                        </a>
                        {/* more inner pages*/}
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-ConfirmCommitteeConfirmList">
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/confirm-committee/confirm-list/npl') ? 'active' : ''}`} to={`${prefix_url + "/confirm-committee/confirm-list/npl"}`}>
                                <div className="d-flex align-items-center">
                                  <span className="nav-link-text">NPL</span>
                                  {(alert && alert?.confirm && alert.confirm.list?.npl > 0) && (
                                    <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.confirm.list?.npl)}</span>
                                  )}
                                </div>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/confirm-committee/confirm-list/npa') ? 'active' : ''}`} to={`${prefix_url + "/confirm-committee/confirm-list/npa"}`}>
                                <div className="d-flex align-items-center">
                                  <span className="nav-link-text">NPA</span>
                                  {(alert && alert?.confirm && alert.confirm.list?.npa > 0) && (
                                    <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.confirm.list?.npa)}</span>
                                  )}
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* parent pages ขออนุมัติชำระหนี้แทน*/}
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/approval') ? 'active' : ''}`}  href="#nv-RequestApprovalPay" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-RequestApprovalPay">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon">
                        <i className="fas fa-money-check-alt"></i>
                      </span>
                      <span className="nav-link-text">ขออนุมัติชำระหนี้แทน</span>
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-RequestApprovalPay">
                      <li className="collapsed-nav-item-title d-none">ขออนุมัติชำระหนี้แทน
                      </li>
                      
                      {(user && officeList.includes(user.role)) && (
                        <li className="nav-item">
                          <a className={`nav-link dropdown-indicator ${path.includes('/approval/make-petition') ? 'active' : ''}`} href="#nv-RequestApprovalPayMakePetition" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-RequestApprovalPayMakePetition">
                            <div className="d-flex align-items-center">
                              <div className="dropdown-indicator-icon-wrapper">
                                <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                              </div>
                              <span className="nav-link-text">จัดทำฎีกา</span>
                            </div>
                          </a>
                          {/* more inner pages*/}
                          <div className="parent-wrapper">
                            <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-RequestApprovalPayMakePetition">
                              <li className="nav-item">
                                <Link className={`nav-link ${path.includes('/approval/make-petition/npl') ? 'active' : ''}`} to={`${prefix_url + "/approval/make-petition/npl"}`}>
                                  <div className="d-flex align-items-center"><span className="nav-link-text">NPL</span></div>
                                </Link>
                              </li>
                              <li className="nav-item">
                                <Link className={`nav-link ${path.includes('/approval/make-petition/npa') ? 'active' : ''}`} to={`${prefix_url + "/approval/make-petition/npa"}`}>
                                  <div className="d-flex align-items-center"><span className="nav-link-text">NPA</span></div>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </li>
                      )}
                      {(user && branchList.includes(user.role)) && (
                        <li className="nav-item">
                          <a className={`nav-link dropdown-indicator ${path.includes('/approval/make-branch-petition') ? 'active' : ''}`} href="#nv-RequestApprovalPayMakePetitionBranch" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-RequestApprovalPayMakePetitionBranch">
                            <div className="d-flex align-items-center">
                              <div className="dropdown-indicator-icon-wrapper">
                                <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                              </div>
                              <span className="nav-link-text">จัดทำฎีกา (สาขา){/*`${officeList.includes(user.role) ? '' : ''}`*/}</span>
                            </div>
                          </a>
                          {/* more inner pages*/}
                          <div className="parent-wrapper">
                            <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-RequestApprovalPayMakePetitionBranch">
                              <li className="nav-item">
                                <Link className={`nav-link ${path.includes('/approval/make-branch-petition/npl') ? 'active' : ''}`} to={`${prefix_url + "/approval/make-branch-petition/npl"}`}>
                                  <div className="d-flex align-items-center"><span className="nav-link-text">NPL</span></div>
                                </Link>
                              </li>
                              <li className="nav-item">
                                <Link className={`nav-link ${path.includes('/approval/make-branch-petition/npa') ? 'active' : ''}`} to={`${prefix_url + "/approval/make-branch-petition/npa"}`}>
                                  <div className="d-flex align-items-center"><span className="nav-link-text">NPA</span></div>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </li>
                      )}
                      <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/approval/disbursement-status') ? 'active' : ''}`} href="#nv-RequestApprovalPayDisbursementStatus" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-RequestApprovalPayDisbursementStatus">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">สถานะเบิกจ่าย</span>
                          </div>
                        </a>
                        {/* more inner pages*/}
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-RequestApprovalPayDisbursementStatus">
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/approval/disbursement-status/npl') ? 'active' : ''}`} to={`${prefix_url + "/approval/disbursement-status/npl"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPL</span></div>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/approval/disbursement-status/npa') ? 'active' : ''}`} to={`${prefix_url + "/approval/disbursement-status/npa"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPA</span></div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                      {/* <li className="nav-item">
                        <a className={`nav-link dropdown-indicator ${path.includes('/approval/additional-action') ? 'active' : ''}`} href="#nv-RequestApprovalPayAdditionalActions" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-RequestApprovalPayAdditionalActions">
                          <div className="d-flex align-items-center">
                            <div className="dropdown-indicator-icon-wrapper">
                              <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                            </div>
                            <span className="nav-link-text">การดำเนินการเพิ่มเติม</span>
                          </div>
                        </a>
                        <div className="parent-wrapper">
                          <ul className="nav collapse parent" data-bs-parent="#e-commerce" id="nv-RequestApprovalPayAdditionalActions">
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/approval/additional-action/npl') ? 'active' : ''}`} to={`${prefix_url + "/approval/additional-action/npl"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPL</span></div>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className={`nav-link ${path.includes('/approval/additional-action/npa') ? 'active' : ''}`} to={`${prefix_url + "/approval/additional-action/npa"}`}>
                                <div className="d-flex align-items-center"><span className="nav-link-text">NPA</span>
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li> */}
                    </ul>
                  </div>
                </div>
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/legal-contract') ? 'active' : ''}`}  
                    href="#nv-LegalContract" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-LegalContract">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon">
                        <i className="fas fa-money-check"></i>
                      </span>
                      <span className="nav-link-text">นิติกรรมสัญญา</span>
                      {(alert && alert?.legal && alert.legal.total > 0) && (
                        <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.legal.total)}</span>
                      )}
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-LegalContract">
                      <li className="collapsed-nav-item-title d-none">นิติกรรมสัญญา</li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/legal-contract/prepare-legal-contract') ? 'active' : ''}`}
                          to={`${prefix_url + "/legal-contract/prepare-legal-contract"}`}>
                          <div className="d-flex align-items-center">
                            <span className="nav-link-text">จัดทำนิติกรรม</span>
                          </div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/legal-contract/send-legal-contract') ? 'active' : ''}`} 
                          to={`${prefix_url + "/legal-contract/send-legal-contract"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">จัดส่งนิติกรรม</span></div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/legal-contract/check-legal-contract') ? 'active' : ''}`}
                          to={`${prefix_url + "/legal-contract/check-legal-contract"}`}>
                          <div className="d-flex align-items-center">
                            <span className="nav-link-text">ตรวจสอบนิติกรรม</span>
                            {(alert && alert?.legal && alert.legal.checking > 0) && (
                              <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.legal.checking)}</span>
                            )}
                          </div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/legal-contract/manage-legal-contract') ? 'active' : ''}`}
                          to={`${prefix_url + "/legal-contract/manage-legal-contract"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">บริหารสินทรัพย์</span>
                          {(alert && alert?.legal && alert.legal.asset > 0) && (
                            <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.legal.asset)}</span>
                          )}
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/guarantee') ? 'active' : ''}`}  
                    href="#nv-Guarantee" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-Guarantee">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon">
                        <i className="fas fa-landmark"></i>
                      </span>
                      <span className="nav-link-text">หลักประกัน</span>
                      {(alert && alert?.collateral && (alert.collateral.total - alert.collateral.borrow) > 0) && (
                        <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.collateral.total-alert.collateral.borrow)}</span>
                      )}
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-Guarantee">
                      <li className="collapsed-nav-item-title d-none">หลักประกัน</li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/guarantee/prepare-guarantee') ? 'active' : ''}`}
                          to={`${prefix_url + "/guarantee/prepare-guarantee"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">ทะเบียนคุมหลักประกัน</span>
                          {(alert && alert?.collateral && alert.collateral.registration) > 0 && (
                            <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.collateral.registration)}</span>
                          )}
                          </div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/guarantee/check-guarantee') ? 'active' : ''}`}
                          to={`${prefix_url + "/guarantee/check-guarantee"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">ตรวจสอบหลักประกัน</span>
                          {(alert && alert?.collateral && alert.collateral.checking > 0) && (
                            <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.collateral.checking)}</span>
                          )}
                          </div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/guarantee/manage-guarantee') ? 'active' : ''}`}
                          to={`${prefix_url + "/guarantee/manage-guarantee"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">บริหารสินทรัพย์</span>
                          {(alert && alert?.collateral && alert.collateral.asset > 0) && (
                            <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.collateral.asset)}</span>
                          )}
                          </div>
                        </Link>
                      </li>
                      {/* 
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/guarantee/operation-guarantee') ? 'active' : ''}`}
                          to={`${prefix_url + "/guarantee/operation-guarantee"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">การดำเนินการในที่ดิน</span>
                          </div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/guarantee/borrow-guarantee') ? 'active' : ''}`}
                          to={`${prefix_url + "/guarantee/borrow-guarantee"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">ยืม-คืนโฉนด</span>
                          {(alert && alert?.collateral && alert.collateral.borrow > 0) && (
                            <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.collateral.borrow)}</span>
                          )}
                          </div>
                        </Link>
                      </li> 
                      */}
                    </ul>
                  </div>
                </div>
              </li>
              <li className="nav-item">
                <p className="navbar-vertical-label">บัญชีลูกหนี้</p>
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/account/operation-land') ? 'active' : ''}`}  
                    href="#nv-OperationLand" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-OperationLand">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon"><i className="fas fa-landmark-flag"></i></span>
                      <span className="nav-link-text">การดำเนินการ</span>
                      {(alert && alert?.collateral && alert.collateral.borrow > 0) && (
                        <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.collateral.borrow)}</span>
                      )}
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-OperationLand">
                      <li className="collapsed-nav-item-title d-none">การดำเนินการในที่ดิน</li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/account/operation-land/operation') ? 'active' : ''}`}
                          to={`${prefix_url + "/account/operation-land/operation"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">การดำเนินการในที่ดิน</span></div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/account/operation-land/borrow') ? 'active' : ''}`}
                          to={`${prefix_url + "/account/operation-land/borrow"}`}>
                          <div className="d-flex align-items-center">
                            <span className="nav-link-text">การยืม-คืนโฉนด</span>
                            {(alert && alert?.collateral && alert.collateral.borrow > 0) && (
                              <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.collateral.borrow)}</span>
                            )}
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="nav-item-wrapper">
                  <Link className={`nav-link label-1 ${path.includes('/account/reimbursement') ? 'active' : ''}`}
                    to={`${prefix_url + "/account/reimbursement"}`}>
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><span className="fas fa-donate"></span></span>
                      <div className="nav-link-text-wrapper">
                        <span className="nav-link-text">การชำระเงินคืน</span>
                        {(alert && alert?.pay > 0) && (
                          <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.pay)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/account/adjust') ? 'active' : ''}`}  
                    href="#nv-AccountsReceivable" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-AccountsReceivable">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon"><i className="fas fa-retweet"></i></span>
                      <span className="nav-link-text">การปรับปรุงหนี้</span>
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-AccountsReceivable">
                      <li className="collapsed-nav-item-title d-none">การปรับปรุงหนี้</li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/account/adjust/receivable-debt') ? 'active' : ''}`}
                          to={`${prefix_url + "/account/adjust/receivable-debt"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">รายการรับชำระ</span></div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/account/adjust/not-valid') ? 'active' : ''}`}
                          to={`${prefix_url + "/account/adjust/not-valid"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">เงินไม่เข้าบัญชีกองทุน</span></div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="nav-item-wrapper">
                  <Link className={`nav-link ${path.includes('/account/following') ? 'active' : ''}`}
                    to={`${prefix_url + "/account/following"}`}>
                    <div className="d-flex align-items-center"><div className="nav-link-icon"><span className="fas fa-file-invoice-dollar"></span></div><div className="nav-link-text-wrapper"><span className="nav-link-text">การติดตามชำระหนี้คืน</span></div>
                    </div>
                  </Link>
                </div>
                <div className="nav-item-wrapper">
                  <Link className={`nav-link ${path.includes('/account/invoice') ? 'active' : ''}`}
                    to={`${prefix_url + "/account/invoice"}`}>
                    <div className="d-flex align-items-center"><span className="nav-link-icon"><i className="fas fa-receipt"></i></span>
                    <div className="nav-link-text-wrapper">
                      <span className="nav-link-text">ออกใบแจ้งหนี้</span>
                      {(alert && alert?.receipt > 0) && (
                        <span className="badge ms-2 badge badge-phoenix badge-phoenix-warning nav-link-badge">{numberWithCommas(alert.receipt)}</span>
                      )}
                    </div>
                    </div>
                  </Link>
                </div>
                <div className="nav-item-wrapper">
                  <Link className={`nav-link ${path.includes('/account/debt-acknowledgment') ? 'active' : ''}`}
                    to={`${prefix_url + "/account/debt-acknowledgment"}`}>
                    <div className="d-flex align-items-center"><span className="nav-link-icon"><i className="far fa-address-book"></i></span>
                    <div className="nav-link-text-wrapper">
                      <span className="nav-link-text">หนังสือรับสภาพหนี้</span>
                      {(alert && alert?.instead > 0) && (
                        <span className="badge ms-2 badge badge-phoenix badge-phoenix-danger nav-link-badge">{numberWithCommas(alert.instead)}</span>
                      )}
                    </div>
                    </div>
                  </Link>
                </div>
                <div className="nav-item-wrapper">
                  <Link className={`nav-link label-1 ${path.includes('/account/debt-accept') ? 'active' : ''}`}
                    to={`${prefix_url + "/account/debt-accept"}`}>
                    <div className="d-flex align-items-center"><span className="nav-link-icon"><i className="fas fa-address-book"></i></span><div className="nav-link-text-wrapper"><span className="nav-link-text">หนังสือรับสภาพบังคับ</span></div>
                    {(alert && alert?.force > 0) && (
                      <span className="badge ms-2 badge badge-phoenix badge-phoenix-danger nav-link-badge">{numberWithCommas(alert.force)}</span>
                    )}
                    </div>
                  </Link>
                </div>
                <div className="nav-item-wrapper">
                  <Link className={`nav-link label-1 ${path.includes('/account/debt-restructuring') ? 'active' : ''}`}
                    to={`${prefix_url + "/account/debt-restructuring"}`}>
                    <div className="d-flex align-items-center"><span className="nav-link-icon"><i className="fas fa-recycle"></i></span><div className="nav-link-text-wrapper"><span className="nav-link-text">ปรับโครงสร้างหนี้</span></div>
                    {(alert && alert?.restruct > 0) && (
                      <span className="badge ms-2 badge badge-phoenix badge-phoenix-danger nav-link-badge">{numberWithCommas(alert.restruct)}</span>
                    )}
                    </div>
                  </Link>
                </div>
              </li>
              <li className="nav-item">
                <p className="navbar-vertical-label">ปิดสัญญา</p>
                <div className="nav-item-wrapper">
                  <Link className={`nav-link label-1 ${path.includes('/close') ? 'active' : ''}`}
                    to={`${prefix_url + "/close"}`}>
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="fas fa-file-excel"></i></span>
                      <div className="nav-link-text-wrapper">
                        <span className="nav-link-text">ปิดสัญญา</span>
                        {(alert && alert?.closing > 0) && (
                          <span className="badge ms-2 badge badge-phoenix badge-phoenix-danger nav-link-badge">{numberWithCommas(alert.closing)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </li>
              {/* หัวข้อ รายงาน*/}
              <li className="nav-item">
                {/* label*/}
                <p className="navbar-vertical-label">รายงาน</p>
                {/* parent pages รายงาน*/}
                <div className="nav-item-wrapper">
                  <a className={`nav-link dropdown-indicator label-1 ${path.includes('/report') ? 'active' : ''}`} href="#nv-Report" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-Report">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon-wrapper">
                        <span className="fas fa-caret-right dropdown-indicator-icon"></span>
                      </div>
                      <span className="nav-link-icon"><PieChart size={16} /></span>
                      <span className="nav-link-text">รายงาน</span>
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-Report">
                      <li className="collapsed-nav-item-title d-none">รายงาน</li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/report/manage') ? 'active' : ''}`} to={`${prefix_url + "/report/manage"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">จัดการหนี้</span></div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/report/asset') ? 'active' : ''}`} to={`${prefix_url + "/report/asset"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">บริหารสินทรัพย์</span></div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/report/restruct') ? 'active' : ''}`} to={`${prefix_url + "/report/restruct"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">ปรับโครงสร้างหนี้ฯ</span></div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${path.includes('/report/postpone') ? 'active' : ''}`} to={`${prefix_url + "/report/postpone"}`}>
                          <div className="d-flex align-items-center"><span className="nav-link-text">ชะลอหนี้</span></div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-vertical-footer">
          <button className="btn navbar-vertical-toggle border-0 fw-semibold w-100 white-space-nowrap d-flex align-items-center" onClick={() => handleHide(!menuCollapsed)}>
            <span className="uil uil-left-arrow-to-left fs-8"></span>
            <span className="uil uil-arrow-from-right fs-8"></span>
            <span className="navbar-vertical-footer-text ms-2">ซ่อนเมนู</span>
          </button>
        </div>
      </nav>
    </Fragment>
  )
}

export default Sidebar
