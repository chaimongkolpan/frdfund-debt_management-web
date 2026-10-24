import { useState } from "react";
import { Spinner } from 'reactstrap'
import toast from "react-hot-toast";
import { toCurrency, getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";
import Filter from "@views/components/account/pending-debt-adjustment/filter";
import SearchTable from "@views/components/account/pending-debt-adjustment/searchTable";
import ValidationTable from "@views/components/account/pending-debt-adjustment/validationTable";
import DetailTable from "@views/components/account/pending-debt-adjustment/detailTable";
import HistoryTable from "@views/components/account/pending-debt-adjustment/historyTable";
import Textbox from "@views/components/input/Textbox";
import Textarea from "@views/components/input/Textarea";
import DropZone from "@views/components/input/DropZone";
import {
  downloadPendingDebtAdjustmentTemplate,
  validateImportPendingDebtAdjustment,
  downloadPendingDebtAdjustmentValidationResult,
  searchPendingDebtAdjustment,
  getPendingDebtAdjustmentDetail,
  downloadPendingDebtAdjustmentDocuments,
  confirmPendingDebtAdjustment,
  cancelPendingDebtAdjustment,
  searchHistoryPendingDebtAdjustment,
} from "@services/api";

const user = getUserData();
const PageContent = () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState(null);

  const [openUpload, setOpenUpload] = useState(false);
  const [files, setFiles] = useState(null);
  const [clearFile, setClear] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const [selected, setSelected] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [openHistory, setOpenHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState(null);
  const [historyResult, setHistoryResult] = useState(null);

  const [historySearchPolicyNo, setHistorySearchPolicyNo] = useState('');
  const [historySearchFilter, setHistorySearchFilter] = useState(null);
  const [historySearchResult, setHistorySearchResult] = useState(null);

  const onSearch = async (f) => {
    setLoading(true);
    setFilter(f);
    const result = await searchPendingDebtAdjustment(f);
    if (result?.isSuccess) setData(result); else setData(null);
    setLoading(false);
  }

  const handleDownloadTemplate = async () => {
    setLoading(true);
    const result = await downloadPendingDebtAdjustmentTemplate();
    setLoading(false);
    if (!result) {
      toast((t) => (<ToastError t={t} title={'ดาวน์โหลดแบบฟอร์ม'} message={'ดาวน์โหลดไม่สำเร็จ'} />));
    }
  }

  const handleOpenUpload = async () => {
    await setUploadResult(null);
    await setFiles(null);
    await setClear(true);
    await setOpenUpload(true);
  }
  const onFileChange = async (f) => {
    if (f.length > 0) {
      await setFiles(f);
      await setClear(false);
    }
  }
  const onSubmitUpload = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      form.append('file', files[0]);
      setLoading(true);
      const result = await validateImportPendingDebtAdjustment(form);
      setLoading(false);
      if (result) {
        await setUploadResult(result);
        if (!result.isSuccess) {
          toast((t) => (<ToastError t={t} title={'นำเข้าข้อมูล'} message={result.message ?? 'นำเข้าข้อมูลไม่สำเร็จ กรุณาตรวจสอบไฟล์'} />));
        }
      } else {
        toast((t) => (<ToastError t={t} title={'นำเข้าข้อมูล'} message={'นำเข้าข้อมูลไม่สำเร็จ กรุณาตรวจสอบไฟล์'} />));
      }
    } else {
      toast((t) => (<ToastError t={t} title={'นำเข้าข้อมูล'} message={'กรุณาเลือกไฟล์ที่ต้องการนำเข้า'} />));
    }
  }
  const handleDownloadValidationResult = async (result) => {
    setLoading(true);
    await downloadPendingDebtAdjustmentValidationResult({ import_filename: result.import_filename, rows: result.data });
    setLoading(false);
  }
  const handleDownloadDocumentsFromUpload = async (result) => {
    if (result.id_PendingDebtAdjustmentBatch) {
      setLoading(true);
      await downloadPendingDebtAdjustmentDocuments(result.id_PendingDebtAdjustmentBatch);
      setLoading(false);
    }
  }
  const handleCloseUpload = async () => {
    if (uploadResult?.all_valid) {
      await onSearch(filter ?? { status: ['รอดำเนินการ'], currentPage: 1, pageSize: process.env.VITE_PAGESIZE });
    }
    await setUploadResult(null);
    await setOpenUpload(false);
  }

  const handleDownload = async (item) => {
    setLoading(true);
    await downloadPendingDebtAdjustmentDocuments(item.id_PendingDebtAdjustmentBatch, `เอกสารปรับปรุงหนี้รอสะสาง_${item.import_filename}`);
    setLoading(false);
  }

  const handleViewDetail = async (item) => {
    setLoading(true);
    const result = await getPendingDebtAdjustmentDetail(item.id_PendingDebtAdjustmentBatch);
    setLoading(false);
    if (result?.isSuccess) {
      await setDetailData(result.data);
      await setOpenDetail(true);
    } else {
      toast((t) => (<ToastError t={t} title={'ดูรายละเอียดข้อมูล'} message={'ไม่สามารถเรียกข้อมูลได้'} />));
    }
  }

  const handleOpenConfirm = async (item) => {
    await setSelected(item);
    await setOpenConfirm(true);
  }
  const onConfirm = async () => {
    if (selected) {
      setLoading(true);
      const result = await confirmPendingDebtAdjustment(selected.id_PendingDebtAdjustmentBatch);
      setLoading(false);
      if (result?.isSuccess) {
        toast((t) => (<ToastContent t={t} title={'ยืนยันการปรับปรุงหนี้'} message={'ยืนยันการปรับปรุงหนี้รอสะสางสำเร็จ'} />));
        await setOpenConfirm(false);
        await onSearch(filter);
      } else {
        toast((t) => (<ToastError t={t} title={'ยืนยันการปรับปรุงหนี้'} message={result?.message ?? 'ยืนยันไม่สำเร็จ'} />));
      }
    }
  }

  const handleOpenCancel = async (item) => {
    await setSelected(item);
    await setCancelReason('');
    await setOpenCancel(true);
  }
  const onCancel = async () => {
    if (selected) {
      setLoading(true);
      const result = await cancelPendingDebtAdjustment({ id_PendingDebtAdjustmentBatch: selected.id_PendingDebtAdjustmentBatch, cancel_reason: cancelReason });
      setLoading(false);
      if (result?.isSuccess) {
        toast((t) => (<ToastContent t={t} title={'ยกเลิกการปรับปรุงหนี้'} message={'ยกเลิกชุดข้อมูลสำเร็จ'} />));
        await setOpenCancel(false);
        await onSearch(filter);
      } else {
        toast((t) => (<ToastError t={t} title={'ยกเลิกการปรับปรุงหนี้'} message={result?.message ?? 'ยกเลิกไม่สำเร็จ'} />));
      }
    }
  }

  const fetchHistory = async (params) => {
    setLoading(true);
    const result = await searchHistoryPendingDebtAdjustment(params);
    setLoading(false);
    return result?.isSuccess ? result : null;
  }
  const onSearchHistoryByItem = async (item) => {
    const params = { policyNo: item.policyNO, currentPage: 1, pageSize: process.env.VITE_PAGESIZE };
    const result = await fetchHistory(params);
    await setHistoryFilter(params);
    await setHistoryResult(result);
    await setOpenHistory(true);
  }
  const getHistoryModalData = async (params) => {
    const result = await fetchHistory(params);
    await setHistoryFilter(params);
    await setHistoryResult(result);
  }
  const onHistorySearchSubmit = async () => {
    if (historySearchPolicyNo) {
      const params = { policyNo: historySearchPolicyNo, currentPage: 1, pageSize: process.env.VITE_PAGESIZE };
      const result = await fetchHistory(params);
      await setHistorySearchFilter(params);
      await setHistorySearchResult(result);
    }
  }
  const getHistorySearchData = async (params) => {
    const result = await fetchHistory(params);
    await setHistorySearchFilter(params);
    await setHistorySearchResult(result);
  }
  const handleDownloadHistoryDocument = async (item) => {
    setLoading(true);
    await downloadPendingDebtAdjustmentDocuments(item.id_PendingDebtAdjustmentBatch);
    setLoading(false);
  }

  return (
    <>
      <div className="content">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h4 className="mb-0">ปรับปรุงหนี้รอสะสาง</h4>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-secondary" type="button" onClick={handleDownloadTemplate}>
              <span className="fas fa-download me-1"></span>ดาวน์โหลดฟอร์มนำเข้าเงินรับฝากรอสะสาง
            </button>
            <button className="btn btn-primary" type="button" onClick={handleOpenUpload}>
              <span className="fas fa-upload me-1"></span>อัปโหลดเอกสารฟอร์มนำเข้าเงินรับฝากรอสะสาง
            </button>
          </div>
        </div>
        <div className="mt-4">
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According
                  title={'รายการรอดำเนินการ'}
                  className={"my-4"}
                  children={(
                    <>
                      <Filter handleSubmit={onSearch} />
                      <br />
                      {data && (
                        <SearchTable result={data} filter={filter} getData={onSearch}
                          handleDownload={handleDownload}
                          handleViewDetail={handleViewDetail}
                          handleConfirm={handleOpenConfirm}
                          handleCancel={handleOpenCancel}
                        />
                      )}
                    </>
                  )}
                />
              </div>
              <div className="mb-9">
                <According
                  title={'ค้นหาประวัติการปรับปรุงหนี้รายสัญญา'}
                  className={"my-4"}
                  children={(
                    <>
                      <form className="row g-3">
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'เลขที่นิติกรรมสัญญา'} handleChange={(val) => setHistorySearchPolicyNo(val)} />
                        </div>
                        <div className="col-12">
                          <div className="row g-3 justify-content-center">
                            <div className="col-auto">
                              <button className="btn btn-success me-1 mb-1" type="button" onClick={() => onHistorySearchSubmit()}>
                                <span className="fas fa-search"></span> ค้นหา
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                      <br />
                      {historySearchResult && (
                        <HistoryTable result={historySearchResult} filter={historySearchFilter} getData={getHistorySearchData}
                          onDownload={handleDownloadHistoryDocument}
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

      {openUpload && (
        <Modal isOpen={openUpload} setModal={setOpenUpload} hideOk onClose={() => handleCloseUpload()} title={'อัปโหลดเอกสารฟอร์มนำเข้าเงินรับฝากรอสะสาง'} closeText={'ปิด'} scrollable size={'xl'}>
          <form>
            <br />
            <div className="row">
              <div className="col-12">
                <DropZone onChange={onFileChange} clearFile={clearFile} maxFiles={1} accept={'.xlsx'} />
              </div>
              <div className="col-12">
                <p className="text-muted fs-9 text-center mt-2 mb-0">รองรับเฉพาะไฟล์ Excel (.xlsx) เท่านั้น และอัปโหลดได้ครั้งละ 1 ไฟล์</p>
              </div>
              <div className="row justify-content-center mt-3 mb-3">
                <div className="col-auto">
                  <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitUpload}>นำไฟล์เข้าระบบ</button>
                </div>
              </div>
              {uploadResult && (
                <div className="col-12 mt-3">
                  <ValidationTable result={uploadResult} onDownloadResult={handleDownloadValidationResult} onDownloadDocuments={handleDownloadDocumentsFromUpload} />
                </div>
              )}
            </div>
          </form>
        </Modal>
      )}

      {openConfirm && (
        <Modal isOpen={openConfirm} setModal={setOpenConfirm} centered hideFooter onClose={() => setOpenConfirm(false)}>
          <div className="d-flex flex-column align-items-center text-center">
            <div className="rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 58, height: 58, background: '#FFF4E5' }}>
              <span className="fas fa-exclamation-triangle fs-3" style={{ color: '#E8A33D' }}></span>
            </div>
            <h5 className="mb-2">ยืนยันการปรับปรุงหนี้รอสะสาง</h5>
            <p className="text-muted">
              เมื่อยืนยันแล้ว ระบบจะดำเนินการปรับปรุงหนี้รอสะสางและปรับปรุงข้อมูลในการ์ดลูกหนี้ทันที<br />
              <b>การดำเนินการนี้ไม่สามารถยกเลิกหรือแก้ไขย้อนหลังได้</b> กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน
            </p>
            <div className="w-100 bg-light border rounded-2 p-3 text-start fs-9 mb-3">
              <div className="d-flex justify-content-between py-1"><span className="text-muted">ไฟล์นำเข้า</span><b>{selected?.import_filename}</b></div>
              <div className="d-flex justify-content-between py-1"><span className="text-muted">จำนวนรายการ</span><b>{selected?.total_items} รายการ</b></div>
              <div className="d-flex justify-content-between py-1"><span className="text-muted">ผลรวมจำนวนเงิน</span><b>{toCurrency(selected?.total_amount)} บาท</b></div>
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-outline-secondary px-4" type="button" onClick={() => setOpenConfirm(false)}>ยกเลิก</button>
              <button className="btn btn-success px-4" type="button" onClick={onConfirm}>ยืนยันการปรับปรุงหนี้รอสะสาง</button>
            </div>
          </div>
        </Modal>
      )}

      {openCancel && (
        <Modal isOpen={openCancel} setModal={setOpenCancel} centered hideFooter onClose={() => setOpenCancel(false)}>
          <div className="d-flex flex-column align-items-center text-center">
            <div className="rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 58, height: 58, background: '#FBEAEA' }}>
              <span className="fas fa-times-circle fs-3" style={{ color: '#C42B1C' }}></span>
            </div>
            <h5 className="mb-2">ยืนยันการยกเลิกการปรับปรุงหนี้รอสะสาง</h5>
            <p className="text-muted">
              เมื่อยืนยันการยกเลิกแล้ว ชุดข้อมูลการคำนวณนี้จะถูกยกเลิกและนำออกจากรายการรอดำเนินการทันที<br />
              <b>การดำเนินการนี้ไม่สามารถย้อนกลับได้ ระบบจะไม่ปรับปรุงข้อมูลในการ์ดลูกหนี้ของสัญญาชุดนี้</b> หากต้องการปรับปรุงหนี้รอสะสางอีกครั้ง ผู้ใช้ต้องนำเข้าข้อมูลใหม่ตามขั้นตอนเดิม
            </p>
            <div className="w-100 bg-light border rounded-2 p-3 text-start fs-9 mb-3">
              <div className="d-flex justify-content-between py-1"><span className="text-muted">ไฟล์นำเข้า</span><b>{selected?.import_filename}</b></div>
              <div className="d-flex justify-content-between py-1"><span className="text-muted">จำนวนรายการ</span><b>{selected?.total_items} รายการ</b></div>
              <div className="d-flex justify-content-between py-1"><span className="text-muted">ผลรวมจำนวนเงิน</span><b>{toCurrency(selected?.total_amount)} บาท</b></div>
            </div>
            <div className="w-100 mb-3 text-start">
              <Textarea title={'เหตุผลการยกเลิก'} value={cancelReason} handleChange={(val) => setCancelReason(val)} />
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-outline-secondary px-4" type="button" onClick={() => setOpenCancel(false)}>ย้อนกลับ</button>
              <button className="btn btn-danger px-4" type="button" onClick={onCancel}>ยืนยันการยกเลิกการปรับปรุง</button>
            </div>
          </div>
        </Modal>
      )}

      {openDetail && (
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk onClose={() => setOpenDetail(false)} title={'รายละเอียดข้อมูลปรับปรุงหนี้รอสะสาง'} closeText={'ปิด'} scrollable size={'xl'}>
          <DetailTable batch={detailData} onHistory={onSearchHistoryByItem} />
        </Modal>
      )}

      {openHistory && (
        <Modal isOpen={openHistory} setModal={setOpenHistory} hideOk onClose={() => setOpenHistory(false)} title={'ประวัติการปรับปรุงหนี้รอสะสาง'} closeText={'ปิด'} scrollable size={'xl'}>
          <HistoryTable result={historyResult} filter={historyFilter} getData={getHistoryModalData} onDownload={handleDownloadHistoryDocument} />
        </Modal>
      )}

      <Loading isOpen={isLoading} setModal={setLoading} centered scrollable size={'sm'} title={'กำลังประมวลผล'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default PageContent;
