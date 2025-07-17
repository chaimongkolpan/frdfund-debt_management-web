import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/CustomModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/legal-contract/filterPrepare";
import SearchTable from "@views/components/legal-contract/searchSendTable";
import Detail from "@views/components/legal-contract/detail";
import PlanPay from "@views/components/legal-contract/planPay";
import Asset from "@views/components/legal-contract/assetModal";
import Guarantor from "@views/components/legal-contract/guarantorModal";
import Spouse from "@views/components/legal-contract/spouseModal";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import { 
  cleanData,
  searchLegalPrepare,
} from "@services/api";

const user = getUserData();
const LegalContractSend = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [policy, setPolicy] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openAsset, setOpenAsset] = useState(false);
  const [openGuarantor, setOpenGuarantor] = useState(false);
  const [openSpouse, setOpenSpouse] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
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
  const onSubmit = async () => {
    // save
    await setSelectedData(null);
    await setOpenSubmit(false);
  }
  const handleSubmit = async (selected) => {
    await setBookNo(null);
    await setBookDate(null);
    await setSelectedData(selected);
    await setOpenSubmit(true);
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
  useEffect(() => {
    setLoadBigData(true);
    return cleanData
  },[])
  return (
    <>
      <div className="content">
        <h4>จัดส่งนิติกรรมสัญญา</h4>
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
                        handleSubmit={handleSubmit} 
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
          <PlanPay policy={policy} isView />
        </Modal>
      )}
      {openAsset && (
        <Modal isOpen={openAsset} setModal={setOpenAsset} hideOk onClose={() => setOpenAsset(false)}  title={'ข้อมูลหลักทรัพย์ค้ำประกัน'} closeText={'ปิด'} scrollable fullscreen>
          <Asset policy={policy} isView /> 
        </Modal> 
      )}
      {openGuarantor && (
        <Modal isOpen={openGuarantor} setModal={setOpenGuarantor} hideOk onClose={() => setOpenGuarantor(false)}  title={'ข้อมูลบุคคลค้ำประกัน'} closeText={'ปิด'} scrollable fullscreen>
          <Guarantor policy={policy} isView /> 
        </Modal> 
      )}
      {openSpouse && (
        <Modal isOpen={openSpouse} setModal={setOpenSpouse} hideOk onClose={() => setOpenSpouse(false)}  title={'ข้อมูลคู่สมรส'} closeText={'ปิด'} scrollable fullscreen>
          <Spouse policy={policy} isView /> 
        </Modal> 
      )}
      {openSubmit && (
        <Modal isOpen={openSubmit} setModal={setOpenSubmit} onClose={() => setOpenSubmit(false)}  
          title={'จัดส่งนิติกรรมสัญญา'} closeText={'ปิด'} scrollable fullscreen okText={'จัดส่งนิติกรรมสัญญา'} onOk={onSubmit}
        >
          <form>
            <br />
            <div class="row">
              <div data-list='{"valueNames":["name","email","age"]}'>
                <div className="table-responsive mx-n1 px-1">
                  <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                    <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                      <tr>
                        <th rowSpan="2" style={{ minWidth: 30 }}>#</th>
                        <th colSpan="4">เกษตรกร</th>
                        <th colSpan="4">เจ้าหนี้</th>
                        <th colSpan="8">นิติกรรมสัญญา</th>
                        <th colSpan="2">หลักประกัน</th>
                      </tr>
                      <tr>
                        <th>เลขบัตรประชาชน</th>
                        <th>คำนำหน้า</th>
                        <th>ชื่อ-นามสกุล</th>
                        <th>จังหวัด</th>
                        <th>ประเภทเจ้าหนี้</th>
                        <th>สถาบันเจ้าหนี้</th>
                        <th>จังหวัดเจ้าหนี้</th>
                        <th>สาขาเจ้าหนี้</th>
                        <th>เลขที่นิติกรรมสัญญา</th>
                        <th>ประเภทจัดการหนี้</th>
                        <th>วันที่ทำสัญญา</th>
                        <th>จำนวนงวด</th>
                        <th>จำนวนปี</th>
                        <th>ยอดเงินตามสัญญา</th>
                        <th>จำนวนเงินที่ชดเชย</th>
                        <th>สถานะนิติกรรมสัญญา</th>
                        <th>หลักทรัพย์ค้ำประกัน</th>
                        <th>บุคคลค้ำประกัน</th>
                      </tr>
                    </thead>
                    <tbody className="list text-center align-middle" id="bulk-select-body">
                      {(selectedData && selectedData.length > 0) ? (selectedData.map((item,index) => (
                        <tr key={index}>
                          <td className="fs-9 align-middle">{index + 1}</td>
                          <td>{item.k_idcard}</td>
                          <td>{item.k_name_prefix}</td>
                          <td>{(item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
                          <td>{item.loan_province}</td>
                          <td>{item.loan_creditor_type}</td>
                          <td>{item.loan_creditor_name}</td>
                          <td>{item.loan_creditor_province}</td>
                          <td>{item.loan_creditor_branch}</td>
                          <td>{item.policyNO}</td>
                          <td>{item.loan_debt_type}</td>
                          <td>{item.policyStartDate ? stringToDateTh(item.policyStartDate, false) : '-'}</td>
                          <td>{item.numberOfPeriodPayback}</td>
                          <td>{item.numberOfYearPayback}</td>
                          <td>{toCurrency(item.loan_amount)}</td>
                          <td>{toCurrency(item.compensation_amount)}</td>
                          <td>{item.policyStatus}</td>
                          <td>{`${item.assetCount ? item.assetCount : 0} แปลง`}</td>
                          <td>{`${item.guarantorCount ? item.guarantorCount : 0} คน`}</td>
                        </tr>
                      ))) : (
                        <tr>
                          <td className="fs-9 text-center align-middle" colSpan={20}>
                            <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 mt-3">
                <Textbox title={'เลขที่หนังสือนำส่งสาขา'} handleChange={(val) => setBookNo(val)} containerClassname={'mb-3'} value={bookNo} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือนำส่งสาขา'} value={bookDate} handleChange={(val) => setBookDate(val)} />
              </div>
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
export default LegalContractSend;