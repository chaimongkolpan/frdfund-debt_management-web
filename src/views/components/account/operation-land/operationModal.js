import { useEffect, useState } from "react";
import { stringToDateTh, spDate, toCurrency } from "@utils";
import Textarea from "@views/components/input/Textarea";
import Textbox from "@views/components/input/Textbox";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  getPlanPay,
  savePlanPay,
  printPlanPay,
  saveDocumentPolicy,
} from "@services/api";

const PlanPay = (props) => {
  const { policy, isView } = props;
  const [date, setDate] = useState(null);
  const [data, setData] = useState([]);
  const interest = 0.0;
  const [installment, setInstallment] = useState(null);
  const [year, setYear] = useState(null);
  const [plans, setPlan] = useState(null);
  const [clearFile, setClear] = useState(false);
  const [files, setFiles] = useState(null);
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
  const cal = async () => {
    if (installment && year) {
      let pl = [];
      let total = policy?.loan_amount;
      const ins = Math.round((policy?.loan_amount / installment) * 100.0) / 100.0;
      const monthPerInstall = 12 * year / installment;
      const now = new Date();
      let y = now.getFullYear();
      let m = now.getMonth() + 1;
      let d = now.getDate();
      for(let i = 0;i < installment;i++) {
        m += monthPerInstall;
        if (m / 12 > 1) y += 1;
        m %= 12;
        if (i == installment - 1) {
          let inte = (total * interest / 100.0);
          let deduc = ins - inte;
          pl.push({ 
            pno: i + 1, pDate: new Date(y, m-1, d), ppp: total, yokma: total, interes: inte, dd: total, bl: 0,
            policyNo: policy.policyNO, intrate: interest, plubrate: 0, isKfk: 0
          });
          total -= deduc;
        } else {
          let inte = (total * interest / 100.0);
          let deduc = ins - inte;
          pl.push({ 
            pno: i + 1, pDate: new Date(y, m-1, d), ppp: ins, yokma: total, interes: inte, dd: deduc, bl: total - deduc,
            policyNo: policy.policyNO, intrate: interest, plubrate: 0, isKfk: 0
          });
          total -= deduc;
        }
      }
      await setPlan(pl);
    }
  }
  const save = async () => {
    const result = await savePlanPay(plans);
    if (result.isSuccess) {
      await fetchData();
    } 
  }
  const print = async () => {
    const result = await printPlanPay({ type: 'application/octet-stream', filename: 'แผนการชำระเงินคืน_' + (new Date().getTime()) + '.zip', data: { id_KFKPolicy: policy.id_KFKPolicy, policyNo: policy.policyNO }});
    if (result.isSuccess) {
    } 
  }
  const fetchData = async () => {
    const result = await getPlanPay(policy.id_KFKPolicy, policy.policyNO);
    if (result.isSuccess) {
      await setDate(result.data.policyStartDate)
      await setYear(result.data.numberOfYearPayback)
      await setInstallment(result.data.numberOfPeriodPayback)
      await setPlan(result.listData);
    } 
  }
  const RenderData = (item, index, checked) => {
    return (item && (
      <tr key={index}>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td>
                      <div className='d-flex justify-content-center'>
                        <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' >
                          <i className="far fa-eye"></i>
                        </button>
                      </div>
                    </td>
         <td>
                      <div className='d-flex justify-content-center'>
                        <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' >
                          <i className="far fa-edit"></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex justify-content-center'>
                        <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' >
                          <i className="far fa-trash"></i>
                        </button>
                      </div>
                    </td>
      </tr>
    ))
  }
  useEffect(() => {
    if (isView) {
      fetchData();
    } else {
      setDate(new Date())
    }
  },[])
  return (
    <>
      <form>
        <br />
        <div className="row g-3">
        <div className={`d-flex mb-3 flex-row-reverse ${isView ? 'd-none' : ''}`}>
        <button type="button" className="btn btn-primary btn-sm ms-2" ><span className="fas fa-plus fs-8"></span> เพิ่มดำเนินการในที่ดิน</button>
      </div>
        <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
              <th rowSpan="2">#</th>
                <th colSpan="2">ดำเนินการในที่ดิน</th>
                <th colSpan="11">หลักประกัน</th>
                <th colSpan="3">ยืมโฉนด</th>
                <th colSpan="3">คืนโฉนด</th>
              </tr>
              <tr>
                <th>ประเภทดำเนินการในที่ดิน</th>
                <th>รายละเอียด</th>
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>ดัชนีจัดเก็บหลักประกัน</th>
                <th>ประเภทหลักประกัน</th>
                <th>เจ้าของหลักประกัน</th>
                <th>เลขที่หลักประกัน</th>
                <th>จังหวัด</th>
                <th>อำเภอ</th>
                <th>ตำบล</th>
                <th>ไร่</th>
                <th>งาน</th>
                <th>ตารางวา</th>
                <th>เลขที่หนังสือ</th>
                <th>วันที่หนังสือ</th>
                <th>เหตุผล</th>
                <th>เลขที่หนังสือ</th>
                <th>วันที่หนังสือ</th>
                <th>หมายเหตุ</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={20}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="card shadow-none border my-2" data-component-card="data-component-card">
                      <div className="card-body p-0">
                        <div className="p-3 code-to-copy">
                          <h3 className="text-center">รายละเอียดดำเนินการในที่ดิน</h3><br />
                          <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                            <Textbox title={'ประเภทการดำเนินการในที่ดิน'} containerClassname={'mb-3'}  handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                            <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'}  handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                        </div>
                        <br/>
                        <div className="col-12 mt-3">
                                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                            </div>
                            <div className="row justify-content-center mt-3 mb-3">
                                <div className="col-auto">
                                <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                                </div>
                            </div>
                        </div>
                      </div>
           </div>
           {/* แก้ไขรายละเอียดดำเนินการในที่ดิน */}
           <div className="card shadow-none border my-2" data-component-card="data-component-card">
                      <div className="card-body p-0">
                        <div className="p-3 code-to-copy">
                          <h3 className="text-center">แก้ไขรายละเอียดดำเนินการในที่ดิน</h3><br />
                          <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
            <Textbox title={'ประเภทการดำเนินการในที่ดิน'} containerClassname={'mb-3'}  handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
            <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'}  handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
          </div>
          <br/>
          <div className="col-12 mt-3">
                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
              </div>
              <div className="row justify-content-center mt-3 mb-3">
                <div className="col-auto">
                  <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                </div>
              </div>
                        </div>
                      </div>
                    </div>


          <div className="col-12 mt-3">
            <div className="row g-3 justify-content-center">
              <div className="col-auto">
              
                  <button className="btn btn-success me-1 mb-1" type="button" onClick={() => save()}>บันทึก</button>
                  <button className="btn btn-danger me-1 mb-1" type="button" onClick={() => save()}>ลบข้อมูล</button>
            
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default PlanPay;