import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData, ToDateDb, getBookNo } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/guarantee/filterCheck";
import SearchTable from "@views/components/guarantee/searchCheckTable";
import Detail from "@views/components/guarantee/detail";
import PostPone from "@views/components/guarantee/postpone";
import Asset from "@views/components/guarantee/assetModal";
import Guarantor from "@views/components/guarantee/editGuaranteeModal";
import ReturnGuarantee from "@views/components/guarantee/returnGuaranteeModal";
import Spouse from "@views/components/legal-contract/spouseModal";
import Textbox from "@views/components/input/Textbox";
import BookNo from "@views/components/input/BookNo";
import Textarea from "@views/components/input/Textarea";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  saveAssetGuarantee,
  saveSendAssetGuarantee,
  searchGuaranteeCheck
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const LegalContractSend = () => {
  const allow_roles = [1,2,7,8,9];
  const can_action = allow_roles.includes(user?.role)
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
  const [openReturnGuarantee, setOpenReturnGuarantee] = useState(false);
  const [openSpouse, setOpenSpouse] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openViewEdit, setOpenViewEdit] = useState(false);
  const [openViewEditAsset, setOpenViewEditAsset] = useState(false);
  const [openViewReturn, setOpenViewReturn] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [clearFile, setClear] = useState(false);
  const [files, setFiles] = useState(null);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [remark, setRemark] = useState(null);
  const [oldfiles, setOldFiles] = useState(null);
  const handleViewEdit = async (item) => {
    await setBookNo(item.edit_contract_reason);
    await setOpenViewEdit(true);
  }
  const handleViewEditAsset = async (item) => {
    await setBookNo(item.edit_contract_manage_reason);
    await setOpenViewEditAsset(true);
  }
  const handleViewReturn = async (item) => {
    await setBookNo(item.return_contract_no);
    await setBookDate(item.return_contract_date);
    if (item.return_document_name) {
      await setOldFiles(item.return_document_name.split(','))
    } else await setOldFiles(null)
    await setOpenViewReturn(true);
  }
  const downloadReturn = (file) => {
    console.log('download', file)
  }
  const download = (file) => {
    console.log('download', file)
  }
  const onFileChange = async (files) => {
    if (files.length > 0) {
      await setFiles(files);
      await setClear(false);
    }
  }
  const handleEdit = async (selected) => {
    await setBookNo(null);
    await setBookDate(null);
    await setSelectedData(selected);
    await setOpenEdit(true);
  }
  const handleReturn = async (selected) => {
    await setBookNo(null);
    await setBookDate(null);
    await setSelectedData(selected);
    await setFiles(null);
    await setOpenReturn(true);
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchGuaranteeCheck(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const onSubmit = async () => {
    const param = selectedData.map(item => {
      return {
        id_AssetPolicy: item.id_AssetPolicy,
        debt_management_asset_no: 'กฟก ' + getBookNo() + bookNo,
        debt_management_asset_date: ToDateDb(bookDate),
      }
    });
    const result = await saveAssetGuarantee(param);
    if (result.isSuccess) {
      const form = new FormData();
      selectedData.forEach((item) => form.append("ids[]", item.id_AssetPolicy));
      form.append('TransferStatus', 'ตรวจสอบโอนหลักทรัพย์แล้ว');
      const resultSend = await saveSendAssetGuarantee(form);
      if (resultSend.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
        await setRemark(null);
        await onSearch(filter);
      } else {
        toast((t) => (
          <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
      }
    }  else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onEditSubmit = async () => {
    const param = selectedData.map(item => {
      return {
        id_AssetPolicy: item.id_AssetPolicy,
        edit_asset_reason: remark,
      }
    });
    const result = await saveAssetGuarantee(param);
    if (result.isSuccess) {
      const form = new FormData();
      selectedData.forEach((item) => form.append("ids[]", item.id_AssetPolicy));
      form.append('TransferStatus', 'แก้ไขโอนหลักทรัพย์');
      const resultSend = await saveSendAssetGuarantee(form);
      if (resultSend.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
        await setRemark(null);
        await onSearch(filter);
      } else {
        toast((t) => (
          <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
      }
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onReturnSubmit = async () => {
    if (files && files.length > 0) {
      const param = selectedData.map(item => {
        return {
          id_AssetPolicy: item.id_AssetPolicy,
          return_asset_no: 'กฟก ' + getBookNo() + bookNo,
          return_asset_date: ToDateDb(bookDate),
          return_asset_reason: remark,
        }
      });
      const result = await saveAssetGuarantee(param);
      if (result.isSuccess) {
        const form = new FormData();
        selectedData.forEach((item) => form.append("ids[]", item.id_AssetPolicy));
        form.append('TransferStatus', 'ส่งคืนโอนหลักทรัพย์');
        form.append('document_type', 'หนังสือส่งคืนโอนหลักทรัพย์');
        files.forEach((item) => form.append("files", item));
        const resultSend = await saveSendAssetGuarantee(form);
        if (resultSend.isSuccess) {
          toast((t) => (
            <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
          ));
          await setRemark(null);
          await onSearch(filter);
        } else {
          toast((t) => (
            <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
          ));
        }
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
  const handleReturnGuarantee = async (item) => {
    await setPolicy(item);
    await setOpenReturnGuarantee(true);
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
        <h4>ตรวจสอบหลักประกัน</h4>
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
                        handleEdit={handleEdit}
                        handleReturn={handleReturn}
                        handleViewEdit={handleViewEdit}
                        handleViewEditAsset={handleViewEditAsset}
                        handleViewReturn={handleViewReturn}
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
          {/* <Detail policy={policy} /> */}
          <Asset policy={policy} isView /> 
        </Modal>
      )}
      {openPlan && (
        <Modal isOpen={openPlan} setModal={setOpenPlan} hideOk onClose={() => setOpenPlan(false)}  title={'แผนการชำระเงินคืน'} closeText={'ปิด'} scrollable fullscreen>
          <PostPone policy={policy} isView />
        </Modal>
      )}
      {openAsset && (
        <Modal isOpen={openAsset} setModal={setOpenAsset} hideOk onClose={() => setOpenAsset(false)}  title={'เลื่อนโอนหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <Asset policy={policy} isView /> 
        </Modal> 
      )}
      {openGuarantor && (
        <Modal isOpen={openGuarantor} setModal={setOpenGuarantor} hideOk onClose={() => setOpenGuarantor(false)}  title={'ข้อมูลแก้ไขโอนหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <Guarantor policy={policy} isView /> 
        </Modal> 
      )}
      {openSpouse && (
        <Modal isOpen={openSpouse} setModal={setOpenSpouse} hideOk onClose={() => setOpenSpouse(false)}  title={'ข้อมูลแก้ไขโอนหลักทรัพย์ (บริหารสินทรัพย์)'} closeText={'ปิด'} scrollable fullscreen>
          <Guarantor policy={policy} isView /> 
        </Modal> 
      )}
      {openReturnGuarantee && (
        <Modal isOpen={openReturnGuarantee} setModal={setOpenReturnGuarantee} hideOk onClose={() => setOpenReturnGuarantee(false)}  title={'ข้อมูลส่งคืนโอนหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <ReturnGuarantee policy={policy} /> 
        </Modal> 
      )}
      {openViewEdit && (
        <Modal isOpen={openViewEdit} setModal={setOpenViewEdit} hideOk onClose={() => setOpenViewEdit(false)}  title={'ข้อมูลแก้ไขนิติกรรมสัญญา'} closeText={'ปิด'} scrollable size={'xl'}>
          <form>
            <br />
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 mt-3">
                <Textbox title={'หมายเหตุ'} disabled containerClassname={'mb-3'} value={bookNo} />
              </div>
            </div>
          </form>
        </Modal> 
      )}
      {openViewEditAsset && (
        <Modal isOpen={openViewEditAsset} setModal={setOpenViewEditAsset} hideOk onClose={() => setOpenViewEditAsset(false)}  title={'ข้อมูลแก้ไขนิติกรรมสัญญา (บริหารสินทรัพย์)'} closeText={'ปิด'} scrollable size={'xl'}>
          <form>
            <br />
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 mt-3">
                <Textbox title={'หมายเหตุ'} disabled containerClassname={'mb-3'} value={bookNo} />
              </div>
            </div>
          </form>
        </Modal> 
      )}
      {openViewReturn && (
        <Modal isOpen={openViewReturn} setModal={setOpenViewReturn} hideOk onClose={() => setOpenViewReturn(false)}  title={'ข้อมูลส่งคืนนิติกรรมสัญญา'} closeText={'ปิด'} scrollable size={'xl'}>
          <form>
            <br />
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'เลขที่หนังสือส่งคืน'} disabled containerClassname={'mb-3'} value={bookNo} />
              </div>
              <div class="col-sm-12 col-md-12 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือส่งคืน'} value={bookDate} disabled />
              </div>
              {oldfiles && (
                <div className="col-12">
                  {oldfiles.map((file, index) => (
                    <div key={index} className="d-flex pb-3 border-bottom border-translucent media px-2">
                      <div className="border p-2 rounded-2 me-2">
                        <img className="rounded-2" width={25} src="/assets/img/icons/file.png" alt="..." data-dz-thumbnail="data-dz-thumbnail" />
                      </div>
                      <div className="flex-1 d-flex flex-between-center">
                        <div>
                          <h6 data-dz-name="data-dz-name">{file}</h6>
                        </div>
                        <div className="dropdown">
                          <button className="btn btn-link text-body-quaternary btn-sm dropdown-toggle btn-reveal dropdown-caret-none" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="fas fa-ellipsis-h"></span>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end border border-translucent py-2">
                            <button className="dropdown-item" type="button" onClick={() => downloadReturn(file)}>Download File</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </Modal> 
      )}
      {openReturn && (
        <Modal isOpen={openReturn} setModal={setOpenReturn} onClose={() => setOpenReturn(false)}  title={`ส่งคืนโอนหลักทรัพย์`} closeText={'ปิด'} 
          scrollable fullscreen okText={'ส่งคืนโอนหลักทรัพย์'} onOk={onReturnSubmit} okColor={"danger"}>
          <form>
            <br />
            <div className="row">
              <div data-list='{"valueNames":["name","email","age"]}'>
                <div className="table-responsive mx-n1 px-1">
                  <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                    <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                      <tr>
                        <th rowSpan="2" style={{ minWidth: 30 }}>#</th>
                        <th colSpan="4">เกษตรกร</th>
                        <th colSpan="5">นิติกรรมสัญญา</th>
                        <th colSpan="10">หลักประกัน</th>
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
                      {(selectedData && selectedData.length > 0) ? (selectedData.map((item,index) => (
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
                <BookNo title={'เลขที่หนังสือส่งคืน'} subtitle={'กฟก ' + getBookNo()} containerClassname={'mb-3'} handleChange={(val) => setBookNo(val)} value={bookNo} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือส่งคืน'} value={bookDate} handleChange={(val) => setBookDate(val)} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                <Textarea title={'หมายเหตุ'} handleChange={(val) => setRemark(val)} containerClassname={'mb-3'} value={remark} />
              </div>
              <div className="col-12 mt-3">
                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
              </div>
              {/* <div className="row justify-content-center mt-3 mb-3">
                <div className="col-auto">
                  <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                </div>
              </div> */}
            </div>
          </form>
        </Modal> 
      )}
      {openEdit && (
        <Modal isOpen={openEdit} setModal={setOpenEdit} onClose={() => setOpenEdit(false)}  
          title={'แก้ไขโอนหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen okText={'แก้ไขโอนหลักทรัพย์'} onOk={onEditSubmit} okColor={"warning"}
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
                        <th colSpan="5">นิติกรรมสัญญา</th>
                        <th colSpan="10">หลักประกัน</th>
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
                      {(selectedData && selectedData.length > 0) ? (selectedData.map((item,index) => (
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
                          <td className="fs-9 text-center align-middle" colSpan={20}>
                            <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                <Textarea title={'หมายเหตุ'} handleChange={(val) => setRemark(val)} value={remark} />
              </div>
            </div>
          </form>
        </Modal> 
      )}
      {openSubmit && (
        <Modal isOpen={openSubmit} setModal={setOpenSubmit} onClose={() => setOpenSubmit(false)}  
          title={'ส่งบริหารสินทรัพย์'} closeText={'ปิด'} scrollable fullscreen okText={'ส่งบริหารสินทรัพย์'} onOk={onSubmit}
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
                        <th colSpan="5">นิติกรรมสัญญา</th>
                        <th colSpan="10">หลักประกัน</th>
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
                      {(selectedData && selectedData.length > 0) ? (selectedData.map((item,index) => (
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
                <BookNo title={'เลขที่หนังสือนำส่งจัดการหนี้'} subtitle={'กฟก ' + getBookNo()} containerClassname={'mb-3'} handleChange={(val) => setBookNo(val)} value={bookNo} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือนำส่งจัดการหนี้'} value={bookDate} handleChange={(val) => setBookDate(val)} />
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