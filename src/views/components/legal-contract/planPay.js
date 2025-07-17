import { useEffect, useState } from "react";
import { stringToDateTh, spDate, toCurrency } from "@utils";
import Textbox from "@views/components/input/Textbox";

const PlanPay = (props) => {
  const { policy, isView } = props;
  const [date, setDate] = useState(null);
  const interest = 0.0;
  const [installment, setInstallment] = useState(null);
  const [year, setYear] = useState(null);
  const [plans, setPlan] = useState(null);
  const cal = async () => {
    if (installment && year) {
      let pl = [];
      let total = policy?.loan_amount;
      const ins = policy?.loan_amount / installment;
      for(let i = 0;i < installment;i++) {
        if (i == installment - 1) {
          let inte = (total * interest / 100.0);
          let deduc = ins - inte;
          pl.push({ 
            pnO: i + 1, pDate: new Date(), ppP: total, yokma: total, interes: inte, dD: total, bL: 0,
            policyNo: policy.policyNo, inTrate: interest, pluBrate: 0, isKfk: 0
          });
          total -= deduc;
        } else {
          let inte = (total * interest / 100.0);
          let deduc = ins - inte;
          pl.push({ 
            pnO: i + 1, pDate: new Date(), ppP: ins, yokma: total, interes: inte, dD: deduc, bL: total - deduc,
            policyNo: policy.policyNo, inTrate: interest, pluBrate: 0, isKfk: 0
          });
          total -= deduc;
        }
      }
      await setPlan(pl);
    }
  }
  const save = async () => {
  }
  const fetchData = async () => {
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
          <div className="col-sm-12 col-md-6 col-lg-6">
            <Textbox title={'วันที่ทำสัญญา'} value={stringToDateTh(date, false)} disabled />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <Textbox title={'อัตราดอกเบี้ย'} value={interest.toLocaleString()} disabled />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <Textbox title={'ชำระทุกวันที่'} value={spDate(policy)} disabled />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <Textbox title={'ยอดเงินตามสัญญา'} value={toCurrency(policy?.loan_amount)} disabled />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <Textbox title={'จำนวนงวด'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <Textbox title={'จำนวนปี'} handleChange={(val) => setYear(val)} value={year} disabled={isView} />
          </div>
          <div className={`col-12 ${isView ? 'd-none' : ''}`}>
            <div className="row g-3 justify-content-center">
              <div className="col-auto">
                <button className="btn btn-primary me-1 mb-1" type="button" onClick={() => cal()}> คำนวณแผนการชำระเงินคืน</button>
              </div>
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="container text-center">
              <div className="row bg-body-highlight">
                <div className="col p-2 "><b>เงินต้น : {toCurrency(policy?.loan_amount)}</b></div>
                <div className="col p-2 "><b>ดอกเบี้ย : {interest.toLocaleString()}</b></div>
                <div className="col p-2 "><b>ยอดที่ต้องชำระ : {toCurrency(policy?.loan_amount)}</b></div>
              </div>
            </div>
          </div>
          <div className="col-12 mt-3">
            <div data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
              <div className="table-responsive mx-n1 px-1">
                <table className="table table-sm table-bordered fs-9 mb-0">
                  <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0', border: '#cdd0c7' }}>
                    <tr>
                      <th>งวดที่</th>
                      <th>กำหนดชำระเงิน</th>
                      <th>ยอดที่ต้องชำระ</th>
                      <th>ต้นยกมา</th>
                      <th>ดอกเบี้ย</th>
                      <th>ลดต้น	</th>
                      <th>คงเหลือ</th>
                    </tr>
                  </thead> 
                  <tbody className="list text-center align-middle">
                    {(plans && plans?.length > 0) && (
                      plans.map((plan, index) => (
                        <tr key={index}>
                          <td>{plan.pnO}</td>
                          <td>{stringToDateTh(plan.pDate, false)}</td>
                          <td>{toCurrency(plan.ppP)}</td>
                          <td>{toCurrency(plan.yokma)}</td>
                          <td>{toCurrency(plan.interes)}</td>
                          <td>{toCurrency(plan.dD)}</td>
                          <td>{toCurrency(plan.bL)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="row g-3 justify-content-center">
              <div className="col-auto">
                {isView ? (
                  <button className="btn btn-primary me-1 mb-1" type="button" onClick={() => save()}>ปริ้นแผนการชำระเงินคืน</button>
                ) : (
                  <button className="btn btn-success me-1 mb-1" type="button" onClick={() => save()}>บันทึกแผนการชำระเงินคืน</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default PlanPay;