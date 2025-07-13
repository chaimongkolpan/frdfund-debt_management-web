import { useEffect, useState } from "react";
import { stringToDateTh, toCurrency } from "@utils";
const ConfirmTable = (props) => {
  const { data, setAddPetition } = props;
  const [coop, setCoop] = useState(true);
  const [petition, setPetition] = useState(null);
  const [paymentType, setPaymentType] = useState("เบิกจ่ายเต็มจำนวน");
  const [sumTotal, setSumTotal] = useState(0);
  const [amountCheck, setAmountCheck] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [branchCheck, setBranchCheck] = useState([false, false, false, false, false, false, false]);
  const [cheques, setCheques] = useState([]);
  const AddCheque = () => {
    setCheques(prev => [
      ...prev,
      {
        total: 0,
        checked: [false, false, false, false, false, false, false],
        amount: [0, 0, 0, 0, 0, 0, 0],
      }
    ])
  }
  const RemoveCheque = () => {
    if (cheques.length > 1) {
      setCheques(cheques.slice(0, cheques.length - 1))
    }
  }
  const SaveOffice = () => {
    setAddPetition(1)
  }
  const SaveCheque = () => {
    setAddPetition(1)
  }
  const SaveBranch = () => {
    setAddPetition(1)
  }
  const ChequeChange = (index, key) => {
    const newSelected = [
      ...(cheques[index]?.checked.map((item, ind) => (key == ind ? !item : item))),
    ]
    var total = cheques[index]?.total + (newSelected[key] ? amountCheck[key] : -cheques[index]?.amount[key]);
    const che = {
        total: total,
        checked: newSelected,
        amount: [
          ...(cheques[index]?.amount.map((item, ind) => (key == ind ? (newSelected[key] ? amountCheck[key] : 0) : item))),
        ] 
      };
    setAmountCheck((prev) => {
      prev[key] = newSelected[key] ? 0 : cheques[index]?.amount[key];
      return [...prev]
    })
    setCheques((prev) => {
      prev[index] = che;
      return [...prev]
    })
  }
  const BranchChange = (index) => {
    const newSelected = [
      ...(branchCheck.map((item, ind) => (index == ind ? !item : item))),
    ]
    setBranchCheck((prev) => {
      prev[index] = !prev[index];
      return [...prev]
    })
    const sum = data.reduce((prev, item) => { 
      var total = 0;
      if (newSelected[0]) total += item.debt_manage_outstanding_principal_remain;
      if (newSelected[1]) total += item.debt_manage_accrued_interest_remain;
      if (newSelected[2]) total += item.debt_manage_fine_remain;
      if (newSelected[3]) total += item.debt_manage_litigation_expenses_remain;
      if (newSelected[4]) total += item.debt_manage_forfeiture_withdrawal_fee_remain;
      if (newSelected[5]) total += item.debt_manage_insurance_premium_remain;
      if (newSelected[6]) total += item.debt_manage_other_expenses_remain;
      return prev + total; 
    }, 0)
    setBranchTotal(sum)
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.proposal_committee_no}</td>
        <td>{item.proposal_committee_date ? stringToDateTh(item.proposal_committee_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
        <td>{item.debt_manage_creditor_type}</td>
        <td>{item.debt_manage_creditor_name}</td>
        <td>{item.debt_manage_creditor_province}</td>
        <td>{item.debt_manage_creditor_branch}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{toCurrency(item.debt_manage_outstanding_principal)}</td>
        <td>{toCurrency(item.debt_manage_accrued_interest)}</td>
        <td>{toCurrency(item.debt_manage_fine)}</td>
        <td>{toCurrency(item.debt_manage_litigation_expenses)}</td>
        <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee)}</td>
        {!coop && (
          <>
            <td>{toCurrency(item.debt_manage_insurance_premium)}</td>
            <td>{toCurrency(item.debt_manage_other_expenses)}</td>
          </>
        )}
        <td>{toCurrency(item.debt_manage_total_expenses)}</td>
        <td>{toCurrency(item.debt_manage_total)}</td>
        <td>{item.debt_manage_objective_details}</td>
        <td>{item.debt_manage_status}</td>
        <td>{item.collateral_type}</td>
        <td>{item.collateral_no}</td>
        <td>{item.debt_management_audit_status}</td>
      </tr>
    ))
  }
  useEffect(() => {
    if(data) {
      setCoop(data[0]?.debt_manage_creditor_type == 'สหกรณ์');
      const sum = data.reduce((prev, item) => { 
        var total = item.debt_manage_outstanding_principal_remain 
        + item.debt_manage_accrued_interest_remain
        + item.debt_manage_fine_remain
        + item.debt_manage_litigation_expenses_remain
        + item.debt_manage_forfeiture_withdrawal_fee_remain
        + item.debt_manage_insurance_premium_remain
        + item.debt_manage_other_expenses_remain
        return prev + total; 
      }, 0)
      setSumTotal(sum);
      const total = data.reduce((prev, item) => { 
        prev[0] += item.debt_manage_outstanding_principal_remain;
        prev[1] += item.debt_manage_accrued_interest_remain;
        prev[2] += item.debt_manage_fine_remain;
        prev[3] += item.debt_manage_litigation_expenses_remain;
        prev[4] += item.debt_manage_forfeiture_withdrawal_fee_remain;
        prev[5] += item.debt_manage_insurance_premium_remain;
        prev[6] += item.debt_manage_other_expenses_remain;
        return prev; 
      }, [0, 0, 0, 0, 0, 0, 0]);
      setAmountCheck(total);
    }
  },[data])
  return (
    <>
      <br />
      <div className="row">
        <div className="d-flex">
          <div className="square border border-1"  style={{ background: "#fff", height: 20, width: 30 }}></div>
          <div className="ms-1">ปกติ</div>
          <div className="ms-2 square border border-1"  style={{ background: "rgb(255, 242, 205)", height: 20, width: 30 }}></div>
          <div className="ms-1">เพิ่มเงิน</div>
        </div>
        <div data-list='{"valueNames":["name","email","age"]}'>
          <div className="table-responsive mx-n1 px-1">
            <table className="table table-sm table-striped table-bordered fs-9 mb-0">
              <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                <tr>
                  <th rowSpan="2" style={{ minWidth: 40 }}>#</th>
                  <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                  <th colSpan="4">เกษตรกร</th>
                  <th colSpan="4">เจ้าหนี้</th>
                  <th colSpan={coop ? "11" : "13"}>สัญญา</th>
                  <th>หลักทรัพย์ค้ำประกัน</th>
                  <th rowSpan="2">สถานะสัญญา</th>
                </tr>
                <tr>
                  <th>ครั้งที่เสนอคณะกรรมการ</th>
                  <th>วันที่เสนอคณะกรรมการ</th>
                  <th>เลขบัตรประชาชน</th>
                  <th>คำนำหน้า</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>จังหวัด</th>
                  <th>ประเภทเจ้าหนี้</th>
                  <th>สถาบันเจ้าหนี้</th>
                  <th>จังหวัดเจ้าหนี้</th>
                  <th>สาขาเจ้าหนี้</th>
                  <th>เลขที่สัญญา</th>
                  <th>เงินต้น</th>
                  <th>ดอกเบี้ย</th>
                  <th>ค่าปรับ</th>
                  <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                  <th>ค่าถอนการยึดทรัพย์</th>
                  {!coop && (
                    <>
                      <th>ค่าเบี้ยประกัน</th>
                      <th>ค่าใช้จ่ายอื่นๆ</th>
                    </>
                  )}
                  <th>รวมค่าใช้จ่าย</th>
                  <th>รวมทั้งสิ้น</th>
                  <th>วัตถุประสงค์การกู้</th>
                  <th>สถานะหนี้</th>
                  <th>ประเภทหลักประกัน</th>
                  <th>ประเภทและเลขที่หลักทรัพย์(เลขโฉนด)</th>
                </tr>
              </thead>
              <tbody className="list text-center align-middle">
                {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                  <tr>
                    <td className="fs-9 text-center align-middle" colSpan={coop ? 24 : 26}>
                      <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="p-4 code-to-copy">
          <div className="row g-3">
            <div className="card p-3" >
              <h3>
                <div className="d-flex justify-content-center">
                  <div>เจ้าหนี้</div>
                </div>
              </h3>
                <div className="row">
                  <div className="d-flex justify-content-center p-3">
                    <div className="col-sm-12 col-md-12 col-lg-8">
                      <div className="form-floating">
                        <select value={paymentType} className="form-select" onChange={(e) => setPaymentType(e.target?.value)}>
                          <option value="เบิกจ่ายเต็มจำนวน" >เบิกจ่ายเต็มจำนวน</option>
                          <option value="แยกเช็ค">แยกเช็ค</option>
                        </select>
                        <label for="floatingSelectPrivacy">ประเภทการเบิกจ่าย</label>
                      </div>
                    </div>
                  </div>
                  {paymentType == 'เบิกจ่ายเต็มจำนวน' && (
                    <div className="d-flex justify-content-center p-3">
                      <div className="col-sm-12 col-md-12 col-lg-8" >
                      <div className="card p-3">
                        <h5>
                          <div className="d-flex justify-content-center p-3">
                            <div>เบิกจ่ายเต็มจำนวน</div>
                          </div>
                        </h5>
                        <div className="input-group mb-3">
                          <span className="input-group-text">จำนวนเบิกจ่าย</span>
                          <input className="form-control" type="text" aria-label="รายละเอียดเช็ค" value={toCurrency(sumTotal)} disabled/>
                          <span className="input-group-text">บาท</span>
                        </div>
                        <div className="d-flex justify-content-center ">
                          <button className="btn btn-success" type="button" onClick={() => SaveOffice()}>บันทึก</button>
                        </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {paymentType == 'แยกเช็ค' && (
                    <div className="d-flex justify-content-center p-3">
                      <div className="col-sm-12 col-md-12 col-lg-8">
                        <div className="card p-3">
                          <h5 className="mb-3">
                            <div className="d-flex justify-content-center ">
                              <div>จ่ายแยกเช็ค</div>
                            </div>
                          </h5>
                          {(cheques && cheques.length > 0) && (cheques.map((item, index) => (
                                <div key={index} className="col-sm-12 col-md-12 col-lg-12 mb-2" >
                                  <div className="table-responsive mx-n1 px-1">
                                    <div className="d-flex flex-column">
                                      <div className="input-group mb-3">
                                        <span className="input-group-text">เช็คที่ {index + 1}</span>
                                        <span className="input-group-text">จำนวนเบิกจ่าย</span>
                                        <input className="form-control" type="text" aria-label="รายละเอียดเช็ค" disabled value={toCurrency(item.total)}/>
                                        <span className="input-group-text">บาท</span>
                                      </div>
                                      <div className="d-flex flex-wrap">
                                        <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[0]} onChange={() => ChequeChange(index, 0)}/> &nbsp;เงินต้น</div>
                                        <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[1]} onChange={() => ChequeChange(index, 1)}/> &nbsp;ดอกเบี้ย</div>
                                        <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[2]} onChange={() => ChequeChange(index, 2)}/> &nbsp;ค่าปรับ</div>
                                        <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[3]} onChange={() => ChequeChange(index, 3)}/> &nbsp;ค่าใช้จ่ายในการดำเนินคดี</div>
                                        <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[4]} onChange={() => ChequeChange(index, 4)}/> &nbsp;ค่าถอนการยึดทรัพย์</div>
                                        {!coop && (
                                          <>
                                            <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[5]} onChange={() => ChequeChange(index, 5)}/> &nbsp;ค่าเบี้ยประกัน</div>
                                            <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[6]} onChange={() => ChequeChange(index, 6)}/> &nbsp;ค่าใช้จ่ายอื่นๆ</div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                          )))}
                          <div className="d-flex justify-content-center ">
                            <button className="btn btn-primary me-2" type="button" onClick={() => AddCheque()}>เพิ่มเช็ค</button>
                            {cheques.length > 1 && (
                              <button className="btn btn-danger me-2" type="button" onClick={() => RemoveCheque()}>ลบเช็ค</button>
                            )}
                            <button className="btn btn-success" type="button" onClick={() => SaveCheque()}>บันทึก</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfirmTable;