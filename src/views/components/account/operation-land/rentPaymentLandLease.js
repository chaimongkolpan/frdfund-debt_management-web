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
    const { isOpen,onOk, policy,setModal } = props;
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
 const toggle = () => setModal(!isOpen);
 const RenderData = (item, index, checked) => {
    return (item && (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-outline-success btn-sm ms-2" id="OpenEditLandRental" onClick={() => setOpenEditLandLeaseModal(true)}><span class="fas fa-list"></span></button>
                </div>
            </td>
            <td>{item.assetType}</td>
            <td>{item.assetType}</td>
            <td>{item.assetType}</td>
            <td>{item.assetType}</td>
            <td>{item.assetType}</td>
        </tr>
    ))
}
    return (
        <Modal
            isOpen={isOpen}
            title="รับเงินค่าเช่า"
            closeText="ปิด"
            okText="ตกลง"
            onOk={onOk}
            size='lg'
            hideFooter={true}
            setModal={setModal}
        >
            <div className="card my-2 border-0" data-component-card="data-component-card"  >
                <div className="p-3 code-to-copy">
                    <div className="col-12 mt-3 mb-3">
                        <div className="row g-3 justify-content-end">
                            <div className="col-auto">
                                <button className="btn btn-primary me-1 mb-1 " type="button" onClick={handleAddForm}><span className="fas fa-plus fs-8"></span> เพิ่มรับเงินค่าเช่า</button>

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
                            {(data && data.length > 0) ? (data.map((item, index) => RenderData(item, index))) : (
                                <tr>
                                    <td className="fs-9 text-center align-middle" colSpan={20}>
                                        <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {collateralForms.map((form, index) => (
                        < div key={form.id} className="mb-1 rounded p-3 position-relative">
                            <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                <div className="card-body p-0">
                                    <div className="p-3 code-to-copy">
                                        <div className="d-flex justify-content-center mb-1">
                                            <span className="text-center fw-bold">รับเงินค่าเช่าครั้งที่ {index + 1}</span>
                                        </div>
                                        <div className="d-flex justify-content-center mt-1">
                                            <span className="text-center fw-bold">เอกสารประกอบการโอนเงิน</span>
                                        </div>
                                        <br />
                                        <div className="col-12 mt-1 mb-3">
                                            <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                        </div>
                                        <br />


                                        <div className="row g-2 mb-1">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox title={'เลขที่หนังสือ'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker title={'วันที่หนังสือ'} />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox title={'เลขที่ใบสำคัญรับ'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker title={'วันที่ได้รับเงิน'} />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox title={'เลขที่แคชเชียร์เช็ค'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker title={'วันที่แคชเชียร์เช็ค'} />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <DatePicker title={'วันที่การโอน'} />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox title={'จำนวนเงิน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                        </div>

                                    </div></div></div>
                            <div className='form-switch mb-2 d-flex justify-content-center'>
                                <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                    <p className='fw-bold mb-0'>คืนเงิน/หักหนี้</p>
                                    <Input type='switch' id='flag1' name='flag1' onChange={(e) => handleChangeCollateral('flag1', e.target.checked)} checked={collateralDetail?.flag1} />
                                </div>
                            </div>
                            <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                <div className="card-body p-0">
                                    <div className="p-3 code-to-copy">
                                        <div className="d-flex justify-content-center mb-1">
                                            <span className="text-center fw-bold">คืนเงิน/หักหนี้ ครั้งที่ {index + 1}</span>
                                        </div>
                                        <div className="d-flex justify-content-center mt-1">
                                            <span className="text-center fw-bold">เอกสารเกษตรกรรับแจ้งรับเงินคืนหรือหักหนี้</span>
                                        </div>
                                        <br />
                                        <div className="col-12 mt-1 mb-3">
                                            <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                        </div>
                                        <br />

                                        <br />

                                        <div className="row g-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox title={'คืนเงินจำนวน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox title={'หักหนี้จำนวน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center">
                                            <span className="text-center fw-bold">ทำเรื่องให้บัญชีโอนเงิน</span>
                                        </div>
                                        <br />
                                        <div className="col-12 mt-1 mb-3">
                                            <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                        </div>
                                        <br />

                                        <div className="row g-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox title={'เลขที่หนังสือ'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker title={'วันที่หนังสือ'} />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <Textbox title={'เลขที่ใบสำคัญการจ่าย'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 ">
                                                <DatePicker title={'วันที่โอนเงิน'} />
                                            </div>

                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <Textbox title={'จำนวนเงินค่าเช่า'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <Textbox title={'ดอกเบี้ย'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <Textbox title={'รวมจำนวนเงินทั้งสิ้น'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </ div>))}
                </div>
                <div className={`d-flex justify-content-center`}>
                    <button className="btn btn-success me-2" type="button" onClick={() => saveCollateral()}>บันทึก</button>

                </div>
            </div>
        </Modal>
    );
}
export default editLandLeaseModal;
