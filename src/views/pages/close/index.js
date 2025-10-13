import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Label, Input, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
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
  getReimbursementPlan,
  getReimbursementCard,
  printPlanRe,
  printCardRe,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const Close = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [planPrint, setPlanPrint] = useState(null);
  const [card, setCard] = useState(null);
  const [cardPrint, setCardPrint] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [closeDate, setCloseDate] = useState(null);
  const [closeDetail, setCloseDetail] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openRequestClose, setOpenRequestClose] = useState(false);
  const [openRequestRefund, setOpenRequestRefund] = useState(false);
  const [openRedeemAsset, setOpenRedeemAsset] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [tab, setTab] = useState(null);
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
    await setLoadBigData(true);
    const result = await getPrintClose({ id_KFKPolicy: policy.id_KFKPolicy, calDate: ToDateDb(closeDate, false)});
    if (result.isSuccess) {
      await printClose({ data: result.data, type: 'application/octet-stream', filename: 'ใบแจ้งการชำระเงิน.pdf' });
      await setLoadBigData(false);
    } else {
      await setLoadBigData(false);
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
    const handleShowPlan = async (item) => {
      await setPolicy(item);
      const param = {
        params: { id: item.id_KFKPolicy }
      };
      const result = await getReimbursementPlan(param);
      if (result.isSuccess) {
        const kfkcard = result?.data?.kfkCards[0];
        await setPlan(kfkcard?.transactions)
        await setPlanPrint(result?.data)
      } else {
        await setPlan(null)
        await setPlanPrint(null)
      }
      await setOpenPlan(true);
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
    const printPlan = async () => {
      await setLoadBigData(true);
      const param = { type: 'application/octet-stream', filename: 'ชำระหนี้คืน_' + (new Date().getTime()) + '.xlsx', data: planPrint };
      const result = await printPlanRe(param);
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
                          handleShowPlan={handleShowPlan}
                          handleShowCard={handleShowCard}
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
      {openPlan && (
        <Modal isOpen={openPlan} setModal={setOpenPlan} hideOk onClose={() => setOpenPlan(false)}  title={'ตารางผ่อนชำระหนี้คืน'} closeText={'ปิด'} scrollable fullscreen>
          <form>
            <div className="mb-1">
              <div className="card shadow-none border my-4" data-component-card="data-component-card">
                <div className="card-body p-0">
                  <div className="p-4 code-to-copy">
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'ชื่อ-สกุล'} disabled value={`${policy?.k_name_prefix}${policy?.k_firstname} ${policy?.k_lastname}`} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'เลขที่บัตรประชาชน'} disabled value={`${policy?.k_idcard}`} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'วันเริ่มสัญญา'} disabled value={stringToDateTh(policy?.policyStartDate, false)} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'วันครบสัญญา'} disabled value={stringToDateTh(policy?.policyEndDate, false)} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'เลขที่สัญญา'} disabled value={policy?.policyNO} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'ยอดเงินตามสัญญา'} disabled value={toCurrency(policy?.loan_amount ?? 0, 2)} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'วันครบกำหนดชำระ'} disabled value={policy?.spDate} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'อัตราดอกเบี้ย'} disabled value={toCurrency(policy?.interesRate ?? 0, 2) + '%'} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'จำนวนปี'} disabled value={policy?.numberOfYearPayback} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'จำนวนงวด'} disabled value={policy?.numberOfPeriodPayback} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'จำนวนงวดต่อปี (งวด)'} disabled value={policy?.numberOfPeriodPayback / policy?.numberOfYearPayback} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'ค่างวดตามแผน(บาท)'} disabled value={toCurrency(policy?.installment ?? 0, 2)} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12 mt-3" style={{ backgroundColor: 'honeydew', color: 'grey', height: 60 }}>
                        <div className="d-flex justify-content-evenly align-items-center h-100">
                          <span>{'เงินต้น : '}<b>{toCurrency(policy?.loan_amount ?? 0, 2)}</b></span>
                          <span>{'ดอกเบี้ย : '}<b>{toCurrency(policy?.interest ?? 0, 2)}</b></span>
                          <span>{'ยอดที่ต้องชำระ : '}<b>{toCurrency(policy?.loan_amount ?? 0, 2)}</b></span>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                        <div className="table-responsive mx-n1 px-1">
                          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                              <tr>
                                <th rowSpan="2">งวดที่</th>
                                <th rowSpan="2">วันที่ชำระเงิน</th>
                                <th rowSpan="2">เลขที่เอกสารบัญชี</th>
                                <th colSpan="2">ใบเสร็จรับเงิน</th>
                                <th rowSpan="2">จำนวนเงิน</th>
                                <th rowSpan="2">หมายเหตุ</th>
                              </tr>
                              <tr>
                                <th>วันที่</th>
                                <th>เลขที่</th>
                              </tr>
                            </thead>
                            <tbody className="list text-center align-middle" id="bulk-select-body">
                              {(plan && plan.length > 0) ? (plan.map((item,index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.transactionDate}</td>
                                  <td>{item.documentNo}</td>
                                  <td>{item.receiptDate}</td>
                                  <td>{item.receiptNo}</td>
                                  <td>{toCurrency(item.amountPaid, 2)}</td>
                                  <td>{item.remark}</td>
                                </tr>
                              ))) : (
                                <tr>
                                  <td className="fs-9 text-center align-middle" colSpan={7}>
                                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center my-3">
                        <div className="d-flex">
                          <button className="btn btn-primary btn-sm ms-2" type="button" onClick={() => printPlan()}><i className="fa fa-print"></i> ปริ้นตารางผ่อนชำระหนี้คืน</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
export default Close;