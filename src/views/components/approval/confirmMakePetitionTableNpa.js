import { useEffect, useState } from "react";
import { stringToDateTh, toCurrency } from "@utils";
const ConfirmTable = (props) => {
  const debt_management_type = 'NPA';
  const { data, setAddPetition, petition } = props;
  const [receiverType, setReceiveType] = useState("เจ้าหนี้");
  const [paymentType, setPaymentType] = useState("เบิกจ่ายเต็มจำนวน");
  const [sumTotal, setSumTotal] = useState(0);
  const [amountCheck, setAmountCheck] = useState([0, 0, 0, 0]);
  const [branchCheck, setBranchCheck] = useState([false, false, false, false]);
  const [branchTotal, setBranchTotal] = useState(0);
  const [cheques, setCheques] = useState([]);
  const AddCheque = () => {
    setCheques(prev => [
      ...prev,
      {
        total: 0,
        checked: [false, false, false, false],
        amount: [0, 0, 0, 0],
      }
    ])
  }
  const RemoveCheque = () => {
    if (cheques.length > 1) {
      setCheques(cheques.slice(0, cheques.length - 1))
    }
  }
  const onSave = () => {
    const ids = data.map(item => item.id_debt_management.toString());
    const pet = {
      id: petition ? petition.id_petition : 0,
      disbursement: receiverType,
      petition_amount: sumTotal,
      debt_payment_status: receiverType == 'สาขา' ? 'อยู่ระหว่างการโอนเงินให้สาขา' : (paymentType == 'เบิกจ่ายเต็มจำนวน' ? 'ชำระหนี้แทนแล้ว' : 'รอชำระหนี้แทน'),
      contract_status: 'ปกติ',
    };
    const map_petitions = data.map(item => {
      return {
        id_debt_management: item.id_debt_management.toString(),
        province: item.province,
      }
    })
    const t_cheque = cheques.map(item => {
      return {
        debt_management_type,
        cheques_no: '',
        cashier_check_amount: item.total,
        principle_flag: '0',
        interest_flag: '0',
        fine_flag: '0',
        litigation_expenses_flag: '0',
        forfeiture_withdrawal_fee_flag: '0',
        insurance_premium_flag: '0',
        other_expenses_flag: '0',
        NPA_property_sales_price_flag: item.checked[0] ? '1' : '0',
        NPA_NPL_creditors_receive_flag: item.checked[1] ? '1' : '0',
        NPA_litigation_expenses_flag: item.checked[2] ? '1' : '0',
        NPA_insurance_premium_flag: item.checked[3] ? '1' : '0',
      }
    });
    const param = {
      ids,
      debt_management_audit_status: receiverType == 'สาขา' ? 'อยู่ระหว่างการโอนเงินให้สาขา' : (paymentType == 'เบิกจ่ายเต็มจำนวน' ? 'ชำระหนี้แทนแล้ว' : 'อยู่ระหว่างการชำระหนี้แทน'),
      petition: pet,
      cheques: t_cheque,
      map_petitions,
    }
    setAddPetition(param)
  }
  const SaveOffice = () => {
    onSave()
  }
  const SaveCheque = () => {
    onSave()
  }
  const SaveBranch = () => {
    onSave()
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
      if (newSelected[0]) total += item.npA_property_sales_price;
      if (newSelected[1]) total += item.npL_creditors_receive;
      if (newSelected[2]) total += item.litigation_expenses;
      if (newSelected[3]) total += item.insurance_premium;
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
        <td>{item.npA_round}</td>
        <td>{item.title_document_no}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{toCurrency(item.estimated_price_creditors)}</td>
        <td>{toCurrency(item.npA_property_sales_price)}</td>
        <td>{toCurrency(item.npL_creditors_receive)}</td>
        <td>{toCurrency(item.litigation_expenses)}</td>
        <td>{toCurrency(item.insurance_premium)}</td>
        <td>{toCurrency(item.total_xpenses)}</td>
        <td>{toCurrency(item.frD_total_payment)}</td>
        <td>{item.debt_manage_objective_details}</td>
        <td>{item.debt_manage_status}</td>
        <td>{item.regulation_no}</td>
        <td>{item.collateral_type}</td>
        <td>{item.collateral_no}</td>
        <td>{item.debt_management_audit_status}</td>
      </tr>
    ))
  }
  useEffect(() => {
    if(data) {
      const sum = data.reduce((prev, item) => { 
        var total = item.npA_property_sales_price 
        + item.npL_creditors_receive
        + item.litigation_expenses
        + item.insurance_premium
        return prev + total; 
      }, 0)
      setSumTotal(sum);
      const total = data.reduce((prev, item) => { 
        prev[0] += item.npA_property_sales_price;
        prev[1] += item.npL_creditors_receive;
        prev[2] += item.litigation_expenses;
        prev[3] += item.insurance_premium;
        return prev; 
      }, [0, 0, 0, 0]);
      setAmountCheck(total);
      setCheques([])
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
                  <th colSpan={"14"}>สัญญา</th>
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
                  <th>รอบ NPA</th>
                  <th>เอกสารสิทธิ์</th>
                  <th>เลขที่สัญญา</th>
                  <th>ราคาประเมินของเจ้าหนี้</th>
                  <th>ราคาขายทรัพย์ NPA</th>
                  <th>เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)</th>
                  <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                  <th>ค่าเบี้ยประกัน</th>
                  <th>รวมค่าใช้จ่าย</th>
                  <th>รวมทั้งสิ้น</th>
                  <th>วัตถุประสงค์การกู้</th>
                  <th>สถานะหนี้</th>
                  <th>ซื้อทรัพย์ตามระเบียบฯ</th> 
                  <th>ประเภทหลักประกัน</th>
                  <th>ประเภทและเลขที่หลักทรัพย์(เลขโฉนด)</th>
                </tr>
              </thead>
              <tbody className="list text-center align-middle">
                {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                  <tr>
                    <td className="fs-9 text-center align-middle" colSpan={29}>
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
            <div className="d-flex justify-content-center p-3">
              <div className="col-sm-12 col-md-12 col-lg-8">
                <div className="form-floating">
                  <select value={receiverType} className="form-select" onChange={(e) => setReceiveType(e.target?.value)}>
                    <option value="เจ้าหนี้">เจ้าหนี้</option>
                    <option value="สาขา">สาขา</option>
                  </select>
                  <label for="floatingSelectPrivacy">เบิกจ่ายให้</label>
                </div>
              </div>
            </div>
          </div>
          <br />
          {receiverType == 'เจ้าหนี้' && (
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
                                          <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[0]} onChange={() => ChequeChange(index, 0)}/> &nbsp;ราคาขายทรัพย์ NPA</div>
                                          <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[1]} onChange={() => ChequeChange(index, 1)}/> &nbsp;เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)</div>
                                          <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[2]} onChange={() => ChequeChange(index, 2)}/> &nbsp;ค่าใช้จ่ายในการดำเนินคดี</div>
                                          <div className="me-3"><input className="form-check-input" type="checkbox" checked={item.checked[3]} onChange={() => ChequeChange(index, 3)}/> &nbsp;ค่าเบี้ยประกัน</div>
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
          )}
          {receiverType == 'สาขา' && (
            <div className="row g-3">
              <div className="card p-3" >
                <h3>
                  <div className="d-flex justify-content-center">
                    <div>โอนเงินให้สาขา</div>
                  </div>
                </h3>
                  <div className="row">
                    <div className="d-flex justify-content-center p-3">
                      <div className="col-sm-12 col-md-12 col-lg-8" >
                        <div className="card p-3">
                          <div className="col-sm-12 col-md-12 col-lg-12 mb-2" >
                            <div className="table-responsive mx-n1 px-1">
                              <div className="d-flex flex-column">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" id="Search_id_card">จำนวนเบิกจ่าย</span>
                                  <input className="form-control" type="text" aria-label="รายละเอียดเช็ค" value={toCurrency(branchTotal)} disabled/>
                                  <span className="input-group-text" id="Search_id_card">บาท</span>
                                </div>
                                <div className="d-flex flex-wrap">
                                  <div className="me-3"><input className="form-check-input" type="checkbox" checked={branchCheck[0]} onChange={() => BranchChange(0)}/> &nbsp;ราคาขายทรัพย์ NPA</div>
                                  <div className="me-3"><input className="form-check-input" type="checkbox" checked={branchCheck[1]} onChange={() => BranchChange(1)}/> &nbsp;เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)</div>
                                  <div className="me-3"><input className="form-check-input" type="checkbox" checked={branchCheck[2]} onChange={() => BranchChange(2)}/> &nbsp;ค่าใช้จ่ายในการดำเนินคดี</div>
                                  <div className="me-3"><input className="form-check-input" type="checkbox" checked={branchCheck[3]} onChange={() => BranchChange(3)}/> &nbsp;ค่าเบี้ยประกัน</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-center ">
                            <button className="btn btn-success" type="button" onClick={() => SaveBranch()}>บันทึก</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ConfirmTable;