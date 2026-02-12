import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, NavItem, NavLink, TabContent, TabPane, Spinner } from 'reactstrap'
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import Dropdown from "@views/components/input/DropdownSearch";
import Modal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/legal-contract/filterPrepare";
import SearchTable from "@views/components/legal-contract/searchPrepareTable";
import Detail from "@views/components/legal-contract/detail";
import PlanPay from "@views/components/legal-contract/planPay";
import Asset from "@views/components/legal-contract/assetModal";
import Guarantor from "@views/components/legal-contract/guarantorModal";
import Spouse from "@views/components/legal-contract/spouseModal";
import FarmerModal from "@views/components/legal-contract/farmerModal";
import { 
  cleanData,
  searchLegalPrepare,
  printLegalContract,
  getReimbursementCard,
  printCardRe,
} from "@services/api";

const user = getUserData();
const LegalContractPrepare = () => {
  const allow_roles = [1,2,4,7,8,9];
  const can_action = allow_roles.includes(user?.role)
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [filter, setFilter] = useState(null);
  const [card, setCard] = useState(null);
  const [cardPrint, setCardPrint] = useState(null);
  const [openCard, setOpenCard] = useState(false);
  const [tab, setTab] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openAsset, setOpenAsset] = useState(false);
  const [openGuarantor, setOpenGuarantor] = useState(false);
  const [openSpouse, setOpenSpouse] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const [openDetailFarmer, setOpenDetailFarmer] = useState(false);
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchLegalPrepare(filter);
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
  const printCard = async () => {
    await setLoadBigData(true);
    const cardReq = {
      ...cardPrint,
      fname: user?.firstname,
      lname: user?.lastname,
    }
    const param = { type: 'application/octet-stream', filename: 'การ์ดลูกหนี้_' + (new Date().getTime()) + '.xlsx', data: cardReq };
    const result = await printCardRe(param);
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
  const handleShowDetail = async (item) => {
    await setPolicy(item);
    await setOpenDetail(true);
  }
  const handlePlan = async (item) => {
    await setPolicy(item);
    await setOpenPlan(true);
  }
  const handleAsset = async (item) => {
    await setPolicy(item);
    await setOpenAsset(true);
  }
  const handleGuarantor = async (item) => {
    await setPolicy(item);
    await setOpenGuarantor(true);
  }
  const handleSpouse = async (item) => {
    await setPolicy(item);
    await setOpenSpouse(true);
  }
  const handlePrint = async (item) => {
    await setPolicy(item);
    await setOpenPrint(true);
  }
  const handleShowFarmerDetail = async (item) => {
    await setPolicy(item);
    await setOpenDetailFarmer(true);
  }
  const onPrint = async () => {
    await setLoadBigData(true);
    const id = policy.id_KFKPolicy
    const param = { type: 'application/octet-stream', filename: 'เอกสารนิติกรรมสัญญา_' + (new Date().getTime()) + '.zip', data: { id } };
    const result = await printLegalContract(param);
    if (result.isSuccess) {
      await setOpenPrint(false);
    }
    await setLoadBigData(false);
  }
  useEffect(() => {
    setLoadBigData(true);
    return cleanData
  },[])
  return (
    <>
      <div className="content">
        <h4>จัดทำนิติกรรมสัญญา</h4>
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
                        handleShowDetail={handleShowDetail} 
                        handlePlan={handlePlan} 
                        handleAsset={handleAsset} 
                        handleGuarantor={handleGuarantor} 
                        handleSpouse={handleSpouse} 
                        handlePrint={handlePrint} 
                        handleShowFarmerDetail={handleShowFarmerDetail}
                        handleShowCard={handleShowCard}
                        can_action={can_action}
                      />
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      {openDetail && (
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk onClose={() => setOpenDetail(false)}  title={'รายละเอียดจัดการหนี้'} closeText={'ปิด'} scrollable fullscreen>
          <Detail policy={policy} />
        </Modal>
      )}
      {openPlan && (
        <Modal isOpen={openPlan} setModal={setOpenPlan} hideOk onClose={() => setOpenPlan(false)}  title={'แผนการชำระเงินคืน'} closeText={'ปิด'} scrollable fullscreen>
          <PlanPay policy={policy} />
        </Modal>
      )}
      {openAsset && (
        <Modal isOpen={openAsset} setModal={setOpenAsset} hideOk onClose={() => setOpenAsset(false)}  title={'ข้อมูลหลักทรัพย์ค้ำประกัน'} closeText={'ปิด'} scrollable fullscreen>
          {/* <div className="col-sm-12 col-md-6 col-lg-6">
            <Dropdown 
              title={'สถาบันเจ้าหนี้'} 
              defaultValue={'all'} 
              options={['all','กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)','ธนาคารกรุงไทย','ธนาคารออมสิน','ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร']} hasAll
            />
          </div> */}
          <Asset policy={policy} /> 
        </Modal> 
      )}
      {openDetailFarmer && (
        <FarmerModal isOpen={openDetailFarmer} setModal={setOpenDetailFarmer} onClose={() => setOpenDetailFarmer(false)} policy={policy} />
      )}
      {openGuarantor && (
        <Modal isOpen={openGuarantor} setModal={setOpenGuarantor} hideOk onClose={() => setOpenGuarantor(false)}  title={'ข้อมูลบุคคลค้ำประกัน'} closeText={'ปิด'} scrollable fullscreen>
          <Guarantor policy={policy} /> 
        </Modal> 
      )}
      {openSpouse && (
        <Modal isOpen={openSpouse} setModal={setOpenSpouse} hideOk onClose={() => setOpenSpouse(false)}  title={'ข้อมูลคู่สมรส'} closeText={'ปิด'} scrollable fullscreen>
          <Spouse policy={policy} /> 
        </Modal> 
      )}
      {openPrint && (
        <Modal isOpen={openPrint} setModal={setOpenPrint} onClose={() => setOpenPrint(false)}  
          title={'ดาวน์โหลดนิติกรรมสัญญา'} okText={'ดาวน์โหลด'} centered onOk={onPrint}
          closeText={'ยกเลิก'}>
          <p className="text-body-tertiary lh-lg mb-0">ต้องการดาวน์โหลดนิติกรรมสัญญา</p>
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
                            <td>{item.trc == 'PAYOUT' ? toCurrency(item.balance, 2) : item.trc == 'SPN' ? toCurrency(Math.abs(item.amountPaid), 2) : ''}</td>
                            <td>{(item.trc == 'PAYOUT' || item.trc == 'SPN') ? '' : toCurrency(item.planDeduc, 2)}</td>
                            <td>{(item.trc == 'PAYOUT' || item.trc == 'SPN') ? '' : toCurrency(item.intdeduc, 2)}</td>
                            <td>{(item.trc == 'PAYOUT' || item.trc == 'SPN') ? '' : toCurrency(item.deduc, 2)}</td>
                            <td>{(item.trc == 'PAYOUT' || item.trc == 'SPN') ? '' : toCurrency(item.amountPaid, 2)}</td>
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
export default LegalContractPrepare;