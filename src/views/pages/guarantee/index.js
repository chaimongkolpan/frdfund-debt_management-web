import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData, stringToDateTh, toCurrency, ToDateDb } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/guarantee/filterPrepare";
import SearchTable from "@views/components/guarantee/searchPrepareTable";
import PostPone from "@views/components/guarantee/postpone";
import Asset from "@views/components/guarantee/assetModal";
import Guarantor from "@views/components/guarantee/editGuaranteeModal";
import ReturnGuarantee from "@views/components/guarantee/returnGuaranteeModal";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchGuaranteePrepare,
  sendGuarantee,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const LegalContractPrepare = () => {
  const allow_roles = [1,2,4,7,8,9];
  const can_action = allow_roles.includes(user?.role)
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
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [transferDate, setTransferDate] = useState(null);
  const [transferType, setTransferType] = useState(null);
  const [clearFile, setClear] = useState(false);
  const [files, setFiles] = useState(null);
  const onFileChange = async (files) => {
    if (files.length > 0) {
      await setFiles(files);
      await setClear(false);
    }
  }
  const onSubmit = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      selected.forEach((item) => form.append("ids[]", item.id_AssetPolicy));
      form.append('branch_asset_no', bookNo);
      form.append('branch_asset_date', ToDateDb(bookDate));
      form.append('transfer_date', ToDateDb(transferDate));
      form.append('transfer_type', transferType);
      form.append('TransferStatus', 'สาขาโอนหลักทรัพย์');
      form.append('document_type', 'หนังสือโอนหลักทรัพย์');
      files.forEach((item) => form.append("files", item));
      const result = await sendGuarantee(form);
      if (result.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
        await onSearch(filter);
      } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
      }
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'ยังไม่ได้เลือกไฟล์'} />
      ));
      console.error('no file upload');
    }
  }
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
    await setTransferType('โอนตามมาตรา 37/9 วรรค 2');
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
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk onClose={() => setOpenDetail(false)}  title={'รายละเอียดหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <Asset policy={policy} isView /> 
        </Modal>
      )}
      {openPlan && (
        <Modal isOpen={openPlan} setModal={setOpenPlan} hideOk onClose={() => setOpenPlan(false)}  title={'เลื่อนโอนหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <PostPone policy={policy} />
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
          title={'โอนหลักทรัพย์'} centered fullscreen okText={'โอนหลักทรัพย์'} onOk={onSubmit}
          closeText={'ปิด'}>
          <form>
            <br />
            <div className="row">
              <div className="table-responsive mx-n1 px-1">
                <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                  <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                    <tr>
                      <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>#</th>
                      <th colSpan="4">เกษตรกร</th>
                      <th colSpan="5">นิติกรรมสัญญา</th>
                      <th colSpan="10">หลักทรัพย์</th>
                    </tr>
                    <tr>
                      <th>เลขบัตรประชาชน</th>
                      <th>คำนำหน้า</th>
                      <th>ชื่อ-นามสกุล</th>
                      <th>จังหวัด</th>
                      <th>เลขที่นิติกรรมสัญญา</th>
                      <th>ประเภทจัดการหนี้</th>
                      <th>วันที่ทำสัญญา</th>
                      <th>ยอดเงินตามสัญญา</th>
                      <th>จำนวนเงินที่ชดเชย</th>
                      <th>สถานะการโอนหลักทรัพย์</th>
                      <th>จำนวนวัน</th>
                      <th>ประเภทหลักทรัพย์</th>
                      <th>หลักทรัพย์เลขที่</th>
                      <th>จังหวัด</th>
                      <th>อำเภอ</th>
                      <th>ตำบล</th>
                      <th>ไร่</th>
                      <th>งาน</th>
                      <th>ตารางวา</th>
                    </tr>
                  </thead>
                  <tbody className="list text-center align-middle" id="bulk-select-body">
                    {(selected && selected.length > 0) ? (selected.map((item,index) => (
                      <tr key={index}>
                        <td className="fs-9 align-middle">{index + 1}</td>
                        <td>{item.k_idcard}</td>
                        <td>{item.k_name_prefix}</td>
                        <td>{(item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
                        <td>{item.loan_province}</td>
                        <td>{item.policyNO}</td>
                        <td>{item.loan_debt_type}</td>
                        <td>{item.policyStartDate ? stringToDateTh(item.policyStartDate, false) : '-'}</td>
                        <td>{toCurrency(item.loan_amount)}</td>
                        <td>{toCurrency(item.compensation_amount)}</td>
                        <td>{item.transferStatus}</td>
                        <td>{item.numberOfDay}</td>
                        <td>{item.assetType}</td>
                        <td>{item.collateral_no}</td>
                        <td>{item.collateral_province}</td>
                        <td>{item.collateral_district}</td>
                        <td>{item.collateral_sub_district}</td>
                        <td>{`${item.contract_area_rai ? item.contract_area_rai : 0}`}</td>
                        <td>{`${item.contract_area_ngan ? item.contract_area_ngan : 0}`}</td>
                        <td>{`${item.contract_area_sqaure_wa ? item.contract_area_sqaure_wa : 0}`}</td>
                      </tr>
                    ))) : (
                      <tr>
                        <td className="fs-9 text-center align-middle" colSpan={19}>
                          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'เลขที่หนังสือนำส่งสาขา'} value={bookNo} handleChange={(val) => setBookNo(val)} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือนำส่งสาขา'} value={bookDate} handleChange={(val) => setBookDate(val)} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <DatePicker title={'วันที่โอนหลักประกัน'} value={transferDate} handleChange={(val) => setTransferDate(val)} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <div className="form-floating needs-validation">
                  <select className="form-select" value={transferType} onChange={(e) => setTransferType(e.target?.value)}>
                    <option value="โอนตามมาตรา 37/9 วรรค 2">โอนตามมาตรา 37/9 วรรค 2</option>
                    <option value="ขาย">ขาย</option>
                  </select>
                  <label htmlFor="floatingSelectTeam">ประเภทการโอน</label>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
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
export default LegalContractPrepare;