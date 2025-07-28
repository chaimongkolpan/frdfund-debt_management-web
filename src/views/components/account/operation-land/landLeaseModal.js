import { useEffect, useState, useRef } from "react";
import { stringToDateTh, spDate, toCurrency } from "@utils";
import Textarea from "@views/components/input/Textarea";
import Textbox from "@views/components/input/Textbox";
import AreaTextbox from "@views/components/input/AreaTextbox";
import DropZone from "@views/components/input/DropZone";
import { Input, Label } from 'reactstrap'
import DatePicker from "@views/components/input/DatePicker";
import {
    cleanData,
    getPlanPay,
    savePlanPay,
    printPlanPay,
    saveDocumentPolicy,
    getProvinces,
    getOperationDetail
} from "@services/api";

const PlanPay = (props) => {
    const { policy, isView } = props;
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
    const handleShowDetail = async () => {
        setShowDetail(true);
    }

    const handleShowEdit = async () => {
        setShowEdit(true);
    }

    const [provinces, setProvOp] = useState(null);
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
    const RenderData = (item, index, checked) => {
        return (item && (
            <tr key={index}>
                <td></td>
                <td>
                    <div className='d-flex justify-content-center'>
                        <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={handleShowDetail}>
                            <i className="far fa-eye"></i>
                        </button>
                        <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={handleShowEdit}>
                            <i className="far fa-edit"></i>
                        </button>
                    </div>
                </td>
                <td>{item.assetType}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>

            </tr>
        ))
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
    const handleChangeCollateral = async (key, val) => {
        if (key == 'assetType') {
            await setCollateralType(val);
            await setCollateralDetail((prevState) => ({
                ...prevState,
                ...({ stock_status: (val == 'หุ้น' ? 'Y' : 'N') })
            }))
        }
        await setCollateralDetail((prevState) => ({
            ...prevState,
            ...({ [key]: val })
        }))
    }
    useEffect(() => { }, [collateralRef]);
    useEffect(() => {
        if (!isMounted) {
            getProvince();
        }
    }, [])
    useEffect(() => {
        if (isView) {
            fetchData();
        } else {
            setDate(new Date())
        }
    }, [])
    useEffect(() => {
        console.log('useEffect fired', { showDetail, showEdit });
        if (showDetail) {
            console.log('✅ showDetail ON');
        }
        if (showEdit) {
            console.log('✅ showEdit ON');
        }
    }, [showDetail, showEdit]);
    const addData = async () => {
        await setAddTitle(true);
        await setShowEdit(true);
    }
    return (
        <>
            <form>
                <br />
                <div className="row g-3">
                    <div className={`d-flex mb-3 flex-row-reverse `}>
                        <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => addData()}><span className="fas fa-plus fs-8"></span> เพิ่มดำเนินการในที่ดิน</button>
                    </div>
                    <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                        <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0', border: '#cdd0c7' }}>
                            <tr>
                                <th rowSpan="2">#</th>
                                <th colSpan="3">ดำเนินการในที่ดิน</th>
                                <th colSpan="11">หลักประกัน</th>
                            </tr>
                            <tr>
                                <th>รายละเอียด</th>
                                <th>ประเภทหน่วยงาน</th>
                                <th>ชื่อหน่วยงาน</th>
                                <th>เลขที่นิติกรรมสัญญา</th>
                                <th>ดัชนีจัดเก็บหลักประกัน</th>
                                <th>ประเภทหลักประกัน</th>
                                <th>เจ้าของหลักประกัน</th>
                                <th>เลขที่หลักประกัน</th>
                                <th>จังหวัด</th>
                                <th>อำเภอ</th>
                                <th>ตำบล</th>
                                <th>ไร่</th>
                                <th>งาน</th>
                                <th>ตารางวา</th>
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
                    {/* รายละเอียดดำเนินการในที่ดิน */}
                    {showDetail && (
                        <div className="card shadow-none border my-2" data-component-card="data-component-card">
                            <div className="card-body p-0">
                                <div className="p-3 code-to-copy">
                                    <h3 className="text-center">รายละเอียดดำเนินการในที่ดิน</h3><br />
                                    <div className="row g-2">
                                        <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                            <Textbox title={'ประเภทการดำเนินการในที่ดิน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                            <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                        </div>
                                    </div>
                                    <br />
                                    <span className="text-center">เอกสารคำร้อง</span><br />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* end รายละเอียดดำเนินการในที่ดิน */}

                    {showEdit && (<> {/* start card แก้ไขรายละเอียดดำเนินการในที่ดิน */}
                        <div className="card shadow-none border my-2" data-component-card="data-component-card">
                            <div className="card-body p-0">
                                <div className="p-3 code-to-copy">
                                    <h3 className="text-center">{addTile ? 'เพิ่มการเช่า' : 'แก้ไขรายละเอียดการเช่า'}</h3><br />
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
                                            <Textbox title={'ชื่อหน่วยงาน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                        </div>

                                        <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                            <div className="d-flex justify-content-center">
                                                <span className="text-center fw-bold">เอกสารคำร้อง</span>
                                            </div>
                                            <br />
                                            <div className="col-12 mt-1 mb-3">
                                                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                            </div>
                                            <br />
                                            <div className="row justify-content-center mt-3 mb-3">
                                                <div className="col-auto">
                                                    <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                                                </div>
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
                                            <br />
                                            <div className="row justify-content-center mt-3 mb-3">
                                                <div className="col-auto">
                                                    <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>
                                                        นำไฟล์เข้าระบบ
                                                    </button>
                                                </div>
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
                                            <div className="row justify-content-center mt-3 mb-3">
                                                <div className="col-auto">
                                                    <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                                                </div>
                                            </div>
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
                                            <div className="row justify-content-center mt-3 mb-3">
                                                <div className="col-auto">
                                                    <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                                                </div>
                                            </div>
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
                                            <div className="row justify-content-center mt-3 mb-3">
                                                <div className="col-auto">
                                                    <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                                                </div>
                                            </div>
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
                                            wa={collateralDetail?.area_transfer_sqaure_wa} disabled={isView}
                                        />
                                    </div>

                                    <div className="row g-2">

                                        <div className="col-sm-12 col-md-4 col-lg-4 mb-1">
                                            <DatePicker title={'ระยะเวลาการเช่า(ปี)'} />
                                        </div>
                                        <div className="col-sm-12 col-md-8 col-lg-8">
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="Search_id_card">ระยะเวลาเริ่มต้น-สิ้นสุด</span>
                                                <input className="form-control" type="text" disabled={isView} aria-label="รายละเอียดน บ้าน" />
                                                <span className="input-group-text" id="Search_id_card">-</span>
                                                <input className="form-control" type="text" disabled={isView} aria-label="รายละเอียดน บ้าน" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                        <Textarea title={'หมายเหตุ'} containerClassname={'mb-4'}
                                            handleChange={(val) => handleChangeCollateral('remark', val)}
                                            value={collateralDetail?.remark} disabled={isView}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end card แก้ไขรายละเอียดดำเนินการในที่ดิน */}</>)}
                        {showEdit && (<>
                    {/* start card รับเงินค่าเช่า */}
                    <div className="col-12 mt-3">
                        <div className="row g-3 justify-content-center">
                            <div className="col-auto">
                                <button className="btn btn-outline-success me-1 mb-1 " type="button" onClick={handleAddForm}><span className="fas fa-plus fs-8"></span> เพิ่มรับเงินค่าเช่า</button>
                               
                            </div>
                        </div>
                    </div>
                  
                    {collateralForms.map((form, index) => (
                        < div key={form.id} className="mb-1 rounded p-3 position-relative">
                    <div className="card shadow-none border my-2" data-component-card="data-component-card">
                        <div className="card-body p-0">
                            <div className="p-3 code-to-copy">
                            <div className="d-flex justify-content-center mb-1">
                                <span className="text-center fw-bold">รับเงินค่าเช่าครั้งที่ {index+1}</span>
                            </div>
                                <div className="d-flex justify-content-center mt-1">
                                    <span className="text-center fw-bold">เอกสารประกอบการโอนเงิน</span>
                                </div>
                                <br />
                                <div className="col-12 mt-1 mb-3">
                                    <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                </div>
                                <br />
                                <div className="row justify-content-center mt-3 mb-3">
                                    <div className="col-auto">
                                        <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                                    </div>
                                </div>

                                <div className="row g-2 mb-1">
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'เลขที่หนังสือ'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <DatePicker title={'วันที่หนังสือ'} />
                                    </div>

                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'เลขที่ใบสำคัญรับ'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <DatePicker title={'วันที่ได้รับเงิน'} />
                                    </div>

                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'เลขที่แคชเชียร์เช็ค'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <DatePicker title={'วันที่แคชเชียร์เช็ค'} />
                                    </div>

                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <DatePicker title={'วันที่การโอน'} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'จำนวนเงิน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center mb-1">
                                <span className="text-center fw-bold">คืนเงิน/หักหนี้ ครั้งที่ {index+1}</span>
                                </div>      
                                <div className="d-flex justify-content-center mt-1">
                                    <span className="text-center fw-bold">เอกสารเกษตรกรรับแจ้งรับเงินคืนหรือหักหนี้</span>
                                </div>
                                <br />
                                <div className="col-12 mt-1 mb-3">
                                    <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                                </div>
                                <br />
                                <div className="row justify-content-center mt-3 mb-3">
                                    <div className="col-auto">
                                        <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                                    </div>
                                </div>
                                <br />

                                <div className="row g-2">
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'คืนเงินจำนวน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'หักหนี้จำนวน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
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
                                <div className="row justify-content-center mt-3 mb-3">
                                    <div className="col-auto">
                                        <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                                    </div>
                                </div>


                                <div className="row g-2">
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'เลขที่หนังสือ'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <DatePicker title={'วันที่หนังสือ'} />
                                    </div>

                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'เลขที่ใบสำคัญการจ่าย'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <DatePicker title={'วันที่โอนเงิน'} />
                                    </div>

                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'จำนวนเงินค่าเช่า'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'ดอกเบี้ย'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'รวมจำนวนเงินทั้งสิ้น'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="d-flex justify-content-center mt-2 mb-2">
                            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => handleAddForm(index + 1)}>
                                <i className="fas fa-square-plus"></i>
                            </button>
                            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-danger-dark px-0" type='button' onClick={() => handleRemoveForm(form.id)}>
                                <i className="fas fa-square-minus"></i>
                            </button>
                        </div>
                        </ div>))}
                        </>)}
                    {/* end card รับเงินค่าเช่า */}


                    {/* <div className="col-12 mt-3 ">
                        <div className="row g-3 justify-content-center">
                            <div className="col-auto">
                                <button className="btn btn-success me-1 mb-1" type="button" onClick={() => save()}>บันทึก</button>
                               

                            </div>
                        </div>
                    </div> */}

                </div>
            </form>
        </>
    );
};
export default PlanPay;