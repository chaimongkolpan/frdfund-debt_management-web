import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/account/reimbursement/filter";
import SearchTable from "@views/components/account/reimbursement/searchTable";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchReimbursement,
  getReimbursementPlan,
  getReimbursementCard,
  printPlanRe,
  printCardRe,
} from "@services/api";

const user = getUserData();
const PageContent = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [planPrint, setPlanPrint] = useState(null);
  const [card, setCard] = useState(null);
  const [cardPrint, setCardPrint] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openPlan, setOpenPlan] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [tab, setTab] = useState(null);
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchReimbursement(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const handleShowCard = async (item) => {
    await setPolicy(item);
    const param = {
      params: { id: item.id_KFKPolicy }
    };
    const result = await getReimbursementCard(param);
    if (result.isSuccess) {
      const kfkcard = result?.data?.kfkCards[0];
      await setCard(kfkcard?.transactions)
      await setCardPrint(result)
    } else {
      await setCard(null)
      await setCardPrint(null)
    }
    await setTab("1");
    await setOpenCard(true);
  }
  const handleShowPlan = async (item) => {
    await setPolicy(item);
    const param = {
      params: { id: item.id_KFKPolicy }
    };
    const result = await getReimbursementPlan(param);
    if (result.isSuccess) {
      const kfkcard = result?.data?.kfkCards[0];
      await setPlan(kfkcard?.transactions)
      await setPlanPrint(result?.data)
    } else {
      await setPlan(null)
      await setPlanPrint(null)
    }
    await setOpenPlan(true);
  }
  const printCard = async () => {
    await setLoadBigData(true);
    const param = { type: 'application/octet-stream', filename: 'การ์ดลูกหนี้_' + (new Date().getTime()) + '.xlsx', data: cardPrint };
    const result = await printCardRe(param);
    await setLoadBigData(false);
    if (result.isSuccess) {
      await onSearch(filter)
    }
  }
  const printPlan = async () => {
    await setLoadBigData(true);
    const param = { type: 'application/octet-stream', filename: 'ชำระหนี้คืน_' + (new Date().getTime()) + '.xlsx', data: planPrint };
    const result = await printPlanRe(param);
    await setLoadBigData(false);
    if (result.isSuccess) {
      await onSearch(filter)
    }
  }
  const convertTrc = (trc) => {
    if (trc == 'PAYOUT') return 'จ่าย';
    else if (trc == 'PAYIN') return 'รับ';
    else if (trc == 'RTN') return 'รับ';
    else if (trc == 'SPN') return 'จ่าย';
    else return '';
  }
  return (
    <>
      <div className="content">
        <h4 className="mb-3">การชำระเงินคืน</h4>
        <div className="mt-4">
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'ค้นหา'}
                  className={"my-4"}
                  children={(
                    <>
                      <Filter handleSubmit={onSearch} setLoading={setLoadBigData} />
                      <br />
                      {data && (
                        <SearchTable result={data} filter={filter} getData={onSearch} 
                          handleShowPlan={handleShowPlan}
                          handleShowCard={handleShowCard}
                        />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {openPlan && (
        <Modal isOpen={openPlan} setModal={setOpenPlan} hideOk onClose={() => setOpenPlan(false)}  title={'ตารางผ่อนชำระหนี้คืน'} closeText={'ปิด'} scrollable fullscreen>
          <form>
            <div className="mb-1">
              <div className="card shadow-none border my-4" data-component-card="data-component-card">
                <div className="card-body p-0">
                  <div className="p-4 code-to-copy">
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'ชื่อ-สกุล'} disabled value={`${policy?.k_name_prefix}${policy?.k_firstname} ${policy?.k_lastname}`} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'เลขที่บัตรประชาชน'} disabled value={`${policy?.k_idcard}`} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'วันเริ่มสัญญา'} disabled value={stringToDateTh(policy?.policyStartDate, false)} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'วันครบสัญญา'} disabled value={stringToDateTh(policy?.policyEndDate, false)} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'เลขที่สัญญา'} disabled value={policy?.policyNO} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'ยอดเงินตามสัญญา'} disabled value={toCurrency(policy?.loan_amount ?? 0, 2)} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'วันครบกำหนดชำระ'} disabled value={policy?.spDate} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'อัตราดอกเบี้ย'} disabled value={toCurrency(policy?.interesRate ?? 0, 2) + '%'} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'จำนวนปี'} disabled value={policy?.numberOfYearPayback} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'จำนวนงวด'} disabled value={policy?.numberOfPeriodPayback} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'จำนวนงวดต่อปี (งวด)'} disabled value={policy?.numberOfPeriodPayback / policy?.numberOfYearPayback} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'ค่างวดตามแผน(บาท)'} disabled value={toCurrency(policy?.installment ?? 0, 2)} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12 mt-3" style={{ backgroundColor: 'honeydew', color: 'grey', height: 60 }}>
                        <div className="d-flex justify-content-evenly align-items-center h-100">
                          <span>{'เงินต้น : '}<b>{toCurrency(policy?.loan_amount ?? 0, 2)}</b></span>
                          <span>{'ดอกเบี้ย : '}<b>{toCurrency(policy?.interest ?? 0, 2)}</b></span>
                          <span>{'ยอดที่ต้องชำระ : '}<b>{toCurrency(policy?.loan_amount ?? 0, 2)}</b></span>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                        <div className="table-responsive mx-n1 px-1">
                          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                              <tr>
                                <th rowSpan="2">งวดที่</th>
                                <th rowSpan="2">วันที่ชำระเงิน</th>
                                <th rowSpan="2">เลขที่เอกสารบัญชี</th>
                                <th colSpan="2">ใบเสร็จรับเงิน</th>
                                <th rowSpan="2">จำนวนเงิน</th>
                                <th rowSpan="2">หมายเหตุ</th>
                              </tr>
                              <tr>
                                <th>วันที่</th>
                                <th>เลขที่</th>
                              </tr>
                            </thead>
                            <tbody className="list text-center align-middle" id="bulk-select-body">
                              {(plan && plan.length > 0) ? (plan.map((item,index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.transactionDate}</td>
                                  <td>{item.documentNo}</td>
                                  <td>{item.receiptDate}</td>
                                  <td>{item.receiptNo}</td>
                                  <td>{toCurrency(item.amountPaid, 2)}</td>
                                  <td>{item.remark}</td>
                                </tr>
                              ))) : (
                                <tr>
                                  <td className="fs-9 text-center align-middle" colSpan={7}>
                                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center my-3">
                        <div className="d-flex">
                          <button className="btn btn-primary btn-sm ms-2" type="button" onClick={() => printPlan()}><i className="fa fa-print"></i> ปริ้นตารางผ่อนชำระหนี้คืน</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      )}
      {openCard && (
        <Modal isOpen={openCard} setModal={setOpenCard} hideOk onClose={() => setOpenCard(false)}  title={'การ์ดลูกหนี้'} closeText={'ปิด'} scrollable fullscreen>
          <form>
            <div className="row reimbursement-detail">
              <Nav tabs>
                <NavItem className={`${tab == "1" ? 'active' : ''}`} >
                  <NavLink className={`${tab == "1" ? 'active' : ''}`} onClick={() => setTab("1")}>
                    ลูกหนี้เกษตรกร
                  </NavLink>
                </NavItem>
                <NavItem className={`${tab == "2" ? 'active' : ''}`}>
                  <NavLink className={`${tab == "2" ? 'active' : ''}`} onClick={() => setTab("2")}>
                    ลูกหนี้ส่วนราชการ
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={tab}>
                <TabPane tabId="1">
                  <div className="table-responsive mx-n1 px-1 mt-3">
                    <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                      <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                        <tr>
                          <th rowSpan="2">ชำระงวดที่</th>
                          <th rowSpan="2">รายการ</th>
                          <th rowSpan="2">วันที่ทำรายการ</th>
                          <th rowSpan="2">เลขที่เอกสารบัญชี</th>
                          <th rowSpan="2">จำนวนวัน</th>
                          <th rowSpan="2">เลขที่เช็คจ่าย</th>
                          <th rowSpan="2">เลขที่แคชเชียร์เช็ค</th>
                          <th colSpan="2">ใบเสร็จ</th>
                          <th rowSpan="2">เดบิตเพิ่มยอดหนี้</th>
                          <th colSpan="4">เครดิต / ลดยอดหนี้</th>
                          <th rowSpan="2">ลูกหนี้คงเหลือ</th>
                        </tr>
                        <tr>
                          <th>วันที่</th>
                          <th>เลขที่</th>
                          <th>ค่าปรับ</th>
                          <th>ค่าจัดการ (ดอกเบี้ย)</th>
                          <th>เงินต้น</th>
                          <th>รวม</th>
                        </tr>
                      </thead>
                      <tbody className="list text-center align-middle" id="bulk-select-body">
                        {(card && card.length > 0) ? (card.map((item,index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{convertTrc(item.trc)}</td>
                            <td>{item.transactionDate}</td>
                            <td>{item.documentNo}</td>
                            <td>{item.duration}</td>
                            <td>{item.chequeNo}</td>
                            <td>{item.cashierChequeNo}</td>
                            <td>{item.receiptDate}</td>
                            <td>{item.receiptNo}</td>
                            <td>{toCurrency(item.amountPaid, 2)}</td>
                            <td>{toCurrency(item.planDeduc, 2)}</td>
                            <td>{toCurrency(item.intdeduc, 2)}</td>
                            <td>{toCurrency(item.deduc, 2)}</td>
                            <td>{toCurrency(item.balance, 2)}</td>
                            <td>{toCurrency(item.balance, 2)}</td>
                          </tr>
                        ))) : (
                          <tr>
                            <td className="fs-9 text-center align-middle" colSpan={16}>
                              <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex align-items-center justify-content-center my-3">
                    <div className="d-flex">
                      <button className="btn btn-primary btn-sm ms-2" type="button" onClick={() => printCard()}><i className="fa fa-print"></i> ปริ้นการ์ดลูกหนี้</button>
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="2">
                  <div className="table-responsive mx-n1 px-1 mt-3">
                    <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                      <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                        <tr>
                          <th>แผนงวดที่</th>
                          <th>ชำระงวดที่</th>
                          <th>รายการ</th>
                          <th>วันที่ทำรายการ</th>
                          <th>จำนวนวัน</th>
                          <th>ต้นเงินตามแผน</th>
                          <th>แผนเงินต้นค้างชำระ(+)</th>
                          <th>เงินต้นยกมา</th>
                          <th>ยอดชำระทั้งสิ้น</th>
                          <th>ลดต้น</th>
                          <th>คงเหลือ</th>
                          <th>อัตราดอกเบี้ย</th>
                        </tr>
                      </thead>
                      <tbody className="list text-center align-middle">
                        <tr>
                          <td className="fs-9 text-center align-middle" colSpan={12}>
                            <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabPane>
              </TabContent>
            </div>
          </form>
        </Modal>
      )}
      <Loading isOpen={isLoadBigData} setModal={setLoadBigData} centered scrollable size={'lg'} title={'เรียกข้อมูลทะเบียนหนี้จาก BigData'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default PageContent;