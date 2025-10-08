import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Textbox from "@views/components/input/Textbox";
import AreaTextbox from "@views/components/input/AreaTextbox";
import Textarea from "@views/components/input/Textarea";
import DatePicker from "@views/components/input/DatePicker";
import According from "@views/components/panel/according";
import { 
  getProvinces,
  getBigDataCreditorTypes,
  getBigDataCreditors,
  getDebtManagementDetailClassifyNpa,
  updateDebtManagementDetailClassifyNpa,
  upsertCollateralClassify,
  removeCollateralClassify,
} from "@services/api";
import { ToDateDb } from "@utils";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const FullModal = (props) => {
  const {isOpen, setModal, onClose, data} = props;
  const [isMounted, setMounted] = useState(false);
  const [collateral_type, setCollateralType] = useState(null);
  const [collateralDetail, setCollateralDetail] = useState(null);
  const [isOpenCollateralAdd, setOpenCollateralAdd] = useState(false);
  const [isOpenCollateralEdit, setOpenCollateralEdit] = useState(false);
  const [debts, setDebts] = useState(null);
  const [collaterals, setCollaterals] = useState(null);
  const [provinces, setProvOp] = useState(null);
  const [creditor_types, setCreditorTypeOp] = useState(null);
  const [creditors, setCreditorOp] = useState(null);
  const [creditor_type, setCreditorType] = useState(null);
  const [not_correct_list, setNotCorrectList] = useState(null);
  const toggle = () => setModal(!isOpen);
  const submitDebt = async () => {
    const result = await updateDebtManagementDetailClassifyNpa({ 
      ...debts
      , date_of_purchase: ToDateDb(debts?.date_of_purchase)
      , ownership_transfer_date: ToDateDb(debts?.ownership_transfer_date) 
      , not_correct_list: '0,0,0,0,0,0,0,0,0'
    });
    if (result.isSuccess) {
      await fetchData();
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
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
  const addCollateral = async() => {
    await setCollateralDetail({ id_debt_management: debts.id_debt_management, title_document_type: 'โฉนด', collateral_status: 'โอนได้' });
    await setCollateralType('โฉนด')
    await setOpenCollateralAdd(true)
    await setOpenCollateralEdit(true)
  }
  const editCollateral = async(item) => {
    await setCollateralDetail(item)
    await setCollateralType(item.title_document_type)
    await setOpenCollateralAdd(false)
    await setOpenCollateralEdit(true)
  }
  const saveCollateral = async() => {
    const result = await upsertCollateralClassify({ ...collateralDetail, debt_management_type: 'NPA' });
    if (result.isSuccess) {
      await fetchData();
      await setOpenCollateralEdit(false)
      await setCollateralDetail(null)
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const removeCollateral = async(item) => {
    const result = await removeCollateralClassify(item);
    if (result.isSuccess) {
      await fetchData();
      await setOpenCollateralEdit(false)
      await setCollateralDetail(null)
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const handleChangeCollateral = async (key, val) => {
    if (key == 'title_document_type') {
      await setCollateralType(val);
      await setCollateralDetail((prevState) => ({
        ...prevState,
        ...({stock_status: (val == 'หุ้น')})
      }))
    }
    await setCollateralDetail((prevState) => ({
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
    const result = await getDebtManagementDetailClassifyNpa(data.id_card, data.province, data.creditor_type);
    if (result.isSuccess) {
      const debt = result.contracts.find(x => x.id_debt_management == data.id_debt_management)
      await setDebts({
        ...debt,
        debt_management_audit_status: (debt.debt_management_audit_status ?? 'อยู่ระหว่างการสอบยอด'),
        debt_manage_creditor_type: (debt.debt_manage_creditor_type ?? creditor_type),
        debt_manage_creditor_name: (debt.debt_manage_creditor_name ?? (creditors ? creditors[0] : '')),
        contract_conditions: (debt.contract_conditions ?? 'ตามจำนวนเงินที่กองทุนชำระหนี้แทน'),
        compensation_conditions: (debt.compensation_conditions ?? 'ไม่มีการชดเชย'),
        debt_manage_objective: (debt.debt_manage_objective ?? 'เพื่อการเกษตร'),
      });
      await setNotCorrectList((debt?.not_correct_list ? debt?.not_correct_list.split(',') : ['0','0','0','0','0','0','0','0','0']))
      await setCreditorType(debt.debt_manage_creditor_type);
      const colls = result.collaterals.filter(x => x.id_debt_management == debt.id_debt_management);
      await setCollaterals(colls);
    } else {
      await setDebts(null);
      await setCollaterals(null);
    }
  }
  useEffect(() => {
    setDebts((prevState) => ({
      ...prevState,
      total_xpenses: debts?.litigation_expenses + debts?.insurance_premium
    }))
  },[debts?.litigation_expenses, debts?.insurance_premium])
  useEffect(() => {
    setDebts((prevState) => ({
      ...prevState,
      frD_total_payment: debts?.npA_property_sales_price + debts?.npL_creditors_receive + debts?.litigation_expenses + debts?.insurance_premium
    }))
  },[debts?.npA_property_sales_price, debts?.npL_creditors_receive, debts?.litigation_expenses, debts?.insurance_premium])
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
        <ModalHeader toggle={toggle}>รายละเอียดจำแนกมูลหนี้ NPA ตามสัญญา</ModalHeader>
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
                          <Textbox title={'เลขที่สัญญา'} classname={`${(not_correct_list && not_correct_list[0] == '1') ? 'border-danger' : ''}`}
                            handleChange={(val) => handleChangeDebt('debt_manage_contract_no', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_contract_no}
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
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
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating form-floating-advance-select mb-3">
                            <label htmlFor="floaTingLabelSingleSelect">สถานะหนี้</label>
                            <select className={`form-select ${(not_correct_list && not_correct_list[6] == '1') ? 'border-danger' : ''}`} value={debts?.debt_manage_status ?? ''} onChange={(e) => handleChangeDebt('debt_manage_status', e.target?.value)}>
                              <option value="ปกติ">ปกติ</option>
                              <option value="ผิดนัดชำระ" >ผิดนัดชำระ</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating">
                            <select className={`form-select ${(not_correct_list && not_correct_list[7] == '1') ? 'border-danger' : ''}`} value={debts?.debt_manage_objective ?? ''} onChange={(e) => handleChangeDebt('debt_manage_objective', e.target?.value)}>
                              <option value="เพื่อการเกษตร">เพื่อการเกษตร</option>
                              <option value="ไม่เพื่อการเกษตร">ไม่เพื่อการเกษตร</option>
                              <option value="เพื่อการเกษตรและไม่เพื่อการเกษตร">เพื่อการเกษตรและไม่เพื่อการเกษตร</option>
                            </select>
                            <label htmlFor="floatingSelectPrivacy">วัตถุประสงค์</label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                          <Textarea title={'รายละเอียดวัตถุประสงค์'} 
                            handleChange={(val) => handleChangeDebt('debt_manage_objective_details', val)} 
                            containerClassname={'mb-3'} value={debts?.debt_manage_objective_details}
                          />
                        </div>

                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'จำนวนเงินที่ชดเชย'} 
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
                          <Textbox title={'ราคาประเมินของเจ้าหนี้'} classname={`${(not_correct_list && not_correct_list[1] == '1') ? 'border-danger' : ''}`}
                            handleChange={(val) => handleChangeDebt('estimated_price_creditors', val)} 
                            containerClassname={'mb-3'} value={debts?.estimated_price_creditors ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ราคาขายทรัพย์ NPA'} classname={`${(not_correct_list && not_correct_list[2] == '1') ? 'border-danger' : ''}`} 
                            handleChange={(val) => handleChangeDebt('npA_property_sales_price', val)} 
                            containerClassname={'mb-3'} value={debts?.npA_property_sales_price ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ต้นเงินคงค้าง (NPL)'}
                            handleChange={(val) => handleChangeDebt('npL_remaining_capital', val)} 
                            containerClassname={'mb-3'} value={debts?.npL_remaining_capital ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)'} classname={`${(not_correct_list && not_correct_list[3] == '1') ? 'border-danger' : ''}`} 
                            handleChange={(val) => handleChangeDebt('npL_creditors_receive', val)} 
                            containerClassname={'mb-3'} value={debts?.npL_creditors_receive ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ค่าใช้จ่ายในการดำเนินคดี'} classname={`${(not_correct_list && not_correct_list[4] == '1') ? 'border-danger' : ''}`} 
                            handleChange={(val) => handleChangeDebt('litigation_expenses', val)} 
                            containerClassname={'mb-3'} value={debts?.litigation_expenses ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ค่าเบี้ยประกัน'} classname={`${(not_correct_list && not_correct_list[5] == '1') ? 'border-danger' : ''}`} 
                            handleChange={(val) => handleChangeDebt('insurance_premium', val)} 
                            containerClassname={'mb-3'} value={debts?.insurance_premium ?? 0} isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รวมค่าใช้จ่าย'} 
                            handleChange={(val) => handleChangeDebt('total_xpenses', val)} 
                            containerClassname={'mb-3'} value={debts?.total_xpenses ?? 0} disabled isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รวมทั้งสิ้น'} 
                            handleChange={(val) => handleChangeDebt('frD_total_payment', val)} 
                            containerClassname={'mb-3'} value={debts?.frD_total_payment ?? 0} disabled isNumber
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <div className="form-floating">
                            <select className={`form-select ${(not_correct_list && not_correct_list[8] == '1') ? 'border-danger' : ''}`} value={debts?.regulation_no ?? ''} onChange={(e) => handleChangeDebt('regulation_no', e.target?.value)}>
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
                            value={debts?.date_of_purchase} 
                            handleChange={(val) => handleChangeDebt('date_of_purchase', val)} 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <DatePicker title={'วันโอนกรรมสิทธิ์มาเป็นของเจ้าหนี้'}
                            value={debts?.ownership_transfer_date} 
                            handleChange={(val) => handleChangeDebt('ownership_transfer_date', val)} 
                          />
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
                              <option value="ติดอายัติ(เจ้าหนี้อื่น)">ติดอายัติ(เจ้าหนี้อื่น)</option>
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
                                                  <Textbox title={'เลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('parceL_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เล่ม'} 
                                                    handleChange={(val) => handleChangeCollateral('parceL_volume', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_volume}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'หน้า'} 
                                                    handleChange={(val) => handleChangeCollateral('parceL_page', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_page}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select ">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" value={collateralDetail?.parceL_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('parceL_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'อำเภอ'} 
                                                    handleChange={(val) => handleChangeCollateral('parceL_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_district}
                                                  />
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
                                                  <Textbox title={'ระวาง'} 
                                                    handleChange={(val) => handleChangeCollateral('parceL_map_sheet', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_map_sheet}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เลขที่ดิน'} 
                                                    handleChange={(val) => handleChangeCollateral('parceL_parcel_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_parcel_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'หน้าสำรวจ'} 
                                                    handleChange={(val) => handleChangeCollateral('parceL_explore_page', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_explore_page}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ตำบล'} 
                                                    handleChange={(val) => handleChangeCollateral('parceL_sub_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_sub_district}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดโฉนดที่ดิน */}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                                value={collateralDetail?.promisor}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                                value={collateralDetail?.contract_recipient}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)} 
                                                rai={collateralDetail?.contract_area_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)} 
                                                ngan={collateralDetail?.contract_area_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)} 
                                                wa={collateralDetail?.contract_area_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)} 
                                                rai={collateralDetail?.area_transfer_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)} 
                                                ngan={collateralDetail?.area_transfer_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)} 
                                                wa={collateralDetail?.area_transfer_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="form-floating form-floating-advance-select ">
                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                <select className="form-select" value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                                  <option value="จำนอง">จำนอง</option>
                                                  <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                  <option value="สืบทรัพย์">สืบทรัพย์</option>
                                                  <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                                  <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                                  <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                                value={collateralDetail?.source_of_wealth_other}
                                                disabled={collateralDetail?.source_of_wealth != 'อื่นๆ'}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                value={collateralDetail?.remark}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
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
                                                  <Textbox title={'เล่มที่'} 
                                                    handleChange={(val) => handleChangeCollateral('pre_emption_volume_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.pre_emption_volume_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เล่ม'} 
                                                    handleChange={(val) => handleChangeCollateral('pre_emption_volume', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.pre_emption_volume}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'หน้า'} 
                                                    handleChange={(val) => handleChangeCollateral('pre_emption_page', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.pre_emption_page}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'ระวาง'} 
                                                    handleChange={(val) => handleChangeCollateral('pre_emption_map_sheet', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.pre_emption_map_sheet}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เลขที่ดิน'} 
                                                    handleChange={(val) => handleChangeCollateral('pre_emption_parcel_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.pre_emption_parcel_no}
                                                  />
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
                                                    <select className="form-select" value={collateralDetail?.pre_emption_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('pre_emption_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'อำเภอ'} 
                                                    handleChange={(val) => handleChangeCollateral('pre_emption_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.pre_emption_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ตำบล'} 
                                                    handleChange={(val) => handleChangeCollateral('pre_emption_sub_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.pre_emption_sub_district}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดตราจอง */}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                                value={collateralDetail?.promisor}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                                value={collateralDetail?.contract_recipient}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)} 
                                                rai={collateralDetail?.contract_area_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)} 
                                                ngan={collateralDetail?.contract_area_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)} 
                                                wa={collateralDetail?.contract_area_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)} 
                                                rai={collateralDetail?.area_transfer_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)} 
                                                ngan={collateralDetail?.area_transfer_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)} 
                                                wa={collateralDetail?.area_transfer_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="form-floating form-floating-advance-select ">
                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                <select className="form-select" value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                                  <option value="จำนอง">จำนอง</option>
                                                  <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                  <option value="สืบทรัพย์">สืบทรัพย์</option>
                                                  <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                                  <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                                  <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                                value={collateralDetail?.source_of_wealth_other}
                                                disabled={collateralDetail?.source_of_wealth != 'อื่นๆ'}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                value={collateralDetail?.remark}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
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
                                                    <select className="form-select" value={collateralDetail?.nS3_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'อำเภอ'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ตำบล'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3_sub_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3_sub_district}
                                                  />
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
                                                  <Textbox title={'เล่ม'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3_emption_volume', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3_emption_volume}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'หน้า'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3_emption_page', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3_emption_page}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'สารบบเล่ม/เลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3_dealing_file_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3_dealing_file_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'สารบบหน้า'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3_dealing_page_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3_dealing_page_no}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดหนังสือรับรองการทำประโยชน์(น.ส.3) */}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                                value={collateralDetail?.promisor}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                                value={collateralDetail?.contract_recipient}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)} 
                                                rai={collateralDetail?.contract_area_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)} 
                                                ngan={collateralDetail?.contract_area_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)} 
                                                wa={collateralDetail?.contract_area_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)} 
                                                rai={collateralDetail?.area_transfer_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)} 
                                                ngan={collateralDetail?.area_transfer_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)} 
                                                wa={collateralDetail?.area_transfer_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="form-floating form-floating-advance-select ">
                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                <select className="form-select" value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                                  <option value="จำนอง">จำนอง</option>
                                                  <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                  <option value="สืบทรัพย์">สืบทรัพย์</option>
                                                  <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                                  <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                                  <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                                value={collateralDetail?.source_of_wealth_other}
                                                disabled={collateralDetail?.source_of_wealth != 'อื่นๆ'}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                value={collateralDetail?.remark}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
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
                                                    <select className="form-select" value={collateralDetail?.nS3A_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3A_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'อำเภอ'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3A_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3A_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ตำบล'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3A_sub_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3A_sub_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ระวางรูปถ่ายทางออกชื่อ'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3A_map_sheet', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3A_map_sheet}
                                                  />
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
                                                  <Textbox title={'เลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3A_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3A_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เล่มที่'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3A_volume_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3A_volume_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'หน้า'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3A_page', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3A_page}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'เลขที่ดิน'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3A_parcel_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3A_parcel_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'หมายเลข'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3A_number', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3A_number}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'แผ่นที่'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3A_sheet_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3A_sheet_no}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ก) */}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                                value={collateralDetail?.promisor}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                                value={collateralDetail?.contract_recipient}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)} 
                                                rai={collateralDetail?.contract_area_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)} 
                                                ngan={collateralDetail?.contract_area_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)} 
                                                wa={collateralDetail?.contract_area_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)} 
                                                rai={collateralDetail?.area_transfer_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)} 
                                                ngan={collateralDetail?.area_transfer_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)} 
                                                wa={collateralDetail?.area_transfer_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="form-floating form-floating-advance-select ">
                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                <select className="form-select" value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                                  <option value="จำนอง">จำนอง</option>
                                                  <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                  <option value="สืบทรัพย์">สืบทรัพย์</option>
                                                  <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                                  <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                                  <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                                value={collateralDetail?.source_of_wealth_other}
                                                disabled={collateralDetail?.source_of_wealth != 'อื่นๆ'}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                value={collateralDetail?.remark}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
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
                                                    <select className="form-select" value={collateralDetail?.nS3B_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3B_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'อำเภอ'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3B_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3B_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'ตำบล'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3B_sub_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3B_sub_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'หมู่ที่'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3B_village', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3B_village}
                                                  />
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
                                                  <Textbox title={'เล่ม'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3B_volume', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3B_volume}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'หน้า'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3B_page', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3B_page}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'เลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('nS3B_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.nS3B_no}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ข) */}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                                value={collateralDetail?.promisor}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                                value={collateralDetail?.contract_recipient}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)} 
                                                rai={collateralDetail?.contract_area_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)} 
                                                ngan={collateralDetail?.contract_area_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)} 
                                                wa={collateralDetail?.contract_area_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)} 
                                                rai={collateralDetail?.area_transfer_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)} 
                                                ngan={collateralDetail?.area_transfer_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)} 
                                                wa={collateralDetail?.area_transfer_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="form-floating form-floating-advance-select ">
                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                <select className="form-select" value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                                  <option value="จำนอง">จำนอง</option>
                                                  <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                  <option value="สืบทรัพย์">สืบทรัพย์</option>
                                                  <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                                  <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                                  <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                                value={collateralDetail?.source_of_wealth_other}
                                                disabled={collateralDetail?.source_of_wealth != 'อื่นๆ'}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                value={collateralDetail?.remark}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
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
                                                    <select className="form-select" value={collateralDetail?.alrO_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('alrO_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'อำเภอ'} 
                                                    handleChange={(val) => handleChangeCollateral('alrO_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.alrO_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ตำบล'} 
                                                    handleChange={(val) => handleChangeCollateral('alrO_sub_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.alrO_sub_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'หมู่ที่'} 
                                                    handleChange={(val) => handleChangeCollateral('alrO_village', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.alrO_village}
                                                  />
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
                                                  <Textbox title={'แปลงเลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('alrO_plot_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.alrO_plot_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ระวาง ส.ป.ก. ที่'} 
                                                    handleChange={(val) => handleChangeCollateral('alrO_map_sheet', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.alrO_map_sheet}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'เลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('alrO_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.alrO_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เล่ม'} 
                                                    handleChange={(val) => handleChangeCollateral('alrO_volume', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.alrO_volume}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'หน้า'} 
                                                    handleChange={(val) => handleChangeCollateral('alrO_page', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.alrO_page}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด ส.ป.ก. */}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                                value={collateralDetail?.promisor}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                                value={collateralDetail?.contract_recipient}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)} 
                                                rai={collateralDetail?.contract_area_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)} 
                                                ngan={collateralDetail?.contract_area_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)} 
                                                wa={collateralDetail?.contract_area_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)} 
                                                rai={collateralDetail?.area_transfer_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)} 
                                                ngan={collateralDetail?.area_transfer_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)} 
                                                wa={collateralDetail?.area_transfer_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="form-floating form-floating-advance-select ">
                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                <select className="form-select" value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                                  <option value="จำนอง">จำนอง</option>
                                                  <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                  <option value="สืบทรัพย์">สืบทรัพย์</option>
                                                  <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                                  <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                                  <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                                value={collateralDetail?.source_of_wealth_other}
                                                disabled={collateralDetail?.source_of_wealth != 'อื่นๆ'}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                value={collateralDetail?.remark}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
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
                                                  <Textbox title={'โฉนดที่ดินเลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('condO_parcel_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.condO_parcel_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" value={collateralDetail?.condO_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('condO_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'อำเภอ'} 
                                                    handleChange={(val) => handleChangeCollateral('condO_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.condO_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ตำบล'} 
                                                    handleChange={(val) => handleChangeCollateral('condO_sub_district', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.condO_sub_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <AreaTextbox title={'เนื้อที่'} containerClassname={'mb-3'}
                                                    handleChangeRai={(val) => handleChangeCollateral('condO_rai', val)} 
                                                    rai={collateralDetail?.condO_rai}
                                                    handleChangeNgan={(val) => handleChangeCollateral('condO_ngan', val)} 
                                                    ngan={collateralDetail?.condO_ngan}
                                                    handleChangeWa={(val) => handleChangeCollateral('condO_sqaure_wa', val)} 
                                                    wa={collateralDetail?.condO_sqaure_wa}
                                                  />
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
                                                  <Textbox title={'ห้องชุดเลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('condO_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.condO_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ชั้นที่'} 
                                                    handleChange={(val) => handleChangeCollateral('condO_floor', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.condO_floor}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'อาคารเลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('condO_building_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.condO_building_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ชื่ออาคารชุด'} 
                                                    handleChange={(val) => handleChangeCollateral('condO_building_name', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.condO_building_name}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ทะเบียนอาคารชุดเลขที่'} 
                                                    handleChange={(val) => handleChangeCollateral('condO_registration_no', val)} 
                                                    containerClassname={'mb-3'} value={collateralDetail?.condO_registration_no}
                                                  />
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
                                                  <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                                    value={collateralDetail?.promisor}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                                    value={collateralDetail?.contract_recipient}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เนื้อที่ประมาณ'} footer={'ตารางเมตร'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('area_square_meter', val)} 
                                                    value={collateralDetail?.area_square_meter}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'สูง'} footer={'เมตร'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('high_meter', val)} 
                                                    value={collateralDetail?.high_meter}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select ">
                                                    <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                    <select className="form-select" value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                                      <option value="จำนอง">จำนอง</option>
                                                      <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                      <option value="สืบทรัพย์">สืบทรัพย์</option>
                                                      <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                                      <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                                      <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                      <option value="อื่นๆ">อื่นๆ</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                                    value={collateralDetail?.source_of_wealth_other}
                                                    disabled={collateralDetail?.source_of_wealth != 'อื่นๆ'}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                    value={collateralDetail?.remark}
                                                  />
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
                                                  <Textbox title={'ที่ดินตั้งอยู่เลขที่'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('labT5_parcel_no', val)} 
                                                    value={collateralDetail?.labT5_parcel_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" value={collateralDetail?.labT5_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('labT5_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'อำเภอ'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('labT5_district', val)} 
                                                    value={collateralDetail?.labT5_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'ตำบล'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('labT5_sub_district', val)} 
                                                    value={collateralDetail?.labT5_sub_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'หมู่ที่'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('labT5_village', val)} 
                                                    value={collateralDetail?.labT5_village}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด ภ.ท.บ.5 */}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อที่ทั้งหมด'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('total_area_rai', val)} 
                                                rai={collateralDetail?.total_area_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('total_area_ngan', val)} 
                                                ngan={collateralDetail?.total_area_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('total_area_sqaure_wa', val)} 
                                                wa={collateralDetail?.total_area_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="form-floating form-floating-advance-select ">
                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                <select className="form-select" value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                                  <option value="จำนอง">จำนอง</option>
                                                  <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                  <option value="สืบทรัพย์">สืบทรัพย์</option>
                                                  <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                                  <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                                  <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                                value={collateralDetail?.source_of_wealth_other}
                                                disabled={collateralDetail?.source_of_wealth != 'อื่นๆ'}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                value={collateralDetail?.remark}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
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
                                                  <Textbox title={'สิ่งปลูกสร้างเลขที่'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('house_no', val)} 
                                                    value={collateralDetail?.house_no}
                                                  />
                                                  <div className="input-group mb-3">
                                                    <span className="input-group-text" id="Search_id_card">สิ่งปลูกสร้างเลขที่</span>
                                                    <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" value={collateralDetail?.house_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('house_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'อำเภอ'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('house_district', val)} 
                                                    value={collateralDetail?.house_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'ตำบล'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('house_sub_district', val)} 
                                                    value={collateralDetail?.house_sub_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'ตั้งอยู่บนที่ดินเลขที่'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('house_parcel_no', val)} 
                                                    value={collateralDetail?.house_parcel_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textbox title={'ลักษณะสิ่งปลูกสร้าง'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('house_type', val)} 
                                                    value={collateralDetail?.house_type}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด บ้าน */}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                                value={collateralDetail?.promisor}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                                value={collateralDetail?.contract_recipient}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)} 
                                                rai={collateralDetail?.contract_area_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)} 
                                                ngan={collateralDetail?.contract_area_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)} 
                                                wa={collateralDetail?.contract_area_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)} 
                                                rai={collateralDetail?.area_transfer_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)} 
                                                ngan={collateralDetail?.area_transfer_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)} 
                                                wa={collateralDetail?.area_transfer_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <div className="form-floating form-floating-advance-select ">
                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                <select className="form-select" value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                                  <option value="จำนอง">จำนอง</option>
                                                  <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                                  <option value="สืบทรัพย์">สืบทรัพย์</option>
                                                  <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                                  <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                                  <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                                  <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                                value={collateralDetail?.source_of_wealth_other}
                                                disabled={collateralDetail?.source_of_wealth != 'อื่นๆ'}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                value={collateralDetail?.remark}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
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
                                                  <Textbox title={'วันที่จดทะเบียน'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('chattel_registration_date', val)} 
                                                    value={collateralDetail?.chattel_registration_date}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'ยี่ห้อ'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('chattel_brand', val)} 
                                                    value={collateralDetail?.chattel_brand}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'ประเภท'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('chattel_type', val)} 
                                                    value={collateralDetail?.chattel_type}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เลขทะเบียน'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('chattel_registration_no', val)} 
                                                    value={collateralDetail?.chattel_registration_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'ลักษณะ'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('chattel_style', val)} 
                                                    value={collateralDetail?.chattel_style}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เลขตัวรถ'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('chattel_vehicle_no', val)} 
                                                    value={collateralDetail?.chattel_vehicle_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'เลขเครื่องยนต์'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('chattel_engine_no', val)} 
                                                    value={collateralDetail?.chattel_engine_no}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'สี'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('chattel_color', val)} 
                                                    value={collateralDetail?.chattel_color}
                                                  />
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
                                                  <Textarea title={'ชื่อผู้ถือกรรมสิทธิ์'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('name_legal_owner', val)} 
                                                    value={collateralDetail?.name_legal_owner}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textarea title={'ชื่อผู้ครอบครอง'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('name_occupier', val)} 
                                                    value={collateralDetail?.name_occupier}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                  <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                    value={collateralDetail?.remark}
                                                  />
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
                                    <Textbox title={'หลักประกันอื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('title_document_type_other', val)} 
                                      value={collateralDetail?.title_document_type_other}
                                    />
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
                                                  <Textbox title={'เล่ม'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('otheR_volume', val)} 
                                                    value={collateralDetail?.otheR_volume}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'หน้า'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('otheR_page', val)} 
                                                    value={collateralDetail?.otheR_page}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <div className="form-floating form-floating-advance-select mb-3">
                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                    <select className="form-select" value={collateralDetail?.otheR_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('otheR_province', e.target?.value)}>
                                                      {provinces && (
                                                        provinces.map((option, index) => (
                                                          <option key={index} value={option}>{option}</option>
                                                        ))
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'อำเภอ'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('otheR_district', val)} 
                                                    value={collateralDetail?.otheR_district}
                                                  />
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                  <Textbox title={'ตำบล'} containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChangeCollateral('otheR_sub_district', val)} 
                                                    value={collateralDetail?.otheR_sub_district}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียด อื่นๆ */}
                                  {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                                  <div className="mb-1">
                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                      <div className="card-body p-0">
                                        <div className="p-4 code-to-copy">
                                          <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                          <div className="row g-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                                value={collateralDetail?.promisor}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                              <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                                value={collateralDetail?.contract_recipient}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)} 
                                                rai={collateralDetail?.contract_area_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)} 
                                                ngan={collateralDetail?.contract_area_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)} 
                                                wa={collateralDetail?.contract_area_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)} 
                                                rai={collateralDetail?.area_transfer_rai}
                                                handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)} 
                                                ngan={collateralDetail?.area_transfer_ngan}
                                                handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)} 
                                                wa={collateralDetail?.area_transfer_sqaure_wa}
                                              />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                              <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                                handleChange={(val) => handleChangeCollateral('remark', val)} 
                                                value={collateralDetail?.remark}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end card รายละเอียดสารบัญจดทะเบียน */}
                                </>
                              )}
                              <br />
                              <div className="d-flex justify-content-center ">
                                <button className="btn btn-success me-2" type="button" onClick={() => saveCollateral()}>บันทึก</button>
                                {isOpenCollateralAdd ? (
                                  <button className="btn btn-secondary" type="button" onClick={() => setOpenCollateralEdit(false)}>ยกเลิก</button>
                                ) : (
                                  <button className="btn btn-danger" type="button" onClick={() => removeCollateral(collateralDetail)}>ลบหลักทรัพย์</button>
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
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>ปิด</Button>
        </ModalFooter>
      </Modal>
  );
};
export default FullModal;