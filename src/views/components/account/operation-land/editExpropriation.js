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
    updateAssetRental,
    getProvinces,
    updateExpropriation,
} from "@services/api";
const editLandLeaseModal = (props) => {
    const { isOpen, setModal, onOk, policy, title, data: propData, showDetail = false } = props;
    const [date, setDate] = useState(null);
    const [installment, setInstallment] = useState(null);
    const collateralRef = useRef(null);
    const [year, setYear] = useState(null);
    const [plans, setPlan] = useState(null);
    const [clearFile, setClear] = useState(false);
    const [files, setFiles] = useState(null);
    const [provinces, setProvOp] = useState(null);
    const [isMounted, setMounted] = useState(false);
    const initialCollateralDetail = {
        id_KFKPolicy: '',
        policyNO: '',
        assetType: 'โฉนด',
        collateral_status: 'โอนได้',
        parceL_province: '',
        pre_emption_province: '',
        nS3_province: '',
        nS3A_province: '',
        nS3B_province: '',
        alrO_province: '',
        condO_province: '',
        labT5_province: '',
        house_province: '',
        otheR_province: '',
        changeCollateral: {
            assetType: 'โฉนด',
        },
        separateCollateral: [{
            assetType: 'โฉนด',
        }],
        req_docu: [],
        borrowdeed_docu: [],
        approve_docu: [],
        results_docu: [],
        report_docu: [],
    };
    const [formData, setFormData] = useState({
        ...initialCollateralDetail,
        ...propData,
        changeCollateral: {
            ...initialCollateralDetail.changeCollateral,
            ...(propData?.changeCollateral || {
                assetType : 'โฉนด'
            })
        },
        separateCollateral: propData?.separateCollateral || initialCollateralDetail.separateCollateral
    });
    const [collateralDetail, setCollateralDetail] = useState(initialCollateralDetail);

    const onFileChange = async (fieldName, files) => {
        if (files.length > 0) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: files[0]
            }));
        }
    };
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
    const save = async () => {

        const updatedFormData = {
            ...formData,
            flag1: typeof formData?.flag1 === 'boolean' ? (formData.flag1 ? 'Y' : 'N') : '',
            flag2: typeof formData?.flag2 === 'boolean' ? (formData.flag2 ? 'Y' : 'N') : '',
            flag3: typeof formData?.flag3 === 'boolean' ? (formData.flag3 ? 'Y' : 'N') : '',
            id_KFKPolicy: policy?.id_KFKPolicy,
            policyNO: policy?.policyNO,
            id_AssetPolicy: policy?.id_AssetPolicy,
            id_AssetRental: policy?.id_AssetRental,
            indexAssetPolicy: policy?.indexAssetPolicy,
        };
    
        console.log("test formdata", updatedFormData);
        const formDataToSend = new FormData();
        appendFormData(formDataToSend, updatedFormData);
        
        const result = await updateExpropriation(formDataToSend);
        if (result.isSuccess) {
            console.log("save expropriation done");
        }
    };

    function appendFormData(formData, data, parentKey = '') {
        if (data === null || data === undefined) return;
      
        if (data instanceof File) {
          formData.append(parentKey, data);
        } else if (Array.isArray(data)) {
          data.forEach((value, index) => {
            appendFormData(formData, value, `${parentKey}[${index}]`);
          });
        } else if (typeof data === 'object') {
          Object.entries(data).forEach(([key, value]) => {
            appendFormData(formData, value, parentKey ? `${parentKey}.${key}` : key);
          });
        } else {
          formData.append(parentKey, data);
        }
      }
      
    const convertToFormData = (data) => {
        const formData = new FormData();
      
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (item instanceof File) {
                formData.append(`${key}[${index}]`, item);
              } else {
                formData.append(`${key}[${index}]`, JSON.stringify(item));
              }
            });
          } else if (value instanceof File) {
            formData.append(key, value);
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });
      
        return formData;
      };
      
      
    const submitOperation = async () => {
      const data = operationLandRef.current?.getData(); 
      console.log('Operation data:', data);
    
      
    
     
    };
    
    const handleAddForm = () => {
        setFormData(prev => ({
            ...prev,
            separateCollateral: [
                ...(prev.separateCollateral || []),
                { id: Date.now(), assetType: 'โฉนด' }
            ]
        }));
    };
    const handleRemoveForm = (idToRemove) => {
        setFormData(prev => ({
            ...prev,
            separateCollateral: prev.separateCollateral.filter(({ id }) => id !== idToRemove)
        }));
    };
    const handleChangeAssetType = (id, newType) => {
        setFormData(prev => ({
            ...prev,
            separateCollateral: prev.separateCollateral.map(item =>
                item.id === id ? { ...item, assetType: newType } : item
            )
        }));
    };
    const handleChangeSeparateCollateral = (id, key, value) => {
        setFormData(prev => ({
            ...prev,
            separateCollateral: prev.separateCollateral.map(item =>
                item.id === id ? { ...item, [key]: value } : item
            )
        }));
    };
    const handleChangeChangeCollateral = (field, value) => {
        setFormData(prev => ({
            ...prev,
            changeCollateral: {
                ...prev.changeCollateral,
                [field]: value
            }
        }));
    };
    const handleChange = async (key, val) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: val
        }));
    };
    const wrappedSetModal = (value) => {
        if (!value) { // เมื่อปิด modal
            setFormData([]); // เคลียร์ข้อมูล
        }
        setModal(value);
    };
    const toggle = () => {
        if (onClose) {
            onClose();
        } else if (setModal) {
            setModal(!isOpen);
        }
    };

    useEffect(() => {
        console.log(propData);
    }, []);
    useEffect(() => {
        if (!isMounted) {
            getProvince();
        }
    }, [])
    const handleChangeCollateral = async (key, val) => {
        if (key == 'assetType') {
            await setCollateralType(val);
            await setFormData((prevState) => ({
                ...prevState,
                ...({ stock_status: (val == 'หุ้น' ? 'Y' : 'N') })
            }))
        }
        await setFormData((prevState) => ({
            ...prevState,
            ...({ [key]: val })
        }))
    }
    return (
        <Modal
            isOpen={isOpen}
            title={title}
            closeText="ปิด"
            okText="ตกลง"
            onOk={onOk}
            size='xl'
            hideFooter={true}
            setModal={wrappedSetModal}
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
                            <Textbox title={'ชื่อหน่วยงาน'} containerClassname={'mb-3'} handleChange={(val) => handleChange('asset_operations_name', val)} value={formData?.asset_operations_name} disabled={formData.rt == 1} />
                        </div>

                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                            <div className="d-flex justify-content-center">
                                <span className="text-center fw-bold">เอกสารคำร้อง</span>
                            </div>
                            <br />
                            <div className="col-12 mt-1 mb-3">
                                <DropZone onChange={(f) => onFileChange('req_docu', f)} clearFile={clearFile['req_docu']} accept={'*'} disabled={formData.rt == 1} />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                            <div className="d-flex justify-content-center">
                                <span className="text-center fw-bold">ใบอนุญาตจากเกษตร</span>
                            </div>
                            <br />
                            <div className="col-12 mt-1 mb-3">
                                <DropZone onChange={(f) => onFileChange('license_ farmers_docu', f)} clearFile={clearFile['license_ farmers_docu']} accept={'*'} disabled={formData.rt == 1} />
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                            <div className="d-flex justify-content-center">
                                <span className='fw-bold'>บันทึกข้อความแจ้งยินยอม</span>
                            </div>
                            <br />
                            <div className="col-12 mt-3 mb-3">
                                <DropZone onChange={(f) => onFileChange('consent_docu', f)} clearFile={clearFile['consent_docu']} accept={'*'} disabled={formData.rt == 1} />
                            </div><br />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                            <div className="d-flex justify-content-center">
                                <span className='fw-bold'>เอกสารประกอบและสัญญาเช่า</span>
                            </div>
                            <br />
                            <div className="col-12 mt-3 mb-3">
                                <DropZone onChange={(f) => onFileChange('rental _contract_docu', f)} clearFile={clearFile['rental _contract_docu']} accept={'*'} disabled={formData.rt == 1} />
                            </div>
                            <br />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                            <div className="d-flex justify-content-center">
                                <span className='fw-bold'>เอกสารเกษตรรับทราบ</span>
                            </div>
                            <br />
                            <div className="col-12 mt-3 mb-3">
                                <DropZone onChange={(f) => onFileChange('ack_farmers_docu', f)} clearFile={clearFile['ack_farmers_docu']} accept={'*'} disabled={formData.rt == 1} />
                            </div>
                            <br />
                        </div>
                    </div>
                    <div className='form-switch mb-2 d-flex justify-content-center'>
                        <div className='d-flex flex-row-reverse align-items-center gap-2'>
                            <p className='fw-bold mb-0'>ใช้โฉนด</p>
                            <Input type='switch' id='flag1' name='flag1' onChange={(e) => handleChangeCollateral('flag1', e.target.checked)} checked={formData?.flag1} />
                        </div>
                    </div>
                    <br />
                    {formData?.flag1 && (<>
                        <div className="card shadow-none border my-2" data-component-card="data-component-card">
                            <div className="card-body p-0">
                                <div className="p-3 code-to-copy">
                                    <div className="row g-2">
                                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                            <div className="d-flex justify-content-center">
                                                <span className="fw-bold">เอกสารคำร้องขอยืมโฉนด</span><br />
                                            </div>
                                            <div className="col-12 mt-3 mb-3">
                                                <DropZone onChange={(f) => onFileChange('borrowdeed_docu', f)} clearFile={clearFile['borrowdeed_docu']} accept={'*'} />
                                            </div>
                                            <br />
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                            <div className="d-flex justify-content-center">
                                                <span className="fw-bold">เอกสารบันทึกข้อความที่เลขาอนุมัติ</span><br />
                                            </div>
                                            <div className="col-12  mt-3 mb-3">
                                                <DropZone onChange={(f) => onFileChange('approve_docu', f)} clearFile={clearFile['approve_docu']} accept={'*'} />
                                            </div>
                                            <br />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="d-flex justify-content-center">
                                        <span className="fw-bold ">ยืมโฉนด</span>
                                    </div>
                                    <div className="row g-2 mt-1">
                                        <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                            <Textbox title={'เลขที่หนังสือยืมโฉนด'} containerClassname={'mb-3'} handleChange={(val) => handleChangeCollateral('borrowdeed_no', val)} value={formData?.borrowdeed_no} disabled={showDetail} />
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                            <DatePicker title={'วันที่หนังสือยืมโฉนด'}
                                                value={formData.borrowdeed_date}
                                                handleChange={(val) => handleChangeCollateral('borrowdeed_date', val)}
                                                disabled={showDetail} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mb-4">
                                        <Textarea title={'เหตุผล'} containerClassname={'mb-3'} handleChange={(val) => handleChangeCollateral('borrowdeed_reason', val)} value={formData?.borrowdeed_reason} disabled={showDetail} />
                                    </div>
                                </div>
                            </div>
                        </div></>)}

                    <div className="row g-2">
                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                            <div className="d-flex justify-content-center">
                                <span className='fw-bold'>แบบรับทราบผลการดำเนินการ</span>
                            </div>
                            <br />
                            <div className="col-12 mt-3 mb-3">
                                <DropZone onChange={(f) => onFileChange('results_docu', f)} clearFile={clearFile['results_docu']} accept={'*'} />
                            </div>
                            <br />

                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                            <div className="d-flex justify-content-center">
                                <span className='fw-bold'>บันทึกข้อความรายงานผลการดำเนินการ</span>
                            </div>
                            <br />
                            <div className="col-12 mt-3 mb-3">
                                <DropZone onChange={(f) => onFileChange('report_docu', f)} clearFile={clearFile['report_docu']} accept={'*'} />
                            </div>
                            <br />
                        </div>
                    </div>

                    {formData?.flag1 && (
                        <div className='form-switch mb-2 d-flex justify-content-center'>
                            <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                <p className='fw-bold mb-0'>เปลี่ยนแปลงหลักทรัพย์</p>
                                <Input type='switch' id='flag2' name='flag2' onChange={(e) => handleChangeCollateral('flag2', e.target.checked)} checked={formData?.flag2} />
                            </div>
                        </div>)}
                    {(formData?.flag2 || formData?.change_asset === 1) && (
                        <div className="card shadow-none border my-2" data-component-card="data-component-card">
                            <div className="card-body p-0">
                                <div className="p-3 code-to-copy">
                                    <div ref={collateralRef} className="row g-3">
                                        <div className="col-sm-12 col-md-6 col-lg-4">
                                            <div className="form-floating needs-validation">
                                                <select className="form-select" value={formData.changeCollateral?.assetType} onChange={(e) => handleChangeChangeCollateral('assetType', e.target.value)}>
                                                    <option value="">-- เลือกประเภทหลักทรัพย์ --</option>
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
                                                <label htmlFor="floatingSelectTeam">หลักทรัพย์</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-4">
                                            <div className="form-floating needs-validation">
                                                <select className="form-select" value={formData.changeCollateral?.collateral_status} onChange={(e) => handleChangeChangeCollateral('collateral_status', e.target.value)}>
                                                    <option value="โอนได้">โอนได้</option>
                                                    <option value="โอนไม่ได้">โอนไม่ได้</option>
                                                </select>
                                                <label htmlFor="floatingSelectTeam">สถานะหลักทรัพย์</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-4">
                                            <div className="form-floating needs-validation">
                                                <select className="form-select" value={formData.changeCollateral?.conditions_cannot_transferred} onChange={(e) => handleChangeChangeCollateral('conditions_cannot_transferred', e.target?.value)} >
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

                                                    {formData.changeCollateral?.assetType === 'โฉนด' && (
                                                        <div className="mt-3">
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('parceL_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.parceL_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เล่ม'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('parceL_volume', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.parceL_volume}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'หน้า'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('parceL_page', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.parceL_page}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <div className="form-floating form-floating-advance-select ">
                                                                                                <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                <select className="form-select" value={formData.changeCollateral?.parceL_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral('parceL_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('parceL_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.parceL_district}
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
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('parceL_map_sheet', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.parceL_map_sheet}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เลขที่ดิน'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('parceL_parcel_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.parceL_parcel_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'หน้าสำรวจ'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('parceL_explore_page', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.parceL_explore_page}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ตำบล'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('parceL_sub_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.parceL_sub_district}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* end card รายละเอียดโฉนดที่ดิน */} </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'ตราจอง' && (
                                                        <div className="mt-3">
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
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('pre_emption_volume_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.pre_emption_volume_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เล่ม'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('pre_emption_volume', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.pre_emption_volume}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'หน้า'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('pre_emption_page', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.pre_emption_page}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'ระวาง'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('pre_emption_map_sheet', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.pre_emption_map_sheet}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เลขที่ดิน'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('pre_emption_parcel_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.pre_emption_parcel_no}
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
                                                                                                <select className="form-select" value={formData.changeCollateral?.pre_emption_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral('pre_emption_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('pre_emption_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.pre_emption_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ตำบล'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('pre_emption_sub_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.pre_emption_sub_district}
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
                                                        </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'น.ส.3' && (
                                                        <div className="mt-3">
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
                                                                                                <select className="form-select" value={formData.changeCollateral?.nS3_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('nS3_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ตำบล'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('nS3_sub_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3_sub_district}
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
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('nS3_emption_volume', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3_emption_volume}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'หน้า'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('nS3_emption_page', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3_emption_page}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'สารบบเล่ม/เลขที่'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('nS3_dealing_file_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3_dealing_file_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'สารบบหน้า'}
                                                                                                handleChange={(val) => handleChangeSeparateCollateral('nS3_dealing_page_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3_dealing_page_no}
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

                                                        </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'น.ส.3 ก' && (
                                                        <div className="mt-3">
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
                                                                                                <select className="form-select" value={formData.changeCollateral?.nS3A_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'nS3A_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3A_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3A_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ตำบล'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3A_sub_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3A_sub_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ระวางรูปถ่ายทางออกชื่อ'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3A_map_sheet', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3A_map_sheet}
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3A_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3A_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เล่มที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3A_volume_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3A_volume_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'หน้า'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3A_page', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3A_page}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'เลขที่ดิน'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3A_parcel_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3A_parcel_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'หมายเลข'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3A_number', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3A_number}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'แผ่นที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3A_sheet_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3A_sheet_no}
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
                                                        </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'น.ส.3 ข' && (
                                                        <div className="mt-3">
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
                                                                                                <select className="form-select" value={formData.changeCollateral?.nS3B_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('nS3B_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3B_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3B_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'ตำบล'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3B_sub_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3B_sub_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'หมู่ที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3B_village', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3B_village}
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3B_volume', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3B_volume}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'หน้า'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3B_page', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3B_page}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'เลขที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('nS3B_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.nS3B_no}
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
                                                        </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'ส.ป.ก.' && (
                                                        <div className="mt-3">
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
                                                                                                <select className="form-select" value={formData.changeCollateral?.alrO_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('alrO_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('alrO_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.alrO_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ตำบล'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('alrO_sub_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.alrO_sub_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'หมู่ที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('alrO_village', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.alrO_village}
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('alrO_plot_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.alrO_plot_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ระวาง ส.ป.ก. ที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('alrO_map_sheet', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.alrO_map_sheet}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'เลขที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('alrO_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.alrO_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เล่ม'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('alrO_volume', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.alrO_volume}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'หน้า'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('alrO_page', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.alrO_page}
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
                                                        </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'หนังสือแสดงกรรมสิทธิ์ห้องชุด' && (
                                                        <div className="mt-3">
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('condO_parcel_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.condO_parcel_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <div className="form-floating form-floating-advance-select mb-3">
                                                                                                <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                <select className="form-select" value={formData.changeCollateral?.condO_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('condO_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('condO_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.condO_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ตำบล'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('condO_sub_district', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.condO_sub_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <AreaTextbox title={'เนื้อที่'} containerClassname={'mb-3'}
                                                                                                handleChangeRai={(val) => handleChangeChangeCollateral('condO_rai', val)}
                                                                                                rai={formData.changeCollateral?.condO_rai}
                                                                                                handleChangeNgan={(val) => handleChangeChangeCollateral('condO_ngan', val)}
                                                                                                ngan={formData.changeCollateral?.condO_ngan}
                                                                                                handleChangeWa={(val) => handleChangeChangeCollateral('condO_sqaure_wa', val)}
                                                                                                wa={formData.changeCollateral?.condO_sqaure_wa}
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('condO_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.condO_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ชั้นที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('condO_floor', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.condO_floor}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'อาคารเลขที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('condO_building_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.condO_building_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ชื่ออาคารชุด'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('condO_building_name', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.condO_building_name}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ทะเบียนอาคารชุดเลขที่'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('condO_registration_no', val)}
                                                                                                containerClassname={'mb-3'} value={formData.changeCollateral?.condO_registration_no}
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('promisor', val)}
                                                                                                value={formData.changeCollateral?.promisor}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('contract_recipient', val)}
                                                                                                value={formData.changeCollateral?.contract_recipient}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เนื้อที่ประมาณ'} footer={'ตารางเมตร'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('area_square_meter', val)}
                                                                                                value={formData.changeCollateral?.area_square_meter}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'สูง'} footer={'เมตร'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('high_meter', val)}
                                                                                                value={formData.changeCollateral?.high_meter}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <div className="form-floating form-floating-advance-select ">
                                                                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                                <select className="form-select" value={formData.changeCollateral?.source_of_wealth} onChange={(e) => handleChangeChangeCollateral('source_of_wealth', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('source_of_wealth_other', val)}
                                                                                                value={formData.changeCollateral?.source_of_wealth_other}
                                                                                                disabled={formData.changeCollateral?.source_of_wealth != 'อื่นๆ' || isView}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('remark', val)}
                                                                                                value={formData.changeCollateral?.remark}
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
                                                        </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'ภ.ท.บ.5' && (
                                                        <div className="mt-3">
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('labT5_parcel_no', val)}
                                                                                                value={formData.changeCollateral?.labT5_parcel_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <div className="form-floating form-floating-advance-select mb-3">
                                                                                                <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                <select className="form-select" value={formData.changeCollateral?.labT5_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('labT5_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('labT5_district', val)}
                                                                                                value={formData.changeCollateral?.labT5_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('labT5_sub_district', val)}
                                                                                                value={formData.changeCollateral?.labT5_sub_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'หมู่ที่'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('labT5_village', val)}
                                                                                                value={formData.changeCollateral?.labT5_village}
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
                                                                                        handleChangeRai={(val) => handleChangeChangeCollateral('total_area_rai', val)}
                                                                                        rai={formData.changeCollateral?.total_area_rai}
                                                                                        handleChangeNgan={(val) => handleChangeChangeCollateral('total_area_ngan', val)}
                                                                                        ngan={formData.changeCollateral?.total_area_ngan}
                                                                                        handleChangeWa={(val) => handleChangeChangeCollateral('total_area_sqaure_wa', val)}
                                                                                        wa={formData.changeCollateral?.total_area_sqaure_wa}
                                                                                    />
                                                                                </div>
                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                    <div className="form-floating form-floating-advance-select ">
                                                                                        <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                        <select className="form-select" value={formData.changeCollateral?.source_of_wealth} onChange={(e) => handleChangeChangeCollateral('source_of_wealth', e.target?.value)}>
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
                                                                                        handleChange={(val) => handleChangeChangeCollateral('source_of_wealth_other', val)}
                                                                                        value={formData.changeCollateral?.source_of_wealth_other}
                                                                                        disabled={formData.changeCollateral?.source_of_wealth != 'อื่นๆ' || isView}
                                                                                    />
                                                                                </div>
                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                    <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                        handleChange={(val) => handleChangeChangeCollateral('remark', val)}
                                                                                        value={formData.changeCollateral?.remark}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* end card รายละเอียดสารบัญจดทะเบียน */}
                                                        </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'บ้าน' && (
                                                        <div className="mt-3">
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('house_no', val)}
                                                                                                value={formData.changeCollateral?.house_no}
                                                                                            />
                                                                                            <div className="input-group mb-3">
                                                                                                <span className="input-group-text" id="Search_id_card">สิ่งปลูกสร้างเลขที่</span>
                                                                                                <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <div className="form-floating form-floating-advance-select mb-3">
                                                                                                <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                <select className="form-select" value={formData.changeCollateral?.house_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('house_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('house_district', val)}
                                                                                                value={formData.changeCollateral?.house_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('house_sub_district', val)}
                                                                                                value={formData.changeCollateral?.house_sub_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'ตั้งอยู่บนที่ดินเลขที่'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('house_parcel_no', val)}
                                                                                                value={formData.changeCollateral?.house_parcel_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textbox title={'ลักษณะสิ่งปลูกสร้าง'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('house_type', val)}
                                                                                                value={formData.changeCollateral?.house_type}
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
                                                        </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'สังหาริมทรัพย์' && (
                                                        <div className="mt-3">
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('chattel_registration_date', val)}
                                                                                                value={formData.changeCollateral?.chattel_registration_date}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'ยี่ห้อ'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('chattel_brand', val)}
                                                                                                value={formData.changeCollateral?.chattel_brand}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'ประเภท'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('chattel_type', val)}
                                                                                                value={formData.changeCollateral?.chattel_type}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เลขทะเบียน'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('chattel_registration_no', val)}
                                                                                                value={formData.changeCollateral?.chattel_registration_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'ลักษณะ'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('chattel_style', val)}
                                                                                                value={formData.changeCollateral?.chattel_style}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เลขตัวรถ'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('chattel_vehicle_no', val)}
                                                                                                value={formData.changeCollateral?.chattel_vehicle_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'เลขเครื่องยนต์'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('chattel_engine_no', val)}
                                                                                                value={formData.changeCollateral?.chattel_engine_no}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'สี'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('chattel_color', val)}
                                                                                                value={formData.changeCollateral?.chattel_color}
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('name_legal_owner', val)}
                                                                                                value={formData.changeCollateral?.name_legal_owner}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textarea title={'ชื่อผู้ครอบครอง'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('name_occupier', val)}
                                                                                                value={formData.changeCollateral?.name_occupier}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                            <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('remark', val)}
                                                                                                value={formData.changeCollateral?.remark}
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
                                                        </div>
                                                    )}

                                                    {formData.changeCollateral?.assetType === 'อื่นๆ' && (
                                                        <div className="mt-3">
                                                            {/* start card รายละเอียด อื่นๆ */}
                                                            <h3 className="text-center">อื่นๆ</h3>
                                                            <div className="col-sm-12 col-md-12 col-lg-12 g-3">
                                                                <Textbox title={'หลักประกันอื่นๆโปรดระบุ'} containerClassname={'mb-3'}
                                                                    handleChange={(val) => handleChangeChangeCollateral('assetType_other', val)}
                                                                    value={formData.changeCollateral?.assetType_other}
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('otheR_volume', val)}
                                                                                                value={formData.changeCollateral?.otheR_volume}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'หน้า'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('otheR_page', val)}
                                                                                                value={formData.changeCollateral?.otheR_page}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <div className="form-floating form-floating-advance-select mb-3">
                                                                                                <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                <select className="form-select" value={formData.changeCollateral?.otheR_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('otheR_province', e.target?.value)}>
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
                                                                                                handleChange={(val) => handleChangeChangeCollateral('otheR_district', val)}
                                                                                                value={formData.changeCollateral?.otheR_district}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                            <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                handleChange={(val) => handleChangeChangeCollateral('otheR_sub_district', val)}
                                                                                                value={formData.changeCollateral?.otheR_sub_district}
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
                                                                                        handleChange={(val) => handleChangeChangeCollateral('promisor', val)}
                                                                                        value={formData.changeCollateral?.promisor}
                                                                                    />
                                                                                </div>
                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                    <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                        handleChange={(val) => handleChangeChangeCollateral('contract_recipient', val)}
                                                                                        value={formData.changeCollateral?.contract_recipient}
                                                                                    />
                                                                                </div>
                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                    <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                                                        handleChangeRai={(val) => handleChangeChangeCollateral('contract_area_rai', val)}
                                                                                        rai={formData.changeCollateral?.contract_area_rai}
                                                                                        handleChangeNgan={(val) => handleChangeChangeCollateral('contract_area_ngan', val)}
                                                                                        ngan={formData.changeCollateral?.contract_area_ngan}
                                                                                        handleChangeWa={(val) => handleChangeChangeCollateral('contract_area_sqaure_wa', val)}
                                                                                        wa={formData.changeCollateral?.contract_area_sqaure_wa}
                                                                                    />
                                                                                </div>
                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                    <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                                                        handleChangeRai={(val) => handleChangeChangeCollateral('area_transfer_rai', val)}
                                                                                        rai={formData.changeCollateral?.area_transfer_rai}
                                                                                        handleChangeNgan={(val) => handleChangeChangeCollateral('area_transfer_ngan', val)}
                                                                                        ngan={formData.changeCollateral?.area_transfer_ngan}
                                                                                        handleChangeWa={(val) => handleChangeChangeCollateral('area_transfer_sqaure_wa', val)}
                                                                                        wa={formData.changeCollateral?.area_transfer_sqaure_wa}
                                                                                    />
                                                                                </div>
                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                    <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                        handleChange={(val) => handleChangeChangeCollateral('remark', val)}
                                                                                        value={formData.changeCollateral?.remark}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* end card รายละเอียดสารบัญจดทะเบียน */}
                                                        </div>
                                                    )}
                                                    <div className='form-switch mb-2 d-flex justify-content-center'>
                                                        <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                                            <p className='fw-bold mb-0'>แบ่งหลักทรัพย์</p>
                                                            <Input type='switch' id='flag3' name='flag3' onChange={(e) => handleChangeCollateral('flag3', e.target.checked)} checked={formData?.flag3} />
                                                        </div>
                                                    </div>
                                                    {(formData?.flag3 || formData?.separate_asset === 1) && !showDetail && (<>
                                                        <div className="d-flex justify-content-center">
                                                            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={handleAddForm}>
                                                                <i className="fas fa-square-plus"></i>
                                                            </button>
                                                        </div>

                                                        {formData.separateCollateral?.map((form, index) => (
                                                            <div key={form.id} className="mb-1 rounded p-3 position-relative">
                                                                {/* ปุ่มบวก-ลบ */}
                                                                {!showDetail && (
                                                                    <div className="d-flex gap-2 mt-2 mb-3 justify-content-center">
                                                                        {index !== 0 && (
                                                                            <>
                                                                                <div className="d-flex justify-content-center">
                                                                                    <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => handleAddForm(index + 1)}>
                                                                                        <i className="fas fa-square-plus"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-phoenix-secondary btn-icon fs-7 text-danger-dark px-0" type='button' onClick={() => handleRemoveForm(form.id)}>
                                                                                        <i className="fas fa-square-minus"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>)}
                                                                {/* Dropdown ประเภทหลักทรัพย์ */}
                                                                <div className="w-100 d-flex justify-content-center mb-3 ">
                                                                    <div className="form-floating needs-validation col-sm-12 col-md-4 col-lg-4" >
                                                                        <select
                                                                            className="form-select"
                                                                            value={form.assetType}
                                                                            onChange={(e) => handleChangeAssetType(form.id, e.target.value)}
                                                                        >
                                                                            <option value="">-- เลือกประเภทหลักทรัพย์ --</option>
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
                                                                        <label htmlFor="floatingSelectTeam">หลักทรัพย์</label>
                                                                    </div>
                                                                </div>


                                                                {/* Render ฟอร์มเฉพาะตาม assetType */}
                                                                {form.assetType === 'โฉนด' && (
                                                                    <div className="mt-3">
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.parceL_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เล่ม'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.parceL_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_page', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.parceL_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select ">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" value={form?.parceL_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'parceL_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.parceL_district}
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_map_sheet', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.parceL_map_sheet}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขที่ดิน'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_parcel_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.parceL_parcel_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'หน้าสำรวจ'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_explore_page', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.parceL_explore_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.parceL_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* end card รายละเอียดโฉนดที่ดิน */} </div>
                                                                )}

                                                                {form.assetType === 'ตราจอง' && (
                                                                    <div className="mt-3">
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_volume_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.pre_emption_volume_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เล่ม'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.pre_emption_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_page', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.pre_emption_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ระวาง'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_map_sheet', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.pre_emption_map_sheet}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขที่ดิน'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_parcel_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.pre_emption_parcel_no}
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
                                                                                                            <select className="form-select" value={form?.pre_emption_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'pre_emption_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.pre_emption_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.pre_emption_sub_district}
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
                                                                    </div>
                                                                )}

                                                                {form.assetType === 'น.ส.3' && (
                                                                    <div className="mt-3">
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
                                                                                                            <select className="form-select" value={form?.nS3_province ?? provinces[0]} onChange={(e) => handleChangeCollateral(form.id, 'nS3_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3_sub_district}
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_emption_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3_emption_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'หน้า'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_emption_page', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3_emption_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'สารบบเล่ม/เลขที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_dealing_file_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3_dealing_file_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'สารบบหน้า'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_dealing_page_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3_dealing_page_no}
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

                                                                    </div>
                                                                )}

                                                                {form.assetType === 'น.ส.3 ก' && (
                                                                    <div className="mt-3">
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
                                                                                                            <select className="form-select" value={form?.nS3A_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'nS3A_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3A_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3A_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ระวางรูปถ่ายทางออกชื่อ'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_map_sheet', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3A_map_sheet}
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3A_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เล่มที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_volume_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3A_volume_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_page', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3A_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'เลขที่ดิน'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_parcel_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3A_parcel_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หมายเลข'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_number', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3A_number}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'แผ่นที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_sheet_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3A_sheet_no}
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
                                                                    </div>
                                                                )}

                                                                {form.assetType === 'น.ส.3 ข' && (
                                                                    <div className="mt-3">
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
                                                                                                            <select className="form-select" value={form?.nS3B_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'nS3B_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3B_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตำบล'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3B_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หมู่ที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_village', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3B_village}
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3B_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'หน้า'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_page', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3B_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'เลขที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.nS3B_no}
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
                                                                    </div>
                                                                )}

                                                                {form.assetType === 'ส.ป.ก.' && (
                                                                    <div className="mt-3">
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
                                                                                                            <select className="form-select" value={form?.alrO_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'alrO_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.alrO_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.alrO_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'หมู่ที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_village', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.alrO_village}
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_plot_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.alrO_plot_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ระวาง ส.ป.ก. ที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_map_sheet', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.alrO_map_sheet}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'เลขที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.alrO_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เล่ม'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.alrO_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_page', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.alrO_page}
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
                                                                    </div>
                                                                )}

                                                                {form.assetType === 'หนังสือแสดงกรรมสิทธิ์ห้องชุด' && (
                                                                    <div className="mt-3">
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_parcel_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.condO_parcel_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <div className="form-floating form-floating-advance-select mb-3">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" value={form?.condO_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'condO_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.condO_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.condO_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <AreaTextbox title={'เนื้อที่'} containerClassname={'mb-3'}
                                                                                                            handleChangeRai={(val) => handleChangeSeparateCollateral(form.id, 'condO_rai', val)}
                                                                                                            rai={form?.condO_rai}
                                                                                                            handleChangeNgan={(val) => handleChangeSeparateCollateral(form.id, 'condO_ngan', val)}
                                                                                                            ngan={form?.condO_ngan}
                                                                                                            handleChangeWa={(val) => handleChangeSeparateCollateral(form.id, 'condO_sqaure_wa', val)}
                                                                                                            wa={form?.condO_sqaure_wa}
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.condO_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ชั้นที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_floor', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.condO_floor}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'อาคารเลขที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_building_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.condO_building_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ชื่ออาคารชุด'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_building_name', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.condO_building_name}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ทะเบียนอาคารชุดเลขที่'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_registration_no', val)}
                                                                                                            containerClassname={'mb-3'} value={form?.condO_registration_no}
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'promisor', val)}
                                                                                                            value={form?.promisor}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'contract_recipient', val)}
                                                                                                            value={form?.contract_recipient}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เนื้อที่ประมาณ'} footer={'ตารางเมตร'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'area_square_meter', val)}
                                                                                                            value={form?.area_square_meter}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'สูง'} footer={'เมตร'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'high_meter', val)}
                                                                                                            value={form?.high_meter}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select ">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                                            <select className="form-select" value={form?.source_of_wealth} onChange={(e) => handleChangeSeparateCollateral(form.id, 'source_of_wealth', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'source_of_wealth_other', val)}
                                                                                                            value={form?.source_of_wealth_other}
                                                                                                            disabled={form?.source_of_wealth != 'อื่นๆ' || isView}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'remark', val)}
                                                                                                            value={form?.remark}
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
                                                                    </div>
                                                                )}

                                                                {form.assetType === 'ภ.ท.บ.5' && (
                                                                    <div className="mt-3">
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'labT5_parcel_no', val)}
                                                                                                            value={form?.labT5_parcel_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select mb-3">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" value={form?.labT5_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'labT5_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'labT5_district', val)}
                                                                                                            value={form?.labT5_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'labT5_sub_district', val)}
                                                                                                            value={form?.labT5_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หมู่ที่'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'labT5_village', val)}
                                                                                                            value={form?.labT5_village}
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
                                                                                                    handleChangeRai={(val) => handleChangeSeparateCollateral(form.id, 'total_area_rai', val)}
                                                                                                    rai={form?.total_area_rai}
                                                                                                    handleChangeNgan={(val) => handleChangeSeparateCollateral(form.id, 'total_area_ngan', val)}
                                                                                                    ngan={form?.total_area_ngan}
                                                                                                    handleChangeWa={(val) => handleChangeSeparateCollateral(form.id, 'total_area_sqaure_wa', val)}
                                                                                                    wa={form?.total_area_sqaure_wa}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                <div className="form-floating form-floating-advance-select ">
                                                                                                    <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                                    <select className="form-select" value={form?.source_of_wealth} onChange={(e) => handleChangeSeparateCollateral(form.id, 'source_of_wealth', e.target?.value)}>
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
                                                                                                    handleChange={(val) => handleChangeSeparateCollateral(form.id, 'source_of_wealth_other', val)}
                                                                                                    value={form?.source_of_wealth_other}
                                                                                                    disabled={form?.source_of_wealth != 'อื่นๆ' || isView}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                    handleChange={(val) => handleChangeSeparateCollateral(form.id, 'remark', val)}
                                                                                                    value={form?.remark}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* end card รายละเอียดสารบัญจดทะเบียน */}
                                                                    </div>
                                                                )}
                                                                {form.assetType === 'บ้าน' && (
                                                                    <div className="mt-3">
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'house_no', val)}
                                                                                                            value={form?.house_no}
                                                                                                        />
                                                                                                        <div className="input-group mb-3">
                                                                                                            <span className="input-group-text" id="Search_id_card">สิ่งปลูกสร้างเลขที่</span>
                                                                                                            <input className="form-control" type="text" aria-label="รายละเอียดน บ้าน" />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select mb-3">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" value={form?.house_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'house_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'house_district', val)}
                                                                                                            value={form?.house_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'house_sub_district', val)}
                                                                                                            value={form?.house_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตั้งอยู่บนที่ดินเลขที่'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'house_parcel_no', val)}
                                                                                                            value={form?.house_parcel_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ลักษณะสิ่งปลูกสร้าง'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'house_type', val)}
                                                                                                            value={form?.house_type}
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
                                                                    </div>
                                                                )}
                                                                {form.assetType === 'สังหาริมทรัพย์' && (
                                                                    <div className="mt-3">
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_registration_date', val)}
                                                                                                            value={form?.chattel_registration_date}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ยี่ห้อ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_brand', val)}
                                                                                                            value={form?.chattel_brand}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ประเภท'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_type', val)}
                                                                                                            value={form?.chattel_type}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขทะเบียน'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_registration_no', val)}
                                                                                                            value={form?.chattel_registration_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ลักษณะ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_style', val)}
                                                                                                            value={form?.chattel_style}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขตัวรถ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_vehicle_no', val)}
                                                                                                            value={form?.chattel_vehicle_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขเครื่องยนต์'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_engine_no', val)}
                                                                                                            value={form?.chattel_engine_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'สี'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_color', val)}
                                                                                                            value={form?.chattel_color}
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'name_legal_owner', val)}
                                                                                                            value={form?.name_legal_owner}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textarea title={'ชื่อผู้ครอบครอง'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'name_occupier', val)}
                                                                                                            value={form?.name_occupier}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'remark', val)}
                                                                                                            value={form?.remark}
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
                                                                    </div>
                                                                )}
                                                                {form.assetType === 'อื่นๆ' && (
                                                                    <div className="mt-3">
                                                                        {/* start card รายละเอียด อื่นๆ */}
                                                                        <h3 className="text-center">อื่นๆ</h3>
                                                                        <div className="col-sm-12 col-md-12 col-lg-12 g-3">
                                                                            <Textbox title={'หลักประกันอื่นๆโปรดระบุ'} containerClassname={'mb-3'}
                                                                                handleChange={(val) => handleChangeSeparateCollateral(form.id, 'assetType_other', val)}
                                                                                value={form?.assetType_other}
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'otheR_volume', val)}
                                                                                                            value={form?.otheR_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'otheR_page', val)}
                                                                                                            value={form?.otheR_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select mb-3">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" value={form?.otheR_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'otheR_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'otheR_district', val)}
                                                                                                            value={form?.otheR_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeSeparateCollateral(form.id, 'otheR_sub_district', val)}
                                                                                                            value={form?.otheR_sub_district}
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
                                                                                                    handleChange={(val) => handleChangeSeparateCollateral(form.id, 'promisor', val)}
                                                                                                    value={form?.promisor}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                                    handleChange={(val) => handleChangeSeparateCollateral(form.id, 'contract_recipient', val)}
                                                                                                    value={form?.contract_recipient}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                                                                    handleChangeRai={(val) => handleChangeSeparateCollateral(form.id, 'contract_area_rai', val)}
                                                                                                    rai={form?.contract_area_rai}
                                                                                                    handleChangeNgan={(val) => handleChangeSeparateCollateral(form.id, 'contract_area_ngan', val)}
                                                                                                    ngan={form?.contract_area_ngan}
                                                                                                    handleChangeWa={(val) => handleChangeSeparateCollateral(form.id, 'contract_area_sqaure_wa', val)}
                                                                                                    wa={form?.contract_area_sqaure_wa}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                                                                    handleChangeRai={(val) => handleChangeSeparateCollateral(form.id, 'area_transfer_rai', val)}
                                                                                                    rai={form?.area_transfer_rai}
                                                                                                    handleChangeNgan={(val) => handleChangeSeparateCollateral(form.id, 'area_transfer_ngan', val)}
                                                                                                    ngan={form?.area_transfer_ngan}
                                                                                                    handleChangeWa={(val) => handleChangeSeparateCollateral(form.id, 'area_transfer_sqaure_wa', val)}
                                                                                                    wa={form?.area_transfer_sqaure_wa}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                    handleChange={(val) => handleChangeSeparateCollateral(form.id, 'remark', val)}
                                                                                                    value={form?.remark}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* end card รายละเอียดสารบัญจดทะเบียน */}
                                                                    </div>
                                                                )}

                                                            </div>
                                                        ))} </>)}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)}

                    {formData?.flag1 && (<>
                        <div className="d-flex justify-content-center">
                            <span className="fw-bold mt-0">คืนโฉนด</span>
                        </div>
                        <div className="row g-2 mt-1">
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <Textbox title={'เลขที่หนังสือยืมคืนโฉนด'} containerClassname={'mb-1'} handleChange={(val) => handleChangeCollateral('returndeed_no', val)} value={formData?.returndeed_no} disabled={showDetail} />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <DatePicker title={'วันที่หนังสือคืนโฉนด'}
                                    value={formData.returndeed_date}
                                    handleChange={(val) => handleChangeCollateral('returndeed_date', val)}
                                />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <Textarea title={'หมายเหตุ'} containerClassname={'mb-4'}
                                handleChange={(val) => handleChangeCollateral('returndeed_remark', val)}
                                value={formData?.returndeed_remark} disabled={showDetail}
                            />
                        </div>
                    </>)}
                    <div className="row g-2">
                        <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                            <DatePicker title={'วันที่ทำสัญญา'}
                                value={formData.contract_expro_date}
                                handleChange={(val) => handleChange('contract_expro_date', val)}  />
                        </div>

                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-floating form-floating-advance-select mb-3">
                                <label htmlFor="floaTingLabelSingleSelect">หน่วยงานที่เวนคืน</label>
                                <select className={`form-select`} onChange={(e) => handleChange('expro_agency', e.target?.value)} value={formData.expro_agency} >
                                    <option value="หน่วยงานภายนอก">หน่วยงานภายนอก</option>
                                    <option value="หน่วยงานรัฐ" >หน่วยงานรัฐ</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <AreaTextbox title={'พื้นที่ประมาณการเวนคืน'} containerClassname={'mb-3'}
                            handleChangeRai={(val) => handleChange('rental_area_rai', val)}
                            rai={formData?.expro_area_rai}


                            handleChangeNgan={(val) => handleChange('rental_area_ngan', val)}
                            ngan={formData?.expro_area_ngan}


                            handleChangeWa={(val) => handleChange('rental_area_sqaure_wa', val)}
                            wa={formData?.expro_area_sqaure_wa}
                           
                        />
                    </div>



                    <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                        <Textbox title={'จำนวนเงินการเวนคืนตามสัญญา'} containerClassname={'mb-3'} handleChange={(val) => handleChange('expro_amount', val)} value={formData?.expro_amount}  />
                    </div>

                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <Textarea title={'หมายเหตุ'} containerClassname={'mb-4'}
                            handleChange={(val) => handleChange('expro_remark', val)}
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
