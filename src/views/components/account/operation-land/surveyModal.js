import { useEffect, useState, useRef, forwardRef,useImperativeHandle } from "react";
import { stringToDateTh, spDate, toCurrency } from "@utils";
import Textarea from "@views/components/input/Textarea";
import Textbox from "@views/components/input/Textbox";
import AreaTextbox from "@views/components/input/AreaTextbox";
import DropZone from "@views/components/input/DropZone";
import { Input, Label } from 'reactstrap'
import DatePicker from "@views/components/input/DatePicker";
import Dropdown from "@views/components/input/DropdownSearch";
import {
    cleanData,
    getPlanPay,
    savePlanPay,
    printPlanPay,
    saveDocumentPolicy,
    getProvinces,
    getSurveyDetail,
    getSurveyChangeCollateral,
    getSurveySeparateCollateral,
    getSurveySeparateUsedeed
} from "@services/api";

const survey = forwardRef((props, ref) => {
    const { policy, isView } = props;
    const [date, setDate] = useState(null);
    const [data, setData] = useState([]);
    const interest = 0.0;
    const [installment, setInstallment] = useState(null);
    const [year, setYear] = useState(null);
    const [plans, setPlan] = useState(null);
    const [clearFile, setClear] = useState({});
    const [files, setFiles] = useState({});
    const collateralRef = useRef(null);
    const [isMounted, setMounted] = useState(false);
    const [collateral_type, setCollateralType] = useState('โฉนด');
    const typeSurvey = ["รังวัดชี้แนวเขต", "รังวัดแบ่งเขต", "รังวัดสอบเขต", "รังวัดออกโฉนด", "อื่นๆ"];
    const [addTile, setAddTitle] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [isExternalAgency, setIsExternalAgency] = useState(false);
    const [useAsset, setUseAsset] = useState(false);
    const [isAssetChanged, setIsAssetChanged] = useState(false);
    const [isAssetSplit, setIsAssetSplit] = useState(false);
    const [provinces, setProvOp] = useState(null);
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
    const [collateralDetail, setCollateralDetail] = useState(initialCollateralDetail);

    const handleAddForm = () => {
        setCollateralDetail(prev => ({
            ...prev,
            separateCollateral: [
                ...prev.separateCollateral,
                { id: Date.now(), assetType: '' }
            ]
        }));
    };
    const handleRemoveForm = (idToRemove) => {
        setCollateralDetail(prev => ({
            ...prev,
            separateCollateral: prev.separateCollateral.filter(({ id }) => id !== idToRemove)
        }));
    };
    const handleChangeAssetType = (id, newType) => {
        setCollateralDetail(prev => ({
            ...prev,
            separateCollateral: prev.separateCollateral.map(item =>
                item.id === id ? { ...item, assetType: newType } : item
            )
        }));
    };
    const onFileChange = (key, selectedFiles) => {
        if (selectedFiles.length > 0) {
          setCollateralDetail((prev) => ({
            ...prev,
            [key]: selectedFiles, 
          }));

          setClear((prev) => ({
            ...prev,
            [key]: false,
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
    const getSeparateCollateral = async (id) => {
        console.log(id);
        const result = await getSurveyChangeCollateral(id);
        if (result.isSuccess) {
            setCollateralDetail(prev => ({
                ...prev,
                assetType: result.data?.assetType ?? prev.separateCollateral?.assetType, 
            }));
        }
    }
    const getChangeCollateral = async (id) => {
        console.log(id);
        const result = await getSurveySeparateCollateral(id);
        if (result.isSuccess) {
            setCollateralDetail(prev => ({
                ...prev, 
                ...result.data, 
                assetType: result.data?.assetType ?? prev.changeCollateral?.assetType, 
            }));
        }
    }
    const getUseDeed = async (item) => {
        const params ={
            id_KFKPolicy: item.id_KFKPolicy,
            policyNO: item.policyNO,
            id_AssetPolicy: item.id_AssetPolicy,
            indexAssetPolicy: item.indexAssetPolicy,
            operations_type: item.operations_type,
            id_operations_type: item.id_operations_type
          }
        const result = await getSurveySeparateUsedeed(params);
        if (result.isSuccess) {
            if(result.data.length > 0){
                setCollateralDetail(prev => ({
                    ...prev,
                    changeCollateral: {
                        ...result.changeCollateral,
                        assetType: result.changeCollateral?.assetType ?? prev.changeCollateral?.assetType,
                    },
                    ...result.data
                }));
            }
        }
    }
    const fetchData = async () => {
        console.log(policy);
        const result = await getSurveyDetail(policy.id_KFKPolicy);
        if (result.isSuccess) {
            await setDate(result.data.policyStartDate)
            await setYear(result.data.numberOfYearPayback)
            await setInstallment(result.data.numberOfPeriodPayback)
            await setPlan(result.listData);
            await setData(result.data);
        }
    }
    const handleShowDetail = async (item) => {
        setShowDetail(true);
        await getChangeCollateral(item.id_AssetPolicy);
        await getSeparateCollateral(item.id_AssetPolicy);
        await getUseDeed(item);
        setCollateralDetail(prev => ({
            ...prev,
            ...item, 
            changeCollateral: { assetType: item.assetType || 'โฉนด' },
            separateCollateral: [{ assetType: item.assetType || 'โฉนด' }],
            req_docu: [],
            borrowdeed_docu: [],
            approve_docu: [],
            results_docu: [],
            report_docu: [],
          }));
    }
    const handleShowEdit = async (item) => {
        setShowEdit(true);
        await setCollateralDetail(item);
        await getChangeCollateral(item.id_AssetPolicy);
        await getSeparateCollateral(item.id_AssetPolicy);
        await getUseDeed(item);
        setCollateralDetail(prev => ({
            ...prev,
            ...item, 
            changeCollateral: { assetType: item.assetType || 'โฉนด' },
            separateCollateral: [{ assetType: item.assetType || 'โฉนด' }],
            req_docu: [],
            borrowdeed_docu: [],
            approve_docu: [],
            results_docu: [],
            report_docu: [],
          }));
    }
    const handleChangeSeparateCollateral = (id, key, value) => {
        setCollateralDetail(prev => ({
            ...prev,
            separateCollateral: prev.separateCollateral.map(item =>
                item.id === id ? { ...item, [key]: value } : item
            )
        }));
    };
    const handleChangeChangeCollateral = (field, value) => {
        setCollateralDetail(prev => ({
            ...prev,
            changeCollateral: {
                ...prev.changeCollateral,
                [field]: value
            }
        }));
    };
    const RenderData = (item, index, checked) => {
        return (item && (
            <tr key={index}>
                <td></td>
                <td>
                    <div className='d-flex justify-content-center'>
                    {!item.deedBorrowReturn_status || item.deedBorrowReturn_status == 'ยืมโฉนด' ? 
                        (<button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={handleShowEdit}>
                            <i className="far fa-edit"></i>
                        </button>) : (<button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={handleShowDetail}>
                            <i className="far fa-eye"></i>
                        </button>
                        )} 
                    </div>
                </td>
                <td>{item.assetType}</td>
                <td>{item.policyNO}</td>
                <td>{item.indexAssetPolicy}</td>
                <td>{item.assetType}</td>
                <td>{item.collateral_no}</td>
                <td>{item.collateral_province}</td>
                <td>{item.collateral_district}</td>
                <td>{item.collateral_sub_district}</td>
                <td>{item.contract_area_rai}</td>
                <td>{item.contract_area_ngan}</td>
                <td>{item.contract_area_sqaure_wa}</td>
                <td>{item.borrowdeed_no}</td>
                <td>{item.borrowdeed_date}</td>
                <td>{item.borrowdeed_reason}</td>
                <td>{item.returndeed_no}</td>
                <td>{item.returndeed_date}</td>
                <td>{item.returndeed_remark}</td>
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
        console.log(policy);
       // if (showDetail) {
            fetchData();
       // } else {
       //     setDate(new Date())
       // }
    }, [])
    useEffect(() => {
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

      useImperativeHandle(ref, () => ({
        getData: () => {
          return {
            collateralDetail,
          };
        },
      }));
    return (
        <>
            <form>
                <br />
                <div className="row g-3">
                    <div className={`d-flex mb-3 flex-row-reverse `}>
                        <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => addData()} ><span className="fas fa-plus fs-8"></span> เพิ่มการรังวัด</button>
                    </div>
                    <div className="table-responsive mx-n1 px-1">
                    <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                        <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0', border: '#cdd0c7' }}>
                            <tr>
                                <th rowSpan="2">#</th>
                                <th colSpan="2">ดำเนินการในที่ดิน</th>
                                <th colSpan="11">หลักประกัน</th>
                                <th colSpan="3">ยืมโฉนด</th>
                                <th colSpan="3">คืนโฉนด</th>
                            </tr>
                            <tr>
                                <th>รายละเอียด</th>
                                <th>ประเภทดำเนินการรังวัด</th>
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
                                <th>เลขที่หนังสือ</th>
                                <th>วันที่หนังสือ</th>
                                <th>เหตุผล</th>
                                <th>เลขที่หนังสือ</th>
                                <th>วันที่หนังสือ</th>
                                <th>หมายเหตุ</th>
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
                    </div>
                    {/* รายละเอียดดำเนินการในที่ดิน */}
                    {/* { showDetail && (
                        <div className="card shadow-none border my-2" data-component-card="data-component-card">
                        <div className="card-body p-0">
                            <div className="p-3 code-to-copy">
                                <h3 className="text-center">รายละเอียดการรังวัด</h3><br />
                                <div className="row g-2">
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                        <Textbox title={'ประเภทการรังวัด'} containerClassname={'mb-1'} handleChange={(val) => setInstallment(val)} value={installment} disabled={showDetail} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                        <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-1'} handleChange={(val) => setInstallment(val)} value={installment} disabled={showDetail} />
                                    </div>
                                </div>
                                <br />
                                <span className="text-center">เอกสารคำร้อง</span><br />
                            </div>
                        </div>
                    </div>
                    )} */}
                    {/* end รายละเอียดดำเนินการในที่ดิน */}
                    { (showEdit || showDetail ) && (<>
                    {/* start แก้ไขรายละเอียดดำเนินการในที่ดิน */}
                    <div className="card shadow-none border my-2" data-component-card="data-component-card">
                        <div className="card-body p-0">
                            <div className="p-3 code-to-copy">
                                <h3 className="text-center">{addTile ? 'เพิ่มดำเนินการรังวัด': showDetail? 'รายละเอียดการรังวัด' :'แก้ไขรายละเอียดดการรังวัด'}</h3><br />
                                <div className="row g-2">
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                        {/* <Textbox title={'ประเภทการรังวัด'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={isView} /> */}
                                        <Dropdown
                                            title={'ประเภทการรังวัด'}
                                            defaultValue={'รังวัดสอบเขต'}
                                            options={typeSurvey}
                                            handleChange={(val) => handleChangeCollateral('asset_operations_type', val)}                          
                                        />
                                       
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                        <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-1'} handleChange={(val) => handleChangeCollateral('asset_operations_other', val)}  value={collateralDetail?.chattel_brand} disabled={showDetail} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center">
                                <span className="text-center fw-bold">เอกสารคำร้อง</span>
                                </div>
                                <br />
                                <div className="col-12 mt-1 mb-3">
                                <DropZone onChange={(f) => onFileChange('req_docu', f)} clearFile={clearFile['req_docu']} accept={'*'} disabled={showDetail} />
                                </div>
                                <br />
                                
                                <div className='form-switch mb-2 d-flex justify-content-center'>
                                    <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                        <p className='fw-bold mb-0'>หน่วยงานภายนอก</p>
                                        <Input type='switch' id='rtl' name='RTL' onChange={(e) => setIsExternalAgency(e.target.checked)} checked={collateralDetail?.external}/>
                                    </div>
                                </div>
                                {isExternalAgency && (
                                    <>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mt-3 mb-1">
                                    <div className="d-flex justify-content-center">
                                        <span className="fw-bold">ใบอนุญาตจากเกษตร</span><br />
                                    </div>
                                        <div className="col-12 mt-3 mb-3">
                                        <DropZone onChange={(f) => onFileChange('license_ farmers_docu', f)} clearFile={clearFile['ใบอนุญาตจากเกษตร']} accept={'*'} />
                                        </div>
                                        <br />
                                    </div>
                                    </>
                                    )}
                                <div className='form-switch mb-2 d-flex justify-content-center'>
                                    <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                        <p className='fw-bold mb-0'>ใช้โฉนด</p>
                                        <Input type='switch' id='flag1' name='flag1' onChange={(e) => handleChangeCollateral('flag1',e.target.checked)} disabled={showDetail} checked={collateralDetail?.flag1} />
                                    </div>
                                </div>
                                <br />
                                {collateralDetail?.flag1 && (<>
                                    <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                    <div className="card-body p-0">
                                        <div className="p-3 code-to-copy">
                                        <div className="row g-2">
                                                    <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                                    <div className="d-flex justify-content-center">
                                                        <span className="fw-bold">เอกสารคำร้องขอยืมโฉนด</span><br />
                                                        </div>
                                                        <div className="col-12 mt-3 mb-3">
                                                            <DropZone onChange={(f) => onFileChange('borrowdeed_docu', f)} clearFile={clearFile['borrowdeed_docu']} accept={'*'} disabled={showDetail} />
                                                        </div>
                                                        <br />

                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                                    <div className="d-flex justify-content-center">
                                                        <span className="fw-bold">เอกสารบันทึกข้อความที่เลขาอนุมัติ</span><br />
                                                        </div>
                                                        <div className="col-12  mt-3 mb-3">
                                                            <DropZone onChange={(f) => onFileChange('approve_docu', f)} clearFile={clearFile['approve_docu']} accept={'*'} disabled={showDetail} />
                                                        </div>
                                                        <br />

                                                    </div>
                                                </div>
                                            <br />
                                            <div className="d-flex justify-content-center">
                                            <span className="fw-bold">ยืมโฉนด</span>
                                            </div>
                                            <br />
                                            <div className="row g-2 mt-2">
                                                <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                                    <Textbox title={'เลขที่หนังสือยืมโฉนด'} containerClassname={'mb-1'} handleChange={(val) => handleChangeCollateral('borrowdeed_no', val)}  value={collateralDetail?.borrowdeed_no} disabled={showDetail} />
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 mb-2">
                                                    <DatePicker title={'วันที่หนังสือยืมโฉนด'} 
                                                     value={collateralDetail.borrowdeed_date} 
                                                     handleChange={(val) => handleChangeCollateral('borrowdeed_date', val)} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12 mb-4">
                                                <Textarea title={'เหตุผล'} containerClassname={'mb-3'} handleChange={(val) => handleChangeCollateral('borrowdeed_reason', val)}  value={collateralDetail?.borrowdeed_reason} disabled={showDetail} />
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
                                <DropZone onChange={(f) => onFileChange('results_docu', f)} clearFile={clearFile['results_docu']} accept={'*'} disabled={showDetail} />
                                </div>
                                <br />
                               
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <div className="d-flex justify-content-center">
                                <span className='fw-bold'>บันทึกข้อความรายงานผลการดำเนินการ</span>
                                </div>
                                <br />
                                <div className="col-12 mt-3 mb-3">
                                <DropZone onChange={(f) => onFileChange('report_docu', f)} clearFile={clearFile['report_docu']} accept={'*'} disabled={showDetail} />
                                </div>
                                <br />
                                </div>
                                </div>
                                {collateralDetail?.flag1 && (
                                <div className='form-switch mb-2 d-flex justify-content-center'>
                                    <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                        <p className='fw-bold mb-0'>เปลี่ยนแปลงหลักทรัพย์</p>
                                        <Input type='switch' id='flag2' name='flag2' onChange={(e) => handleChangeCollateral('flag2',e.target.checked)} disabled={showDetail} checked={collateralDetail?.flag2}/>
                                    </div>
                                </div> )}
                                {(collateralDetail?.flag2 || collateralDetail?.change_asset === 1 )  && (
                                <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                    <div className="card-body p-0">
                                        <div className="p-3 code-to-copy">
                                            <div ref={collateralRef} className="row g-3">
                                                <div className="col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating needs-validation">
                                                        <select className="form-select" value={collateralDetail.changeCollateral?.assetType} disabled={showDetail} onChange={(e) => handleChangeChangeCollateral('assetType', e.target.value)}>
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
                                                        <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.collateral_status} onChange={(e) => handleChangeChangeCollateral('collateral_status', e.target.value)}>
                                                            <option value="โอนได้">โอนได้</option>
                                                            <option value="โอนไม่ได้">โอนไม่ได้</option>
                                                        </select>
                                                        <label htmlFor="floatingSelectTeam">สถานะหลักทรัพย์</label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating needs-validation">
                                                        <select className="form-select" value={collateralDetail.changeCollateral?.conditions_cannot_transferred} onChange={(e) => handleChangeChangeCollateral('conditions_cannot_transferred', e.target?.value)} disabled={showDetail}>
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

                                                        {collateralDetail.changeCollateral?.assetType === 'โฉนด' && (
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
                                                                                                                <Textbox title={'เลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('parceL_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.parceL_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('parceL_volume', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.parceL_volume}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('parceL_page', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.parceL_page}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <div className="form-floating form-floating-advance-select ">
                                                                                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.parceL_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral('parceL_province', e.target?.value)}>
                                                                                                                        {provinces && (
                                                                                                                            provinces.map((option, index) => (
                                                                                                                                <option key={index} value={option}>{option}</option>
                                                                                                                            ))
                                                                                                                        )}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('parceL_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.parceL_district}
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
                                                                                                                <Textbox title={'ระวาง'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('parceL_map_sheet', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.parceL_map_sheet}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เลขที่ดิน'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('parceL_parcel_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.parceL_parcel_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'หน้าสำรวจ'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('parceL_explore_page', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.parceL_explore_page}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('parceL_sub_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.parceL_sub_district}
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

                                                                        {collateralDetail.changeCollateral?.assetType === 'ตราจอง' && (
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
                                                                                                                <Textbox title={'เล่มที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('pre_emption_volume_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.pre_emption_volume_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('pre_emption_volume', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.pre_emption_volume}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('pre_emption_page', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.pre_emption_page}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'ระวาง'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('pre_emption_map_sheet', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.pre_emption_map_sheet}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เลขที่ดิน'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('pre_emption_parcel_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.pre_emption_parcel_no}
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
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.pre_emption_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral('pre_emption_province', e.target?.value)}>
                                                                                                                        {provinces && (
                                                                                                                            provinces.map((option, index) => (
                                                                                                                                <option key={index} value={option}>{option}</option>
                                                                                                                            ))
                                                                                                                        )}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('pre_emption_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.pre_emption_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('pre_emption_sub_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.pre_emption_sub_district}
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

                                                                        {collateralDetail.changeCollateral?.assetType === 'น.ส.3' && (
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
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.nS3_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3_province', e.target?.value)}>
                                                                                                                        {provinces && (
                                                                                                                            provinces.map((option, index) => (
                                                                                                                                <option key={index} value={option}>{option}</option>
                                                                                                                            ))
                                                                                                                        )}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('nS3_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('nS3_sub_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3_sub_district}
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
                                                                                                                <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('nS3_emption_volume', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3_emption_volume}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('nS3_emption_page', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3_emption_page}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'สารบบเล่ม/เลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('nS3_dealing_file_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3_dealing_file_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'สารบบหน้า'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeSeparateCollateral('nS3_dealing_page_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3_dealing_page_no}
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

                                                                        {collateralDetail.changeCollateral?.assetType === 'น.ส.3 ก' && (
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
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.nS3A_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'nS3A_province', e.target?.value)}>
                                                                                                                        {provinces && (
                                                                                                                            provinces.map((option, index) => (
                                                                                                                                <option key={index} value={option}>{option}</option>
                                                                                                                            ))
                                                                                                                        )}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3A_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3A_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3A_sub_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3A_sub_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ระวางรูปถ่ายทางออกชื่อ'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3A_map_sheet', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3A_map_sheet}
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
                                                                                                                <Textbox title={'เลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3A_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3A_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เล่มที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3A_volume_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3A_volume_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3A_page', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3A_page}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'เลขที่ดิน'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3A_parcel_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3A_parcel_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'หมายเลข'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3A_number', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3A_number}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'แผ่นที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3A_sheet_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3A_sheet_no}
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

                                                                        {collateralDetail.changeCollateral?.assetType === 'น.ส.3 ข' && (
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
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.nS3B_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('nS3B_province', e.target?.value)}>
                                                                                                                        {provinces && (
                                                                                                                            provinces.map((option, index) => (
                                                                                                                                <option key={index} value={option}>{option}</option>
                                                                                                                            ))
                                                                                                                        )}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3B_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3B_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3B_sub_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3B_sub_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'หมู่ที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3B_village', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3B_village}
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
                                                                                                                <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3B_volume', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3B_volume}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3B_page', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3B_page}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'เลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('nS3B_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.nS3B_no}
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

                                                                        {collateralDetail.changeCollateral?.assetType === 'ส.ป.ก.' && (
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
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.alrO_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('alrO_province', e.target?.value)}>
                                                                                                                        {provinces && (
                                                                                                                            provinces.map((option, index) => (
                                                                                                                                <option key={index} value={option}>{option}</option>
                                                                                                                            ))
                                                                                                                        )}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('alrO_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.alrO_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('alrO_sub_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.alrO_sub_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'หมู่ที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('alrO_village', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.alrO_village}
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
                                                                                                                <Textbox title={'แปลงเลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('alrO_plot_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.alrO_plot_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ระวาง ส.ป.ก. ที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('alrO_map_sheet', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.alrO_map_sheet}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'เลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('alrO_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.alrO_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('alrO_volume', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.alrO_volume}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('alrO_page', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.alrO_page}
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

                                                                        {collateralDetail.changeCollateral?.assetType === 'หนังสือแสดงกรรมสิทธิ์ห้องชุด' && (
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
                                                                                                                <Textbox title={'โฉนดที่ดินเลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('condO_parcel_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.condO_parcel_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <div className="form-floating form-floating-advance-select mb-3">
                                                                                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.condO_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('condO_province', e.target?.value)}>
                                                                                                                        {provinces && (
                                                                                                                            provinces.map((option, index) => (
                                                                                                                                <option key={index} value={option}>{option}</option>
                                                                                                                            ))
                                                                                                                        )}
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('condO_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.condO_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('condO_sub_district', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.condO_sub_district}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <AreaTextbox title={'เนื้อที่'} containerClassname={'mb-3'} disabled={showDetail}
                                                                                                                    handleChangeRai={(val) => handleChangeChangeCollateral('condO_rai', val)}
                                                                                                                    rai={collateralDetail.changeCollateral?.condO_rai}
                                                                                                                    handleChangeNgan={(val) => handleChangeChangeCollateral('condO_ngan', val)}
                                                                                                                    ngan={collateralDetail.changeCollateral?.condO_ngan}
                                                                                                                    handleChangeWa={(val) => handleChangeChangeCollateral('condO_sqaure_wa', val)}
                                                                                                                    wa={collateralDetail.changeCollateral?.condO_sqaure_wa}
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
                                                                                                                <Textbox title={'ห้องชุดเลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('condO_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.condO_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ชั้นที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('condO_floor', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.condO_floor}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'อาคารเลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('condO_building_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.condO_building_no}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ชื่ออาคารชุด'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('condO_building_name', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.condO_building_name}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ทะเบียนอาคารชุดเลขที่'} disabled={showDetail}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('condO_registration_no', val)}
                                                                                                                    containerClassname={'mb-3'} value={collateralDetail.changeCollateral?.condO_registration_no}
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
                                                                                                                    value={collateralDetail.changeCollateral?.promisor} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('contract_recipient', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.contract_recipient} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เนื้อที่ประมาณ'} footer={'ตารางเมตร'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('area_square_meter', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.area_square_meter} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'สูง'} footer={'เมตร'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('high_meter', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.high_meter} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <div className="form-floating form-floating-advance-select ">
                                                                                                                    <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.source_of_wealth} onChange={(e) => handleChangeChangeCollateral('source_of_wealth', e.target?.value)}>
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
                                                                                                                    value={collateralDetail.changeCollateral?.source_of_wealth_other}
                                                                                                                    disabled={collateralDetail.changeCollateral?.source_of_wealth != 'อื่นๆ' || isView}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('remark', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.remark} disabled={showDetail}
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

                                                                        {collateralDetail.changeCollateral?.assetType === 'ภ.ท.บ.5' && (
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
                                                                                                                    value={collateralDetail.changeCollateral?.labT5_parcel_no} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <div className="form-floating form-floating-advance-select mb-3">
                                                                                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.labT5_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('labT5_province', e.target?.value)}>
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
                                                                                                                    value={collateralDetail.changeCollateral?.labT5_district} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('labT5_sub_district', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.labT5_sub_district} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'หมู่ที่'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('labT5_village', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.labT5_village} disabled={showDetail}
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
                                                                                                            rai={collateralDetail.changeCollateral?.total_area_rai}
                                                                                                            handleChangeNgan={(val) => handleChangeChangeCollateral('total_area_ngan', val)}
                                                                                                            ngan={collateralDetail.changeCollateral?.total_area_ngan}
                                                                                                            handleChangeWa={(val) => handleChangeChangeCollateral('total_area_sqaure_wa', val)}
                                                                                                            wa={collateralDetail.changeCollateral?.total_area_sqaure_wa} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select ">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.source_of_wealth} onChange={(e) => handleChangeChangeCollateral('source_of_wealth', e.target?.value)}>
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
                                                                                                            value={collateralDetail.changeCollateral?.source_of_wealth_other}
                                                                                                            disabled={collateralDetail.changeCollateral?.source_of_wealth != 'อื่นๆ' || isView}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeChangeCollateral('remark', val)}
                                                                                                            value={collateralDetail.changeCollateral?.remark} disabled={showDetail}
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

                                                                        {collateralDetail.changeCollateral?.assetType === 'บ้าน' && (
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
                                                                                                                    value={collateralDetail.changeCollateral?.house_no} disabled={showDetail}
                                                                                                                />
                                                                                                                <div className="input-group mb-3">
                                                                                                                    <span className="input-group-text" id="Search_id_card">สิ่งปลูกสร้างเลขที่</span>
                                                                                                                    <input className="form-control" type="text" disabled={showDetail} aria-label="รายละเอียดน บ้าน" />
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <div className="form-floating form-floating-advance-select mb-3">
                                                                                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.house_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('house_province', e.target?.value)}>
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
                                                                                                                    value={collateralDetail.changeCollateral?.house_district} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('house_sub_district', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.house_sub_district} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'ตั้งอยู่บนที่ดินเลขที่'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('house_parcel_no', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.house_parcel_no} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textbox title={'ลักษณะสิ่งปลูกสร้าง'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('house_type', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.house_type} disabled={showDetail}
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

                                                                        {collateralDetail.changeCollateral?.assetType === 'สังหาริมทรัพย์' && (
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
                                                                                                                    value={collateralDetail.changeCollateral?.chattel_registration_date} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'ยี่ห้อ'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('chattel_brand', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.chattel_brand} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'ประเภท'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('chattel_type', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.chattel_type} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เลขทะเบียน'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('chattel_registration_no', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.chattel_registration_no} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'ลักษณะ'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('chattel_style', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.chattel_style} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เลขตัวรถ'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('chattel_vehicle_no', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.chattel_vehicle_no} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'เลขเครื่องยนต์'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('chattel_engine_no', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.chattel_engine_no} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'สี'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('chattel_color', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.chattel_color} disabled={showDetail}
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
                                                                                                                    value={collateralDetail.changeCollateral?.name_legal_owner} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textarea title={'ชื่อผู้ครอบครอง'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('name_occupier', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.name_occupier} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('remark', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.remark} disabled={showDetail}
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
                                                                        
                                                                        {collateralDetail.changeCollateral?.assetType === 'อื่นๆ' && (
                                                                            <div className="mt-3">
                                                                                {/* start card รายละเอียด อื่นๆ */}
                                                                                <h3 className="text-center">อื่นๆ</h3>
                                                                                <div className="col-sm-12 col-md-12 col-lg-12 g-3">
                                                                                    <Textbox title={'หลักประกันอื่นๆโปรดระบุ'} containerClassname={'mb-3'}
                                                                                        handleChange={(val) => handleChangeChangeCollateral('assetType_other', val)}
                                                                                        value={collateralDetail.changeCollateral?.assetType_other} disabled={showDetail}
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
                                                                                                                    value={collateralDetail.changeCollateral?.otheR_volume} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'หน้า'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('otheR_page', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.otheR_page} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <div className="form-floating form-floating-advance-select mb-3">
                                                                                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail.changeCollateral?.otheR_province ?? provinces[0]} onChange={(e) => handleChangeChangeCollateral('otheR_province', e.target?.value)}>
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
                                                                                                                    value={collateralDetail.changeCollateral?.otheR_district} disabled={showDetail}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                                    handleChange={(val) => handleChangeChangeCollateral('otheR_sub_district', val)}
                                                                                                                    value={collateralDetail.changeCollateral?.otheR_sub_district} disabled={showDetail}
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
                                                                                                            value={collateralDetail.changeCollateral?.promisor} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeChangeCollateral('contract_recipient', val)}
                                                                                                            value={collateralDetail.changeCollateral?.contract_recipient} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                                                                            handleChangeRai={(val) => handleChangeChangeCollateral('contract_area_rai', val)}
                                                                                                            rai={collateralDetail.changeCollateral?.contract_area_rai}
                                                                                                            handleChangeNgan={(val) => handleChangeChangeCollateral('contract_area_ngan', val)}
                                                                                                            ngan={collateralDetail.changeCollateral?.contract_area_ngan}
                                                                                                            handleChangeWa={(val) => handleChangeChangeCollateral('contract_area_sqaure_wa', val)}
                                                                                                            wa={collateralDetail.changeCollateral?.contract_area_sqaure_wa} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                                                                            handleChangeRai={(val) => handleChangeChangeCollateral('area_transfer_rai', val)}
                                                                                                            rai={collateralDetail.changeCollateral?.area_transfer_rai}
                                                                                                            handleChangeNgan={(val) => handleChangeChangeCollateral('area_transfer_ngan', val)}
                                                                                                            ngan={collateralDetail.changeCollateral?.area_transfer_ngan}
                                                                                                            handleChangeWa={(val) => handleChangeChangeCollateral('area_transfer_sqaure_wa', val)}
                                                                                                            wa={collateralDetail.changeCollateral?.area_transfer_sqaure_wa} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeChangeCollateral('remark', val)}
                                                                                                            value={collateralDetail.changeCollateral?.remark} disabled={showDetail}
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
                                                                        <Input type='switch' id='flag3' name='flag3' onChange={(e) => handleChangeCollateral('flag3',e.target.checked)} checked={collateralDetail?.flag3}/>
                                                                    </div>
                                                                </div>
                                                                {(collateralDetail?.flag3 || collateralDetail?.separate_asset === 1)  && !showDetail && (<>
                                                                    <div className="d-flex justify-content-center">
                                                                        <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={handleAddForm}>
                                                                            <i className="fas fa-square-plus"></i>
                                                                        </button>
                                                                    </div>

                                                                    {collateralDetail.separateCollateral.map((form, index) => (
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
                                                                                                                    <Textbox title={'เลขที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.parceL_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_volume', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.parceL_volume}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_page', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.parceL_page}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <div className="form-floating form-floating-advance-select ">
                                                                                                                        <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.parceL_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'parceL_province', e.target?.value)}>
                                                                                                                            {provinces && (
                                                                                                                                provinces.map((option, index) => (
                                                                                                                                    <option key={index} value={option}>{option}</option>
                                                                                                                                ))
                                                                                                                            )}
                                                                                                                        </select>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'อำเภอ'} disabled={showDetail}
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
                                                                                                                    <Textbox title={'ระวาง'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_map_sheet', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.parceL_map_sheet}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เลขที่ดิน'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_parcel_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.parceL_parcel_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'หน้าสำรวจ'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'parceL_explore_page', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.parceL_explore_page}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ตำบล'} disabled={showDetail}
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
                                                                                                                    <Textbox title={'เล่มที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_volume_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.pre_emption_volume_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_volume', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.pre_emption_volume}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_page', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.pre_emption_page}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'ระวาง'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_map_sheet', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.pre_emption_map_sheet}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เลขที่ดิน'} disabled={showDetail}
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
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.pre_emption_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'pre_emption_province', e.target?.value)}>
                                                                                                                            {provinces && (
                                                                                                                                provinces.map((option, index) => (
                                                                                                                                    <option key={index} value={option}>{option}</option>
                                                                                                                                ))
                                                                                                                            )}
                                                                                                                        </select>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'pre_emption_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.pre_emption_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ตำบล'} disabled={showDetail}
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
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.nS3_province ?? provinces[0]} onChange={(e) => handleChangeCollateral(form.id, 'nS3_province', e.target?.value)}>
                                                                                                                            {provinces && (
                                                                                                                                provinces.map((option, index) => (
                                                                                                                                    <option key={index} value={option}>{option}</option>
                                                                                                                                ))
                                                                                                                            )}
                                                                                                                        </select>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ตำบล'} disabled={showDetail}
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
                                                                                                                    <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_emption_volume', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3_emption_volume}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_emption_page', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3_emption_page}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'สารบบเล่ม/เลขที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3_dealing_file_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3_dealing_file_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'สารบบหน้า'} disabled={showDetail}
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
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.nS3A_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'nS3A_province', e.target?.value)}>
                                                                                                                            {provinces && (
                                                                                                                                provinces.map((option, index) => (
                                                                                                                                    <option key={index} value={option}>{option}</option>
                                                                                                                                ))
                                                                                                                            )}
                                                                                                                        </select>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3A_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_sub_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3A_sub_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ระวางรูปถ่ายทางออกชื่อ'} disabled={showDetail}
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
                                                                                                                    <Textbox title={'เลขที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3A_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เล่มที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_volume_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3A_volume_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_page', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3A_page}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'เลขที่ดิน'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_parcel_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3A_parcel_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'หมายเลข'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3A_number', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3A_number}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'แผ่นที่'} disabled={showDetail}
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
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.nS3B_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'nS3B_province', e.target?.value)}>
                                                                                                                            {provinces && (
                                                                                                                                provinces.map((option, index) => (
                                                                                                                                    <option key={index} value={option}>{option}</option>
                                                                                                                                ))
                                                                                                                            )}
                                                                                                                        </select>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3B_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_sub_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3B_sub_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'หมู่ที่'} disabled={showDetail}
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
                                                                                                                    <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_volume', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3B_volume}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'nS3B_page', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.nS3B_page}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'เลขที่'} disabled={showDetail}
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
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.alrO_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'alrO_province', e.target?.value)}>
                                                                                                                            {provinces && (
                                                                                                                                provinces.map((option, index) => (
                                                                                                                                    <option key={index} value={option}>{option}</option>
                                                                                                                                ))
                                                                                                                            )}
                                                                                                                        </select>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.alrO_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_sub_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.alrO_sub_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'หมู่ที่'} disabled={showDetail}
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
                                                                                                                    <Textbox title={'แปลงเลขที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_plot_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.alrO_plot_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ระวาง ส.ป.ก. ที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_map_sheet', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.alrO_map_sheet}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'เลขที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.alrO_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'alrO_volume', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.alrO_volume}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'หน้า'} disabled={showDetail}
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
                                                                                                                    <Textbox title={'โฉนดที่ดินเลขที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_parcel_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.condO_parcel_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <div className="form-floating form-floating-advance-select mb-3">
                                                                                                                        <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.condO_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'condO_province', e.target?.value)}>
                                                                                                                            {provinces && (
                                                                                                                                provinces.map((option, index) => (
                                                                                                                                    <option key={index} value={option}>{option}</option>
                                                                                                                                ))
                                                                                                                            )}
                                                                                                                        </select>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'อำเภอ'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.condO_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_sub_district', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.condO_sub_district}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <AreaTextbox title={'เนื้อที่'} containerClassname={'mb-3'} disabled={showDetail}
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
                                                                                                                    <Textbox title={'ห้องชุดเลขที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.condO_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ชั้นที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_floor', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.condO_floor}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'อาคารเลขที่'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_building_no', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.condO_building_no}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ชื่ออาคารชุด'} disabled={showDetail}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'condO_building_name', val)}
                                                                                                                        containerClassname={'mb-3'} value={form?.condO_building_name}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ทะเบียนอาคารชุดเลขที่'} disabled={showDetail}
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
                                                                                                                        value={form?.promisor} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'contract_recipient', val)}
                                                                                                                        value={form?.contract_recipient} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เนื้อที่ประมาณ'} footer={'ตารางเมตร'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'area_square_meter', val)}
                                                                                                                        value={form?.area_square_meter} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'สูง'} footer={'เมตร'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'high_meter', val)}
                                                                                                                        value={form?.high_meter} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <div className="form-floating form-floating-advance-select ">
                                                                                                                        <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.source_of_wealth} onChange={(e) => handleChangeSeparateCollateral(form.id, 'source_of_wealth', e.target?.value)}>
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
                                                                                                                        value={form?.remark} disabled={showDetail}
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
                                                                                                                        value={form?.labT5_parcel_no} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <div className="form-floating form-floating-advance-select mb-3">
                                                                                                                        <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.labT5_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'labT5_province', e.target?.value)}>
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
                                                                                                                        value={form?.labT5_district} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'labT5_sub_district', val)}
                                                                                                                        value={form?.labT5_sub_district} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'หมู่ที่'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'labT5_village', val)}
                                                                                                                        value={form?.labT5_village} disabled={showDetail}
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
                                                                                                                wa={form?.total_area_sqaure_wa} disabled={showDetail}
                                                                                                            />
                                                                                                        </div>
                                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                            <div className="form-floating form-floating-advance-select ">
                                                                                                                <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                                                <select className="form-select" disabled={showDetail} value={form?.source_of_wealth} onChange={(e) => handleChangeSeparateCollateral(form.id, 'source_of_wealth', e.target?.value)}>
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
                                                                                                                value={form?.remark} disabled={showDetail}
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
                                                                                                                        value={form?.house_no} disabled={showDetail}
                                                                                                                    />
                                                                                                                    <div className="input-group mb-3">
                                                                                                                        <span className="input-group-text" id="Search_id_card">สิ่งปลูกสร้างเลขที่</span>
                                                                                                                        <input className="form-control" type="text" disabled={showDetail} aria-label="รายละเอียดน บ้าน" />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <div className="form-floating form-floating-advance-select mb-3">
                                                                                                                        <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.house_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'house_province', e.target?.value)}>
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
                                                                                                                        value={form?.house_district} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'house_sub_district', val)}
                                                                                                                        value={form?.house_sub_district} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'ตั้งอยู่บนที่ดินเลขที่'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'house_parcel_no', val)}
                                                                                                                        value={form?.house_parcel_no} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textbox title={'ลักษณะสิ่งปลูกสร้าง'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'house_type', val)}
                                                                                                                        value={form?.house_type} disabled={showDetail}
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
                                                                                                                        value={form?.chattel_registration_date} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'ยี่ห้อ'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_brand', val)}
                                                                                                                        value={form?.chattel_brand} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'ประเภท'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_type', val)}
                                                                                                                        value={form?.chattel_type} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เลขทะเบียน'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_registration_no', val)}
                                                                                                                        value={form?.chattel_registration_no} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'ลักษณะ'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_style', val)}
                                                                                                                        value={form?.chattel_style} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เลขตัวรถ'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_vehicle_no', val)}
                                                                                                                        value={form?.chattel_vehicle_no} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'เลขเครื่องยนต์'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_engine_no', val)}
                                                                                                                        value={form?.chattel_engine_no} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'สี'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'chattel_color', val)}
                                                                                                                        value={form?.chattel_color} disabled={showDetail}
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
                                                                                                                        value={form?.name_legal_owner} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textarea title={'ชื่อผู้ครอบครอง'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'name_occupier', val)}
                                                                                                                        value={form?.name_occupier} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                                    <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'remark', val)}
                                                                                                                        value={form?.remark} disabled={showDetail}
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
                                                                                            value={form?.assetType_other} disabled={showDetail}
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
                                                                                                                        value={form?.otheR_volume} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'หน้า'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'otheR_page', val)}
                                                                                                                        value={form?.otheR_page} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <div className="form-floating form-floating-advance-select mb-3">
                                                                                                                        <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                                        <select className="form-select" disabled={showDetail} value={form?.otheR_province ?? provinces[0]} onChange={(e) => handleChangeSeparateCollateral(form.id, 'otheR_province', e.target?.value)}>
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
                                                                                                                        value={form?.otheR_district} disabled={showDetail}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                                    <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                                        handleChange={(val) => handleChangeSeparateCollateral(form.id, 'otheR_sub_district', val)}
                                                                                                                        value={form?.otheR_sub_district} disabled={showDetail}
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
                                                                                                                value={form?.promisor} disabled={showDetail}
                                                                                                            />
                                                                                                        </div>
                                                                                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                            <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                                                handleChange={(val) => handleChangeSeparateCollateral(form.id, 'contract_recipient', val)}
                                                                                                                value={form?.contract_recipient} disabled={showDetail}
                                                                                                            />
                                                                                                        </div>
                                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                            <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                                                                                handleChangeRai={(val) => handleChangeSeparateCollateral(form.id, 'contract_area_rai', val)}
                                                                                                                rai={form?.contract_area_rai}
                                                                                                                handleChangeNgan={(val) => handleChangeSeparateCollateral(form.id, 'contract_area_ngan', val)}
                                                                                                                ngan={form?.contract_area_ngan}
                                                                                                                handleChangeWa={(val) => handleChangeSeparateCollateral(form.id, 'contract_area_sqaure_wa', val)}
                                                                                                                wa={form?.contract_area_sqaure_wa} disabled={showDetail}
                                                                                                            />
                                                                                                        </div>
                                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                            <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                                                                                handleChangeRai={(val) => handleChangeSeparateCollateral(form.id, 'area_transfer_rai', val)}
                                                                                                                rai={form?.area_transfer_rai}
                                                                                                                handleChangeNgan={(val) => handleChangeSeparateCollateral(form.id, 'area_transfer_ngan', val)}
                                                                                                                ngan={form?.area_transfer_ngan}
                                                                                                                handleChangeWa={(val) => handleChangeSeparateCollateral(form.id, 'area_transfer_sqaure_wa', val)}
                                                                                                                wa={form?.area_transfer_sqaure_wa} disabled={showDetail}
                                                                                                            />
                                                                                                        </div>
                                                                                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                            <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                                handleChange={(val) => handleChangeSeparateCollateral(form.id, 'remark', val)}
                                                                                                                value={form?.remark} disabled={showDetail}
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
                            </div>
                        </div>
                        {useAsset && (<>
                        <div className="d-flex justify-content-center">
                        <span className="fw-bold mt-0">คืนโฉนด</span>
                        </div>
                        <div className="row g-2 mt-1">
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <Textbox title={'เลขที่หนังสือยืมคืนโฉนด'} containerClassname={'mb-1'} handleChange={(val) => handleChangeCollateral('returndeed_no', val)} value={collateralDetail?.returndeed_no} disabled={showDetail} />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <DatePicker title={'วันที่หนังสือคืนโฉนด'} 
                                 value={collateralDetail.returndeed_date} 
                                 handleChange={(val) => handleChangeCollateral('returndeed_date', val)} 
                                />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <Textarea title={'หมายเหตุ'} containerClassname={'mb-4'}
                                handleChange={(val) => handleChangeCollateral('returndeed_remark', val)}
                                value={collateralDetail?.returndeed_remark} disabled={showDetail}
                            />
                        </div>
                        </> )}
                    </div> 
                    {/* end แก้ไขรายละเอียดดำเนินการในที่ดิน */}
                    </>)}
                </div>
            </form>
        </>
    );
});
export default survey;