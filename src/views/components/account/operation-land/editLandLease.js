import React from 'react';
import Modal from "@views/components/modal/CustomModal";
import { useEffect, useState, useRef } from "react";
import Textarea from "@views/components/input/Textarea";
import Textbox from "@views/components/input/Textbox";
import AreaTextbox from "@views/components/input/AreaTextbox";
import DropZone from "@views/components/input/DropZone";
import { Input, Label } from 'reactstrap'
import DatePicker from "@views/components/input/DatePicker";
const editLandLeaseModal = (props) => {
    const { isOpen, setModal, onOk,policy} = props;
    const [date, setDate] = useState(null);
    const [data, setData] = useState([]);
    const interest = 0.0;
    const [installment, setInstallment] = useState(null);
    const [year, setYear] = useState(null);
    const [plans, setPlan] = useState(null);
    const [clearFile, setClear] = useState(false);
    const [files, setFiles] = useState(null);
    const collateralRef = useRef(null);
    const [isMounted, setMounted] = useState(false);
    const [collateral_type, setCollateralType] = useState('โฉนด');
    const [addTile, setAddTitle] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [provinces, setProvOp] = useState(null);
    const [useAsset, setUseAsset] = useState(false);
    const [isAssetChanged, setIsAssetChanged] = useState(false);
    const [collateralDetail, setCollateralDetail] = useState({
        id_KFKPolicy: policy?.id_KFKPolicy,
        policyNO: policy?.policyNO,
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
    });
    const [collateralForms, setCollateralForms] = useState([
        // { id: Date.now(), assetType: '' }, // ชุดแรก default
    ]);
    const handleAddForm = () => {
        setCollateralForms([...collateralForms, { id: Date.now(), assetType: '' }]);
    };

    const handleRemoveForm = (idToRemove) => {
        setCollateralForms(collateralForms.filter(({ id }) => id !== idToRemove));
    };
    const handleChangeAssetType = (id, newType) => {
        setCollateralForms(forms =>
            forms.map(f => f.id === id ? { ...f, assetType: newType } : f)
        );
    };
    const handleShowRent = async () => {
        setShowDetail(true);
    }

    const handleShowEdit = async () => {
        setShowEdit(true);
    }
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
    const cal = async () => {
        if (installment && year) {
            let pl = [];
            let total = policy?.loan_amount;
            const ins = Math.round((policy?.loan_amount / installment) * 100.0) / 100.0;
            const monthPerInstall = 12 * year / installment;
            const now = new Date();
            let y = now.getFullYear();
            let m = now.getMonth() + 1;
            let d = now.getDate();
            for (let i = 0; i < installment; i++) {
                m += monthPerInstall;
                if (m / 12 > 1) y += 1;
                m %= 12;
                if (i == installment - 1) {
                    let inte = (total * interest / 100.0);
                    let deduc = ins - inte;
                    pl.push({
                        pno: i + 1, pDate: new Date(y, m - 1, d), ppp: total, yokma: total, interes: inte, dd: total, bl: 0,
                        policyNo: policy.policyNO, intrate: interest, plubrate: 0, isKfk: 0
                    });
                    total -= deduc;
                } else {
                    let inte = (total * interest / 100.0);
                    let deduc = ins - inte;
                    pl.push({
                        pno: i + 1, pDate: new Date(y, m - 1, d), ppp: ins, yokma: total, interes: inte, dd: deduc, bl: total - deduc,
                        policyNo: policy.policyNO, intrate: interest, plubrate: 0, isKfk: 0
                    });
                    total -= deduc;
                }
            }
            await setPlan(pl);
        }
    }
    const save = async () => {
        const result = await savePlanPay(plans);
        if (result.isSuccess) {
            await fetchData();
        }
    }
    const print = async () => {
        const result = await printPlanPay({ type: 'application/octet-stream', filename: 'แผนการชำระเงินคืน_' + (new Date().getTime()) + '.zip', data: { id_KFKPolicy: policy.id_KFKPolicy, policyNo: policy.policyNO } });
        if (result.isSuccess) {
        }
    }
    const fetchData = async () => {
        const result = await getOperationDetail(policy.id_KFKPolicy);
        if (result.isSuccess) {
            await setDate(result.data.policyStartDate)
            await setYear(result.data.numberOfYearPayback)
            await setInstallment(result.data.numberOfPeriodPayback)
            await setData(result.data);
        }
    }
    const toggle = () => {
        if (onClose) {
          onClose(); // ใช้ onClose แทน setModal
        } else if (setModal) {
          setModal(!isOpen);
        }
      };
    return (
        <Modal
            isOpen={isOpen}
            setModal={setModal}
            title="แก้ไขการเช่า"
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
                                    <select className={`form-select`} onChange={(e) => handleChangeDebt('debt_manage_status', e.target?.value)}>
                                        <option value="หน่วยงานภายนอก">หน่วยงานภายนอก</option>
                                        <option value="หน่วยงานรัฐ" >หน่วยงานรัฐ</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <Textbox title={'ชื่อหน่วยงาน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment}  />
                            </div>

                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className="text-center fw-bold">เอกสารคำร้อง</span>
                                </div>
                                <br />
                                <div className="col-12 mt-1 mb-3">
                                    <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className="text-center fw-bold">ใบอนุญาตจากเกษตร</span>
                                </div>
                                <br />
                                <div className="col-12 mt-1 mb-3">
                                    <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                </div>                            
                            </div>

                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className='fw-bold'>บันทึกข้อความแจ้งยินยอม</span>
                                </div>
                                <br />
                                <div className="col-12 mt-3 mb-3">
                                    <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                </div><br />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className='fw-bold'>เอกสารประกอบและสัญญาเช่า</span>
                                </div>
                                <br />
                                <div className="col-12 mt-3 mb-3">
                                    <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                </div>
                                <br />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                    <span className='fw-bold'>เอกสารเกษตรรับทราบ</span>
                                </div>
                                <br />
                                <div className="col-12 mt-3 mb-3">
                                    <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                </div>
                                <br />
                            </div>
                        </div>

                        <div className="row g-2">

                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <DatePicker title={'วันที่ทำสัญญา'} />
                            </div>

                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="form-floating form-floating-advance-select mb-3">
                                    <label htmlFor="floaTingLabelSingleSelect">หน่วยงานที่เช่า</label>
                                    <select className={`form-select`} onChange={(e) => handleChangeDebt('debt_manage_status', e.target?.value)}>
                                        <option value="หน่วยงานภายนอก">หน่วยงานภายนอก</option>
                                        <option value="หน่วยงานรัฐ" >หน่วยงานรัฐ</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <AreaTextbox title={'พื้นที่ประมาณให้เช่า'} containerClassname={'mb-3'}
                                handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)}
                                rai={collateralDetail?.area_transfer_rai}
                                handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)}
                                ngan={collateralDetail?.area_transfer_ngan}
                                handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)}
                                wa={collateralDetail?.area_transfer_sqaure_wa} 
                            />
                        </div>

                        <div className="row g-2">

                            <div className="col-sm-12 col-md-4 col-lg-4 mb-1">
                                <Textbox title={'ระยะเวลาการเช่า(ปี)'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment}  />
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 mb-1">
                                <DatePicker title={'ระยะเวลาเริ่มต้น'} />
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 mb-1">
                                <DatePicker title={'ระยะเวลาสิ้นสุด'} />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <Textarea title={'หมายเหตุ'} containerClassname={'mb-4'}
                                handleChange={(val) => handleChangeCollateral('remark', val)}
                                value={collateralDetail?.remark} 
                            />
                        </div>
                    </div>
                    <div className={`d-flex justify-content-center`}>
                  <button className="btn btn-success me-2" type="button" onClick={() => saveCollateral()}>บันทึก</button>
                 
                </div>
                </div>
        </Modal>
    );
}
export default editLandLeaseModal;
