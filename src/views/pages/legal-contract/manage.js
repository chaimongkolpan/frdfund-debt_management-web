import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData, ToDateDb } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/CustomModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/legal-contract/filterManage";
import SearchTable from "@views/components/legal-contract/searchManageTable";
import Detail from "@views/components/legal-contract/detail";
import PlanPay from "@views/components/legal-contract/planPay";
import Asset from "@views/components/legal-contract/assetModal";
import Guarantor from "@views/components/legal-contract/guarantorModal";
import BorrowModal from "@views/components/legal-contract/borrowModal";
import Spouse from "@views/components/legal-contract/spouseModal";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import { 
  cleanData,
  searchLegalCheck,
  saveDocumentPolicy,
  submitSendLegal,
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
  const [openBorrower, setOpenBorrower] = useState(false);
  const [openSpouse, setOpenSpouse] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openViewEdit, setOpenViewEdit] = useState(false);
  const [openViewEditAsset, setOpenViewEditAsset] = useState(false);
  const [openViewReturn, setOpenViewReturn] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
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
  const handleEdit = async (selected) => {
    await setBookNo(null);
    await setBookDate(null);
    await setSelectedData(selected);
    await setOpenEdit(true);
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
  const onSubmit = async () => {
    const param = selectedData.map(item => {
      return {
        id_KFKPolicy: item.id_KFKPolicy,
        policyNO: item.policyNO,
        policyStatus: "จัดส่งนิติกรรมสัญญา",
        sendStatus: "จัดส่งนิติกรรมสัญญา",
        branch_policy_no: bookNo,
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
  const handleBorrower = async (item) => {
    await setPolicy(item);
    await setOpenBorrower(true);
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
        <h4>บริหารสินทรัพย์ (นิติกรรมสัญญา)</h4>
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
                        handleBorrower={handleBorrower}
                        handleSpouse={handleSpouse} 
                        handleSubmit={handleSubmit} 
                        handleUpload={handleUpload}
                        handleEdit={handleEdit}
                        handleViewEdit={handleViewEdit}
                        handleViewEditAsset={handleViewEditAsset}
                        handleViewReturn={handleViewReturn}
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
      {openBorrower && (
        <BorrowModal isOpen={openBorrower} setModal={setOpenBorrower} onClose={() => setOpenBorrower(false)} policy={policy} />
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
      {openEdit && (
        <Modal isOpen={openEdit} setModal={setOpenEdit} onClose={() => setOpenEdit(false)}  
          title={'แก้ไขนิติกรรมสัญญา (บริหารสินทรัพย์)'} closeText={'ปิด'} scrollable fullscreen okText={'แก้ไขนิติกรรมสัญญา (บริหารสินทรัพย์)'} onOk={onSubmit} okColor={"warning"}
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
          title={'จัดเก็บนิติกรรมสัญญา'} closeText={'ปิด'} scrollable fullscreen okText={'จัดเก็บนิติกรรมสัญญา'} onOk={onSubmit}
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