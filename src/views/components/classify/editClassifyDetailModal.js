import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Textbox from "@views/components/input/Textbox";
import Textarea from "@views/components/input/Textarea";
import DatePicker from "@views/components/input/DatePicker";
import According from "@views/components/panel/according";
import { 
  getProvinces,
  getCreditorTypes,
  getCreditors,
  upsertGuarantorClassify,
  removeGuarantorClassify,
  getDebtManagementDetailClassify,
  updateDebtManagementDetailClassify,
} from "@services/api";

const FullModal = (props) => {
  const {isOpen, setModal, onClose, data} = props;
  const [isMounted, setMounted] = useState(false);
  const [collateral_type, setCollateralType] = useState(null);
  const [collateralDetail, setCollateralDetail] = useState(null);
  const [isOpenCollateralAdd, setOpenCollateralAdd] = useState(false);
  const [isOpenCollateralEdit, setOpenCollateralEdit] = useState(false);
  const [guarantorDetail, setGuarantorDetail] = useState(null);
  const [isOpenGuarantorAdd, setOpenGuarantorAdd] = useState(false);
  const [isOpenGuarantorEdit, setOpenGuarantorEdit] = useState(false);
  const [debts, setDebts] = useState(null);
  const [collaterals, setCollaterals] = useState(null);
  const [guarantors, setGuarantors] = useState(null);
  const [provinces, setProvOp] = useState(null);
  const [creditor_types, setCreditorTypeOp] = useState(null);
  const [creditors, setCreditorOp] = useState(null);
  const [creditor_type, setCreditorType] = useState(null);
  const [repayment, setRepaymentCon] = useState('');
  const [contract, setContractCon] = useState('');
  const [expense, setExpense] = useState(0);
  const toggle = () => setModal(!isOpen);

  const submitDebt = async () => {
    console.log('submit', debts)
    const result = await updateDebtManagementDetailClassify(debts);
    if (result.isSuccess) {
      await fetchData();
    }
  }
  const handleChangeDebt = async (key, val) => {
    if (key == 'debt_manage_creditor_type') {
      await setCreditorType(val);
    }
    if (key == 'debt_repayment_conditions') {
      let frd = debts?.frD_paymen_amount;
      let ex = 0;
      if (val == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { frd = debts?.debt_manage_total;}
      else if (val == 'ต้นเงิน90%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.9; ex = expense;}
      else if (val == 'ต้นเงิน50%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.5; ex = expense;}
      else if (val == 'ต้นเงิน40%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.4; ex = expense;}
      else if (val == 'ต้นเงิน30%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.3; ex = expense;}
      else if (val == 'ต้นเงิน50%') { frd = debts?.debt_manage_outstanding_principal * 0.5}
      await setRepaymentCon(val)
      await setDebts((prevState) => ({
        ...prevState,
        ...({frD_paymen_amount: frd + ex})
      }))
      let pri = debts?.contract_amount;
      let ex1 = 0;
      if (contract == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { pri = frd;}
      else if (contract == 'ต้นเงิน90%+ค่าใช้จ่าย') { pri = frd * 0.9; ex1 = expense;}
      else if (contract == 'ต้นเงิน50%+ค่าใช้จ่าย') { pri = frd * 0.5; ex1 = expense;}
      else if (contract == 'ต้นเงิน40%+ค่าใช้จ่าย') { pri = frd * 0.4; ex1 = expense;}
      else if (contract == 'ต้นเงิน30%+ค่าใช้จ่าย') { pri = frd * 0.3; ex1 = expense;}
      else if (contract == 'ต้นเงิน50%') { pri = (frd * 0.5)}
      await setDebts((prevState) => ({
        ...prevState,
        ...({contract_amount: pri + ex1})
      }))
    }
    if (key == 'contract_conditions') {
      const total = debts?.debt_manage_outstanding_principal + debts?.debt_manage_accrued_interest + debts?.debt_manage_fine;
      let frd = debts?.frD_paymen_amount;
      let ex = 0;
      if (repayment != 'ต้นเงิน50%') {
        if (repayment == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { frd = total;ex = expense;}
        else if (repayment == 'ต้นเงิน90%+ค่าใช้จ่าย') { frd = val * 0.9;ex = expense;}
        else if (repayment == 'ต้นเงิน50%+ค่าใช้จ่าย') { frd = val * 0.5;ex = expense;}
        else if (repayment == 'ต้นเงิน40%+ค่าใช้จ่าย') { frd = val * 0.4;ex = expense;}
        else if (repayment == 'ต้นเงิน30%+ค่าใช้จ่าย') { frd = val * 0.3;ex = expense;}
        else if (repayment == 'ต้นเงิน50%') { frd = val * 0.5}
      }
      let pri = debts?.contract_amount;
      let ex1 = 0;
      if (val == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { pri = frd; ex1 = expense;}
      else if (val == 'ต้นเงิน90%+ค่าใช้จ่าย') { pri = frd * 0.9; ex1 = expense;}
      else if (val == 'ต้นเงิน50%+ค่าใช้จ่าย') { pri = frd * 0.5; ex1 = expense;}
      else if (val == 'ต้นเงิน40%+ค่าใช้จ่าย') { pri = frd * 0.4; ex1 = expense;}
      else if (val == 'ต้นเงิน30%+ค่าใช้จ่าย') { pri = frd * 0.3; ex1 = expense;}
      else if (val == 'ต้นเงิน50%') { pri = (frd * 0.5)}
      await setContractCon(val)
      await setDebts((prevState) => ({
        ...prevState,
        ...({contract_amount: pri + ex1})
      }))
    }
    if (key == 'debt_manage_accrued_interest') {
      const total = debts?.debt_manage_outstanding_principal + val + debts?.debt_manage_fine + debts?.debt_manage_litigation_expenses + debts?.debt_manage_forfeiture_withdrawal_fee;
      await setDebts((prevState) => ({
        ...prevState,
        ...({debt_manage_total: total})
      }))
    }
    if (key == 'debt_manage_fine') {
      const total = debts?.debt_manage_outstanding_principal + debts?.debt_manage_accrued_interest + val + debts?.debt_manage_litigation_expenses + debts?.debt_manage_forfeiture_withdrawal_fee;
      await setDebts((prevState) => ({
        ...prevState,
        ...({debt_manage_total: total})
      }))
    }
    if (key == 'debt_manage_litigation_expenses') {
      const exp = val + debts?.debt_manage_forfeiture_withdrawal_fee;
      await setContractCon(exp);
      await setDebts((prevState) => ({
        ...prevState,
        ...({debt_manage_total_expenses: exp})
      }))
      const total = debts?.debt_manage_outstanding_principal + debts?.debt_manage_accrued_interest + debts?.debt_manage_fine;
      await setDebts((prevState) => ({
        ...prevState,
        ...({debt_manage_total: total + exp})
      }))
      let frd = debts?.frD_paymen_amount;
      if (repayment != 'ต้นเงิน50%') {
        if (repayment == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { frd = total;}
        else if (repayment == 'ต้นเงิน90%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.9;}
        else if (repayment == 'ต้นเงิน50%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.5;}
        else if (repayment == 'ต้นเงิน40%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.4;}
        else if (repayment == 'ต้นเงิน30%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.3;}
        await setDebts((prevState) => ({
          ...prevState,
          ...({frD_paymen_amount: frd + exp})
        }))
      }
      if (contract != 'ต้นเงิน50%') {
        let pri = debts?.contract_amount;
        if (contract == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { pri = frd;}
        else if (contract == 'ต้นเงิน90%+ค่าใช้จ่าย') { pri = frd * 0.9;}
        else if (contract == 'ต้นเงิน50%+ค่าใช้จ่าย') { pri = frd * 0.5;}
        else if (contract == 'ต้นเงิน40%+ค่าใช้จ่าย') { pri = frd * 0.4;}
        else if (contract == 'ต้นเงิน30%+ค่าใช้จ่าย') { pri = frd * 0.3;}
        await setDebts((prevState) => ({
          ...prevState,
          ...({contract_amount: pri + exp})
        }))
      }
    }
    if (key == 'debt_manage_forfeiture_withdrawal_fee') {
      const exp = debts?.debt_manage_litigation_expenses + val;
      await setContractCon(exp);
      await setDebts((prevState) => ({
        ...prevState,
        ...({debt_manage_total_expenses: exp})
      }))
      const total = debts?.debt_manage_outstanding_principal + debts?.debt_manage_accrued_interest + debts?.debt_manage_fine;
      await setDebts((prevState) => ({
        ...prevState,
        ...({debt_manage_total: total + exp})
      }))
      let frd = debts?.frD_paymen_amount;
      if (repayment != 'ต้นเงิน50%') {
        if (repayment == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { frd = total;}
        else if (repayment == 'ต้นเงิน90%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.9;}
        else if (repayment == 'ต้นเงิน50%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.5;}
        else if (repayment == 'ต้นเงิน40%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.4;}
        else if (repayment == 'ต้นเงิน30%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal * 0.3;}
        await setDebts((prevState) => ({
          ...prevState,
          ...({frD_paymen_amount: frd + exp})
        }))
      }
      if (contract != 'ต้นเงิน50%') {
        let pri = debts?.contract_amount;
        if (contract == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { pri = frd;}
        else if (contract == 'ต้นเงิน90%+ค่าใช้จ่าย') { pri = frd * 0.9;}
        else if (contract == 'ต้นเงิน50%+ค่าใช้จ่าย') { pri = frd * 0.5;}
        else if (contract == 'ต้นเงิน40%+ค่าใช้จ่าย') { pri = frd * 0.4;}
        else if (contract == 'ต้นเงิน30%+ค่าใช้จ่าย') { pri = frd * 0.3;}
        await setDebts((prevState) => ({
          ...prevState,
          ...({contract_amount: pri + exp})
        }))
      }
    }
    if (key == 'debt_manage_outstanding_principal') {
      const total = val + debts?.debt_manage_accrued_interest + debts?.debt_manage_fine;
      await setDebts((prevState) => ({
        ...prevState,
        ...({debt_manage_total: total + expense})
      }))
      let frd = debts?.frD_paymen_amount;
      let ex = 0;
      if (repayment != 'ต้นเงิน50%') {
        if (repayment == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { frd = total;ex = expense;}
        else if (repayment == 'ต้นเงิน90%+ค่าใช้จ่าย') { frd = val * 0.9;ex = expense;}
        else if (repayment == 'ต้นเงิน50%+ค่าใช้จ่าย') { frd = val * 0.5;ex = expense;}
        else if (repayment == 'ต้นเงิน40%+ค่าใช้จ่าย') { frd = val * 0.4;ex = expense;}
        else if (repayment == 'ต้นเงิน30%+ค่าใช้จ่าย') { frd = val * 0.3;ex = expense;}
        else if (repayment == 'ต้นเงิน50%') { frd = val * 0.5}
        await setDebts((prevState) => ({
          ...prevState,
          ...({frD_paymen_amount: frd + ex})
        }))
      }
      if (contract != 'ต้นเงิน50%') {
        let pri = debts?.contract_amount;
        let ex1 = 0;
        if (contract == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { pri = frd;ex1 = expense;}
        else if (contract == 'ต้นเงิน90%+ค่าใช้จ่าย') { pri = frd * 0.9;ex1 = expense;}
        else if (contract == 'ต้นเงิน50%+ค่าใช้จ่าย') { pri = frd * 0.5;ex1 = expense;}
        else if (contract == 'ต้นเงิน40%+ค่าใช้จ่าย') { pri = frd * 0.4;ex1 = expense;}
        else if (contract == 'ต้นเงิน30%+ค่าใช้จ่าย') { pri = frd * 0.3;ex1 = expense;}
        else if (contract == 'ต้นเงิน50%') { pri = frd * 0.5}
        await setDebts((prevState) => ({
          ...prevState,
          ...({contract_amount: pri + ex1})
        }))
      }
    }
    await setDebts((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }

  const addCollateral = async() => {
    await setCollateralDetail({ id_debt_management: debts.id_debt_management, title_document_type: 'โฉนด' })
    await setOpenCollateralAdd(true)
    await setOpenCollateralEdit(true)
  }
  const editCollateral = async(item) => {
    await setCollateralDetail(item)
    await setOpenCollateralAdd(false)
    await setOpenCollateralEdit(true)
  }
  const saveCollateral = async() => {
    const result = await upsertGuarantorClassify(guarantorDetail);
    if (result.isSuccess) {
      await fetchData();
      await setOpenCollateralEdit(false)
      await setCollateralDetail(null)
    }
  }
  const removeCollateral = async(item) => {
    const result = await removeGuarantorClassify(item);
    if (result.isSuccess) {
      await fetchData();
      await setOpenCollateralEdit(false)
      await setCollateralDetail(null)
    }
  }
  const handleChangeCollateral = async (key, val) => {
    if (key == 'title_document_type') {
      await setCollateralType(val);
    }
    await setCollateralDetail((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }

  const addGuarantor = async() => {
    await setGuarantorDetail({ id_debt_management: debts.id_debt_management })
    await setOpenGuarantorAdd(true)
    await setOpenGuarantorEdit(true)
  }
  const editGuarantor = async(item) => {
    await setGuarantorDetail(item)
    await setOpenGuarantorAdd(false)
    await setOpenGuarantorEdit(true)
  }
  const saveGuarantor = async() => {
    const result = await upsertGuarantorClassify(guarantorDetail);
    if (result.isSuccess) {
      await fetchData();
      await setOpenGuarantorEdit(false)
      await setGuarantorDetail(null)
    }
  }
  const removeGuarantor = async(item) => {
    const result = await removeGuarantorClassify(item);
    if (result.isSuccess) {
      await fetchData();
      await setOpenGuarantorEdit(false)
      await setGuarantorDetail(null)
    }
  }
  const handleChangeGuarantor = async (key, val) => {
    await setGuarantorDetail((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const getProvince = async () => {
    const resultProv = await getProvinces();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
    } else {
      await setProvOp(null);
    }
    await setMounted(true);
  }
  const getCreditorType = async () => {
    const result = await getCreditorTypes(null);
    if (result.isSuccess) {
      const temp = result.data.map(item => item.name);
      await setCreditorTypeOp(temp);
    } else {
      await setCreditorTypeOp(null);
    }
    await setMounted(true);
  }
  const getCreditor = async () => {
    const result = await getCreditors(null, creditor_type);
    if (result.isSuccess) {
      const temp = result.data.map(item => item.name);
      await setCreditorOp(temp);
    } else {
      await setCreditorOp(null);
    }
    await setMounted(true);
  }
  const fetchData = async() => {
    const result = await getDebtManagementDetailClassify(data.id_card, data.province, data.creditor_type);
    if (result.isSuccess) {
      const debt = result.contracts.find(x => x.id_debt_management == data.id_debt_management)
      console.log('debt', debt);
      await setDebts({
        ...debt,
        debt_management_audit_status: (debt.debt_management_audit_status ?? 'อยู่ระหว่างการสอบยอด'),
        debt_manage_creditor_type: (debt.debt_manage_creditor_type ?? creditor_type),
        debt_manage_creditor_name: (debt.debt_manage_creditor_name ?? (creditors ? creditors[0] : '')),
        debt_repayment_conditions: (debt.debt_repayment_conditions ?? 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน'),
        contract_conditions: (debt.contract_conditions ?? 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน'),
        compensation_conditions: (debt.compensation_conditions ?? 'ไม่มีการชดเชย'),
        debt_manage_objective: (debt.debt_manage_objective ?? 'เพื่อการเกษตร'),
        debt_manage_legal_action: (debt.debt_manage_legal_action ?? 'ไม่มี'),
        debt_agreement: (debts?.debt_agreement ?? 'ตามข้อตกลง')
      });
      await setCreditorType(debt.debt_manage_creditor_type);
      if (debt.debt_manage_creditor_type == "สหกรณ์") await setExpense(debt.debt_manage_total_expenses);
      else await setExpense(0);
      const colls = result.collaterals.filter(x => x.id_debt_management == debt.id_debt_management);
      await setCollaterals(colls);
      const guas = result.guarantors.filter(x => x.id_debt_management == debt.id_debt_management);
      await setGuarantors(guas);
    } else {
      await setDebts(null);
      await setCollaterals(null);
      await setGuarantors(null);
    }
  }
  useEffect(() => {
    getCreditor(creditor_type);
  },[creditor_type])
  useEffect(() => {
    if (!isMounted && data) {
      fetchData();
      getProvince();
      getCreditorType();
    }
  },[])
  return (
      <Modal isOpen={isOpen} toggle={toggle} scrollable fullscreen>
        <ModalHeader toggle={toggle}>รายละเอียดจำแนกมูลหนี้ NPL ตามสัญญา</ModalHeader>
        <ModalBody>
          <form>
          {/* ///start รายละเอียดจัดการหนี้/// */}
            <div className="mb-3">
              <According 
                title={'จัดการหนี้'}
                children={(
                  <>
                    {(isMounted && debts) && (
                      <div className="row g-3">
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating form-floating-advance-select mb-3">
                            <label htmlFor="AutoNPLDetail">สถานะสัญญาจำแนกมูลหนี้</label>
                            <select className="form-select" value={debts?.debt_management_audit_status ?? 'อยู่ระหว่างการสอบยอด'} onChange={(e) => handleChangeDebt('debt_management_audit_status', e.target?.value)}>
                              <option value="ทะเบียนหนี้รอสอบยอด">ทะเบียนหนี้รอสอบยอด</option>
                              <option value="อยู่ระหว่างการสอบยอด">อยู่ระหว่างการสอบยอด</option>
                              <option value="จำแนกมูลหนี้แล้ว">จำแนกมูลหนี้แล้ว</option>
                              <option value="หนี้ไม่เข้าหลักเกณฑ์">หนี้ไม่เข้าหลักเกณฑ์</option>
                              <option value="คณะกรรมการจัดการหนี้ไม่อนุมัติ">คณะกรรมการจัดการหนี้ไม่อนุมัติ</option>
                              <option value="ทะเบียนหนี้ซ้ำซ้อน">ทะเบียนหนี้ซ้ำซ้อน</option>
                              <option value="ปิดบัญชีกับกฟก.แล้ว">ปิดบัญชีกับกฟก.แล้ว</option>
                              <option value="เกษตรกรไม่ประสงค์ชำระหนี้แทน">เกษตรกรไม่ประสงค์ชำระหนี้แทน</option>
                              <option value="คุณสมบัติเกษตรกรไม่ถูกต้อง">คุณสมบัติเกษตรกรไม่ถูกต้อง</option>
                              <option value="ทะเบียนหนี้ไม่ถูกต้อง">ทะเบียนหนี้ไม่ถูกต้อง</option>
                              <option value="ชำระหนี้แทนแล้ว">ชำระหนี้แทนแล้ว</option>
                              <option value="เจ้าหนี้ไม่พบภาระหนี้/เกษตรกรปิดบัญชีเอง">เจ้าหนี้ไม่พบภาระหนี้/เกษตรกรปิดบัญชีเอง</option>
                              <option value="ข้อมูลไม่ถูกต้องครบถ้วน(สาขาเสนอขออนุมัติ)">ข้อมูลไม่ถูกต้องครบถ้วน(สาขาเสนอขออนุมัติ)</option>
                              <option value="รวมสัญญากับสัญญาอื่น">รวมสัญญากับสัญญาอื่น</option>
                              <option value="เจ้าหนี้ปิดกิจการ/ล้มละลาย">เจ้าหนี้ปิดกิจการ/ล้มละลาย</option>
                              <option value="ไม่ใช่เกษตรสมาชิกที่ขึ้นทะเบียนในจังหวัด">ไม่ใช่เกษตรสมาชิกที่ขึ้นทะเบียนในจังหวัด</option>
                              <option value="เจ้าหนี้ไม่เป็นไปตามที่กำหนด-ไม่ต้องตรวจสอบ">เจ้าหนี้ไม่เป็นไปตามที่กำหนด-ไม่ต้องตรวจสอบ</option>
                              <option value="เจ้าหนี้ไม่ยินยอมให้ตรวจสอบข้อมูลเกษตรกร">เจ้าหนี้ไม่ยินยอมให้ตรวจสอบข้อมูลเกษตรกร</option>
                              <option value="ติดต่อเกษตรกรไม่ได้">ติดต่อเกษตรกรไม่ได้</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'เลขที่สัญญา'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_contract_no', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_contract_no}
                          />
                        </div>
                        <div className="ccol-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating form-floating-advance-select mb-3">
                            <label htmlFor="floaTingLabelSingleSelect">ประเภทเจ้าหนี้</label>
                            <select className="form-select" value={debts?.debt_manage_creditor_type} onChange={(e) => handleChangeDebt('debt_manage_creditor_type', e.target?.value)}>
                              {creditor_types && (
                                creditor_types.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating form-floating-advance-select mb-3">
                            <label htmlFor="floaTingLabelSingleSelect">สถาบันเจ้าหนี้</label>
                            <select className="form-select" value={debts?.debt_manage_creditor_name} onChange={(e) => handleChangeDebt('debt_manage_creditor_name', e.target?.value)}>
                              {creditors && (
                                creditors.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating form-floating-advance-select mb-3">
                            <label htmlFor="floaTingLabelSingleSelect">จังหวัดเจ้าหนี้</label>
                            <select className="form-select" value={debts?.debt_manage_creditor_province ?? provinces[0]} onChange={(e) => handleChangeDebt('debt_manage_creditor_province', e.target?.value)}>
                              {provinces && (
                                provinces.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'สาขาเจ้าหนี้'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_creditor_branch', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_creditor_branch}
                          />
                        </div>
                        {(creditor_type == 'สหกรณ์') ? (
                          <>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.debt_repayment_conditions ?? ''} onChange={(e) => handleChangeDebt('debt_repayment_conditions', e.target?.value)}>
                                  <option value="ตามจำนวนเงินที่กองทุนชำระหนี้แทน">ตามจำนวนเงินที่กองทุนชำระหนี้แทน</option>
                                  <option value="ต้นเงิน90%+ค่าใช้จ่าย">ต้นเงิน90%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน50%+ค่าใช้จ่าย">ต้นเงิน50%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน40%+ค่าใช้จ่าย">ต้นเงิน40%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน30%+ค่าใช้จ่าย">ต้นเงิน30%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน50%">ต้นเงิน50%</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">เงื่อนไขชำระหนี้แทน</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <Textbox title={'กฟก. ชำระเงินจำนวน'} 
                                handleChange={(val) => handleChangeDebt('frD_paymen_amount', val)} 
                                containerClassname={'mb-3'} value={debts?.frD_paymen_amount}
                                disabled isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.contract_conditions ?? ''} onChange={(e) => handleChangeDebt('contract_conditions', e.target?.value)}>
                                  <option value="ตามจำนวนเงินที่กองทุนชำระหนี้แทน">ตามจำนวนเงินที่กองทุนชำระหนี้แทน</option>
                                  <option value="ต้นเงิน90%+ค่าใช้จ่าย">ต้นเงิน90%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน50%+ค่าใช้จ่าย">ต้นเงิน50%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน40%+ค่าใช้จ่าย">ต้นเงิน40%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน30%+ค่าใช้จ่าย">ต้นเงิน30%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน50%">ต้นเงิน50%</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">เงื่อนไขการทำสัญญา</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <Textbox title={'ยอดเงินที่ทำสัญญา'} 
                                handleChange={(val) => handleChangeDebt('contract_amount', val)} 
                                containerClassname={'mb-3'} value={debts?.contract_amount}
                                disabled isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.compensation_conditions ?? ''} onChange={(e) => handleChangeDebt('compensation_conditions', e.target?.value)}>
                                  <option value="ไม่มีการชดเชย">ไม่มีการชดเชย</option>
                                  <option value="ต้นเงิน50%">ต้นเงิน50%</option>
                                  <option value="ต้นเงิน40%">ต้นเงิน40%</option>
                                  <option value="ต้นเงิน50%+ดอกเบี้ย7.5">ต้นเงิน50%+ดอกเบี้ย7.5</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">เงื่อนไขการชดเชย</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <Textbox title={'จำนวนเงินที่ชดเชย'} 
                                handleChange={(val) => handleChangeDebt('compensation_amount', val)} 
                                containerClassname={'mb-3'} value={debts?.compensation_amount}
                                disabled  isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating form-floating-advance-select mb-3">
                                <label htmlFor="floaTingLabelSingleSelect">สถานะหนี้</label>
                                <select className="form-select" value={debts?.debt_manage_status ?? ''} onChange={(e) => handleChangeDebt('debt_manage_status', e.target?.value)}>
                                  <option value="ปกติ">ปกติ</option>
                                  <option value="ผิดนัดชำระ" >ผิดนัดชำระ</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.debt_manage_objective ?? ''} onChange={(e) => handleChangeDebt('debt_manage_objective', e.target?.value)}>
                                  <option value="เพื่อการเกษตร">เพื่อการเกษตร</option>
                                  <option value="ไม่เพื่อการเกษตร">ไม่เพื่อการเกษตร</option>
                                  <option value="เพื่อการเกษตรและไม่เพื่อการเกษตร">เพื่อการเกษตรและไม่เพื่อการเกษตร</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">วัตถุประสงค์</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12">
                              <Textbox title={'รายละเอียดวัตถุประสงค์'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_objective_details', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_objective_details}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ต้นเงินคงค้าง'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_outstanding_principal', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_outstanding_principal} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ดอกเบี้ยคงค้าง'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_accrued_interest', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_accrued_interest} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าปรับ'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_fine', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_fine} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าใช้จ่ายในการดำเนินคดี'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_litigation_expenses', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_litigation_expenses} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าถอนการยึดทรัพย์'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_forfeiture_withdrawal_fee', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_forfeiture_withdrawal_fee} isNumber
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.debt_agreement ?? ''} onChange={(e) => handleChangeDebt('debt_agreement', e.target?.value)}>
                                  <option value="ตามข้อตกลง">ตามข้อตกลง</option>
                                  <option value="ไม่ตามข้อตกลง">ไม่ตามข้อตกลง</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">ข้อตกลง</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              {debts?.debt_agreement == 'ไม่ตามข้อตกลง' && (
                                <Textbox title={'เหตุผล'} 
                                  handleChange={(val) => handleChangeDebt('debt_agreement_reason', val)} 
                                  containerClassname={'mb-3'} value={debts?.debt_agreement_reason} 
                                />
                              )}
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.debt_repayment_conditions ?? ''} onChange={(e) => handleChangeDebt('debt_repayment_conditions', e.target?.value)}>
                                  <option value="ตามจำนวนเงินที่กองทุนชำระหนี้แทน">ตามจำนวนเงินที่กองทุนชำระหนี้แทน</option>
                                  <option value="ต้นเงิน90%+ค่าใช้จ่าย">ต้นเงิน90%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน50%+ค่าใช้จ่าย">ต้นเงิน50%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน40%+ค่าใช้จ่าย">ต้นเงิน40%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน30%+ค่าใช้จ่าย">ต้นเงิน30%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน50%">ต้นเงิน50%</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">เงื่อนไขชำระหนี้แทน</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <Textbox title={'กฟก. ชำระเงินจำนวน'} 
                                handleChange={(val) => handleChangeDebt('frD_paymen_amount', val)} 
                                containerClassname={'mb-3'} value={debts?.frD_paymen_amount}
                                disabled={debts?.debt_agreement == 'ตามข้อตกลง'} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.contract_conditions ?? ''} onChange={(e) => handleChangeDebt('contract_conditions', e.target?.value)}>
                                  <option value="ตามจำนวนเงินที่กองทุนชำระหนี้แทน">ตามจำนวนเงินที่กองทุนชำระหนี้แทน</option>
                                  <option value="ต้นเงิน90%+ค่าใช้จ่าย">ต้นเงิน90%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน50%+ค่าใช้จ่าย">ต้นเงิน50%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน40%+ค่าใช้จ่าย">ต้นเงิน40%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน30%+ค่าใช้จ่าย">ต้นเงิน30%+ค่าใช้จ่าย</option>
                                  <option value="ต้นเงิน50%">ต้นเงิน50%</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">เงื่อนไขการทำสัญญา</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <Textbox title={'ยอดเงินที่ทำสัญญา'} 
                                handleChange={(val) => handleChangeDebt('contract_amount', val)} 
                                containerClassname={'mb-3'} value={debts?.contract_amount}
                                disabled={debts?.debt_agreement == 'ตามข้อตกลง'} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.compensation_conditions ?? ''} onChange={(e) => handleChangeDebt('compensation_conditions', e.target?.value)}>
                                  <option value="ไม่มีการชดเชย">ไม่มีการชดเชย</option>
                                  <option value="ต้นเงิน50%">ต้นเงิน50%</option>
                                  <option value="ต้นเงิน40%">ต้นเงิน40%</option>
                                  <option value="ต้นเงิน50%+ดอกเบี้ย7.5">ต้นเงิน50%+ดอกเบี้ย7.5</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">เงื่อนไขการชดเชย</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <Textbox title={'จำนวนเงินที่ชดเชย'} 
                                handleChange={(val) => handleChangeDebt('compensation_amount', val)} 
                                containerClassname={'mb-3'} value={debts?.compensation_amount}
                                disabled  isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating form-floating-advance-select mb-3">
                                <label htmlFor="floaTingLabelSingleSelect">สถานะหนี้</label>
                                <select className="form-select" value={debts?.debt_manage_status ?? ''} onChange={(e) => handleChangeDebt('debt_manage_status', e.target?.value)}>
                                  <option value="ปกติ">ปกติ</option>
                                  <option value="ผิดนัดชำระ" >ผิดนัดชำระ</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.debt_manage_objective ?? ''} onChange={(e) => handleChangeDebt('debt_manage_objective', e.target?.value)}>
                                  <option value="เพื่อการเกษตร">เพื่อการเกษตร</option>
                                  <option value="ไม่เพื่อการเกษตร">ไม่เพื่อการเกษตร</option>
                                  <option value="เพื่อการเกษตรและไม่เพื่อการเกษตร">เพื่อการเกษตรและไม่เพื่อการเกษตร</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">วัตถุประสงค์</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12">
                              <Textbox title={'รายละเอียดวัตถุประสงค์'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_objective_details', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_objective_details}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ต้นเงินคงค้าง'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_outstanding_principal', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_outstanding_principal} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'รับชำระเงินต้น'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_receive_principal', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_receive_principal} isNumber
                                disabled
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ดอกเบี้ยคงค้าง'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_accrued_interest', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_accrued_interest} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าปรับ'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_fine', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_fine} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าใช้จ่ายในการดำเนินคดี'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_litigation_expenses', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_litigation_expenses} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าถอนการยึดทรัพย์'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_forfeiture_withdrawal_fee', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_forfeiture_withdrawal_fee} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าเบี้ยประกัน'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_insurance_premium', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_insurance_premium} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าใช้จ่ายอื่นๆ'} 
                                handleChange={(val) => handleChangeDebt('debt_manage_other_expenses', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_other_expenses} isNumber
                              />
                            </div>
                          </>
                        )}
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รวมค่าใช้จ่าย'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_total_expenses', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_total_expenses} disabled isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รวมทั้งสิ้น'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_total', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_total} disabled isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ราคาประเมิน'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_estimated_price', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_estimated_price} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="flatpickr-input-container">
                            <div className="form-floating">
                              <input className="form-control datetimepicker" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                              <label className="ps-6" htmlFor="floatingInputStartDate">คำนวนเงิน ณ วันที่</label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="flatpickr-input-container">
                            <div className="form-floating">
                              <input className="form-control datetimepicker" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                              <label className="ps-6" htmlFor="floatingInputStartDate">วันที่ทำสัญญา</label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="flatpickr-input-container">
                            <div className="form-floating">
                              <input className="form-control datetimepicker" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                              <label className="ps-6" htmlFor="floatingInputStartDate">วันที่ผิดนัดชำระ</label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating">
                            <select className="form-select" value={debts?.debt_manage_legal_action ?? ''} onChange={(e) => handleChangeDebt('debt_manage_legal_action', e.target?.value)}>
                              <option value="ไม่มี">ไม่มี</option>
                              <option value="ดำเนินคดี">ดำเนินคดี</option>
                              <option value="พิพากษา">พิพากษา</option>
                              <option value="บังคับคดี">บังคับคดี</option>
                            </select>
                            <label htmlFor="floatingSelectPrivacy">ดำเนินการทางกฎหมาย</label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="flatpickr-input-container">
                            <div className="form-floating">
                              <input className="form-control datetimepicker" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                              <label className="ps-6" htmlFor="floatingInputStartDate">วันที่ดำเนินการทางกฎหมาย</label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                          <Textarea title={'หมายเหตุ'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_remark', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_remark}
                          />
                        </div>
                        <br />
                        <div className="d-flex justify-content-center ">
                          <button className="btn btn-success" type="button" onClick={() => submitDebt()}>บันทึก</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          {/* ///end รายละเอียดจัดการหนี้/// */} 

          {/* ///start รายละเอียดหลักทรัพย์ค้ำประกัน/// */}
            <div className="mb-3">
              <According 
                title={'หลักทรัพย์ค้ำประกัน'}
                children={(
                  <>
                    <div className="d-flex mb-3 flex-row-reverse">
                      <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => addCollateral()}><span className="fas fa-plus fs-8"></span> เพิ่มหลักประกัน</button>
                    </div>
                    <div id="tableExample" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
                      <div className="table-responsive mx-n1 px-1">
                        <table className="table table-sm table-bordered fs-9 mb-0">
                          <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
                            <tr>
                            <th>#</th>
                            <th>เลขที่สัญญา</th>
                            <th>ประเภทหลักทรัพย์</th>
                            <th>เลขที่ทะเบียน/โฉนด</th>
                            <th>เนื้อที่ (ไร่-งาน-ตรว.)</th>
                            <th>แก้ไขข้อมูล</th>
                            <th>ลบข้อมูล</th>
                            </tr>
                          </thead>
                          <tbody className="list text-center align-middle">
                            {(collaterals && collaterals.length > 0) ? (collaterals.map((item,index) => (
                              <tr key={index}>
                                <td className="align-middle">{index + 1}</td>
                                <td>{item.debt_manage_contract_no}</td>
                                <td>{item.collateral_type}</td>
                                <td>{item.collateral_no}</td>
                                <td>{item.collateral_area}</td>
                                <td>
                                  <div className='d-flex justify-content-center'>
                                    <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => editCollateral(item)}>
                                      <i className="far fa-edit"></i>
                                    </button>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex justify-content-center'>
                                    <button className="btn btn-phoenix-secondary btn-icon fs-7 text-danger px-0" type='button' onClick={() => editCollateral(item)}>
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
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
                    <br />
                    {isOpenCollateralEdit && (
                    <>
                      <div className="row g-3">
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating needs-validation">
                            <select className="form-select" value={collateralDetail.title_document_type} onChange={(e) => handleChangeCollateral('title_document_type', e.target?.value)}>
                              <option value="โฉนด">โฉนด</option>
                              <option value="ตราจอง">ตราจอง</option>
                              <option value="น.ส.3">น.ส.3</option>
                              <option value="น.ส.3 ก">น.ส.3 ก</option>
                              <option value="น.ส.3 ข">น.ส.3 ข</option>
                              <option value="ส.ป.ก.">ส.ป.ก.</option>
                              <option value="หนังสือแสดงกรรมสิทธิ์ห้องชุด">หนังสือแสดงกรรมสิทธิ์ห้องชุด</option>
                              <option value="ภ.ท.บ.5">ภ.ท.บ.5</option>
                              <optgroup label="___________________________________________"></optgroup>
                              <option value="บ้าน">บ้าน</option>
                              <option value="สังหาริมทรัพย์">สังหาริมทรัพย์</option>
                              <option value="หุ้น">หุ้น</option>
                              <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                            <label htmlFor="floatingSelectTeam">เอกสารสิทธิ์</label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating needs-validation">
                            <select className="form-select" value={collateralDetail?.collateral_status} onChange={(e) => handleChangeCollateral('collateral_status', e.target?.value)}>
                              <option value="โอนได้">โอนได้</option>
                              <option value="โอนไม่ได้">โอนไม่ได้</option>
                            </select>
                            <label htmlFor="floatingSelectTeam">สถานะหลักทรัพย์</label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating needs-validation">
                            <select className="form-select" value={collateralDetail?.conditions_cannot_transferred} onChange={(e) => handleChangeCollateral('conditions_cannot_transferred', e.target?.value)} disabled={collateralDetail?.collateral_status == 'โอนได้'}>
                              <option value="ติดอายัติ(เจ้าหนี้อื่น)">โอติดอายัติ(เจ้าหนี้อื่น)</option>
                              <option value="เจ้าของหลักประกันเสียชีวิต">เจ้าของหลักประกันเสียชีวิต</option>
                              <option value="ติดข้อกฎหมาย">ติดข้อกฎหมาย</option>
                              <option value="ติดจำนองเจ้าหนี้ร่วมของบุคคลอื่น">ติดจำนองเจ้าหนี้ร่วมของบุคคลอื่น</option>
                            </select>
                            <label htmlFor="floatingSelectTeam">เงื่อนไขโอนไม่ได้</label>
                          </div>
                        </div>
                      </div>
                      {/* start card รายละเอียดหลักทรัพย์ */}
                      <div className="mb-1">
                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                          <div className="card-body p-0">
                            <div className="p-4 code-to-copy">
                              {collateral_type == 'โฉนด' && (
                                <>
                                  {/* start card รายละเอียดโฉนดที่ดิน */}
                                  <h3 className="text-center">โฉนดที่ดิน</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">โฉนดที่ดิน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select ">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ระวาง</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขที่ดิน</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หน้าสำรวจ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดโฉนดที่ดิน" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดโฉนดที่ดิน */}
                                </>
                              )}
                              {collateral_type == 'ตราจอง' && (
                                <>
                                  {/* start card รายละเอียดตราจอง */}
                                  <h3 className="text-center">ตราจอง</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ตราจอง</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เล่มที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ระวาง</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขที่ดิน</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดตราจอง" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดตราจอง */}
                                </>
                              )}
                              {collateral_type == 'น.ส.3' && (
                                <>
                                  {/* start card รายละเอียดหนังสือรับรองการทำประโยชน์(น.ส.3) */}
                                  <h3 className="text-center">หนังสือรับรองการทำประโยชน์(น.ส.3)</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ทะเบียน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">สารบบเล่ม/เลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดหนังสือรับรองการทำประโยชน์(น.ส.3) */}
                                </>
                              )}
                              {collateral_type == 'น.ส.3 ก' && (
                                <>
                                  {/* start card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ก) */}
                                  <h3 className="text-center">หนังสือรับรอการทำประโยชน์(น.ส.3 ก)</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ระวางรูปถ่ายทางออกชื่อ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ทะเบียน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เล่มที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขที่ดิน</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หมายเลข</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">แผ่นที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ก" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ก) */}
                                </>
                              )}
                              {collateral_type == 'น.ส.3 ข' && (
                                <>
                                  {/* start card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ข) */}
                                  <h3 className="text-center">หนังสือรับรอการทำประโยชน์(น.ส.3 ข)</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หมู่ที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ทะเบียน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน.ส.3 ข" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ข) */}
                                </>
                              )}
                              {collateral_type == 'ส.ป.ก.' && (
                                <>
                                  {/* start card รายละเอียด ส.ป.ก. */}
                                  <h3 className="text-center">ส.ป.ก.</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หมู่ที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ทะเบียน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">แปลงเลขที่
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ระวาง ส.ป.ก. ที่
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ส.ป.ก." />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด ส.ป.ก. */}
                                </>
                              )}
                              {collateral_type == 'หนังสือแสดงกรรมสิทธิ์ห้องชุด' && (
                                <>
                                  {/* start card รายละเอียด หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2) */}
                                  <h3 className="text-center">หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">โฉนดที่ดินเลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เนื้อที่</span>
                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                    <span className="input-group-text" id="Search_id_card">ไร่</span>
                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                    <span className="input-group-text" id="Search_id_card">งาน</span>
                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                    <span className="input-group-text" id="Search_id_card">ตารางวา</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ที่ตั้งห้องชุด</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ห้องชุดเลขที่
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ชั้นที่
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อาคารเลขที่
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ชื่ออาคารชุด
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ทะเบียนอาคารชุดเลขที่
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ผู้ให้สัญญา</span>
                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)"></textarea>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ผู้รับสัญญา</span>
                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)"></textarea>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เนื้อที่ประมาณ</span>
                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                    <span className="input-group-text" id="Search_id_card">ตารางเมตร</span>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">สูง</span>
                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                    <span className="input-group-text" id="Search_id_card">เมตร</span>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์
                                                    </label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>เลือกข้อมูล...</option>
                                                      <option value="1">จำนอง</option>
                                                      <option value="2">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                      <option value="3">สืบทรัพย์</option>
                                                      <option value="4">โอนตามมาตรา 76</option>
                                                      <option value="5">ตีโอนชำระหนี้</option>
                                                      <option value="6">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อื่นๆโปรดระบุ
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หมายเหตุ</span>
                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)"></textarea>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2) */}
                                </>
                              )}
                              {collateral_type == 'ภ.ท.บ.5' && (
                                <>
                                  {/* start card รายละเอียด ภ.ท.บ.5 */}
                                  <h3 className="text-center">ภ.ท.บ.5</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ที่ดินตั้งอยู่เลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ภ.ท.บ.5" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ภ.ท.บ.5" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ภ.ท.บ.5" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หมู่ที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน ภ.ท.บ.5" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด ภ.ท.บ.5 */}
                                </>
                              )}
                              {collateral_type == 'บ้าน' && (
                                <>
                                  {/* start card รายละเอียด บ้าน */}
                                  <h3 className="text-center">บ้าน</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">สิ่งปลูกสร้างเลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตั้งอยู่บนที่ดินเลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ลักษณะสิ่งปลูกสร้าง</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด บ้าน */}
                                </>
                              )}
                              {collateral_type == 'สังหาริมทรัพย์' && (
                                <>
                                  {/* start card รายละเอียด สังหาริมทรัพย์ */}
                                  <h3 className="text-center">สังหาริมทรัพย์</h3>
                                  <div className="row g-3">
                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">รายการจดทะเบียน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">วันที่จดทะเบียน
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ยี่ห้อ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ประเภท</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขทะเบียน</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ลักษณะ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขตัวรถ
                                                    </span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เลขเครื่องยนต์</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">สี</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ชื่อผู้ถือกรรมสิทธิ์
                                                    </span>
                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน สังหาริมทรัพย์"></textarea>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ชื่อผู้ครอบครอง</span>
                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน สังหาริมทรัพย์"></textarea>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หมายเหตุ</span>
                                                    <textarea className="form-control" aria-label="สารบัญจดทะเบียน สังหาริมทรัพย์"></textarea>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด สังหาริมทรัพย์ */}
                                </>
                              )}
                              {collateral_type == 'หุ้น' && (
                                <>
                                  {/* start card รายละเอียด หุ้น */}
                                  <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                    <div className="card-body p-0">
                                      <div className="p-3 code-to-copy">
                                        <h3 className="text-center">หุ้น</h3><br />
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด หุ้น */}
                                </>
                              )}
                              {collateral_type == 'อื่นๆ' && (
                                <>
                                  {/* start card รายละเอียด อื่นๆ */}
                                  <h3 className="text-center">อื่นๆ</h3>
                                  <div className="col-sm-12 col-md-12 col-lg-12 g-3">
                                    <div className="input-group mb-3">
                                      <span className="input-group-text" id="Search_id_card">ชื่อเอกสารสิทธิ์ (อื่นๆ)                                          </span>
                                      <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                      <div className="mb-1">
                                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                          <div className="card-body p-0">
                                            <div className="p-4 code-to-copy">
                                              <h4 className="text-center">เลขที่</h4><br />
                                              <div className="row g-3">
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">เล่ม</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">หน้า</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" id="floaTingLabelSingleSelect" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                      <option>ทั้งหมด</option>
                                                      <option>University of Chicago</option>
                                                      <option>GSAS Open Labs At Harvard</option>
                                                      <option>California Institute of Technology</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">อำเภอ</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">ตำบล</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน อื่นๆ" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด อื่นๆ */}
                                </>
                              )}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ผู้ให้สัญญา</span>
                                                <textarea className="form-control" aria-label="With textarea"></textarea>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ผู้รับสัญญา</span>
                                                <textarea className="form-control" aria-label="With textarea"></textarea>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">เนื้อที่ตามสัญญา</span>
                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                <span className="input-group-text" id="Search_id_card">ไร่</span>
                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                <span className="input-group-text" id="Search_id_card">งาน</span>
                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                <span className="input-group-text" id="Search_id_card">ตารางวา</span>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)</span>
                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                <span className="input-group-text" id="Search_id_card">ไร่</span>
                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                <span className="input-group-text" id="Search_id_card">งาน</span>
                                                <input className="form-control" type="text" aria-label="สารบัญจดทะเบียน" />
                                                <span className="input-group-text" id="Search_id_card">ตารางวา</span>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">หมายเหตุ</span>
                                                <textarea className="form-control" aria-label="With textarea"></textarea>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
                              <br />
                              <div className="d-flex justify-content-center ">
                                <button className="btn btn-success me-2" type="button" onClick={() => saveCollateral()}>บันทึก</button>
                                {isOpenCollateralAdd ? (
                                  <button button className="btn btn-secondary" type="button" onClick={() => setOpenCollateralEdit(false)}>ยกเลิก</button>
                                ) : (
                                  <button button className="btn btn-danger" type="button" onClick={() => removeCollateral(collateralDetail)}>ลบหลักทรัพย์</button>
                                )}
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                      {/* end card รายละเอียดหลักทรัพย์ */}
                    </>
                    )}
                  </>
                )}
              />
            </div>
          {/* ///end รายละเอียดหลักทรัพย์ค้ำประกัน/// */}   

          {/* ///start รายละเอียดบุคคลค้ำประกัน/// */}
            <div className="mb-1">
              <According 
                title={'บุคคลค้ำประกัน'}
                children={(
                  <>
                    <div className="d-flex mb-3 flex-row-reverse">
                      <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => addGuarantor()}><span className="fas fa-plus fs-8"></span> เพิ่มบุคคลค้ำประกัน</button>
                    </div>
                    <div id="tableExample" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
                      <div className="table-responsive mx-n1 px-1">
                        <table className="table table-sm table-bordered fs-9 mb-0">
                          <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
                            <tr>
                            <th>#</th>
                            <th>เลขที่สัญญา</th>
                            <th>เลขบัตรประชาชน</th>
                            <th>คำนำหน้า</th>
                            <th>ชื่อ-นามสกุล</th>
                            <th>แก้ไขข้อมูล</th>
                            <th>ลบข้อมูล</th>
                            </tr>
                          </thead>
                          <tbody className="list text-center align-middle">
                            {(guarantors && guarantors.length > 0) ? (guarantors.map((item,index) => (
                              <tr key={index}>
                                <td className="align-middle">{index + 1}</td>
                                <td>{item.debt_manage_contract_no}</td>
                                <td>{item.guarantor_idcard}</td>
                                <td>{item.guarantor_name_prefix}</td>
                                <td>{item.fullname}</td>
                                <td>
                                  <div className='d-flex justify-content-center'>
                                    <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => editGuarantor(item)}>
                                      <i className="far fa-edit"></i>
                                    </button>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex justify-content-center'>
                                    <button className="btn btn-phoenix-secondary btn-icon fs-7 text-danger px-0" type='button' onClick={() => editGuarantor(item)}>
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
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
                    <br />
                    {isOpenGuarantorEdit && (
                      <div className="mb-1">
                        <div className="card shadow-none border my-4" data-component-card="data-component-card">
                          <div className="card-body p-0">
                            <div className="p-4 code-to-copy">
                              <h3 className="text-center">รายละเอียดบุคคลค้ำประกัน</h3>
                              <br />
                              <div className="row g-3">
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'เลขบัตรประชาชน'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_idcard', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_idcard}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'คำนำหน้า'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_name_prefix', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_name_prefix}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'ชื่อ'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_firstname', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_firstname}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'นามสกุล'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_lastname', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_lastname}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <DatePicker title={'วันเดือนปีเกิด'}
                                    value={guarantorDetail.guarantor_birthday} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_birthday', val)} 
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'บ้านเลขที่'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_house_no', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_house_no}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'บ้าน/ชุมชน'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_village_name', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_village_name}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'ซอย'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_soi', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_soi}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'ถนน'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_road', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_road}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'ตำบล/แขวง'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_sub_district', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_sub_district}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'อำเภอ/กิ่งอำเภอ/เขต'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_district', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_district}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <div className="form-floating form-floating-advance-select mb-3">
                                    <label>จังหวัด</label>
                                    <select className="form-select" value={guarantorDetail.guarantor_province ?? provinces[0]} onChange={(e) => handleChangeGuarantor('guarantor_province', e.target?.value)}>
                                      {provinces && (
                                        provinces.map((option, index) => (
                                          <option key={index} value={option}>{option}</option>
                                        ))
                                      )}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'รหัสไปรษณีย์'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_zipcode', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_zipcode}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'เบอร์โทรศัพท์'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_mobile', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_mobile}
                                  />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                  <Textbox title={'อีเมล'} 
                                    handleChange={(val) => handleChangeGuarantor('guarantor_email', val)} 
                                    containerClassname={'mb-3'} value={guarantorDetail.guarantor_email}
                                  />
                                </div>
                              </div>  
                              </div>
                              <div className="d-flex justify-content-center ">
                                <button className="btn btn-success me-2" type="button" onClick={() => saveGuarantor()}>บันทึก</button>
                                {isOpenGuarantorAdd ? (
                                  <button button className="btn btn-secondary" type="button" onClick={() => setOpenGuarantorEdit(false)}>ยกเลิก</button>
                                ) : (
                                  <button button className="btn btn-danger" type="button" onClick={() => removeGuarantor(guarantorDetail)}>ลบบุคคลค้ำประกัน</button>
                                )}
                              </div>
                              <br />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              />
            </div> 
          {/* ///end รายละเอียดบุคคลค้ำประกัน/// */} 
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>ปิด</Button>
        </ModalFooter>
      </Modal>
  );
};
export default FullModal;