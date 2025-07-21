import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/CustomModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/guarantee/filterPrepare";
import SearchTable from "@views/components/guarantee/searchPrepareTable";
import Detail from "@views/components/guarantee/detail";
import PlanPay from "@views/components/guarantee/planPay";
import Asset from "@views/components/guarantee/assetModal";
import Guarantor from "@views/components/guarantee/editGuaranteeModal";
import ReturnGuarantee from "@views/components/guarantee/returnGuaranteeModal";
import Spouse from "@views/components/legal-contract/spouseModal";
import { 
  cleanData,
  searchGuaranteePrepare,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const LegalContractPrepare = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openAsset, setOpenAsset] = useState(false);
  const [openGuarantor, setOpenGuarantor] = useState(false);
  const [openSpouse, setOpenSpouse] = useState(false);
  const [openReturnGuarantee, setOpenReturnGuarantee] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchGuaranteePrepare(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
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
  const handleReturnGuarantee = async (item) => {
    await setPolicy(item);
    await setOpenReturnGuarantee(true);
  }
  const handleSpouse = async (item) => {
    await setPolicy(item);
    await setOpenSpouse(true);
  }
  const handleSubmit = async (item) => {
    await setSelected(item);
    await setOpenSubmit(true);
  }
  useEffect(() => {
    setLoadBigData(true);
    return cleanData
  },[])
  return (
    <>
      <div className="content">
        <h4>ทะเบียนคุมหลักประกัน</h4>
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
                        handleReturnGuarantee={handleReturnGuarantee}
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
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk onClose={() => setOpenDetail(false)}  title={'รายละเอียดหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <Asset policy={policy} isView /> 
        </Modal>
      )}
      {openPlan && (
        <Modal isOpen={openPlan} setModal={setOpenPlan} hideOk onClose={() => setOpenPlan(false)}  title={'เลื่อนโอนหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <PlanPay policy={policy} />
        </Modal>
      )}
      {openAsset && (
        <Modal isOpen={openAsset} setModal={setOpenAsset} hideOk onClose={() => setOpenAsset(false)}  title={'ข้อมูลหลักทรัพย์ค้ำประกัน'} closeText={'ปิด'} scrollable fullscreen>
          <Asset policy={policy} /> 
        </Modal> 
      )}
      {openGuarantor && (
        <Modal isOpen={openGuarantor} setModal={setOpenGuarantor} hideOk onClose={() => setOpenGuarantor(false)}  title={'ข้อมูลแก้ไขโอนหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <Guarantor policy={policy} /> 
        </Modal> 
      )}
      {openSpouse && (
        <Modal isOpen={openSpouse} setModal={setOpenSpouse} hideOk onClose={() => setOpenSpouse(false)}  title={'ข้อมูลแก้ไขโอนหลักทรัพย์ (บริหารสินทรัพย์)'} closeText={'ปิด'} scrollable fullscreen>
           <Guarantor policy={policy} /> 
        </Modal> 
      )}
      {openReturnGuarantee && (
        <Modal isOpen={openReturnGuarantee} setModal={setOpenReturnGuarantee} hideOk onClose={() => setOpenReturnGuarantee(false)}  title={'ข้อมูลส่งคืนโอนหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <ReturnGuarantee policy={policy} /> 
        </Modal> 
      )}
      {openSubmit && (
        <Modal isOpen={openSubmit} setModal={setOpenSubmit} onClose={() => setOpenSubmit(false)}  
          title={'ปริ้นนิติกรรมสัญญา'} centered fullscreen okText={'ปริ้น'} onOk={onPrint}
          closeText={'ยกเลิก'}>
          <p class="text-body-tertiary lh-lg mb-0">ต้องการปริ้นนิติกรรมสัญญา</p>
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