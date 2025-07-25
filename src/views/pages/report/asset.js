import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, ToDateDb, saveDate, getDuration } from "@utils";
import According from "@views/components/panel/according";
import DatePicker from "@views/components/input/DatePicker";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { Spinner } from 'reactstrap'
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Modal from "@views/components/modal/CustomModal";
import { 
  getProvinces,
  getCreditors,
  getCreditorTypes,
  getYears,
  downloadReport,
  downloadOldReport,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const Report = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [year, setYear] = useState('all');
  const [province, setProvince] = useState('all');
  const [creditorType, setCreditorType] = useState('all');
  const [creditor, setCreditor] = useState('all');
  const [debtType, setDebtType] = useState('all');
  const [debtStatus, setDebtStatus] = useState('all');
  const [accountType, setAccountType] = useState('all');
  const [committee, setCommittee] = useState('');
  const [isLoad, setLoad] = useState(false);
  const [yearOp, setYearOp] = useState(null);
  const [provOp, setProvOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  const [openDownload, setOpenDownload] = useState(false);
  const [startDownload, setStartDownload] = useState(null);
  const [now, setNow] = useState(null);
  const [showTime, setShowTime] = useState(null);
  const filenames = [
    "รายงานทะเบียนคุมสัญญา.zip",
    "รายงานทะเบียนคุมทรัพย์สิน.zip",
    "รายงานการ์ดลูกหนี้เกษตรกร.zip",
    "รายงานแผนการผ่อนชำระหนี้ของเกษตรกร (รายตัว).zip",
    "รายงานการรับชำระเงินคืนของเกษตรกร.zip",
    "รายงานการปิดบัญชีลูกหนี้เกษตรกร.zip",
    "รายงานการคืนเงินส่วนเกินจากการปิดบัญชี.zip",
    "รายงานสถานะลูกหนี้คงเหลือ.zip",
    "รายงานการ์ดลูกหนี้รัฐบาล.zip",
    "รายงานการชำระหนี้แทนเกษตรกร.zip",
  ];
  const download = async (id) => {
    await setStartDownload(new Date());
    await setOpenDownload(true);
    const param = {
      reportId: id,
      accountType, 
      committee, 
      // startDate: startDate ? ToDateDb(startDate) : null, 
      // endDate: endDate ? ToDateDb(endDate) : null, 
      startDate: startDate ? saveDate(startDate) : null, 
      endDate: endDate ? saveDate(endDate) : null, 
      year, 
      province, creditorType, creditor, debtType, debtStatus ,
      type: 'application/octet-stream', filename: filenames[id - 1]
    }
    var myInterval = setInterval(async () => {
      await setNow(new Date());
    }, 1000);
/*
    //var a = document.createElement('a');
    //a.style.display = 'none';
    //a.href = '/Report/Download?' + param;
    //a.download = filename;
    //document.body.appendChild(a);
    //a.click();   
*/
    // if (await downloadReport(param, filenames[id - 1])) {
    //   setLoad(false);
    // } else {
    //   alert('ไม่สามารถดาวน์โหลดรายงานได้');
    //   setLoad(false);
    // }

    if (await downloadOldReport(param)) {
      toast((t) => (
        <ToastContent t={t} title={'ดาวน์โหลดรายงาน'} message={'ดาวน์โหลดรายงานสำเร็จ'} />
      ));
      clearInterval(myInterval);
      await setOpenDownload(false);
    } else {
      toast((t) => (
        <ToastError t={t} title={'ดาวน์โหลดรายงาน'} message={'ไม่สามารถดาวน์โหลดรายงานได้'} />
      ));
      clearInterval(myInterval);
      await setOpenDownload(false);
    }

    /*
    let reportId = 0;
    if (id == 1) reportId = 4; if (id == 2) reportId = 5;
    if (id == 3) reportId = 7; if (id == 4) reportId = 38;
    if (id == 5) reportId = 9; if (id == 6) reportId = 20;
    if (id == 7) reportId = 13; if (id == 8) reportId = 11;
    if (id == 9) reportId = 14; if (id == 10) reportId = 39;

    var param = 'id=' + reportId + '&';
    var start =startDate;
    if (start != null && start != undefined && start != '') param += 'start=' + saveDate(start) + '&';
    var stop = endDate;
    if (stop != null && stop != undefined && stop != '') param += 'stop=' + saveDate(stop) + '&';
    if (year != null && year != undefined && year != '') param += 'year=' + (year == 'all' ? '0' : year) + '&';
    var CreditorType = (creditorType == 'all' ? 'ทั้งหมด' : creditorType);
    if (CreditorType != null && CreditorType != undefined && CreditorType != '') param += 'creditortype=' + CreditorType + '&';
    var Creditor = (creditor == 'all' ? '0' : creditor);
    if (Creditor != null && Creditor != undefined && Creditor != '') param += 'creditor=' + Creditor + '&';
    var DebtType = (debtType == 'all' ? 'ทั้งหมด' : debtType);
    if (DebtType != null && DebtType != undefined && DebtType != '') param += 'debttype=' + DebtType + '&';
    var LegalNo = (accountType == 'all' ? 'ทั้งหมด' : accountType);
    if (LegalNo != null && LegalNo != undefined && LegalNo != '') param += 'legalno=' + LegalNo + '&';
    var ApproveNo = committee;
    if (ApproveNo != null && ApproveNo != undefined && ApproveNo != '') param += 'approveno=' + ApproveNo + '&';
    var ProvinceId = 0;
    if (ProvinceId != null && ProvinceId != undefined && ProvinceId != '') param += 'province=' + ProvinceId + '&';
    var AccountStatus = (debtStatus == 'all' ? 'ทั้งหมด' : debtStatus);
    if (AccountStatus != null && AccountStatus != undefined && AccountStatus != '') param += 'account_status=' + AccountStatus + '&'; 
    window.open('https://debtinfo.frdfund.org/report-old/report/Download?exportpdf=true&' + param, '_blank').focus();
    */
  }
  const onChange = async(key, val) => {
    if (key == 'province') {
      await setCreditorTypeOp(null);
      await setProvince(val)
      const resultCreditorType = await getCreditorTypes(val);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setCreditorType('all');
        await setCreditorOp(null);
        const resultCreditor = await getCreditors(val);
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setCreditor('all');
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
    } else if (key == 'creditorType') {
      await setCreditorOp(null);
      await setCreditorType(val);
      const resultCreditor = await getCreditors(province, val);
      if (resultCreditor.isSuccess) {
        const temp2 = resultCreditor.data.map(item => item.name);
        await setCreditorOp(temp2);
        await setCreditor('all');
      } else await setCreditorOp(null);
    } else {
      await setCreditor(val);
    }
  }
  async function fetchData() {
    const resultYear = await getYears();
    const resultProv = await getProvinces();
    if (resultYear.isSuccess) {
      await setYearOp(resultYear.data);
    } else await setYearOp(null);
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
      const resultCreditorType = await getCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        const resultCreditor = await getCreditors(null, temp1[0]);
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
    } else {
       await setProvOp(null);
       await setCreditorTypeOp(null);
       await setCreditorOp(null);
    }
  }
  useEffect(() => {
    setShowTime(getDuration(now, startDownload))
    return () => console.log('Clear data')
  }, [now]);
  //** ComponentDidMount
  useEffect(() => {
    fetchData();
    return () => console.log('Clear data')
  }, []);
  return (
    <>
      <div className="content">
        <h4>รายงาน</h4>
        <div>
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'บริหารสินทรัพย์'}
                  className={"my-4"}
                  children={(
                    <>
                      <form className="row g-3">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <Dropdown 
                            title={'รหัสบัญชีลูกหนี้เกษตร'} 
                            defaultValue={'all'} 
                            options={['1030401','1030404']}
                            handleChange={(val) => setAccountType(val)}
                            hasAll
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <Textbox title={'มติคณะกรรมการ'} handleChange={(val) => setCommittee(val)} />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <DatePicker title={'วันที่เริ่มต้น'}
                            value={startDate} 
                            handleChange={(val) => setStartDate(val)} 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <DatePicker title={'วันที่สิ้นสุด'}
                            value={endDate} 
                            handleChange={(val) => setEndDate(val)} 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          {yearOp && (
                            <Dropdown 
                              title={'ปีงบประมาณ'} 
                              defaultValue={'all'} 
                              options={yearOp}
                              handleChange={(val) => setYear(val)}
                              hasAll />
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          {provOp && (
                            <Dropdown 
                              title={'จังหวัด'} 
                              defaultValue={'all'} 
                              options={provOp}
                              handleChange={(val) => onChange('province', val)}
                              hasAll />
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          {creditorTypeOp && (
                            <Dropdown 
                              title={'ประเภทเจ้าหนี้'} 
                              defaultValue={'all'} 
                              options={creditorTypeOp}
                              handleChange={(val) => onChange('creditorType', val)}
                              hasAll
                              />
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          {creditorOp && (
                            <Dropdown 
                              title={'สถาบันเจ้าหนี้'} 
                              defaultValue={'all'} 
                              options={creditorOp}
                              handleChange={(val) => onChange('creditor', val)}
                              hasAll
                            />
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <Dropdown 
                            title={'ประเภทจัดการหนี้'} 
                            defaultValue={'all'} 
                            options={['NPL','NPA']}
                            handleChange={(val) => setDebtType(val)}
                            hasAll
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <Dropdown 
                            title={'สถานะบัญชี'} 
                            defaultValue={'all'} 
                            options={['เปิด','ปิด','ยกเลิก']}
                            handleChange={(val) => setDebtStatus(val)}
                            hasAll
                          />
                        </div>
                      </form>
                      <br />
                      <div className="row">
                        <div data-list='{"valueNames":["name","email","age"]}'>
                          <div className="table-responsive mx-n1 px-1">
                            <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                              <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                                <tr>
                                  <th style={{ minWidth: 30 }}>#</th>
                                  <th>รายงาน</th>
                                  <th>ดำเนินการ</th>
                                </tr>
                              </thead>
                              <tbody className="list align-middle">
                                <tr>
                                  <td className="text-center">1</td><td style={{ paddingLeft: 20 }}>รายงานทะเบียนคุมสัญญา</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(1)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">2</td><td style={{ paddingLeft: 20 }}>รายงานทะเบียนคุมทรัพย์สิน</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(2)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">3</td><td style={{ paddingLeft: 20 }}>รายงานการ์ดลูกหนี้เกษตรกร</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(3)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">4</td><td style={{ paddingLeft: 20 }}>รายงานแผนการผ่อนชำระหนี้ของเกษตรกร (รายตัว)</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(4)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">5</td><td style={{ paddingLeft: 20 }}>	รายงานการรับชำระเงินคืนของเกษตรกร</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(5)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">6</td><td style={{ paddingLeft: 20 }}>รายงานการปิดบัญชีลูกหนี้เกษตรกร</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(6)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">7</td><td style={{ paddingLeft: 20 }}>รายงานการคืนเงินส่วนเกินจากการปิดบัญชี</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(7)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">8</td><td style={{ paddingLeft: 20 }}>รายงานสถานะลูกหนี้คงเหลือ</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(8)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">9</td><td style={{ paddingLeft: 20 }}>รายงานการ์ดลูกหนี้รัฐบาล</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(9)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">10</td><td style={{ paddingLeft: 20 }}>รายงานการชำระหนี้แทนเกษตรกร</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => download(10)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {openDownload && (
        <Modal isOpen={openDownload} setModal={setOpenDownload} hideOk onClose={() => setOpenDownload(false)}  title={'ดาวน์โหลดรายงาน'} closeText={'ปิด'} scrollable size={'lg'}>
          <div className="d-flex flex-column align-items-center justify-content-center">
            <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
            <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
            <h1>{showTime}</h1>
          </div>
        </Modal> 
      )}
      <Loading isOpen={isLoad} setModal={setLoad} centered scrollable size={'lg'} title={'เรียกข้อมูลรายงาน'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default Report;