import { useEffect, useCallback, useState } from "react";
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
import DetailAsset from "@views/components/account/operation-land/DetailAssetModal";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchOperationLand,
} from "@services/api";

const user = getUserData();
const PageContent = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openRequestClose, setOpenRequestClose] = useState(false);
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
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk onClose={() => setOpenDetail(false)}  title={'ดำเนินการในที่ดิน'} closeText={'ปิด'} scrollable fullscreen>
          {/* <form>
            <br />
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'วันที่ปิดสัญญา'} disabled containerClassname={'mb-3'} value={stringToDateTh(new Date(), false)} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <button className="btn btn-primary ms-2" type="button" onClick={() => cal()}>คำนวณ</button>
              </div>
            </div>
          </form> */}
          <OperationLand  policy={policy} /> 
        </Modal>
      )}
      {openRequestClose && (
        <Modal isOpen={openRequestClose} setModal={setOpenRequestClose} hideOk onClose={() => setOpenRequestClose(false)}  title={'รายละเอียดหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
        <DetailAsset policy={policy} /> 
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