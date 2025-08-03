import React from 'react';
import Modal from "@views/components/modal/CustomModal";
import { useEffect, useState, useRef } from "react";
import Textarea from "@views/components/input/Textarea";
import Textbox from "@views/components/input/Textbox";
import AreaTextbox from "@views/components/input/AreaTextbox";
import DropZone from "@views/components/input/DropZone";
import { Input, Label } from 'reactstrap'
import DatePicker from "@views/components/input/DatePicker";
import {
    getExpropriationReceiveRent,
    updateExpropriationLog,
    insertExpropriationLog
} from "@services/api";

const editLandLeaseModal = (props) => {
    const { isOpen, onOk, policy, setModal, propData,showDetail=false } = props; // เพิ่ม propData
    const [data, setData] = useState([]);
    const [clearFile, setClear] = useState({});
    const [files, setFiles] = useState({});

    // เปลี่ยนเป็น array ของ objects สำหรับจัดการหลายฟอร์ม
    const [formData, setFormData] = useState([]);

    // ฟังก์ชันเพิ่มฟอร์มใหม่
    const handleAddForm = () => {
        const newForm = {
            id: Date.now(),
            id_AssetExpropriationLog: 0,
            id_AssetExpropriation: 0,
            rtNo: formData.length,
            payment_docu: '',
            expro_no: '',
            expro_date: null,
            pay_docuno: '',
            pay_date: null,
            cheques_no: '',
            cheques_date: null,
            cashier_check_no: '',
            cashier_check_date: null,
            transfer_rent_date: null,
            cashier_check_amount: 0,
            rf: 0,
            rfNo: 0,
            refund_farmers_docu: '',
            refund_amount: 0,
            debt_deduc_amount: 0,
            transfer_req_docu: '',
            transfer_no: '',
            transfer_date: null,
            payment_no: '',
            refund_date: null,
            amount: 0,
            interest: 0,
            total_amount: 0
        };
        setFormData([...formData, newForm]);
    };

    // ฟังก์ชันลบฟอร์ม
    const handleRemoveForm = (formId) => {
        setFormData(formData.filter(form => form.id !== formId));
    };

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
    const handleChange = (formId, fieldName, value) => {
        setFormData(prevData =>
            prevData.map(form =>
                form.id === formId
                    ? { ...form, [fieldName]: value }
                    : form
            )
        );
    };

    // ฟังก์ชันจัดการไฟล์
    const onFileChange = async (formId, fieldName, files) => {
        if (files.length > 0) {
            setFiles(prev => ({
                ...prev,
                [`${formId}_${fieldName}`]: files
            }));
            setClear(prev => ({
                ...prev,
                [`${formId}_${fieldName}`]: false
            }));
        }
    };

    const save = async () => {
        try {
            const dataToSave = {
                ...formData, // ไม่ต้อง map แล้ว
                id_KFKPolicy: policy?.id_KFKPolicy,
                policyNO: policy?.policyNO,
                id_AssetPolicy: policy?.id_AssetPolicy,
                id_AssetExpropriation: policy?.id_AssetExpropriation,
                indexAssetPolicy: policy?.indexAssetPolicy,
            };
    
            console.log("Data before submit:", dataToSave);
            console.log("Will call:", formData.id_AssetExpropriationLog > 0 ? "UPDATE" : "INSERT");
            
            let result;
            if (formData.id_AssetExpropriationLog && formData.id_AssetExpropriationLog > 0) {
                result = await updateExpropriationLog(dataToSave);
            } else {
                result = await insertExpropriationLog(dataToSave);
            }
            
            console.log("API Result:", result);
            
            if (result?.isSuccess) {
                setModal(false);
                fetchData();
            }
            
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const fetchData = async () => {
        const result = await getExpropriationReceiveRent(policy.id_KFKPolicy);
        if (result.isSuccess) {
            // setData(result.data || []);
            const mockData = [
                {
                    "id_AssetExpropriationLog": 0,
                    "id_AssetExpropriation": 0,
                    "rtNo": 0,
                    "payment_docu": "string",
                    "expro_no": "string",
                    "expro_date": "2025-08-03T08:40:46.062Z",
                    "pay_docuno": "string",
                    "pay_date": "2025-08-03T08:40:46.062Z",
                    "cheques_no": "string",
                    "cheques_date": "2025-08-03T08:40:46.062Z",
                    "cashier_check_no": "string",
                    "cashier_check_date": "2025-08-03T08:40:46.062Z",
                    "transfer_rent_date": "2025-08-03T08:40:46.062Z",
                    "cashier_check_amount": 0,
                    "rf": 0,
                    "rfNo": 0,
                    "refund_farmers_docu": "string",
                    "refund_amount": 0,
                    "debt_deduc_amount": 0,
                    "transfer_req_docu": "string",
                    "transfer_no": "string",
                    "transfer_date": "2025-08-03T08:40:46.062Z",
                    "payment_no": "string",
                    "refund_date": "2025-08-03T08:40:46.062Z",
                    "amount": 0,
                    "interest": 0,
                    "total_amount": 0
                  }
            ];
            setData(mockData);
            // ถ้ามีข้อมูลจาก API ให้ใส่ใน formData สำหรับแก้ไข
            if (result.data && result.data.length > 0) {
                const formsFromAPI = result.data.map((item, index) => ({
                    ...item,
                    id: item.id_AssetExpropriationLog || Date.now() + index
                }));
                setFormData(formsFromAPI);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenReceiveRentDetail = (item) => {
        // เปิดฟอร์มแก้ไขสำหรับ item นี้
        const existingFormIndex = formData.findIndex(form =>
            form.id_AssetExpropriationLog === item.id_AssetExpropriationLog
        );

        if (existingFormIndex === -1) {
            // ถ้ายังไม่มีในฟอร์ม ให้เพิ่มเข้าไป
            setFormData(prev => [...prev, { ...item, id: item.id_AssetExpropriationLog || Date.now() }]);
        }
    };

    const toggle = () => setModal(!isOpen);

    const RenderData = (item, index) => {
        return (item && (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>
                    <div className="d-flex justify-content-center">
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm ms-2"
                            onClick={() => handleOpenReceiveRentDetail(item)}
                        >
                            <span className="fas fa-list"></span>
                        </button>
                    </div>
                </td>
                <td>{item.rtNo}</td>
                <td>{item.pay_date}</td>
                <td>{item.cashier_check_amount}</td>
                <td>{item.refund_amount}</td>
                <td>{item.debt_deduc_amount}</td>
            </tr>
        ))
    };
    const wrappedSetModal = (value) => {
        if (!value) { // เมื่อปิด modal
            setFormData([]); // เคลียร์ข้อมูล
        }
        setModal(value);
    };
    return (
        <Modal
            isOpen={isOpen}
            title="รับเงินค่าเวนคืน"
            closeText="ปิด"
            okText="ตกลง"
            onOk={onOk}
            size='xl'
            hideFooter={true}
            setModal={wrappedSetModal}
        >
            <div className="card my-2 border-0" data-component-card="data-component-card">
                <div className="p-3 code-to-copy">
                    <div className="col-12 mt-3 mb-3">
                        <div className="row g-3 justify-content-end">
                            <div className="col-auto">
                                <button
                                    className="btn btn-primary me-1 mb-1"
                                    type="button"
                                    onClick={handleAddForm}
                                >
                                    <span className="fas fa-plus fs-8"></span> เพิ่มรับเงินค่าเวนคืน
                                </button>
                            </div>
                        </div>
                    </div>

                    <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                        <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0', border: '#cdd0c7' }}>
                            <tr>
                                <th rowSpan="2">#</th>
                                <th rowSpan="2">รายละเอียด</th>
                                <th colSpan="3">รับเงินค่าเวนคืน</th>
                                <th rowSpan="2">คืนเงิน</th>
                                <th rowSpan="2">หักหนี้</th>
                            </tr>
                            <tr>
                                <th>ครั้งที่</th>
                                <th>วันที่ได้รับเงิน</th>
                                <th>จำนวนเงิน</th>
                            </tr>
                        </thead>
                        <tbody className="list text-center align-middle" id="bulk-select-body">
                            {(data && data.length > 0) ? (
                                data.map((item, index) => RenderData(item, index))
                            ) : (
                                <tr>
                                    <td className="fs-9 text-center align-middle" colSpan={7}>
                                        <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Render ฟอร์มทั้งหมด */}
                    {formData.map((form, index) => (
                        <div key={form.id} className="mb-1 rounded p-3 position-relative">
                            <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                <div className="card-body p-0">
                                    <div className="p-3 code-to-copy">
                                        <div className="d-flex justify-content-center mb-3">
                                            <span className="text-center fw-bold">รับเงินค่าเวนคืนครั้งที่ {form.rtNo + 1}</span>
                                        </div>

                                        <div className="d-flex justify-content-center mt-1">
                                            <span className="text-center fw-bold">เอกสารประกอบการโอนเงิน</span>
                                        </div>
                                        <br />

                                        <div className="col-12 mt-1 mb-3">
                                            <DropZone
                                                onChange={(f) => onFileChange(form.id, 'payment_docu', f)}
                                                clearFile={clearFile[`${form.id}_payment_docu`]}
                                                accept={'*'}
                                            />
                                        </div>
                                        <br />

                                        <div className="row g-2 mb-1">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'เลขที่หนังสือ'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'expro_no', val)}
                                                    value={form?.expro_no || ''}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker
                                                    title={'วันที่หนังสือ'}
                                                    value={form.expro_date}
                                                    handleChange={(val) => handleChange(form.id, 'expro_date', val)}
                                                />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'เลขที่ใบสำคัญรับ'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'pay_docuno', val)}
                                                    value={form?.pay_docuno || ''}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker
                                                    title={'วันที่ได้รับเงิน'}
                                                    value={form.pay_date}
                                                    handleChange={(val) => handleChange(form.id, 'pay_date', val)}
                                                />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'เลขที่เช็ค'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'cheques_no', val)}
                                                    value={form?.cheques_no || ''}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker
                                                    title={'วันที่เช็ค'}
                                                    value={form.cheques_date}
                                                    handleChange={(val) => handleChange(form.id, 'cheques_date', val)}
                                                />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'เลขที่แคชเชียร์เช็ค'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'cashier_check_no', val)}
                                                    value={form?.cashier_check_no || ''}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker
                                                    title={'วันที่แคชเชียร์เช็ค'}
                                                    value={form.cashier_check_date}
                                                    handleChange={(val) => handleChange(form.id, 'cashier_check_date', val)}
                                                />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <DatePicker
                                                    title={'วันที่การโอน'}
                                                    value={form.transfer_rent_date}
                                                    handleChange={(val) => handleChange(form.id, 'transfer_rent_date', val)}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'จำนวนเงิน'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'cashier_check_amount', val)}
                                                    value={form?.cashier_check_amount || 0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='form-switch mb-2 d-flex justify-content-center'>
                                <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                    <p className='fw-bold mb-0'>คืนเงิน/หักหนี้</p>
                                    <Input
                                        type='switch'
                                        id={`rf_${form.id}`}
                                        name='rf'
                                        onChange={(e) => handleChange(form.id, 'rf', e.target.checked ? 1 : 0)}
                                        checked={form?.rf == 1}
                                    />
                                </div>
                            </div>
                            {form?.rf == 1 && (<div className="card shadow-none border my-2" data-component-card="data-component-card">
                                <div className="card-body p-0">
                                    <div className="p-3 code-to-copy">
                                        <div className="d-flex justify-content-center mb-1">
                                            <span className="text-center fw-bold">คืนเงิน/หักหนี้ ครั้งที่ {form.rfNo + 1}</span>
                                        </div>
                                        <div className="d-flex justify-content-center mt-1">
                                            <span className="text-center fw-bold">เอกสารเกษตรกรรับแจ้งรับเงินคืนหรือหักหนี้</span>
                                        </div>
                                        <br />

                                        <div className="col-12 mt-1 mb-3">
                                            <DropZone
                                                onChange={(f) => onFileChange(form.id, 'refund_farmers_docu', f)}
                                                clearFile={clearFile[`${form.id}_refund_farmers_docu`]}
                                                accept={'*'}
                                            />
                                        </div>
                                        <br />

                                        <div className="row g-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'คืนเงินจำนวน'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'refund_amount', val)}
                                                    value={form?.refund_amount || 0}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'หักหนี้จำนวน'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'debt_deduc_amount', val)}
                                                    value={form?.debt_deduc_amount || 0}
                                                />
                                            </div>
                                        </div>
                                        <div className="row g-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <div className="form-floating form-floating-advance-select ">
                                                    <label htmlFor="floaTingLabelSingleSelect">รายละเอียด</label>
                                                    <select className="form-select" disabled={showDetail} handleChange={(val) => handleChange(form.id, 'debt_deduc_amount', val)}
                                                    value={form?.debt_deduc_amount || 0}>
                                                        <option value="ค่าทดแทนที่ดิน">ค่าทดแทนต้นไม้</option>
                                                        <option value="ค่าทดแทนที่ดิน">จค่าทดแทนที่ดิน</option>
                                                        <option value="ค่ารื้อถอน">ค่ารื้อถอน</option>
                                                        <option value="อืนๆ">อื่นๆ</option>
                                                    </select>
                                                </div>

                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'อื่นๆโปรดระบุ'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'debt_deduc_amount', val)}
                                                    value={form?.debt_deduc_amount || 0}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center">
                                            <span className="text-center fw-bold">ทำเรื่องให้บัญชีโอนเงิน</span>
                                        </div>
                                        <br />

                                        <div className="col-12 mt-1 mb-3">
                                            <DropZone
                                                onChange={(f) => onFileChange(form.id, 'transfer_req_docu', f)}
                                                clearFile={clearFile[`${form.id}_transfer_req_docu`]}
                                                accept={'*'}
                                            />
                                        </div>
                                        <br />

                                        <div className="row g-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'เลขที่หนังสือ'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'transfer_no', val)}
                                                    value={form?.transfer_no || ''}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker
                                                    title={'วันที่หนังสือ'}
                                                    value={form.transfer_date}
                                                    handleChange={(val) => handleChange(form.id, 'transfer_date', val)}
                                                />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox
                                                    title={'เลขที่ใบสำคัญการจ่าย'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'payment_no', val)}
                                                    value={form?.payment_no || ''}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker
                                                    title={'วันที่โอนเงิน'}
                                                    value={form.refund_date}
                                                    handleChange={(val) => handleChange(form.id, 'refund_date', val)}
                                                />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <Textbox
                                                    title={'จำนวนเงินค่าเวนคืน'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'amount', val)}
                                                    value={form?.amount || 0}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <Textbox
                                                    title={'ดอกเบี้ย'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'interest', val)}
                                                    value={form?.interest || 0}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <Textbox
                                                    title={'รวมจำนวนเงินทั้งสิ้น'}
                                                    containerClassname={'mb-3'}
                                                    handleChange={(val) => handleChange(form.id, 'total_amount', val)}
                                                    value={form?.total_amount || 0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)}

                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-center">
                    <button className="btn btn-success me-2" type="button" onClick={() => save()}>
                        บันทึก
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default editLandLeaseModal;