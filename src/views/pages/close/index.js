import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Label, Input } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData, ToDateDb } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/close/filter";
import SearchTable from "@views/components/close/searchTable";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchClose,
  getCalClose,
  getPrintClose,
  printClose,
  exportClose,
  requestClose,
  redeemClose,
  refundClose,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const Close = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [closeDate, setCloseDate] = useState(null);
  const [closeDetail, setCloseDetail] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openRequestClose, setOpenRequestClose] = useState(false);
  const [openRequestRefund, setOpenRequestRefund] = useState(false);
  const [openRedeemAsset, setOpenRedeemAsset] = useState(false);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [redeemStatus, setRedeemStatus] = useState(null);
  const [redeemDate, setRedeemDate] = useState(null);
  const [objective, setObjective] = useState(null);
  const [accNo, setAccountNo] = useState(null);
  const [accName, setAccountName] = useState(null);
  const [accBank, setAccountBank] = useState(null);
  const [receiptNo, setReceiptNo] = useState(null);
  const [receiptDate, setReceiptDate] = useState(null);
  const [receiptAmount, setReceiptAmount] = useState(null);
  const [clearFile, setClear] = useState(false);
  const [files, setFiles] = useState(null);
  const [showCal, setShowCal] = useState(false);
  const onFileChange = async (files) => {
    if (files.length > 0) {
      await setFiles(files);
      await setClear(false);
    }
  }
  const onSubmitRequest = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      form.append('id_KFKPolicy', policy.id_KFKPolicy);
      form.append('BookNo', bookNo);
      form.append('BookDate', ToDateDb(bookDate));
      files.forEach((item) => form.append("files", item));
      const result = await requestClose(form);
      if (result.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
      } else {
        toast((t) => (
          <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
      }
    } else {
      console.error('no file upload');
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onSubmitRedeem = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      form.append('id_KFKPolicy', policy.id_KFKPolicy);
      form.append('BookNo', bookNo);
      form.append('BookDate', ToDateDb(bookDate));
      form.append('TransferStatus', redeemStatus);
      form.append('TransferDate', ToDateDb(redeemDate));
      files.forEach((item) => form.append("files", item));
      const result = await redeemClose(form);
      if (result.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
      } else {
        toast((t) => (
          <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
      }
    } else {
      console.error('no file upload');
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onSubmitRefund = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      form.append('id_KFKPolicy', policy.id_KFKPolicy);
      form.append('Objective', objective);
      form.append('AccountNo', accNo);
      form.append('AccountName', accName);
      form.append('AccountBank', accBank);
      form.append('BookNo', bookNo);
      form.append('BookDate', ToDateDb(bookDate));
      form.append('ReceiptNo', receiptNo);
      form.append('ReceiptDate', ToDateDb(receiptDate));
      form.append('ReceiptAmount', receiptAmount);
      files.forEach((item) => form.append("files", item));
      const result = await refundClose(form);
      if (result.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
      } else {
        toast((t) => (
          <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
      }
    } else {
      console.error('no file upload');
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchClose(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const handleRequestClose = async (item) => {
    await setPolicy(item);
    await setFiles(null);
    await setBookNo(null);
    await setBookDate(null);
    await setOpenRequestClose(true);
  }
  const handleRedeemAsset = async (item) => {
    await setPolicy(item);
    await setFiles(null);
    await setBookNo(null);
    await setBookDate(null);
    await setRedeemStatus('จัดส่งหลักประกันแล้ว');
    await setRedeemDate(null);
    await setOpenRedeemAsset(true);
  }
  const handleRequestRefund = async (item) => {
    await setPolicy(item);
    await setFiles(null);
    await setBookNo(null);
    await setBookDate(null);
    await setObjective('ขอรับเงินคืน');
    await setAccountNo(null);
    await setAccountName(null);
    await setAccountBank(null);
    await setReceiptNo(null);
    await setReceiptDate(null);
    await setReceiptAmount(null);
    await setOpenRequestRefund(true);
  }
  const handleShowDetail = async (item) => {
    await setPolicy(item);
    await setCloseDate(new Date());
    await setShowCal(false);
    await setOpenDetail(true);
  }
  const print = async () => {
    const result = await getPrintClose({ id_KFKPolicy: policy.id_KFKPolicy, calDate: ToDateDb(closeDate, false)});
    if (result.isSuccess) {
      await printClose({ data: result.data, type: 'application/octet-stream', filename: 'ใบแจ้งการชำระเงิน.pdf' });
    } else {
      toast((t) => (
        <ToastError t={t} title={'ดาวน์โหลดข้อมูล'} message={'ดาวน์โหลดไม่สำเร็จ'} />
      ));
    }
  }
  const handleExportClose = async () => {
    await exportClose();
  }
  const cal = async () => {
    const result = await getCalClose({ id_KFKPolicy: policy.id_KFKPolicy, calDate: ToDateDb(new Date(), false)});
    if (result.isSuccess) {
      await setCloseDetail(result.data);
      await setShowCal(true);
    } else {
      await setCloseDetail(null);
      toast((t) => (
        <ToastError t={t} title={'ดาวน์โหลดข้อมูล'} message={'ดาวน์โหลดไม่สำเร็จ'} />
      ));
    }
  }
  return (
    <>
      <div className="content">
        <h4>ปิดสัญญา</h4>
        <div className="d-flex flex-row-reverse">
          <div>
            <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => handleExportClose()}>
              <span className="fa fa-download"></span> เอกสารยื่นคำร้อง
            </button>
          </div>
        </div>
        <div>
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
                          handleRequestClose={handleRequestClose}
                          handleRequestRefund={handleRequestRefund}
                          handleRedeemAsset={handleRedeemAsset}
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
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk onClose={() => setOpenDetail(false)}  title={'คำนวนยอดปิดสัญญา'} closeText={'ปิด'} scrollable fullscreen>
          <form>
            <br />
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <DatePicker title={'วันที่ปิดสัญญา'} containerClassname={'mb-3'} handleChange={(val) => setCloseDate(val)} value={closeDate} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <button className="btn btn-primary ms-2" type="button" onClick={() => cal()}>คำนวณ</button>
              </div>
              {showCal && (
                <div className="mb-1 mt-1">
                  <div className="card shadow-none border my-4" data-component-card="data-component-card">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                          <Textbox title={'ต้นเงินตามแผน'} disabled containerClassname={'mb-3'} value={toCurrency(policy.loan_amount)} />
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                          <Textbox title={'ต้นเงินยกมา'} disabled containerClassname={'mb-3'} value={toCurrency(policy.balance)} />
                        </div>
                        <div className="mb-3">
                          <div className="table-responsive mx-n1 px-1">
                            <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                              <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                                <tr>
                                  <th style={{ minWidth: 30 }}>#</th>
                                  <th>ค่าปรับยกมา ณ วันที่</th>
                                  <th>วันที่ปิดสัญญา</th>
                                  <th>รวม</th>
                                </tr>
                              </thead>
                              <tbody className="list text-center align-middle">
                                <tr>
                                  <td>ต้นเงินยกมา</td>
                                  <td>{toCurrency(0.00)}</td>
                                  <td>{toCurrency(policy.balance)}</td>
                                  <td>{toCurrency(closeDetail?.calRemain)}</td>
                                </tr>
                                <tr>
                                  <td>ค่าปรับ</td>
                                  <td>{toCurrency(closeDetail?.calFine)}</td>
                                  <td>{toCurrency(closeDetail?.calFineToday)}</td>
                                  <td>{toCurrency(closeDetail?.calFineTotal)}</td>
                                </tr>
                                <tr>
                                  <td>ค่าจัดการ</td>
                                  <td>{toCurrency(closeDetail?.calFee)}</td>
                                  <td>{toCurrency(closeDetail?.calFeeToday)}</td>
                                  <td>{toCurrency(closeDetail?.calFeeTotal)}</td>
                                </tr>
                                <tr>
                                  <td colSpan={3}><b>ยอดปิดบัญชี</b></td>
                                  <td>{toCurrency(closeDetail?.calTotal)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className={`d-flex justify-content-center`}>
                        <button className="btn btn-success" type="button" onClick={() => print()}>
                          <i className="fas fa-print"></i>ออกใบแจ้งหนี้ปิดสัญญา
                        </button>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Modal>
      )}
      {openRequestClose && (
        <Modal isOpen={openRequestClose} setModal={setOpenRequestClose} onClose={() => setOpenRequestClose(false)} title={'ยื่นคำร้องปิดสัญญา'} closeText={'ปิด'} scrollable fullscreen
          onOk={() => onSubmitRequest()} okText={'บันทีก'}>
          <form>
            <br />
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'เลขที่หนังสือ'} value={bookNo} handleChange={(val) => setBookNo(val)}  />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือ'} value={bookDate} handleChange={(val) => setBookDate(val)} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                <span>แบบคำร้องปิดสัญญา, บันทึกข้อความ, หนังสือเลขาธิการอนุมัติปิดบัญชี</span>
                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
              </div>
            </div>
          </form>
        </Modal>
      )}
      {openRedeemAsset && (
        <Modal isOpen={openRedeemAsset} setModal={setOpenRedeemAsset} onClose={() => setOpenRedeemAsset(false)} title={'โอนคืนหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen
          onOk={() => onSubmitRedeem()} okText={'บันทีก'}>
          <form>
            <br />
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'เลขที่หนังสือ'} value={bookNo} handleChange={(val) => setBookNo(val)}  />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือ'} value={bookDate} handleChange={(val) => setBookDate(val)} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <div className={`form-floating form-floating-advance-select`}>
                  <Label>{'สถานะเบิกหลักประกัน'}</Label>
                  <Input type="select" value={redeemStatus} 
                    className={`form-select`}
                    placeholder={'สถานะเบิกหลักประกัน'}
                    onChange={(newval) => setRedeemStatus(newval.target.value)} 
                  >
                    <option value={'จัดส่งหลักประกันแล้ว'}>{'จัดส่งหลักประกันแล้ว'}</option>
                    <option value={'ยังไม่ได้จัดส่งหลักประกัน'}>{'ยังไม่ได้จัดส่งหลักประกัน'}</option>
                  </Input>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <DatePicker title={'วันที่สาขาโอนหลักทรัพย์คืน'} value={redeemDate} handleChange={(val) => setRedeemDate(val)} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                <span>เอกสารรายการการโอนคืนหลักทรัพย์</span>
                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
              </div>
            </div>
          </form>
        </Modal>
      )}
      {openRequestRefund && (
        <Modal isOpen={openRequestRefund} setModal={setOpenRequestRefund} onClose={() => setOpenRequestRefund(false)}  title={'ทำเรื่องคืนเงิน'} closeText={'ปิด'} scrollable fullscreen
          onOk={() => onSubmitRefund()} okText={'บันทีก'}>
          <form>
            <br />
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <div className={`form-floating form-floating-advance-select`}>
                  <Label>{'ความประสงค์'}</Label>
                  <Input type="select" value={objective} 
                    className={`form-select`}
                    placeholder={'ความประสงค์'}
                    onChange={(newval) => setObjective(newval.target.value)} 
                  >
                    <option value={'ขอรับเงินคืน'}>{'ขอรับเงินคืน'}</option>
                    <option value={'ไม่ขอรับเงินคืน'}>{'ไม่ขอรับเงินคืน'}</option>
                  </Input>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'เลขที่บัญชี'} value={accNo} handleChange={(val) => setAccountNo(val)}  />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'ชื่อบัญชี'} value={accName} handleChange={(val) => setAccountName(val)}  />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'ธนาคาร'} value={accBank} handleChange={(val) => setAccountBank(val)}  />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                <span>แบบคำร้องขอรับเงินคืน, บันทึกข้อความ, หนังสือเสนอเลขาธิการอนุมัติคืนเงิน</span>
                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
              </div>
            </div>
            <div className="mb-1 mt-1">
              <div className="card shadow-none border my-4" data-component-card="data-component-card">
                <div className="card-body p-3">
                  <div className="row">
                    <h3 className="text-center">รายละเอียดการโอนเงิน</h3>
                    <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                      <Textbox title={'เลขที่หนังสือ'} value={bookNo} handleChange={(val) => setBookNo(val)} />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                      <DatePicker title={'วันที่หนังสือ'} value={bookDate} handleChange={(val) => setBookDate(val)} />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                      <Textbox title={'เลขใบสำคัญจ่าย'} value={receiptNo} handleChange={(val) => setReceiptNo(val)} />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                      <DatePicker title={'วันที่โอนเงิน'} value={receiptDate} handleChange={(val) => setReceiptDate(val)} />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                      <Textbox title={'จำนวนเงิน'} value={receiptAmount} handleChange={(val) => setReceiptAmount(val)} />
                    </div>
                  </div>
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
export default Close;