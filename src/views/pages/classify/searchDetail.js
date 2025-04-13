import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router"
import { useNavigate } from "react-router-dom";
import { getUserData } from "@utils";
import { 
  getDebtManagementDetailClassify,
} from "@services/api";

import According from "@views/components/panel/according";
import OrgTable from "@views/components/classify/orgTable";
import DebtTable from "@views/components/classify/debtTable";
import AlreadyTable from "@views/components/classify/alreadyTable";
import DebtManageTable from "@views/components/classify/debtManageTable";
import CollateralTable from "@views/components/classify/collateralTable";
import GuarantorTable from "@views/components/classify/guarantorTable";
import CombineModal from "@views/components/classify/combineModal";
import Modal from "@views/components/modal/fullModal";

const user = getUserData();
const SearchClassifyNPLDetail = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const qprov = searchParams.get("province");
  const qcreditorType = searchParams.get("creditor-type");
  const [debts, setDebts] = useState(null);
  const [collaterals, setCollaterals] = useState(null);
  const [guarantors, setGuarantors] = useState(null);
  const [total_collateral, setTotalColl] = useState(null);
  const [isOpenCombine, setOpenCombine] = useState(false);
  const [isOpenBorrow, setOpenBorrow] = useState(false);
  const [isOpenSplitNPL, setOpenSplitNPL] = useState(false);
  const [isOpenNPLDetail, setOpenNPLDetail] = useState(false);
  const [isOpenCancelCombine, setOpenCancelCombine] = useState(false);
  const [isOpenCancelSplit, setOpenCancelSplit] = useState(false);
  const navigate = useNavigate();
  const handleCombine = () => {
    setOpenCombine(true);
  }
  const handleSplit = () => {
    setOpenSplitNPL(true);
  }
  const handleShowDetail = () => {
    setOpenNPLDetail(true);
  }
  const handleCancelCombine = () => {
    setOpenCancelCombine(true);
  }
  const handleCancelSplit = () => {
    setOpenCancelSplit(true);
  }
  const fetchData = async() => {
    const result = await getDebtManagementDetailClassify(params.idcard, qprov, qcreditorType);
    console.log('debt', result)
    if (result.isSuccess) {
      setDebts(result.contracts)
      setCollaterals(result.collaterals)
      setGuarantors(result.guarantors)
      setTotalColl(result.total_collateral)
    } else {
      setDebts(null)
      setCollaterals(null)
      setGuarantors(null)
      setTotalColl(null)
    }
  }
  useEffect(() => {
    fetchData();
  },[])
  return (
    <>
      <div className="content">
        <h4 className="mb-3">จำแนกมูลหนี้ NPL</h4>
        <div className="mt-4">
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              {/*start ทะเบียนเกษตรกร + องค์กร*/}             
              <div className="mb-1">
                <According 
                  title={'ทะเบียนเกษตรกร + องค์กร'}
                  className={"my-4"}
                  children={(
                    <>
                      <OrgTable idcard={params.idcard} province={qprov} creditorType={qcreditorType} />
                    </>
                  )}
                />
              </div>
              {/*end ทะเบียนเกษตรกร + องค์กร*/}
              {/*start ทะเบียนหนี้*/}
              <div className="mb-1">
                <According 
                  title={'ทะเบียนหนี้'}
                  className={"my-4"}
                  children={(
                    <>
                      <DebtTable idcard={params.idcard} province={qprov} creditorType={qcreditorType} />
                    </>
                  )}
                />
              </div>
              {/*end ทะเบียนหนี้*/}
              {/*start ข้อมูลที่ได้รับการจัดการหนี้แล้ว */}
              <div className="mb-1">
                <According 
                  title={'ข้อมูลที่ได้รับการจัดการหนี้แล้ว'}
                  className={"my-4"}
                  children={(
                    <AlreadyTable idcard={params.idcard} province={qprov} creditorType={qcreditorType} />
                  )}
                />
              </div>
              {/*end ข้อมูลที่ได้รับการจัดการหนี้แล้ว */}   
              {/*start จัดการหนี้ */}
              <div className="mb-1">
                <According 
                  title={'จัดการหนี้'}
                  className={"my-4"}
                  children={(
                    <>
                      <div className="d-flex mb-3 flex-row-reverse">
                        <div>  
                          <button type="button" className="btn btn-info btn-sm ms-2" data-bs-toggle="modal" data-bs-target="#ModalDocuments" ><span className="far fa-file-alt"></span> เอกสารประกอบ</button>
                        </div>
                        <div>  
                          <button type="button" className="btn btn-warning btn-sm ms-2" data-bs-toggle="modal" data-bs-target="#ModalBorrower" ><span className="fas fa-users"></span> ผู้รับสภาพหนี้แทน</button>
                        </div>
                      </div>
                      <DebtManageTable data={debts} 
                        handleCombine={handleCombine} 
                        handleSplit={handleSplit} 
                        handleShowDetail={handleShowDetail} 
                        handleCancelCombine={handleCancelCombine} 
                        handleCancelSplit={handleCancelSplit} 
                      />
                      <br />
                      {(debts && debts.length > 0) && (
                        <h6>
                          <div className="d-flex">
                            <div className="flex-grow-1 ">รวม {debts.length} บัญชี จำนวนเงินกู้ {debts.reduce((sum,{frD_paymen_amount}) => sum + frD_paymen_amount,0)} บาท</div>
                            <div className="ms-3 square border border-1" style={{background: '#ddefff'}}></div>
                            <div className="ms-1">รวมสัญญา</div>
                            <div className="ms-3 square border border-1" style={{background: '#fdeae7'}}></div>
                            <div className="ms-1">แยกสัญญา</div>
                          </div>
                        </h6>
                      )}
                    </>
                  )}
                />
              </div>
              {/*end จัดการหนี้ */}  
              {/*start หลักทรัพย์ค้ำประกัน */}
              <div className="mb-1">
                <According 
                  title={'หลักทรัพย์ค้ำประกัน'}
                  className={"my-4"}
                  children={(
                    <>
                      <CollateralTable data={collaterals} />
                      <br />
                      {(collaterals && collaterals.length > 0) && (
                        <h6>
                          <div className="d-flex flex-column align-items-sm-start">
                            <div>รวม {collaterals.length} หลักทรัพย์ เนื้อที่รวม(ไร่-งาน-ตรว.) {total_collateral.area}</div>
                          </div>
                        </h6>
                      )}
                    </>
                  )}
                />
              </div>
              {/*end หลักทรัพย์ค้ำประกัน */}      
              {/*start บุคคลค้ำประกัน */}
              <div className="mb-1">
                <According 
                  title={'บุคคลค้ำประกัน'}
                  className={"my-4"}
                  children={(
                    <>
                      <GuarantorTable data={guarantors} />
                      <br />
                      {(guarantors && guarantors.length > 0) && (
                        <h6>
                          <div className="d-flex flex-column align-items-sm-start">
                            <div>รวม {guarantors.length} บุคคลค้ำประกัน</div>
                          </div>
                        </h6>
                      )}
                    </>
                  )}
                />
              </div>
              {/*end บุคคลค้ำประกัน */}

              {/*---------------modal-------------------*/}

              {/*start modal รวมสัญญา*/}
              <CombineModal isOpen={isOpenCombine} setModal={setOpenCombine} title={'รวมสัญญา'} onClose={() => setOpenCombine(false)} onOk={() => console.log('submit')} />
              {/*end modal รวมสัญญา*/}

              {/*start modal ผู้รับสภาพหนี้แทน*/}
              <div className="modal fade" id="ModalBorrower" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="ModalCombining">ผู้รับสภาพหนี้แทน</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="d-flex mb-3 flex-row-reverse">
                          <div>  <button type="button" className="btn btn-primary btn-sm ms-2" ><span className="fas fa-plus fs-8"></span> เพิ่มผู้รับสภาพหนี้แทน</button></div>
                        </div>
                        <div id="tableExample" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
                          <div className="table-responsive mx-n1 px-1">
                          <table className="table table-sm table-bordered fs-9 mb-0">
                          <thead className="align-middle text-center text-nowrap" style={{backgroundColor: '#d9fbd0',border: '#cdd0c7'}}>
                          <tr>
                          <th style={{ minWidth: 30 }}>#</th>
                          <th>สถานะผู้กู้</th>
                          <th>เลขบัตรประชาชน</th>
                          <th>คำนำหน้า</th>
                          <th>ชื่อ-นามสกุล</th>
                          <th>เบอร์โทรศัพท์</th>
                          <th>แก้ไขข้อมูล</th>
                          </tr>
                          </thead>
                          <tbody className="list text-center align-middle">
                          <tr>
                            <td>1</td>
                            <td>ผู้กู้</td>
                            <td>310xxxx95557</td>
                            <td>นาง</td>
                            <td>ต้อย แมมะ</td>
                            <td>089-xxxxxxx</td>
                            </tr>
                          <tr style={{backgroundColor: '#c2f9fc'}}>
                            <td>2</td>
                            <td>ผู้รับสภาพหนี้แทน</td>
                            <td>1234567891235</td>
                            <td>นาย</td>
                            <td>ทดลอง ทำดู</td>
                            <td>02-xxxxxxx</td>
                            <td><div className="d-flex justify-content-center"> <a className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0"><i className="far fa-edit "></i></a></div></td>
                          </tr>
                          </tbody>
                          </table>
                          </div>
                          </div>
                          <br />
                          <div className="row">
                            <div className=" col-sm-12 col-md-6 col-lg-3">
                              <div className=" input-group">
                                <select className="form-select" aria-label="Default select example">
                                  <option value="1" selected>ผู้กู้</option>
                                  <option value="2">ผู้รับสภาพหนี้</option>
                                </select>
                                <button className="btn btn-success" type="button">บันทึก</button>
                              </div>
                            </div>
                          </div>
                          {/*start card ผู้รับสภาพหนี้ */}
                          <div className="mb-1">
                            <div className="card shadow-none border my-4" data-component-card="data-component-card">
                              <div className="card-body p-0">
                                <div className="p-4 code-to-copy">
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="form-floating needs-validation">
                                        <select className="form-select" id="floatingSelectTeam">
                                          <option value="เสียชีวิต" selected="">เสียชีวิต</option>
                                          <option value="ผู้จัดการมรดก">ผู้จัดการมรดก</option>
                                          <option value="ติดคุก">ติดคุก</option>
                                          <option value="พิการ/ทุพพคลภาพ">พิการ/ทุพพคลภาพ</option>
                                          <option value="ขาดการติดต่อ">ขาดการติดต่อ</option>
                                          <option value="บุคคลค้ำประกัน">บุคคลค้ำประกัน</option>
                                          <option value="เจ้าของหลักประกัน">เจ้าของหลักประกัน</option>
                                          <option value="อื่นๆ">อื่นๆ</option>
                                        </select>
                                        <label for="floatingSelectTeam">เหตุผล</label>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">อื่นๆโปรดระบุ</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">เลขบัตรประชาชน</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">คำนำหน้า</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">ชื่อ</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">นามสกุล</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="flatpickr-input-container">
                                        <div className="form-floating">
                                          <input className="form-control datetimepicker" id="floatingInputStartDate" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                                          <label className="ps-6" for="floatingInputStartDate">วันเดือนปีเกิด
                                          </label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">บ้านเลขที่</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">บ้าน/ชุมชน</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">ซอย</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">ถนน</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">ตำบล/แขวง</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">อำเภอ/กิ่งอำเภอ/เขต</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="form-floating form-floating-advance-select mb-3">
                                        <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                        <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                          <option selected="ทั้งหมด">ทั้งหมด</option>
                                          <option>University of Chicago</option>
                                          <option>GSAS Open Labs At Harvard</option>
                                          <option>California Institute of Technology</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">รหัสไปรษณีย์</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">เบอร์โทรศัพท์</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text" id="Search_id_card">อีเมล</span>
                                        <input className="form-control" type="text" aria-label="ผู้รับสภาพหนี้แทน" />
                                      </div>
                                    </div>
                                  </div>  
                                  <br />
                                  <div className="d-flex justify-content-center ">
                                    <button className="btn btn-success" type="submit">บันทึก</button>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                          {/*end card ผู้รับสภาพหนี้ */}
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>              
                    </div>
                  </div>
                </div>
              </div>
              {/*end modal ผู้รับสภาพหนี้แทน*/}

              {/*start modal รายละเอียดจำแนกมูลหนี้ NPL ตามสัญญา*/}
              <div className="modal fade" id="ModalNPLDetail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="ModalCombining">รายละเอียดจำแนกมูลหนี้ NPL ตามสัญญา</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <form>
                            {/*///start รายละเอียดจัดการหนี้/// */}
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-header p-4 border-bottom bg-success-dark" >
                                        <div className="row g-3 justify-content-between align-items-center">
                                          <div className="col-12 col-md">
                                            <h4 className="text-secondary-subtle mb-0">จัดการหนี้ </h4>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="form-floating form-floating-advance-select mb-3">
                                                <label for="AutoNPLDetail">สถานะสัญญาจำแนกมูลหนี้</label>
                                                <select className="form-select" id="AutoNPLDetail" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                  <option value="ทะเบียนหนี้รอสอบยอด" selected>ทะเบียนหนี้รอสอบยอด</option>
                                                  <option value="อยู่ระหว่างการสอบยอด">อยู่ระหว่างการสอบยอด</option>
                                                  <option value="จำแนกมูลหนี้แล้ว">จำแนกมูลหนี้แล้ว</option>
                                                  <option value="หนี้ไม่เข้าหลักเกณฑ์">หนี้ไม่เข้าหลักเกณฑ์</option>
                                                  <option value="คณะกรรมการจัดการหนี้ไม่อนุมัติ">คณะกรรมการจัดการหนี้ไม่อนุมัติ</option>
                                                  <option value="ทะเบียนหนี้ซ้ำซ้อน">ทะเบียนหนี้ซ้ำซ้อน</option>
                                                  <option value="ปิดบัญชีกับกฟก.แล้ว">ปิดบัญชีกับกฟก.แล้ว</option>
                                                  <option value="เกษตรกรไม่ประสงค์ชำระหนี้แทน">เกษตรกรไม่ประสงค์ชำระหนี้แทน</option>
                                                  <option value="คุณสมบัติเกษตรกรไม่ถูกต้อง">คุณสมบัติเกษตรกรไม่ถูกต้อง</option>
                                                  <option value="ทะเบียนหนี้ไม่ถูกต้อง">ทะเบียนหนี้ไม่ถูกต้อง</option>
                                                  <option value="ชำระหนี้แทนแล้ว">ชำระหนี้แทนแล้ว</option>
                                                  <option value="เจ้าหนี้ไม่พบภาระหนี้/เกษตรกรปิดบัญชีเอง">เจ้าหนี้ไม่พบภาระหนี้/เกษตรกรปิดบัญชีเอง</option>
                                                  <option value="ข้อมูลไม่ถูกต้องครบถ้วน(สาขาเสนอขออนุมัติ)">ข้อมูลไม่ถูกต้องครบถ้วน(สาขาเสนอขออนุมัติ)</option>
                                                  <option value="รวมสัญญากับสัญญาอื่น">รวมสัญญากับสัญญาอื่น</option>
                                                  <option value="เจ้าหนี้ปิดกิจการ/ล้มละลาย">เจ้าหนี้ปิดกิจการ/ล้มละลาย</option>
                                                  <option value="ไม่ใช่เกษตรสมาชิกที่ขึ้นทะเบียนในจังหวัด">ไม่ใช่เกษตรสมาชิกที่ขึ้นทะเบียนในจังหวัด</option>
                                                  <option value="เจ้าหนี้ไม่เป็นไปตามที่กำหนด-ไม่ต้องตรวจสอบ">เจ้าหนี้ไม่เป็นไปตามที่กำหนด-ไม่ต้องตรวจสอบ</option>
                                                  <option value="เจ้าหนี้ไม่ยินยอมให้ตรวจสอบข้อมูลเกษตรกร">เจ้าหนี้ไม่ยินยอมให้ตรวจสอบข้อมูลเกษตรกร</option>
                                                  <option value="ติดต่อเกษตรกรไม่ได้">ติดต่อเกษตรกรไม่ได้</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">เลขที่สัญญา</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="ccol-sm-12 col-md-6 col-lg-4">
                                              <div className="form-floating form-floating-advance-select mb-3">
                                                <label for="floaTingLabelSingleSelect">ประเภทเจ้าหนี้</label>
                                                <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                  <option selected="ธกส" value="ธกส">ธกส</option>
                                                  <option value="ธนาคารพาณิชย์">ธนาคารพาณิชย์</option>
                                                  <option value="โครงการส่งเสริมของรัฐ">โครงการส่งเสริมของรัฐ</option>
                                                  <option value="นิติบุคคล">นิติบุคคล</option>
                                                  <option value="สหกรณ์">สหกรณ์</option>
                                                  <option value="ธนาคารของรัฐ">ธนาคารของรัฐ</option>s
                                                  <option value="บริษัท/โรงงานน้ำตาล">บริษัท/โรงงานน้ำตาล</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="form-floating form-floating-advance-select mb-3">
                                                <label for="floaTingLabelSingleSelect">สถาบันเจ้าหนี้</label>
                                                <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                  <option selected="A">A</option>
                                                  <option>B</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="form-floating form-floating-advance-select mb-3">
                                                <label for="floaTingLabelSingleSelect">จังหวัดเจ้าหนี้</label>
                                                <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                  <option selected="ทั้งหมด">ทั้งหมด</option>
                                                  <option>University of Chicago</option>
                                                  <option>GSAS Open Labs At Harvard</option>
                                                  <option>California Institute of Technology</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">สาขาเจ้าหนี้</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                              <div className="form-floating">
                                                <select className="form-select" id="floatingSelectPrivacy">
                                                  <option value="ตามจำนวนเงินที่กองทุนชำระหนี้แทน" selected>ตามจำนวนเงินที่กองทุนชำระหนี้แทน</option>
                                                  <option value="ต้นเงิน90%+ค่าใช้จ่าย">ต้นเงิน90%+ค่าใช้จ่าย</option>
                                                  <option value="ต้นเงิน50%+ค่าใช้จ่าย">ต้นเงิน50%+ค่าใช้จ่าย</option>
                                                  <option value="ต้นเงิน40%+ค่าใช้จ่าย">ต้นเงิน40%+ค่าใช้จ่าย</option>
                                                  <option value="ต้นเงิน30%+ค่าใช้จ่าย">ต้นเงิน30%+ค่าใช้จ่าย</option>
                                                  <option value="ต้นเงิน50%">ต้นเงิน50%</option>
                                                </select>
                                                <label for="floatingSelectPrivacy">เงื่อนไขชำระหนี้แทน</label>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">กฟก. ชำระเงินจำนวน</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                              <div className="form-floating">
                                                <select className="form-select" id="floatingSelectPrivacy">
                                                  <option value="ตามจำนวนเงินที่กองทุนชำระหนี้แทน" selected>ตามจำนวนเงินที่กองทุนชำระหนี้แทน</option>
                                                  <option value="ต้นเงิน90%+ค่าใช้จ่าย">ต้นเงิน90%+ค่าใช้จ่าย</option>
                                                  <option value="ต้นเงิน50%+ค่าใช้จ่าย">ต้นเงิน50%+ค่าใช้จ่าย</option>
                                                  <option value="ต้นเงิน40%+ค่าใช้จ่าย">ต้นเงิน40%+ค่าใช้จ่าย</option>
                                                  <option value="ต้นเงิน30%+ค่าใช้จ่าย">ต้นเงิน30%+ค่าใช้จ่าย</option>
                                                  <option value="ต้นเงิน50%">ต้นเงิน50%</option>
                                                </select>
                                                <label for="floatingSelectPrivacy">เงื่อนไขการทำสัญญา</label>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ยอดเงินที่ทำสัญญา</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                              <div className="form-floating">
                                                <select className="form-select" id="floatingSelectPrivacy">
                                                  <option value="ไม่มีการชดเชย" selected>ไม่มีการชดเชย</option>
                                                  <option value="ต้นเงิน50%">ต้นเงิน50%</option>
                                                  <option value="ต้นเงิน40%">ต้นเงิน40%</option>
                                                  <option value="ต้นเงิน50%+ดอกเบี้ย7.5">ต้นเงิน50%+ดอกเบี้ย7.5</option>
                                                </select>
                                                <label for="floatingSelectPrivacy">เงื่อนไขการชดเชย</label>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">จำนวนเงินที่ชดเชย</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                              <div className="form-floating form-floating-advance-select mb-3">
                                                <label for="floaTingLabelSingleSelect">สถานะหนี้</label>
                                                <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                  <option value="ปกติ" selected>ปกติ</option>
                                                  <option value="ผิดนัดชำระ" >ผิดนัดชำระ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                              <div className="form-floating">
                                                <select className="form-select" id="floatingSelectPrivacy">
                                                  <option value="เพื่อการเกษตร" selected>เพื่อการเกษตร</option>
                                                  <option value="ไม่เพื่อการเกษตร">ไม่เพื่อการเกษตร</option>
                                                  <option value="เพื่อการเกษตรและไม่เพื่อการเกษตร">เพื่อการเกษตรและไม่เพื่อการเกษตร</option>
                                                </select>
                                                <label for="floatingSelectPrivacy">วัตถุประสงค์</label>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">รายละเอียดวัตถุประสงค์</span>
                                                <textarea className="form-control" aria-label="With textarea"></textarea>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ต้นเงินคงค้าง</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ดอกเบี้ยคงค้าง</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ค่าปรับ</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ค่าใช้จ่ายในการดำเนินคดี</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ค่าถอนการยึดทรัพย์</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">รวมค่าใช้จ่าย</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" disabled/>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">รวมทั้งสิ้น</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" disabled/>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ราคาประเมิน</span>
                                                <input className="form-control" type="text" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์" />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="flatpickr-input-container">
                                                <div className="form-floating">
                                                  <input className="form-control datetimepicker" id="floatingInputStartDate" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                                                  <label className="ps-6" for="floatingInputStartDate">คำนวนเงิน ณ วันที่</label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="flatpickr-input-container">
                                                <div className="form-floating">
                                                  <input className="form-control datetimepicker" id="floatingInputStartDate" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                                                  <label className="ps-6" for="floatingInputStartDate">วันที่ทำสัญญา</label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="flatpickr-input-container">
                                                <div className="form-floating">
                                                  <input className="form-control datetimepicker" id="floatingInputStartDate" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                                                  <label className="ps-6" for="floatingInputStartDate">วันที่ผิดนัดชำระ</label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="form-floating">
                                                <select className="form-select" id="floatingSelectPrivacy">
                                                  <option value="ไม่มี" selected>ไม่มี</option>
                                                  <option value="ดำเนินคดี">ดำเนินคดี</option>
                                                  <option value="พิพากษา">พิพากษา</option>
                                                  <option value="บังคับคดี">บังคับคดี</option>
                                                </select>
                                                <label for="floatingSelectPrivacy">ดำเนินการทางกฎหมาย</label>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="flatpickr-input-container">
                                                <div className="form-floating">
                                                  <input className="form-control datetimepicker" id="floatingInputStartDate" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                                                  <label className="ps-6" for="floatingInputStartDate">วันที่ดำเนินการทางกฎหมาย</label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">หมายเหตุ</span>
                                                <textarea className="form-control" aria-label="รายละเอียดจำแนกมูลหนี้ NPL สหกรณ์"></textarea>
                                              </div>
                                            </div>
                                            <br />
                                            <div className="d-flex justify-content-center ">
                                              <button className="btn btn-success" type="submit">บันทึก</button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                            {/*///end รายละเอียดจัดการหนี้/// */}

                            {/*///start รายละเอียดหลักทรัพย์ค้ำประกัน/// */}
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-header p-4 border-bottom bg-success-dark" >
                                        <div className="row g-3 justify-content-between align-items-center">
                                          <div className="col-12 col-md">
                                            <h4 className="text-secondary-subtle mb-0">หลักทรัพย์ค้ำประกัน </h4>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <div className="d-flex mb-3 flex-row-reverse">
                                            <div>  <button type="button" className="btn btn-primary btn-sm ms-2" ><span className="fas fa-plus fs-8"></span> เพิ่มหลักประกัน</button></div>
                                          </div>
                                          <div id="tableExample" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
                                          <div className="table-responsive mx-n1 px-1">
                                          <table className="table table-sm table-bordered fs-9 mb-0">
                                            <thead className="align-middle text-center text-nowrap" style={{backgroundColor: '#d9fbd0',border: '#cdd0c7'}}>
                                              <tr>
                                              <th style={{ minWidth: 30 }}>#</th>
                                              <th>เลขที่สัญญา</th>
                                              <th>ประเภทหลักทรัพย์</th>
                                              <th>เลขที่ทะเบียน/โฉนด</th>
                                              <th>เนื้อที่ (ไร่-งาน-ตรว.)</th>
                                              <th>แก้ไขข้อมูล</th>
                                              <th>ลบข้อมูล</th>
                                              </tr>
                                            </thead>
                                            <tbody className="list text-center align-middle">
                                              <tr>
                                              <td>1</td>
                                              <td>1958</td>
                                              <td>โฉนด</td>
                                              <td>152</td>
                                              <td>1-1-200.50</td>
                                              <td><div className="d-flex justify-content-center"> <a className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" ><i className="far fa-edit"></i></a></div></td>
                                              <td><div className="d-flex justify-content-center"> <a className="btn btn-phoenix-secondary btn-icon fs-7 text-danger px-0" ><i className="fas fa-trash-alt"></i></a></div></td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          </div>
                                          </div>
                                          <br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="form-floating needs-validation">
                                                <select className="form-select" id="floatingSelectTeam">
                                                  <option value="โฉนด" selected>โฉนด</option>
                                                  <option value="ตราจอง">ตราจอง</option>
                                                  <option value="น.ส.3">น.ส.3</option>
                                                  <option value="น.ส.3 ก">น.ส.3 ก</option>
                                                  <option value="น.ส.3 ข">น.ส.3 ข</option>
                                                  <option value="ส.ป.ก.">ส.ป.ก.</option>
                                                  <option value="หนังสือแสดงกรรมสิทธิ์ห้องชุด">หนังสือแสดงกรรมสิทธิ์ห้องชุด</option>
                                                  <option value="ภ.ท.บ.5">ภ.ท.บ.5</option>
                                                  <option value="บ้าน">บ้าน</option>
                                                  <option value="สังหาริมทรัพย์">สังหาริมทรัพย์</option>
                                                  <option value="หุ้น">หุ้น</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                                <label for="floatingSelectTeam">เอกสารสิทธิ์</label>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="form-floating needs-validation">
                                                <select className="form-select" id="floatingSelectTeam">
                                                  <option value="โอนได้" selected>โอนได้</option>
                                                  <option value="โอนไม่ได้">โอนไม่ได้</option>
                                                </select>
                                                <label for="floatingSelectTeam">สถานะหลักทรัพย์</label>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-4">
                                              <div className="form-floating needs-validation">
                                                <select className="form-select" id="floatingSelectTeam">
                                                  <option value="ติดอายัติ(เจ้าหนี้อื่น)" selected>โอติดอายัติ(เจ้าหนี้อื่น)</option>
                                                  <option value="เจ้าของหลักประกันเสียชีวิต">เจ้าของหลักประกันเสียชีวิต</option>
                                                  <option value="ติดข้อกฎหมาย">ติดข้อกฎหมาย</option>
                                                  <option value="ติดจำนองเจ้าหนี้ร่วมของบุคคลอื่น">ติดจำนองเจ้าหนี้ร่วมของบุคคลอื่น</option>
                                                </select>
                                                <label for="floatingSelectTeam">เงื่อนไขโอนไม่ได้</label>
                                              </div>
                                            </div>
                                          </div>
                                          {/*start card รายละเอียดหลักทรัพย์ */}
                                          <div className="mb-1">
                                            <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                              <div className="card-body p-0">
                                                <div className="p-4 code-to-copy">
                                                  {/*start card รายละเอียดโฉนดที่ดิน */}
                                                  <h3 className="text-center">โฉนดที่ดิน</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">โฉนดที่ดิน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="form-floating form-floating-advance-select ">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ระวาง</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขที่ดิน</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หน้าสำรวจ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียดโฉนดที่ดิน */}

                                                  {/*start card รายละเอียดตราจอง */}
                                                  <h3 className="text-center">ตราจอง</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ตราจอง</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เล่มที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ระวาง</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขที่ดิน</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียดตราจอง */}

                                                  {/*start card รายละเอียดหนังสือรับรองการทำประโยชน์(น.ส.3) */}
                                                  <h3 className="text-center">หนังสือรับรองการทำประโยชน์(น.ส.3)</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ทะเบียน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">สารบบเล่ม/เลขที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียดหนังสือรับรองการทำประโยชน์(น.ส.3) */}

                                                  {/*start card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ก) */}
                                                  <h3 className="text-center">หนังสือรับรอการทำประโยชน์(น.ส.3 ก)</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ระวางรูปถ่ายทางออกชื่อ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ทะเบียน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เล่มที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขที่ดิน</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หมายเลข</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">แผ่นที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ก) */}

                                                  {/*start card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ข) */}
                                                  <h3 className="text-center">หนังสือรับรอการทำประโยชน์(น.ส.3 ข)</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หมู่ที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ทะเบียน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ข) */}

                                                  {/*start card รายละเอียด ส.ป.ก. */}
                                                  <h3 className="text-center">ส.ป.ก.</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หมู่ที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ทะเบียน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">แปลงเลขที่
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ระวาง ส.ป.ก. ที่
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียด ส.ป.ก. */}

                                                  {/*start card รายละเอียด หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2) */}
                                                  <h3 className="text-center">หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">โฉนดที่ดินเลขที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เนื้อที่</span>
                                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                                    <span className="input-group-text" id="Search_id_card">ไร่</span>
                                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                                    <span className="input-group-text" id="Search_id_card">งาน</span>
                                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                                    <span className="input-group-text" id="Search_id_card">ตารางวา</span>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ที่ตั้งห้องชุด</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ห้องชุดเลขที่
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ชั้นที่
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อาคารเลขที่
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ชื่ออาคารชุด
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ทะเบียนอาคารชุดเลขที่
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ผู้ให้สัญญา</span>
                                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)"></textarea>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ผู้รับสัญญา</span>
                                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)"></textarea>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เนื้อที่ประมาณ</span>
                                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                    <span className="input-group-text" id="Search_id_card">ตารางเมตร</span>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">สูง</span>
                                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                    <span className="input-group-text" id="Search_id_card">เมตร</span>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">ที่มาของทรัพย์
                                                                    </label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="">เลือกข้อมูล...</option>
                                                                      <option value="1" selected="">จำนอง</option>
                                                                      <option value="2">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                                      <option value="3">สืบทรัพย์</option>
                                                                      <option value="4">โอนตามมาตรา 76</option>
                                                                      <option value="5">ตีโอนชำระหนี้</option>
                                                                      <option value="6">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อื่นๆโปรดระบุ
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หมายเหตุ</span>
                                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)"></textarea>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียด หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2) */}

                                                  {/*start card รายละเอียด ภ.ท.บ.5 */}
                                                  <h3 className="text-center">ภ.ท.บ.5</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ที่ดินตั้งอยู่เลขที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ภ.ท.บ.5" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ภ.ท.บ.5" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ภ.ท.บ.5" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หมู่ที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ภ.ท.บ.5" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียด ภ.ท.บ.5 */}

                                                  {/*start card รายละเอียด บ้าน */}
                                                  <h3 className="text-center">บ้าน</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">สิ่งปลูกสร้างเลขที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตั้งอยู่บนที่ดินเลขที่</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ลักษณะสิ่งปลูกสร้าง</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียด บ้าน */}

                                                  {/*start card รายละเอียด สังหาริมทรัพย์ */}
                                                  <h3 className="text-center">สังหาริมทรัพย์</h3>
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">รายการจดทะเบียน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">วันที่จดทะเบียน
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ยี่ห้อ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ประเภท</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขทะเบียน</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ลักษณะ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขตัวรถ
                                                                    </span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เลขเครื่องยนต์</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">สี</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ชื่อผู้ถือกรรมสิทธิ์
                                                                    </span>
                                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน สังหาริมทรัพย์"></textarea>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ชื่อผู้ครอบครอง</span>
                                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน สังหาริมทรัพย์"></textarea>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หมายเหตุ</span>
                                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน สังหาริมทรัพย์"></textarea>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียด สังหาริมทรัพย์ */}

                                                  {/*start card รายละเอียด หุ้น */}
                                                  <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                                    <div className="card-body p-0">
                                                      <div className="p-3 code-to-copy">
                                                        <h3 className="text-center">หุ้น</h3><br />
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียด หุ้น */}

                                                  {/*start card รายละเอียด อื่นๆ */}
                                                  <h3 className="text-center">อื่นๆ</h3>
                                                  <div className="col-sm-12 col-md-12 col-lg-12 g-3">
                                                    <div className="input-group mb-3">
                                                      <span className="input-group-text" id="Search_id_card">ชื่อเอกสารสิทธิ์ (อื่นๆ)                                          </span>
                                                      <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                                    </div>
                                                  </div>
                                                  <div className="row">
                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                      <div className="mb-1">
                                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                          <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">
                                                              <h4 className="text-center">เลขที่</h4><br />
                                                              <div className="row g-3">
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                                    <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                                      <option selected="ทั้งหมด">ทั้งหมด</option>
                                                                      <option>University of Chicago</option>
                                                                      <option>GSAS Open Labs At Harvard</option>
                                                                      <option>California Institute of Technology</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                  <div className="input-group mb-3">
                                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                                    <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียด อื่นๆ */}

                                                  {/*start card รายละเอียดสารบัญจดทะเบียน */}                     
                                                  <div className="mb-1">
                                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                      <div className="card-body p-0">
                                                        <div className="p-4 code-to-copy">
                                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                                          <div className="row g-3">
                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                              <div className="input-group mb-3">
                                                                <span className="input-group-text" id="Search_id_card">ผู้ให้สัญญา</span>
                                                                <textarea className="form-control" aria-label="With textarea"></textarea>
                                                              </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                              <div className="input-group mb-3">
                                                                <span className="input-group-text" id="Search_id_card">ผู้รับสัญญา</span>
                                                                <textarea className="form-control" aria-label="With textarea"></textarea>
                                                              </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                              <div className="input-group mb-3">
                                                                <span className="input-group-text" id="Search_id_card">เนื้อที่ตามสัญญา</span>
                                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                                <span className="input-group-text" id="Search_id_card">ไร่</span>
                                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                                <span className="input-group-text" id="Search_id_card">งาน</span>
                                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                                <span className="input-group-text" id="Search_id_card">ตารางวา</span>
                                                              </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                              <div className="input-group mb-3">
                                                                <span className="input-group-text" id="Search_id_card">เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)</span>
                                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                                <span className="input-group-text" id="Search_id_card">ไร่</span>
                                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                                <span className="input-group-text" id="Search_id_card">งาน</span>
                                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                                <span className="input-group-text" id="Search_id_card">ตารางวา</span>
                                                              </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                              <div className="input-group mb-3">
                                                                <span className="input-group-text" id="Search_id_card">หมายเหตุ</span>
                                                                <textarea className="form-control" aria-label="With textarea"></textarea>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*end card รายละเอียดสารบัญจดทะเบียน */}
                                                  <br />
                                                  <div className="d-flex justify-content-center ">
                                                    <button className="btn btn-success" type="submit">บันทึก</button>
                                                    <button className="btn btn-danger" type="submit">ลบหลักทรัพย์</button>
                                                  </div>

                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          {/*end card รายละเอียดหลักทรัพย์ */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                            {/*///end รายละเอียดหลักทรัพย์ค้ำประกัน/// */}  

                            {/*///start รายละเอียดบุคคลค้ำประกัน/// */}
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-header p-4 border-bottom bg-success-dark" >
                                        <div className="row g-3 justify-content-between align-items-center">
                                          <div className="col-12 col-md">
                                            <h4 className="text-secondary-subtle mb-0">บุคคลค้ำประกัน </h4>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <div className="d-flex mb-3 flex-row-reverse">
                                            <div>  <button type="button" className="btn btn-primary btn-sm ms-2" ><span className="fas fa-plus fs-8"></span> เพิ่มบุคคลค้ำประกัน</button></div>
                                          </div>
                                          <div id="tableExample" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
                                            <div className="table-responsive mx-n1 px-1">
                                              <table className="table table-sm table-bordered fs-9 mb-0">
                                              <thead className="align-middle text-center text-nowrap" style={{backgroundColor: '#d9fbd0',border: '#cdd0c7'}}>
                                                <tr>
                                                <th style={{ minWidth: 30 }}>#</th>
                                                <th>เลขที่สัญญา</th>
                                                <th>เลขบัตรประชาชน</th>
                                                <th>คำนำหน้า</th>
                                                <th>ชื่อ-นามสกุล</th>
                                                <th>แก้ไขข้อมูล</th>
                                                <th>ลบข้อมูล</th>
                                                </tr>
                                              </thead>
                                              <tbody className="list text-center align-middle">
                                                <tr>
                                                <td>1</td>
                                                <td>1958</td>
                                                <td>1234567891235</td>
                                                <td>นาย</td>
                                                <td>ทดลอง ทำดู</td>
                                                <td><div className="d-flex justify-content-center"> <a className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" ><i className="far fa-edit"></i></a></div></td>
                                                <td><div className="d-flex justify-content-center"> <a className="btn btn-phoenix-secondary btn-icon fs-7 text-danger px-0" ><i className="fas fa-trash-alt"></i></a></div></td>
                                                </tr>
                                              </tbody>
                                              </table>
                                            </div>
                                          </div>
                                          <br />
                                          <div className="mb-1">
                                            <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                              <div className="card-body p-0">
                                                <div className="p-4 code-to-copy">
                                                  <h3 className="text-center">รายละเอียดบุคคลค้ำประกัน</h3>
                                                  <br />
                                                  <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">เลขบัตรประชาชน</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">คำนำหน้า</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">ชื่อ</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">นามสกุล</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="flatpickr-input-container">
                                                        <div className="form-floating">
                                                          <input className="form-control datetimepicker" id="floatingInputStartDate" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                                                          <label className="ps-6" for="floatingInputStartDate">วันเดือนปีเกิด
                                                          </label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">บ้านเลขที่</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">บ้าน/ชุมชน</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">ซอย</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">ถนน</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">ตำบล/แขวง</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">อำเภอ/กิ่งอำเภอ/เขต</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="form-floating form-floating-advance-select mb-3">
                                                        <label for="floaTingLabelSingleSelect">จังหวัด</label>
                                                        <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                          <option selected="ทั้งหมด">ทั้งหมด</option>
                                                          <option>University of Chicago</option>
                                                          <option>GSAS Open Labs At Harvard</option>
                                                          <option>California Institute of Technology</option>
                                                        </select>
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">รหัสไปรษณีย์</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">เบอร์โทรศัพท์</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                      <div className="input-group mb-3">
                                                        <span className="input-group-text" id="Search_id_card">อีเมล</span>
                                                        <input className="form-control" type="text" aria-label="รายละเอียดบุคคลค้ำประกัน" />
                                                      </div>
                                                    </div>
                                                  </div>  
                                                  </div>
                                                  <div className="d-flex justify-content-center ">
                                                    <button className="btn btn-success" type="submit">บันทึก</button>
                                                    <button className="btn btn-danger" type="submit">ลบหลักทรัพย์</button>
                                                  </div>
                                                  <br />
                                                </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div> 
                            {/*///end รายละเอียดบุคคลค้ำประกัน/// */}
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>              
                    </div>
                  </div>
                </div>
              </div>
              {/*end modal รายละเอียดจำแนกมูลหนี้ NPL ตามสัญญา*/}

              {/*start Modal แยกสัญญา NPL */}
              <div className="modal fade" id="SeparateNPL" tabindex="-1" aria-labelledby="verticallyCenteredModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="SeparateNPL">แยกสัญญา NPL</h5>
                      <button className="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <p className="text-body-tertiary lh-lg mb-0">ต้องการแยกสัญญา NPL (เลขที่สัญญา 1958) </p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-primary" type="button">แยกสัญญา NPL</button>
                      <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">ยกเลิก</button>
                    </div>
                  </div>
                </div>
              </div>
              {/*end Modal แยกสัญญา NPL */}

              {/*start Modal แยกสัญญา NPA */}
              <div className="modal fade" id="SeparateNPA" tabindex="-1" aria-labelledby="verticallyCenteredModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="SeparateNPA">แยกสัญญา NPA</h5>
                      <button className="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <p className="text-body-tertiary lh-lg mb-0">ต้องการแยกสัญญา NPA (เลขที่สัญญา 1958) </p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-primary" type="button">แยกสัญญา NPA</button>
                      <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">ยกเลิก</button>
                    </div>
                  </div>
                </div>
              </div>
              {/*end Modal แยกสัญญา NPA */}

              {/*start Modal ยกเลิกแยกสัญญา */}
              <div className="modal fade" id="CancelSeparate" tabindex="-1" aria-labelledby="verticallyCenteredModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="CancelSeparate">ยกเลิกการแยกสัญญา</h5>
                      <button className="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <p className="text-body-tertiary lh-lg mb-0">ต้องการลบการแยกสัญญา (เลขที่สัญญา 1958_1) </p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-danger" type="button">ลบ</button>
                      <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">ยกเลิก</button>
                    </div>
                  </div>
                </div>
              </div>
              {/*end Modal ยกเลิกแยกสัญญา */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchClassifyNPLDetail;