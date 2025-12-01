import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Textbox from "@views/components/input/Textbox";
import Textarea from "@views/components/input/Textarea";
import DatePicker from "@views/components/input/DatePicker";
import According from "@views/components/panel/according";
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
    let result_confirm = 'เท่าเดิม';
    if (debts?.debt_management_audit_status != 'คณะกรรมการจัดการหนี้อนุมัติ') {
      result_confirm = 'ยกเลิกการชำระหนี้แทน';
    } else {
      let total_status = '';
      if (debts?.frD_total_payment_cf > debts?.frD_total_payment) {
        total_status = 'เพิ่มเงิน';
      } else if (debts?.frD_total_payment_cf < debts?.frD_total_payment) {
        total_status = 'ลดเงิน';
      } else {
        total_status = 'เท่าเดิม';
      }
      result_confirm = total_status;
    }
    const status_confirm = 'แก้ไขยืนยันยอด';
    const param = {
      ...debts,
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
    await setDebts((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  useEffect(() => {
    setDebts((prevState) => ({
      ...prevState,
      ...({total_xpenses_cf: parseFloat((debts?.litigation_expenses_cf + debts?.insurance_premium_cf).toFixed(2)) })
    }))
  },[debts?.litigation_expenses_cf,debts?.insurance_premium_cf])
  useEffect(() => {
    setDebts((prevState) => ({
      ...prevState,
      ...({frD_total_payment_cf: parseFloat((debts?.npA_property_sales_price_cf + debts?.npL_creditors_receive_cf + debts?.litigation_expenses_cf + debts?.insurance_premium_cf).toFixed(2)) })
    }))
  },[debts?.npA_property_sales_price_cf,debts?.npL_creditors_receive_cf,debts?.litigation_expenses_cf,debts?.insurance_premium_cf])
  useEffect(() => {
    setDebts((prevState) => ({
      ...prevState,
      ...({frD_total_payment_cf: parseFloat((debts?.npA_property_sales_price_cf + debts?.npL_creditors_receive_cf + debts?.litigation_expenses_cf + debts?.insurance_premium_cf).toFixed(2)) })
    }))
  },[debts?.frD_total_payment_cf,debts?.total_xpenses_cf])
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
    const result = await getConfirmCommittee(data.id_debt_confirm, 'NPA');
    if (result.isSuccess) {
      const debt = result.data;
      await setDebts({
        ...debt,
        debt_management_audit_status: (debt.debt_management_audit_status ?? 'คณะกรรมการจัดการหนี้อนุมัติ'),
        estimated_price_creditors_cf: (debt?.estimated_price_creditors_cf ?? debt?.estimated_price_creditors),
        npA_property_sales_price_cf: (debt?.npA_property_sales_price_cf ?? debt?.npA_property_sales_price),
        npL_remaining_capital_cf: (debt?.npL_remaining_capital_cf ?? debt?.npL_remaining_capital),
        npL_creditors_receive_cf: (debt?.npL_creditors_receive_cf ?? debt?.npL_creditors_receive),
        litigation_expenses_cf: (debt?.litigation_expenses_cf ?? debt?.litigation_expenses),
        insurance_premium_cf: (debt?.insurance_premium_cf ?? debt?.insurance_premium),
        total_xpenses_cf: (debt?.total_xpenses_cf ?? debt?.total_xpenses),
        frD_total_payment_cf: (debt?.frD_total_payment_cf ?? debt?.frD_total_payment),
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
        <ModalHeader toggle={toggle}>รายละเอียดยืนยันยอด NPA ตามสัญญา</ModalHeader>
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
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <div className="form-floating form-floating-advance-select mb-3">
                            <label htmlFor="floaTingLabelSingleSelect">สถานะหนี้</label>
                            <select className={`form-select`} disabled value={debts?.debt_manage_status_cf ?? ''} onChange={(e) => handleChangeDebt('debt_manage_status_cf', e.target?.value)}>
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
                          <Textarea title={'รายละเอียดวัตถุประสงค์'} disabled
                            handleChange={(val) => handleChangeDebt('debt_manage_objective_details_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_objective_details_cf}
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'จำนวนเงินที่ชดเชย'} disabled
                            handleChange={(val) => handleChangeDebt('compensation_amount', val)} 
                            containerClassname={'mb-3'} value={debts?.compensation_amount ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รอบ NPA'} 
                            handleChange={(val) => handleChangeDebt('npA_round', val)} 
                            containerClassname={'mb-3'} value={debts?.npA_round} disabled
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-12">
                          <Textbox title={'เอกสารสิทธิ์'} containerClassname={'mb-3'} value={debts?.title_document_no} disabled />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ราคาประเมินของเจ้าหนี้'} disabled
                            handleChange={(val) => handleChangeDebt('estimated_price_creditors_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.estimated_price_creditors_cf ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ราคาขายทรัพย์ NPA'} disabled={isView}
                            handleChange={(val) => handleChangeDebt('npA_property_sales_price_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.npA_property_sales_price_cf ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ต้นเงินคงค้าง (NPL)'} disabled
                            handleChange={(val) => handleChangeDebt('npL_remaining_capital', val)} 
                            containerClassname={'mb-3'} value={debts?.npL_remaining_capital ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)'} disabled={isView}
                            handleChange={(val) => handleChangeDebt('npL_creditors_receive_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.npL_creditors_receive_cf ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ค่าใช้จ่ายในการดำเนินคดี'} disabled={isView}
                            handleChange={(val) => handleChangeDebt('litigation_expenses_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.litigation_expenses_cf ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ค่าเบี้ยประกัน'} disabled={isView}
                            handleChange={(val) => handleChangeDebt('insurance_premium_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.insurance_premium_cf ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รวมค่าใช้จ่าย'} 
                            handleChange={(val) => handleChangeDebt('total_xpenses_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.total_xpenses_cf} disabled isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รวมทั้งสิ้น'} 
                            handleChange={(val) => handleChangeDebt('frD_total_payment_cf', val)} 
                            containerClassname={'mb-3'} value={debts?.frD_total_payment_cf} disabled isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating">
                            <select className={`form-select`} value={debts?.regulation_no ?? ''} onChange={(e) => handleChangeDebt('regulation_no', e.target?.value)} disabled>
                              <option value="ข้อ 6 (1) ซื้อไม่เกินราคาที่เจ้าหนี้เดิม" selected>ข้อ 6 (1) ซื้อไม่เกินราคาที่เจ้าหนี้เดิม</option>
                              <option value="ข้อ 6 (2) ซื้อไม่เกินราคาประเมินของทางราชการ">ข้อ 6 (2) ซื้อไม่เกินราคาประเมินของทางราชการ</option>
                              <option value="ข้อ 6 (3) ซื้อไม่เกินราคาประเมินของเจ้าหนี้">ข้อ 6 (3) ซื้อไม่เกินราคาประเมินของเจ้าหนี้</option>
                              <option value="ข้อ 6 (4) ซื้อไม่เกินราคาซื้อไม่เกินราคาประเมินจากบริษัทประเมินมูลค่าทรัพย์สินที่ได้รับความเห็นชอบจากคณะกรรมการกำกับหลักเกณฑ์และตลาดหลักทรัพย์ (กลต.)">
                                ข้อ 6 (4) ซื้อไม่เกินราคาซื้อไม่เกินราคาประเมินจากบริษัทประเมินมูลค่าทรัพย์สินที่ได้รับความเห็นชอบจากคณะกรรมการกำกับหลักเกณฑ์และตลาดหลักทรัพย์ (กลต.)
                              </option>
                            </select>
                            <label htmlFor="floatingSelectPrivacy">ซื้อทรัพย์ตามระเบียบฯ</label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <DatePicker title={'วันที่ซื้อทรัพย์จากบังคับคดี'}
                            value={debts?.date_of_purchase} disabled
                            handleChange={(val) => handleChangeDebt('date_of_purchase', val)} 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <DatePicker title={'วันโอนกรรมสิทธิ์มาเป็นของเจ้าหนี้'} disabled
                            value={debts?.ownership_transfer_date} 
                            handleChange={(val) => handleChangeDebt('ownership_transfer_date', val)} 
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