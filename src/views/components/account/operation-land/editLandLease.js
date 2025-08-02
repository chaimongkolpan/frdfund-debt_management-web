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
    saveAssetRental,
    updateAssetRental
} from "@services/api";
const editLandLeaseModal = (props) => {
    const { isOpen, setModal, onOk,policy,title,data: propData} = props;
    const [date, setDate] = useState(null);
    const [formData, setFormData] = useState(propData || {});
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
    const save = async () => {
        const dataToSave = {
          ...formData,
          id_KFKPolicy: policy?.id_KFKPolicy,
          policyNO: policy?.policyNO,
          id_AssetPolicy: policy?.id_AssetPolicy,
          id_AssetRental: policy?.id_AssetRental,
          indexAssetPolicy: policy?.indexAssetPolicy,
          rt:formData.rt || 0
        };
      
        console.log("Data before submit:", dataToSave);
      
        let result;
      
        if (propData) {
          result = await updateAssetRental(dataToSave); 
        } else {
          result = await saveAssetRental(dataToSave); 
        }
      
        if (result?.isSuccess) {
          setModal(false);
        }
      };
      
    const handleChange = async (key, val) => {
        setFormData((prevState) => ({
          ...prevState,
          [key]: val
        }));
      };

    const toggle = () => {
        if (onClose) {
          onClose(); 
        } else if (setModal) {
          setModal(!isOpen);
        }
      };
      useEffect(() => {
        setFormData({
          ...(propData || {}),
        }); 
      }, [propData]);
      useEffect(() => {
       console.log(propData);
      }, []);
    return (
        <Modal
            isOpen={isOpen}
            setModal={setModal}
            title={title}
            closeText="ปิด"
            okText="ตกลง"
            onOk={onOk}
            size='lg'
            hideFooter={true}
        >
            <div className="card my-2 border-0" data-component-card="data-component-card"  >          
                    <div className="p-3 code-to-copy">
                        
                        <div className="row g-2">
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="form-floating form-floating-advance-select mb-3">
                                    <label htmlFor="floaTingLabelSingleSelect">ประเภทหน่วยงาน</label>
                                    <select className={`form-select`} onChange={(e) => handleChange('asset_operations_type', e.target?.value)} value={formData.asset_operations_type} disabled={formData.rt == 1}>
                                        <option value="หน่วยงานภายนอก">หน่วยงานภายนอก</option>
                                        <option value="หน่วยงานรัฐ" >หน่วยงานรัฐ</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <Textbox title={'ชื่อหน่วยงาน'} containerClassname={'mb-3'} handleChange={(val) => handleChange('asset_operations_name', val)}  value={formData?.asset_operations_name}  disabled={formData.rt == 1}/>
                            </div>

                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className="text-center fw-bold">เอกสารคำร้อง</span>
                                </div>
                                <br />
                                <div className="col-12 mt-1 mb-3">
                                    <DropZone onChange={(f) => onFileChange('req_docu', f)} clearFile={clearFile['req_docu']} accept={'*'} disabled={formData.rt == 1}/>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className="text-center fw-bold">ใบอนุญาตจากเกษตร</span>
                                </div>
                                <br />
                                <div className="col-12 mt-1 mb-3">
                                    <DropZone onChange={(f) => onFileChange('license_ farmers_docu', f)} clearFile={clearFile['license_ farmers_docu']} accept={'*'} disabled={formData.rt == 1}/>
                                </div>                            
                            </div>

                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className='fw-bold'>บันทึกข้อความแจ้งยินยอม</span>
                                </div>
                                <br />
                                <div className="col-12 mt-3 mb-3">
                                    <DropZone onChange={(f) => onFileChange('consent_docu', f)} clearFile={clearFile['consent_docu']} accept={'*'} disabled={formData.rt == 1}/>
                                </div><br />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className='fw-bold'>เอกสารประกอบและสัญญาเช่า</span>
                                </div>
                                <br />
                                <div className="col-12 mt-3 mb-3">
                                    <DropZone onChange={(f) => onFileChange('rental _contract_docu', f)} clearFile={clearFile['rental _contract_docu']} accept={'*'} disabled={formData.rt == 1}/>
                                </div>
                                <br />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className='fw-bold'>เอกสารเกษตรรับทราบ</span>
                                </div>
                                <br />
                                <div className="col-12 mt-3 mb-3">
                                    <DropZone onChange={(f) => onFileChange('ack_farmers_docu', f)} clearFile={clearFile['ack_farmers_docu']} accept={'*'} disabled={formData.rt == 1}/>
                                </div>
                                <br />
                            </div>
                        </div>

                        <div className="row g-2">

                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <DatePicker title={'วันที่ทำสัญญา'} 
                                 value={formData.contract_rental_date} 
                                 handleChange={(val) => handleChange('contract_rental_date', val)} disabled={formData.rt == 1} />
                            </div>

                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="form-floating form-floating-advance-select mb-3">
                                    <label htmlFor="floaTingLabelSingleSelect">หน่วยงานที่เช่า</label>
                                    <select className={`form-select`} onChange={(e) => handleChange('rental_agency', e.target?.value)} value={formData.rental_agency} disabled={formData.rt == 1}>
                                        <option value="หน่วยงานภายนอก">หน่วยงานภายนอก</option>
                                        <option value="หน่วยงานรัฐ" >หน่วยงานรัฐ</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <AreaTextbox title={'พื้นที่ประมาณให้เช่า'} containerClassname={'mb-3'}
                                handleChangeRai={(val) => handleChange('rental_area_rai', val)}
                                rai={formData?.rental_area_rai}
                  

                                handleChangeNgan={(val) => handleChange('rental_area_ngan', val)}
                                ngan={formData?.rental_area_ngan}
                   

                                handleChangeWa={(val) => handleChange('rental_area_sqaure_wa', val)}
                                wa={formData?.rental_area_sqaure_wa} 
                                disabled={formData.rt == 1}
                            />
                        </div>

                        <div className="row g-2">

                            <div className="col-sm-12 col-md-4 col-lg-4 mb-1">
                                <Textbox title={'ระยะเวลาการเช่า(ปี)'} containerClassname={'mb-3'} handleChange={(val) => handleChange('rental_years_period', val)}  value={formData?.rental_years_period}  disabled={formData.rt == 1} />
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 mb-1">
                                <DatePicker title={'ระยะเวลาเริ่มต้น'}  
                                value={formData.rental_start} 
                                handleChange={(val) => handleChange('rental_start', val)}  disabled={formData.rt == 1}/>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 mb-1">
                                <DatePicker title={'ระยะเวลาสิ้นสุด'} 
                                 value={formData.rental_end} 
                                 handleChange={(val) => handleChange('rental_end', val)} disabled={formData.rt == 1} />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <Textarea title={'หมายเหตุ'} containerClassname={'mb-4'}
                                handleChange={(val) => handleChange('rental_remark', val)}
                                value={formData?.rental_remark} 
                                disabled={formData.rt == 1}
                            />
                        </div>
                    </div>
                    <div className={`d-flex justify-content-center`}>
                  <button className="btn btn-success me-2" type="button" onClick={() => save()}>บันทึก</button>
                 
                </div>
                </div>
        </Modal>
    );
}
export default editLandLeaseModal;
