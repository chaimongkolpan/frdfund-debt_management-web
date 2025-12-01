import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Textbox from "@views/components/input/Textbox";
import Textarea from "@views/components/input/Textarea";
import DatePicker from "@views/components/input/DatePicker";
import According from "@views/components/panel/according";
import { ToDateDb } from "@utils";
import { 
  getProvinces,
  getBigDataCreditorTypes,
  getBigDataCreditors,
  getConfirmCommittee,
  updateConfirmCommitteePrepare,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const FullModal = (props) => {
  const {isOpen, setModal, onClose, data, isView = false} = props;
  const [isMounted, setMounted] = useState(false);
  const [debts, setDebts] = useState(null);
  const [provinces, setProvOp] = useState(null);
  const [creditor_types, setCreditorTypeOp] = useState(null);
  const [creditors, setCreditorOp] = useState(null);
  const [creditor_type, setCreditorType] = useState(null);
  const toggle = () => setModal(!isOpen);

  const submitDebt = async () => {
    let rate = 1;
    let expense = 0;
    if (debts?.debt_repayment_conditions_cf == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') {  rate = 1; expense = debts?.debt_manage_total_expenses_cf; }
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน90%+ค่าใช้จ่าย') { rate = 0.9; expense = debts?.debt_manage_total_expenses_cf;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%+ค่าใช้จ่าย') { rate = 0.5; expense = debts?.debt_manage_total_expenses_cf;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน40%+ค่าใช้จ่าย') { rate = 0.4; expense = debts?.debt_manage_total_expenses_cf;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน30%+ค่าใช้จ่าย') { rate = 0.3; expense = debts?.debt_manage_total_expenses_cf;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%') { rate = 0.5; expense = 0;}
    let result_confirm = 'เท่าเดิม';
    if (debts?.debt_management_audit_status != 'คณะกรรมการจัดการหนี้อนุมัติ') {
      result_confirm = 'ยกเลิกการชำระหนี้แทน';
    } else {
      const debt_status = debts?.debt_manage_status_cf != debts?.debt_manage_status;
      let total_status = '';
      if (debts?.debt_manage_total_cf > debts?.debt_manage_total) {
        total_status = 'เพิ่มเงิน';
      } else if (debts?.debt_manage_total_cf < debts?.debt_manage_total) {
        total_status = 'ลดเงิน';
      } else {
        total_status = debt_status ? '' : 'เท่าเดิม';
      }
      result_confirm = total_status + ((debt_status && total_status) ? '/' : '') + (debt_status ? 'แก้ไขสถานะหนี้' : '');
    }
    const status_confirm = 'แก้ไขยืนยันยอด';
    const param = {
      ...debts,
      debt_manage_calculate_ondate : debts?.debt_manage_calculate_ondate ? ToDateDb(debts?.debt_manage_calculate_ondate) : null,
      contract_debt_manage_outstanding_principal_cf: (debts?.debt_manage_outstanding_principal_cf * rate),
      contract_debt_manage_accrued_interest_cf: (debts?.debt_manage_accrued_interest_cf * rate),
      contract_debt_manage_fine_cf: (debts?.debt_manage_fine_cf * rate),
      contract_debt_manage_litigation_expenses_cf: debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%' ? 0 : debts?.debt_manage_litigation_expenses_cf,
      contract_debt_manage_forfeiture_withdrawal_fee_cf: debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%' ? 0 : debts?.debt_manage_forfeiture_withdrawal_fee_cf,
      contract_debt_manage_insurance_premium_cf: debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%' ? 0 : debts?.debt_manage_insurance_premium_cf,
      contract_debt_manage_other_expenses_cf: debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%' ? 0 : debts?.debt_manage_other_expenses_cf,
      contract_debt_manage_total_expenses_cf: debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%' ? 0 : debts?.debt_manage_total_expenses_cf,
      contract_debt_manage_total_cf: ((debts?.debt_manage_outstanding_principal_cf + debts?.debt_manage_accrued_interest_cf + debts?.debt_manage_fine_cf) * rate) + expense,
      status_confirm_cf: status_confirm,
      results_confirm_cf: result_confirm,
    }
    const result = await updateConfirmCommitteePrepare(param);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await fetchData();
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const handleChangeDebt = async (key, val) => {
    if (key == 'debt_manage_creditor_type') {
      await setCreditorType(val);
    }
    await setDebts((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  useEffect(() => {
    const total = debts?.debt_manage_outstanding_principal_cf + debts?.debt_manage_accrued_interest_cf + debts?.debt_manage_fine_cf;
    const expense = debts?.debt_manage_litigation_expenses_cf + debts?.debt_manage_forfeiture_withdrawal_fee_cf + debts?.debt_manage_insurance_premium_cf + debts?.debt_manage_other_expenses_cf;
    let frd = debts?.frD_paymen_amount_cf;
    let ex = 0;
    if (debts?.debt_repayment_conditions_cf == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { frd = total;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน90%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal_cf * 0.9;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal_cf * 0.5;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน40%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal_cf * 0.4;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน30%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal_cf * 0.3;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%') { frd = debts?.debt_manage_outstanding_principal_cf * 0.5}
    setDebts((prevState) => ({
      ...prevState,
      ...({frD_paymen_amount_cf: frd + ex})
    }))
    let pri = debts?.contract_amount_cf;
    let ex1 = 0;
    if (debts?.contract_conditions_cf == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { pri = frd;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน90%+ค่าใช้จ่าย') { pri = frd * 0.9;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน50%+ค่าใช้จ่าย') { pri = frd * 0.5;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน40%+ค่าใช้จ่าย') { pri = frd * 0.4;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน30%+ค่าใช้จ่าย') { pri = frd * 0.3;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน50%') { pri = frd * 0.5}
    setDebts((prevState) => ({
      ...prevState,
      ...({contract_amount_cf: pri + ex1})
    }))
    setDebts((prevState) => ({
      ...prevState,
      ...({debt_manage_total_cf: debts?.debt_manage_outstanding_principal_cf + debts?.debt_manage_accrued_interest_cf + debts?.debt_manage_fine_cf 
        + debts?.debt_manage_litigation_expenses_cf + debts?.debt_manage_forfeiture_withdrawal_fee_cf + debts?.debt_manage_insurance_premium_cf + debts?.debt_manage_other_expenses_cf })
    }))
  },[debts?.debt_manage_outstanding_principal_cf,debts?.debt_manage_accrued_interest_cf,debts?.debt_manage_fine_cf 
  ,debts?.debt_manage_litigation_expenses_cf,debts?.debt_manage_forfeiture_withdrawal_fee_cf,debts?.debt_manage_insurance_premium_cf,debts?.debt_manage_other_expenses_cf])
  useEffect(() => {
    setDebts((prevState) => ({
      ...prevState,
      ...({debt_manage_total_expenses_cf: debts?.debt_manage_litigation_expenses_cf + debts?.debt_manage_forfeiture_withdrawal_fee_cf + debts?.debt_manage_insurance_premium_cf + debts?.debt_manage_other_expenses_cf })
    }))
  },[debts?.debt_manage_litigation_expenses_cf,debts?.debt_manage_forfeiture_withdrawal_fee_cf,debts?.debt_manage_insurance_premium_cf,debts?.debt_manage_other_expenses_cf])
  useEffect(() => {
    setDebts((prevState) => ({
      ...prevState,
      ...({debt_manage_total_expenses_cf: debts?.debt_manage_litigation_expenses_cf + debts?.debt_manage_forfeiture_withdrawal_fee_cf + debts?.debt_manage_insurance_premium_cf + debts?.debt_manage_other_expenses_cf })
    }))
  },[debts?.debt_manage_total_cf,debts?.debt_manage_total_expenses_cf])
  useEffect(() => {
    const total = debts?.debt_manage_outstanding_principal_cf + debts?.debt_manage_accrued_interest_cf + debts?.debt_manage_fine_cf;
    const expense = debts?.debt_manage_litigation_expenses_cf + debts?.debt_manage_forfeiture_withdrawal_fee_cf + debts?.debt_manage_insurance_premium_cf + debts?.debt_manage_other_expenses_cf;
    let frd = debts?.frD_paymen_amount_cf;
    let ex = 0;
    if (debts?.debt_repayment_conditions_cf == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { frd = total;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน90%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal_cf * 0.9;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal_cf * 0.5;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน40%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal_cf * 0.4;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน30%+ค่าใช้จ่าย') { frd = debts?.debt_manage_outstanding_principal_cf * 0.3;ex = expense;}
    else if (debts?.debt_repayment_conditions_cf == 'ต้นเงิน50%') { frd = debts?.debt_manage_outstanding_principal_cf * 0.5}
    setDebts((prevState) => ({
      ...prevState,
      ...({frD_paymen_amount_cf: frd + ex})
    }))
    let pri = debts?.contract_amount_cf;
    let ex1 = 0;
    if (debts?.contract_conditions_cf == 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน') { pri = frd;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน90%+ค่าใช้จ่าย') { pri = frd * 0.9;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน50%+ค่าใช้จ่าย') { pri = frd * 0.5;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน40%+ค่าใช้จ่าย') { pri = frd * 0.4;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน30%+ค่าใช้จ่าย') { pri = frd * 0.3;ex1 = expense;}
    else if (debts?.contract_conditions_cf == 'ต้นเงิน50%') { pri = frd * 0.5}
    setDebts((prevState) => ({
      ...prevState,
      ...({contract_amount_cf: pri + ex1})
    }))
  },[debts?.debt_repayment_conditions_cf,debts?.contract_conditions_cf])
  
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
    const result = await getBigDataCreditorTypes(null);
    if (result.isSuccess) {
      const temp = result.data.map(item => item.name);
      await setCreditorTypeOp(temp);
    } else {
      await setCreditorTypeOp(null);
    }
    await setMounted(true);
  }
  const getCreditor = async () => {
    const result = await getBigDataCreditors(null, creditor_type);
    if (result.isSuccess) {
      const temp = result.data.map(item => item.name);
      await setCreditorOp(temp);
    } else {
      await setCreditorOp(null);
    }
    await setMounted(true);
  }
  const fetchData = async() => {
    const result = await getConfirmCommittee(data.id_debt_confirm, 'NPL');
    if (result.isSuccess) {
      const debt = result.data;
      await setDebts({
        ...debt,
        debt_management_audit_status: (debt.debt_management_audit_status ?? 'คณะกรรมการจัดการหนี้อนุมัติ'),
        debt_repayment_conditions_cf: (debt.debt_repayment_conditions_cf ?? debt.debt_repayment_conditions),
        contract_conditions_cf: (debt.contract_conditions_cf ?? debt.contract_conditions),
        compensation_conditions_cf: (debt.compensation_conditions_cf ?? debt.compensation_conditions),
        debt_manage_objective_cf: (debt.debt_manage_objective_cf ?? debt.debt_manage_objective),
        debt_manage_legal_action_cf: (debt.debt_manage_legal_action_cf ?? debt.debt_manage_legal_action),
        frD_paymen_amount_cf: (debt?.frD_paymen_amount_cf ?? debt?.frD_paymen_amount),
        contract_amount_cf: (debt?.contract_amount_cf ?? debt?.contract_amount),
        debt_manage_outstanding_principal_cf: (debt?.debt_manage_outstanding_principal_cf ?? debt?.debt_manage_outstanding_principal),
        debt_manage_accrued_interest_cf: (debt?.debt_manage_accrued_interest_cf ?? debt?.debt_manage_accrued_interest),
        debt_manage_fine_cf: (debt?.debt_manage_fine_cf ?? debt?.debt_manage_fine),
        debt_manage_litigation_expenses_cf: (debt?.debt_manage_litigation_expenses_cf ?? debt?.debt_manage_litigation_expenses),
        debt_manage_forfeiture_withdrawal_fee_cf: (debt?.debt_manage_forfeiture_withdrawal_fee_cf ?? debt?.debt_manage_forfeiture_withdrawal_fee),
        debt_manage_insurance_premium_cf: (debt?.debt_manage_insurance_premium_cf ?? debt?.debt_manage_insurance_premium),
        debt_manage_other_expenses_cf: (debt?.debt_manage_other_expenses_cf ?? debt?.debt_manage_other_expenses),
        debt_manage_total_expenses_cf: (debt?.debt_manage_total_expenses_cf ?? debt?.debt_manage_total_expenses),
        debt_manage_total_cf: (debt?.debt_manage_total_cf ?? debt?.debt_manage_total),
        debt_manage_remark_cf: (debt?.debt_manage_remark_cf ?? debt?.debt_manage_remark),
      });
      await setCreditorType(debt.debt_manage_creditor_type);
    } else {
      await setDebts(null);
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
        <ModalHeader toggle={toggle}>รายละเอียดยืนยันยอด NPL ตามสัญญา</ModalHeader>
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
                        <div className={`col-sm-12 col-md-6 col-lg-${isView ? '5' : '4'}`}>
                          {isView ? (
                            <Textbox title={'สถานะสัญญาจำแนกมูลหนี้'}
                              handleChange={(val) => handleChangeDebt('debt_management_audit_status', val)} disabled
                              containerClassname={'mb-3'} value={debts?.debt_management_audit_status}
                            />
                          ):(
                            <div className="form-floating form-floating-advance-select mb-3">
                              <label htmlFor="AutoNPLDetail">สถานะสัญญาจำแนกมูลหนี้</label>
                              <select className="form-select" value={debts?.debt_management_audit_status ?? 'อยู่ระหว่างการสอบยอด'} 
                                onChange={(e) => handleChangeDebt('debt_management_audit_status', e.target?.value)} disabled={isView}>
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
                                <option value="คณะกรรมการจัดการหนี้อนุมัติ">คณะกรรมการจัดการหนี้อนุมัติ</option>
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

                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'เลขที่สัญญา'}
                            handleChange={(val) => handleChangeDebt('debt_manage_contract_no', val)} disabled
                            containerClassname={'mb-3'} value={debts?.debt_manage_contract_no}
                          />
                        </div>
                        <div className={`col-sm-12 col-md-6 col-lg-${isView ? '3' : '4'}`}>
                          {creditor_types && (
                            <div className="form-floating form-floating-advance-select mb-3">
                              <label htmlFor="floaTingLabelSingleSelect">ประเภทเจ้าหนี้</label>
                              <select className="form-select" disabled value={debts?.debt_manage_creditor_type} onChange={(e) => handleChangeDebt('debt_manage_creditor_type', e.target?.value)}>
                                  {creditor_types.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                  ))}
                              </select>
                            </div>
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          {creditors && (
                            <div className="form-floating form-floating-advance-select mb-3">
                              <label htmlFor="floaTingLabelSingleSelect">สถาบันเจ้าหนี้</label>
                              <select className="form-select" disabled value={debts?.debt_manage_creditor_name} onChange={(e) => handleChangeDebt('debt_manage_creditor_name', e.target?.value)}>
                                  {creditors.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                  ))}
                              </select>
                            </div>
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          {provinces && (
                            <div className="form-floating form-floating-advance-select mb-3">
                              <label htmlFor="floaTingLabelSingleSelect">จังหวัดเจ้าหนี้</label>
                              <select className="form-select" disabled value={debts?.debt_manage_creditor_province ?? provinces[0]} onChange={(e) => handleChangeDebt('debt_manage_creditor_province', e.target?.value)}>
                                  {provinces.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                  ))}
                              </select>
                            </div>
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'สาขาเจ้าหนี้'} disabled
                            handleChange={(val) => handleChangeDebt('debt_manage_creditor_branch', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_creditor_branch}
                          />
                        </div>
                        {(creditor_type == 'สหกรณ์') ? (
                          <>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" value={debts?.debt_repayment_type ?? 'ชำระหนี้แทน'} onChange={(e) => handleChangeDebt('debt_repayment_type', e.target?.value)}>
                                  <option value="ชำระหนี้แทน">ชำระหนี้แทน</option>
                                  <option value="วางเงินชำระหนี้แทน-บังคับคดี">วางเงินชำระหนี้แทน-บังคับคดี</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">ประเภทการชำระหนี้</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6"></div> 

                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" disabled={isView} value={debts?.debt_repayment_conditions_cf ?? ''} onChange={(e) => handleChangeDebt('debt_repayment_conditions_cf', e.target?.value)}>
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
                                handleChange={(val) => handleChangeDebt('frD_paymen_amount_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.frD_paymen_amount_cf}
                                disabled isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" disabled={isView} value={debts?.contract_conditions_cf ?? ''} onChange={(e) => handleChangeDebt('contract_conditions_cf', e.target?.value)}>
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
                                handleChange={(val) => handleChangeDebt('contract_amount_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.contract_amount_cf}
                                disabled isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" disabled={isView} value={debts?.compensation_conditions_cf ?? ''} onChange={(e) => handleChangeDebt('compensation_conditions_cf', e.target?.value)}>
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
                                handleChange={(val) => handleChangeDebt('compensation_amount_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.compensation_amount_cf}
                                disabled  isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating form-floating-advance-select mb-3">
                                <label htmlFor="floaTingLabelSingleSelect">สถานะหนี้</label>
                                <select className={`form-select`} disabled={isView} value={debts?.debt_manage_status_cf ?? ''} onChange={(e) => handleChangeDebt('debt_manage_status_cf', e.target?.value)}>
                                  <option value="ปกติ">ปกติ</option>
                                  <option value="ผิดนัดชำระ" >ผิดนัดชำระ</option>
                                  <option value="ปรับโครงสร้างหนี้" >ปรับโครงสร้างหนี้</option>
                                  <option value="ดำเนินคดี" >ดำเนินคดี</option>
                                  <option value="บังคับคดี" >บังคับคดี</option>
                                  <option value="ปิดบัญชี" >ปิดบัญชี</option>
                                  <option value="พิพากษา" >พิพากษา</option>
                                  <option value="ล้มละลาย" >ล้มละลาย</option>
                                  <option value="NPA" >NPA</option>
                                  <option value="อื่นๆ" >อื่นๆ</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className={`form-select`} disabled value={debts?.debt_manage_objective_cf ?? ''} onChange={(e) => handleChangeDebt('debt_manage_objective_cf', e.target?.value)}>
                                  <option value="เพื่อการเกษตร">เพื่อการเกษตร</option>
                                  <option value="ไม่เพื่อการเกษตร">ไม่เพื่อการเกษตร</option>
                                  <option value="เพื่อการเกษตรและไม่เพื่อการเกษตร">เพื่อการเกษตรและไม่เพื่อการเกษตร</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">วัตถุประสงค์</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12">
                              <Textarea title={'รายละเอียดวัตถุประสงค์'} disabled={isView} 
                                handleChange={(val) => handleChangeDebt('debt_manage_objective_details_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_objective_details_cf}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ต้นเงินคงค้าง'} disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_outstanding_principal_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_outstanding_principal_cf} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ดอกเบี้ยคงค้าง'} disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_accrued_interest_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_accrued_interest_cf} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าปรับ'} disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_fine_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_fine_cf} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าใช้จ่ายในการดำเนินคดี'} disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_litigation_expenses_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_litigation_expenses_cf} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าถอนการยึดทรัพย์'} disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_forfeiture_withdrawal_fee_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_forfeiture_withdrawal_fee_cf} isNumber
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* <div className="col-sm-12 col-md-6 col-lg-6">
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
                            </div> */}
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" disabled={isView} value={debts?.debt_repayment_conditions_cf ?? ''} onChange={(e) => handleChangeDebt('debt_repayment_conditions_cf', e.target?.value)}>
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
                                handleChange={(val) => handleChangeDebt('frD_paymen_amount_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.frD_paymen_amount_cf}
                                disabled={debts?.debt_agreement == 'ตามข้อตกลง'} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" disabled={isView} value={debts?.contract_conditions_cf ?? ''} onChange={(e) => handleChangeDebt('contract_conditions_cf', e.target?.value)}>
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
                                handleChange={(val) => handleChangeDebt('contract_amount_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.contract_amount_cf}
                                disabled={debts?.debt_agreement == 'ตามข้อตกลง'} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className="form-select" disabled={isView} value={debts?.compensation_conditions_cf ?? ''} onChange={(e) => handleChangeDebt('compensation_conditions_cf', e.target?.value)}>
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
                                handleChange={(val) => handleChangeDebt('compensation_amount_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.compensation_amount_cf}
                                disabled  isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating form-floating-advance-select mb-3">
                                <label htmlFor="floaTingLabelSingleSelect">สถานะหนี้</label>
                                <select className={`form-select`} disabled={isView} value={debts?.debt_manage_status_cf ?? ''} onChange={(e) => handleChangeDebt('debt_manage_status_cf', e.target?.value)}>
                                  <option value="ปกติ">ปกติ</option>
                                  <option value="ผิดนัดชำระ" >ผิดนัดชำระ</option>
                                  <option value="ปรับโครงสร้างหนี้" >ปรับโครงสร้างหนี้</option>
                                  <option value="ดำเนินคดี" >ดำเนินคดี</option>
                                  <option value="บังคับคดี" >บังคับคดี</option>
                                  <option value="ปิดบัญชี" >ปิดบัญชี</option>
                                  <option value="พิพากษา" >พิพากษา</option>
                                  <option value="ล้มละลาย" >ล้มละลาย</option>
                                  <option value="NPA" >NPA</option>
                                  <option value="อื่นๆ" >อื่นๆ</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                              <div className="form-floating">
                                <select className={`form-select`} disabled={isView} value={debts?.debt_manage_objective_cf ?? ''} onChange={(e) => handleChangeDebt('debt_manage_objective_cf', e.target?.value)}>
                                  <option value="เพื่อการเกษตร">เพื่อการเกษตร</option>
                                  <option value="ไม่เพื่อการเกษตร">ไม่เพื่อการเกษตร</option>
                                  <option value="เพื่อการเกษตรและไม่เพื่อการเกษตร">เพื่อการเกษตรและไม่เพื่อการเกษตร</option>
                                </select>
                                <label htmlFor="floatingSelectPrivacy">วัตถุประสงค์</label>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12">
                              <Textarea title={'รายละเอียดวัตถุประสงค์'}  disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_objective_details_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_objective_details_cf}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ต้นเงินคงค้าง'} disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_outstanding_principal_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_outstanding_principal_cf} isNumber
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
                              <Textbox title={'ดอกเบี้ยคงค้าง'}  disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_accrued_interest_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_accrued_interest_cf} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าปรับ'} disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_fine_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_fine_cf} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าใช้จ่ายในการดำเนินคดี'}  disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_litigation_expenses_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_litigation_expenses_cf} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าถอนการยึดทรัพย์'} disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_forfeiture_withdrawal_fee_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_forfeiture_withdrawal_fee_cf} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าเบี้ยประกัน'}  disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_insurance_premium_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_insurance_premium_cf} isNumber
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ค่าใช้จ่ายอื่นๆ'} disabled={isView}
                                handleChange={(val) => handleChangeDebt('debt_manage_other_expenses_cf', val)} 
                                containerClassname={'mb-3'} value={debts?.debt_manage_other_expenses_cf} isNumber
                              />
                            </div>
                          </>
                        )}
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รวมค่าใช้จ่าย'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_total_expenses_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_total_expenses_cf} disabled isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รวมทั้งสิ้น'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_total_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_total_cf} disabled isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ราคาประเมิน'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_estimated_price', val)} disabled
                            containerClassname={'mb-3'} value={debts?.debt_manage_estimated_price} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <DatePicker title={'คำนวนเงิน ณ วันที่'}
                            value={debts?.debt_manage_calculate_ondate} 
                            handleChange={(val) => handleChangeDebt('debt_manage_calculate_ondate', val)} 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <DatePicker title={'วันที่ทำสัญญา'} disabled
                            value={debts?.debt_manage_contract_date} 
                            handleChange={(val) => handleChangeDebt('debt_manage_contract_date', val)} 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <DatePicker title={'วันที่ผิดนัดชำระ'} disabled
                            value={debts?.debt_manage_payment_default_date} 
                            handleChange={(val) => handleChangeDebt('debt_manage_payment_default_date', val)} 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating">
                            <select className="form-select" disabled={isView} value={debts?.debt_manage_legal_action_cf ?? ''} onChange={(e) => handleChangeDebt('debt_manage_legal_action_cf', e.target?.value)}>
                              <option value="ไม่มี">ไม่มี</option>
                              <option value="ดำเนินคดี">ดำเนินคดี</option>
                              <option value="พิพากษา">พิพากษา</option>
                              <option value="บังคับคดี">บังคับคดี</option>
                            </select>
                            <label htmlFor="floatingSelectPrivacy">ดำเนินการทางกฎหมาย</label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-8">
                          <Textbox title={'วันที่ดำเนินการทางกฎหมาย'} disabled={isView} 
                            value={debts?.debt_manage_legal_action_date_cf}
                            handleChange={(val) => handleChangeDebt('debt_manage_legal_action_date_cf', val)}
                            containerClassname={'mb-3'}
                          />
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                          <Textarea title={'หมายเหตุ'}  disabled={isView}
                            handleChange={(val) => handleChangeDebt('debt_manage_remark_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_remark_cf}
                          />
                        </div>
                        <br />
                        {!isView && (
                          <div className="d-flex justify-content-center ">
                            <button className="btn btn-success" type="button" onClick={() => submitDebt()}>บันทึก</button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          {/* ///end รายละเอียดจัดการหนี้/// */} 
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>ปิด</Button>
        </ModalFooter>
      </Modal>
  );
};
export default FullModal;