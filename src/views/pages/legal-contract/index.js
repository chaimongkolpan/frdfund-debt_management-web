import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
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
import { 
  cleanData,
  searchLegalPrepare,
  printLegalContract,
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
  const [openDetail, setOpenDetail] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openAsset, setOpenAsset] = useState(false);
  const [openGuarantor, setOpenGuarantor] = useState(false);
  const [openSpouse, setOpenSpouse] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
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
  const onPrint = async () => {
    const id = policy.id_KFKPolicy
    const param = { type: 'application/octet-stream', filename: 'เอกสารนิติกรรมสัญญา_' + (new Date().getTime()) + '.zip', data: { id } };
    const result = await printLegalContract(param);
    if (result.isSuccess) {
      await setOpenPrint(false);
    }
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
          <Asset policy={policy} /> 
        </Modal> 
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
          title={'ปริ้นนิติกรรมสัญญา'} okText={'ปริ้น'} centered onOk={onPrint}
          closeText={'ยกเลิก'}>
          <p className="text-body-tertiary lh-lg mb-0">ต้องการปริ้นนิติกรรมสัญญา</p>
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