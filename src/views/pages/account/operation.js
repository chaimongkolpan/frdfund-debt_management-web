import { useEffect, useCallback, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/CustomModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/account/operation-land/filter";
import SearchTable from "@views/components/account/operation-land/searchTable";
import OperationLand from "@views/components/account/operation-land/operationModal";
import SurveyLand from "@views/components/account/operation-land/surveyModal";
import DetailAsset from "@views/components/account/operation-land/DetailAssetModal";
import Expropriation from "@views/components/account/operation-land/expropriationModal";
import LandLease from "@views/components/account/operation-land/landLeaseModal";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchOperationLand,
  updateOperationLand
} from "@services/api";

const user = getUserData();
const PageContent = () => {
  const navigate = useNavigate();
  const operationLandRef = useRef();
  const surveyRef =useRef();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openSurvey, setOpenSurvey] = useState(false);
  const [openRequestClose, setOpenRequestClose] = useState(false);
  const [openLandLease, setOpenLandLease] = useState(false);
  const [openExpropriation, setOpenExpropriation] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchOperationLand(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const handleShowDetail = async (item) => {
    await setPolicy(item);
    await setOpenRequestClose(true);
  }
  const handleOperation = async (item) => {
    await setPolicy(item);
    await setShowCal(false);
    await setOpenDetail(true);
  }
  const handleSurvey = async (item) => {
    await setPolicy(item);
    await setShowCal(false);
    await setOpenSurvey(true);
  }
  const handleLandLease = async (item) => {
    await setPolicy(item);
    await setShowCal(false);
    await setOpenLandLease(true);
  }
  const handleExpropriation = async (item) => {
    await setPolicy(item);
    await setShowCal(false);
    await setOpenExpropriation(true);
  }
  const submitOperation = async () => {
    const data = operationLandRef.current?.getData(); 
    console.log('Operation data:', data);
  
    if (typeof data?.collateralDetail?.flag1 === 'boolean') {
      data.collateralDetail.flag1 = data.collateralDetail.flag1 ? 'Y' : 'N';
    }
  
    if (typeof data?.collateralDetail?.flag2 === 'boolean') {
      data.collateralDetail.flag2 = data.collateralDetail.flag2 ? 'Y' : 'N';
    }
  
    if (typeof data?.collateralDetail?.flag3 === 'boolean') {
      data.collateralDetail.flag3 = data.collateralDetail.flag3 ? 'Y' : 'N';
    }
  
    const result = await updateOperationLand(data.collateralDetail);
    if (result.isSuccess) {
      console.log("save operation done");
    }
  };
  

  const submitSurvey = async() => {
    const data = surveyRef.current?.getData(); 
    console.log('survey data:', data);
  }
  const print = async () => {
    // print
  }
  const cal = async () => {
    await setShowCal(true);
  }
  return (
    <>
      <div className="content">
        <h4 className="mb-3">การดำเนินการในที่ดิน</h4>
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
                          handleShowDetail={handleShowDetail}
                          handleOperation={handleOperation}
                          handleSurvey={handleSurvey}
                          handleLandLease={handleLandLease}
                          handleExpropriation={handleExpropriation}
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
      {openDetail && (
        <Modal isOpen={openDetail} setModal={setOpenDetail} onClose={() => setOpenDetail(false)}  okText={'บันทึก'} onOk={submitOperation} title={'ดำเนินการในที่ดิน'} closeText={'ปิด'} scrollable fullscreen>
          <OperationLand ref={operationLandRef}  policy={policy} /> 
        </Modal>
      )}
      {openRequestClose && (
        <Modal isOpen={openRequestClose} setModal={setOpenRequestClose} hideOk onClose={() => setOpenRequestClose(false)}  title={'รายละเอียดหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
        <DetailAsset  policy={policy} isView /> 
        </Modal>
      )}
      {openSurvey && (
        <Modal isOpen={openSurvey} setModal={setOpenSurvey} onClose={() => setOpenSurvey(false)}  title={'การรังวัด'} closeText={'ปิด'} scrollable fullscreen okText={'บันทึก'} onOk={() => submitSurvey()} >
         <SurveyLand ref={surveyRef} policy={policy} isView />
        </Modal>
      )}
      {openLandLease && (
        <Modal isOpen={openLandLease} setModal={setOpenLandLease} onClose={() => setOpenLandLease(false)}  title={'การเช่า'} closeText={'ปิด'} okText={'บันทึก'} onOk={() => submitOperation()}  scrollable fullscreen>
         <LandLease policy={policy} isView />
        </Modal>
      )}
      {openExpropriation && (
        <Modal isOpen={openExpropriation} setModal={setOpenExpropriation} onClose={() => setOpenExpropriation(false)}  title={'การเวนคืน'} closeText={'ปิด'} okText={'บันทึก'} onOk={() => submitOperation()} scrollable fullscreen>
         <Expropriation policy={policy} isView />
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