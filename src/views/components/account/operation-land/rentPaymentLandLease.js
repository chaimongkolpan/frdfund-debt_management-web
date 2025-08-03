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
    getReceiveRent,
    saveRecieveRent,
    updateRecieveRent
} from "@services/api";

const editLandLeaseModal = (props) => {
    const { isOpen, onOk, policy, setModal, propData } = props; // เพิ่ม propData
    const [data, setData] = useState([]);
    const [clearFile, setClear] = useState({});
    const [files, setFiles] = useState({});
  
    const [formData, setFormData] = useState({
        id_AssetRental: 0,
        id_AssetRentalLog: 0,
        rtNo: 0,
        payment_docu: '',
        rent_no: '',
        rent_date: null,
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
        total_amount: 0});

        const [showForm, setShowForm] = useState(false); 
        const [addForm, setAddForm] = useState(false);
    // ฟังก์ชันเพิ่มฟอร์มใหม่
    const handleAddForm = () => {
        setFormData({
            id_AssetRentalLog: 0,
            id_AssetRental: 0,
            rtNo: data.length,
            payment_docu: '',
            rent_no: '',
            rent_date: null,
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
        });
        setAddForm(true);
        setShowForm(true);
    };

    // ฟังก์ชันลบฟอร์ม
    const handleRemoveForm = (formId) => {
        setFormData(formData.filter(form => form.id !== formId));
    };

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
    const handleChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const onFileChange = async (fieldName, files) => {
        if (files.length > 0) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: files[0]
            }));
        }
    };

    const save = async () => {
        try {
            const form = new FormData();
            
            form.append('id_AssetRentalLog', formData.id_AssetRentalLog || 0);
            form.append('id_AssetReantal', formData.id_AssetReantal || 0);
            form.append('rtNo', formData.rtNo || 0);
            form.append('rent_no', formData.rent_no || "");
            form.append('rent_date', formData.rent_date ? formData.rent_date.toISOString() : '');
            form.append('pay_docuno', formData.pay_docuno || "");
            form.append('pay_date', formData.pay_date ? formData.pay_date.toISOString() : '');
            form.append('cheques_no', formData.cheques_no || "");
            form.append('cheques_date', formData.cheques_date ? formData.cheques_date.toISOString() : '');
            form.append('cashier_check_no', formData.cashier_check_no || "");
            form.append('cashier_check_date', formData.cashier_check_date ? formData.cashier_check_date.toISOString() : '');
            form.append('transfer_rent_date', formData.transfer_rent_date ? formData.transfer_rent_date.toISOString() : '');
            form.append('cashier_check_amount', formData.cashier_check_amount || 0);
            form.append('rf', formData.rf || 0);
            form.append('rfNo', formData.rfNo || 0);
            form.append('refund_amount', formData.refund_amount || 0);
            form.append('debt_deduc_amount', formData.debt_deduc_amount || 0);
            form.append('transfer_no', formData.transfer_no || "");
            form.append('transfer_date', formData.transfer_date ? formData.transfer_date.toISOString() : '');
            form.append('payment_no', formData.payment_no || "");
            form.append('refund_date', formData.refund_date ? formData.refund_date.toISOString() : '');
            form.append('amount', formData.amount || 0);
            form.append('interest', formData.interest || 0);
            form.append('total_amount', formData.total_amount || 0);
            
            // ไฟล์
            if (formData.payment_docu instanceof File) {
                form.append('payment_docu', formData.payment_docu);
            }
            if (formData.refund_farmers_docu instanceof File) {
                form.append('refund_farmers_docu', formData.refund_farmers_docu);
            }
            if (formData.transfer_req_docu instanceof File) {
                form.append('transfer_req_docu', formData.transfer_req_docu);
            }
            
            const result = addForm ? await saveRecieveRent(form) : await updateRecieveRent(form);

          
            if (result?.isSuccess) {
                setShowForm(false);
                setFormData({});
                fetchData(); // รีเฟรชข้อมูลในตาราง
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchData = async () => {
        const result = await getReceiveRent(policy.id_KFKPolicy);
        if (result.isSuccess) {
           // setData(result.data || []);
            const mockData = [
                {
                  "id_AssetRentalLog": 0,
                  "id_AssetRental": 0,
                  "rtNo": 0,
                  "payment_docu": "string",
                  "rent_no": "string",
                  "rent_date": "2025-08-02T13:28:53.211Z",
                  "pay_docuno": "string",
                  "pay_date": "2025-08-02T13:28:53.211Z",
                  "cheques_no": "string",
                  "cheques_date": "2025-08-02T13:28:53.211Z",
                  "cashier_check_no": "string",
                  "cashier_check_date": "2025-08-02T13:28:53.211Z",
                  "transfer_rent_date": "2025-08-02T13:28:53.211Z",
                  "cashier_check_amount": 0,
                  "rf": 0,
                  "rfNo": 0,
                  "refund_farmers_docu": "string",
                  "refund_amount": 0,
                  "debt_deduc_amount": 0,
                  "transfer_req_docu": "string",
                  "transfer_no": "string",
                  "transfer_date": "2025-08-02T13:28:53.211Z",
                  "payment_no": "string",
                  "refund_date": "2025-08-02T13:28:53.211Z",
                  "amount": 0,
                  "interest": 0,
                  "total_amount": 0
                }
              ];
              setData(mockData);
            // ถ้ามีข้อมูลจาก API ให้ใส่ใน formData สำหรับแก้ไข
            // if (result.data && result.data.length > 0) {
            //     const formsFromAPI = result.data.map((item, index) => ({
            //         ...item,
            //         id: item.id_AssetRentalLog || Date.now() + index
            //     }));
            //     setFormData(formsFromAPI);
            // }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenReceiveRentDetail = (item) => {
        // เปิดฟอร์มแก้ไขสำหรับ item นี้
        setFormData(item);
        setShowForm(true);
        setAddForm(false);
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
            setFormData({});
            setShowForm(false);
        }
        setModal(value);
    };

    return (
        <Modal
            isOpen={isOpen}
            title="รับเงินค่าเช่า"
            closeText="ปิด"
            okText="ตกลง"
            onOk={onOk}
            size='lg'
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
                                    disabled={addForm}
                                >
                                    <span className="fas fa-plus fs-8"></span> เพิ่มรับเงินค่าเช่า
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                        <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0', border: '#cdd0c7' }}>
                            <tr>
                                <th rowSpan="2">#</th>
                                <th rowSpan="2">รายละเอียด</th>
                                <th colSpan="3">รับเงินค่าเช่า</th>
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
                    {showForm && (
                        <div  className="mb-1 rounded p-3 position-relative">
                            <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                <div className="card-body p-0">
                                    <div className="p-3 code-to-copy">
                                    <div className="d-flex justify-content-center mb-3">
                                        <span className="text-center fw-bold">รับเงินค่าเช่าครั้งที่ {formData.rtNo + 1}</span>
                                    </div>
                                        
                                        <div className="d-flex justify-content-center mt-1">
                                            <span className="text-center fw-bold">เอกสารประกอบการโอนเงิน</span>
                                        </div>
                                        <br />
                                        
                                        <div className="col-12 mt-1 mb-3">
                                            <DropZone 
                                                onChange={(f) => onFileChange('payment_docu', f)} 
                                                clearFile={clearFile.payment_docu} 
                                                accept={'*'} 
                                            />
                                        </div>
                                        <br />

                                        <div className="row g-2 mb-1">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox 
                                                    title={'เลขที่หนังสือ'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('rent_no', val)}  
                                                    value={formData?.rent_no || ''} 
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker 
                                                    title={'วันที่หนังสือ'}
                                                    value={formData.rent_date} 
                                                    handleChange={(val) => handleChange('rent_date', val)}  
                                                /> 
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox 
                                                    title={'เลขที่ใบสำคัญรับ'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('pay_docuno', val)}  
                                                    value={formData?.pay_docuno || ''} 
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker 
                                                    title={'วันที่ได้รับเงิน'} 
                                                    value={formData.pay_date} 
                                                    handleChange={(val) => handleChange('pay_date', val)}  
                                                /> 
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox 
                                                    title={'เลขที่เช็ค'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('cheques_no', val)}  
                                                    value={formData?.cheques_no || ''} 
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker 
                                                    title={'วันที่เช็ค'} 
                                                    value={formData.cheques_date} 
                                                    handleChange={(val) => handleChange('cheques_date', val)}  
                                                /> 
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox 
                                                    title={'เลขที่แคชเชียร์เช็ค'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('cashier_check_no', val)}  
                                                    value={formData?.cashier_check_no || ''} 
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker 
                                                    title={'วันที่แคชเชียร์เช็ค'} 
                                                    value={formData.cashier_check_date} 
                                                    handleChange={(val) => handleChange('cashier_check_date', val)}  
                                                /> 
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <DatePicker 
                                                    title={'วันที่การโอน'} 
                                                    value={formData.transfer_rent_date} 
                                                    handleChange={(val) => handleChange('transfer_rent_date', val)}  
                                                /> 
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox 
                                                    title={'จำนวนเงิน'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('cashier_check_amount', val)}  
                                                    value={formData?.cashier_check_amount || 0} 
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
                                        name='rf' 
                                        onChange={(e) => handleChange( 'rf', e.target.checked ? 1 : 0)} 
                                        checked={formData?.rf == 1} 
                                    />
                                </div>
                            </div>
                            {formData?.rf == 1 && ( 
                            <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                <div className="card-body p-0">
                                    <div className="p-3 code-to-copy">
                                        <div className="d-flex justify-content-center mb-1">
                                            <span className="text-center fw-bold">คืนเงิน/หักหนี้ ครั้งที่ {formData.rfNo + 1}</span>
                                        </div>
                                        <div className="d-flex justify-content-center mt-1">
                                            <span className="text-center fw-bold">เอกสารเกษตรกรรับแจ้งรับเงินคืนหรือหักหนี้</span>
                                        </div>
                                        <br />
                                        
                                        <div className="col-12 mt-1 mb-3">
                                            <DropZone 
                                                onChange={(f) => onFileChange('refund_farmers_docu', f)} 
                                                clearFile={clearFile.refund_farmers_docu} 
                                                accept={'*'} 
                                            />
                                        </div>
                                        <br />

                                        <div className="row g-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox 
                                                    title={'คืนเงินจำนวน'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('refund_amount', val)}  
                                                    value={formData?.refund_amount} 
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox 
                                                    title={'หักหนี้จำนวน'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('debt_deduc_amount', val)}  
                                                    value={formData?.debt_deduc_amount} 
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center">
                                            <span className="text-center fw-bold">ทำเรื่องให้บัญชีโอนเงิน</span>
                                        </div>
                                        <br />
                                        
                                        <div className="col-12 mt-1 mb-3">
                                            <DropZone 
                                                onChange={(f) => onFileChange('transfer_req_docu', f)} 
                                                clearFile={clearFile.transfer_req_docu} 
                                                accept={'*'} 
                                            />
                                        </div>
                                        <br />

                                        <div className="row g-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox 
                                                    title={'เลขที่หนังสือ'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('transfer_no', val)}  
                                                    value={formData?.transfer_no || ''} 
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker 
                                                    title={'วันที่หนังสือ'} 
                                                    value={formData.transfer_date} 
                                                    handleChange={(val) => handleChange('transfer_date', val)}  
                                                /> 
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox 
                                                    title={'เลขที่ใบสำคัญการจ่าย'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('payment_no', val)}  
                                                    value={formData?.payment_no || ''} 
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker 
                                                    title={'วันที่โอนเงิน'} 
                                                    value={formData.refund_date} 
                                                    handleChange={(val) => handleChange('refund_date', val)}  
                                                /> 
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <Textbox 
                                                    title={'จำนวนเงินค่าเช่า'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('amount', val)}  
                                                    value={formData?.amount} 
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <Textbox 
                                                    title={'ดอกเบี้ย'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('interest', val)}  
                                                    value={formData?.interest} 
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <Textbox 
                                                    title={'รวมจำนวนเงินทั้งสิ้น'} 
                                                    containerClassname={'mb-3'} 
                                                    handleChange={(val) => handleChange('total_amount', val)}  
                                                    value={formData?.total_amount} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                            <div className="d-flex justify-content-center mt-3">
                                <button className="btn btn-success me-2" type="button" onClick={() => save()}>
                                    บันทึก
                                </button>
                                {/* <button className="btn btn-secondary" type="button" onClick={handleCloseForm}>
                                    ยกเลิก
                                </button> */}
                            </div>
                            </div>
                    )}
                </div>
                
                
            </div>
        </Modal>
    );
};

export default editLandLeaseModal;