import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, NavItem, NavLink, TabContent, TabPane, Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData, ToDateDb, getBookNo } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/legal-contract/filterCheck";
import SearchTable from "@views/components/legal-contract/searchCheckTable";
import Detail from "@views/components/legal-contract/detail";
import PlanPay from "@views/components/legal-contract/planPay";
import Asset from "@views/components/legal-contract/assetModal";
import Guarantor from "@views/components/legal-contract/guarantorModal";
import Spouse from "@views/components/legal-contract/spouseModal";
import FarmerModal from "@views/components/legal-contract/farmerModal";
import Textbox from "@views/components/input/Textbox";
import BookNo from "@views/components/input/BookNo";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchLegalCheck,
  saveDocumentPolicy,
  submitSendLegal,
} from "@services/api";

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
  const [card, setCard] = useState(null);
  const [cardPrint, setCardPrint] = useState(null);
  const [openCard, setOpenCard] = useState(false);
  const [tab, setTab] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openAsset, setOpenAsset] = useState(false);
  const [openGuarantor, setOpenGuarantor] = useState(false);
  const [openSpouse, setOpenSpouse] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openViewEdit, setOpenViewEdit] = useState(false);
  const [openViewEditAsset, setOpenViewEditAsset] = useState(false);
  const [openViewReturn, setOpenViewReturn] = useState(false);
  const [openDetailFarmer, setOpenDetailFarmer] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [clearFile, setClear] = useState(false);
  const [files, setFiles] = useState(null);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [oldfiles, setOldFiles] = useState(null);
  const handleViewEdit = async (item) => {
    await setBookNo(item.edit_contract_reason);
    await setOpenViewEdit(true);
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
  const onSubmitFile = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      form.append('ids[]', policy.id_KFKPolicy);
      form.append('document_type', 'เอกสารส่งคืนนิติกรรมสัญญา');
      files.forEach((item) => form.append("files", item));
      const result = await saveDocumentPolicy(form);
      if (result.isSuccess) {
        await setUploadStatus("success");
      } else {
        await setUploadStatus("fail");
      }
    } else {
      console.error('no file upload');
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
    const result = await searchLegalCheck(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const handleUpload = async (item) => {
    await setPolicy(item);
    if (item.document_name) {
      await setOldFiles(item.document_name.split(','))
    } else await setOldFiles(null)
    await setOpenUpload(true);
  }
  const handleCloseUpload = async () => {
    await onSearch(filter);
    await setOpenUpload(false);
  }
  const handleShowFarmerDetail = async (item) => {
    await setPolicy(item);
    await setOpenDetailFarmer(true);
  }
  const onSubmit = async () => {
    const param = selectedData.map(item => {
      return {
        id_KFKPolicy: item.id_KFKPolicy,
        policyNO: item.policyNO,
        policyStatus: "จัดส่งนิติกรรมสัญญา",
        sendStatus: "จัดส่งนิติกรรมสัญญา",
        branch_policy_no: 'กฟก ' + getBookNo() + bookNo,
        branch_policy_date: ToDateDb(bookDate),
      }
    });
    const result = await submitSendLegal(param);
    if (result.isSuccess) {
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
        <h4>ตรวจสอบนิติกรรมสัญญา</h4>
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
                        handleUpload={handleUpload}
                        handleEdit={handleEdit}
                        handleReturn={handleReturn}
                        handleViewEdit={handleViewEdit}
                        handleViewEditAsset={handleViewEditAsset}
                        handleViewReturn={handleViewReturn}
                        handleShowFarmerDetail={handleShowFarmerDetail}
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
          <PlanPay policy={policy} isView />
        </Modal>
      )}
      {openAsset && (
        <Modal isOpen={openAsset} setModal={setOpenAsset} hideOk onClose={() => setOpenAsset(false)}  title={'ข้อมูลหลักทรัพย์ค้ำประกัน'} closeText={'ปิด'} scrollable fullscreen>
          <Asset policy={policy} isView /> 
        </Modal> 
      )}
      {openDetailFarmer && (
        <FarmerModal isOpen={openDetailFarmer} setModal={setOpenDetailFarmer} onClose={() => setOpenDetailFarmer(false)} policy={policy} />
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
      {openViewEdit && (
        <Modal isOpen={openViewEdit} setModal={setOpenViewEdit} hideOk onClose={() => setOpenViewEdit(false)}  title={'ข้อมูลแก้ไขนิติกรรมสัญญา'} closeText={'ปิด'} scrollable size={'xl'}>
          <form>
            <br />
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
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
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
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
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'เลขที่หนังสือส่งคืน'} disabled containerClassname={'mb-3'} value={bookNo} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
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
      {openUpload && (
        <Modal isOpen={openUpload} setModal={setOpenUpload} hideOk onClose={() => handleCloseUpload()}  title={`อัพโหลดเอกสารนิติกรรมสัญญาเลขที่ ${policy?.policyNO}`} closeText={'ปิด'} scrollable size={'xl'}>
          <form>
            <br />
            <div className="row">
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
                            <button className="dropdown-item" type="button" onClick={() => download(file)}>Download File</button>
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
        <Modal isOpen={openReturn} setModal={setOpenReturn} onClose={() => setOpenReturn(false)}  title={`ส่งคืนนิติกรรมสัญญา`} closeText={'ปิด'} 
          scrollable fullscreen okText={'ส่งคืนนิติกรรมสัญญา'} onOk={onSubmit} okColor={"danger"}>
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
                <BookNo title={'เลขที่หนังสือส่งคืน'} subtitle={'กฟก ' + getBookNo()} containerClassname={'mb-3'} handleChange={(val) => setBookNo(val)} value={bookNo} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือส่งคืน'} value={bookDate} handleChange={(val) => setBookDate(val)} />
              </div>
              <div className="col-12">
                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
              </div>
              <div className="row justify-content-center mt-3 mb-3">
                <div className="col-auto">
                  <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                </div>
              </div>
            </div>
          </form>
        </Modal> 
      )}
      {openEdit && (
        <Modal isOpen={openEdit} setModal={setOpenEdit} onClose={() => setOpenEdit(false)}  
          title={'แก้ไขนิติกรรมสัญญา'} closeText={'ปิด'} scrollable fullscreen okText={'แก้ไขนิติกรรมสัญญา'} onOk={onSubmit} okColor={"warning"}
        >
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
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                <Textbox title={'หมายเหตุ'} handleChange={(val) => setBookNo(val)} containerClassname={'mb-3'} value={bookNo} />
              </div>
            </div>
          </form>
        </Modal> 
      )}
      {openSubmit && (
        <Modal isOpen={openSubmit} setModal={setOpenSubmit} onClose={() => setOpenSubmit(false)}  
          title={'จัดส่งบริหารสินทรัพย์'} closeText={'ปิด'} scrollable fullscreen okText={'จัดส่งบริหารสินทรัพย์'} onOk={onSubmit}
        >
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
                <BookNo title={'เลขที่หนังสือนำส่งจัดการหนี้'} subtitle={'กฟก ' + getBookNo()} containerClassname={'mb-3'} handleChange={(val) => setBookNo(val)} value={bookNo} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือนำส่งจัดการหนี้'} value={bookDate} handleChange={(val) => setBookDate(val)} />
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
export default LegalContractSend;