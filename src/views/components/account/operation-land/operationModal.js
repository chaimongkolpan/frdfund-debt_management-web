import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
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

const operationLand = forwardRef((props, ref) => {
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
    const [addTile, setAddTitle] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [useAsset, setUseAsset] = useState(false);
    const [isAssetChanged, setIsAssetChanged] = useState(false);
    const [isAssetSplit, setIsAssetSplit] = useState(false);
    const [provinces, setProvOp] = useState(null);
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
        { id: Date.now(), assetType: '' }, // ชุดแรก default
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
    const handleShowDetail = async () =>{
        setShowDetail(true);
    } 
    const handleShowEdit= async () =>{
        setShowEdit(true);
    }
    const onFileChange = async (id, selectedFiles) => {
        if (selectedFiles.length > 0) {
          setFiles((prev) => ({
            ...prev,
            [id]: selectedFiles
          }));
          setClear((prev) => ({
            ...prev,
            [id]: false
          }));
        }
      };
    const fetchData = async () => {
        const result = await getOperationDetail(policy.id_KFKPolicy);
        if (result.isSuccess) {
            await setDate(result.data.policyStartDate)
            await setYear(result.data.numberOfYearPayback)
            await setInstallment(result.data.numberOfPeriodPayback)
            await setData([{
                "id_KFKPolicy": 34747,
                "policyNO": "442566000021",
                "id_debt_management": null,
                "k_idcard": "3440601133405",
                "k_name_prefix": "นาง",
                "k_firstname": " ปภาวรินทร์  ",
                "k_lastname": "ปัดทุม",
                "loan_province": "มหาสารคาม",
                "indexAssetPolicy": null,
                "collateralOwner": null,
                "assetType": "โฉนดที่ดิน",
                "parceL_no": "65307",
                "pre_emption_volume_no": "65307",
                "nS3_dealing_file_no": "65307",
                "nS3A_no": "65307",
                "nS3B_no": "65307",
                "alrO_plot_no": "65307",
                "condO_parcel_no": "65307",
                "labT5_parcel_no": "65307",
                "house_no": "65307",
                "chattel_engine_no": "65307",
                "otheR_volume": "65307",
                "parceL_province": "มหาสารคาม",
                "pre_emption_province": null,
                "nS3_province": null,
                "nS3A_province": null,
                "nS3B_province": null,
                "alrO_province": null,
                "condO_province": null,
                "labT5_province": null,
                "house_province": null,
                "otheR_province": null,
                "parceL_district": "บรบือ",
                "pre_emption_district": null,
                "nS3_district": null,
                "nS3A_district": null,
                "nS3B_district": null,
                "alrO_district": null,
                "condO_district": null,
                "labT5_district": null,
                "house_district": null,
                "otheR_district": null,
                "parceL_sub_district": "หนองจิก",
                "pre_emption_sub_district": null,
                "nS3_sub_district": null,
                "nS3A_sub_district": null,
                "nS3B_sub_district": null,
                "alrO_sub_district": null,
                "condO_sub_district": null,
                "labT5_sub_district": null,
                "house_sub_district": null,
                "otheR_sub_district": null,
                "contract_area_rai": null,
                "contract_area_ngan": null,
                "contract_area_sqaure_wa": null,
                "borrowdeed_no": null,
                "borrowdeed_date": null,
                "borrowdeed_reason": null,
                "returndeed_no": null,
                "returndeed_date": null,
                "returndeed_remark": null,
                "asset_operations_type": null,
                "asset_operations_other": null,
                "req_docu": null,
                "borrowdeed_docu": null,
                "approve_docu": null,
                "results_docu": null,
                "report_docu": null,
                "deedBorrowReturn_status":'ปกติ'
            },{
                "id_KFKPolicy": 34747,
                "policyNO": "442566000021",
                "id_debt_management": null,
                "k_idcard": "3440601133405",
                "k_name_prefix": "นาง",
                "k_firstname": " ปภาวรินทร์  ",
                "k_lastname": "ปัดทุม",
                "loan_province": "มหาสารคาม",
                "indexAssetPolicy": null,
                "collateralOwner": null,
                "assetType": "โฉนดที่ดิน",
                "parceL_no": "65307",
                "pre_emption_volume_no": "65307",
                "nS3_dealing_file_no": "65307",
                "nS3A_no": "65307",
                "nS3B_no": "65307",
                "alrO_plot_no": "65307",
                "condO_parcel_no": "65307",
                "labT5_parcel_no": "65307",
                "house_no": "65307",
                "chattel_engine_no": "65307",
                "otheR_volume": "65307",
                "parceL_province": "มหาสารคาม",
                "pre_emption_province": null,
                "nS3_province": null,
                "nS3A_province": null,
                "nS3B_province": null,
                "alrO_province": null,
                "condO_province": null,
                "labT5_province": null,
                "house_province": null,
                "otheR_province": null,
                "parceL_district": "บรบือ",
                "pre_emption_district": null,
                "nS3_district": null,
                "nS3A_district": null,
                "nS3B_district": null,
                "alrO_district": null,
                "condO_district": null,
                "labT5_district": null,
                "house_district": null,
                "otheR_district": null,
                "parceL_sub_district": "หนองจิก",
                "pre_emption_sub_district": null,
                "nS3_sub_district": null,
                "nS3A_sub_district": null,
                "nS3B_sub_district": null,
                "alrO_sub_district": null,
                "condO_sub_district": null,
                "labT5_sub_district": null,
                "house_sub_district": null,
                "otheR_sub_district": null,
                "contract_area_rai": null,
                "contract_area_ngan": null,
                "contract_area_sqaure_wa": null,
                "borrowdeed_no": null,
                "borrowdeed_date": null,
                "borrowdeed_reason": null,
                "returndeed_no": null,
                "returndeed_date": null,
                "returndeed_remark": null,
                "asset_operations_type": null,
                "asset_operations_other": null,
                "req_docu": null,
                "borrowdeed_docu": null,
                "approve_docu": null,
                "results_docu": null,
                "report_docu": null,
                "deedBorrowReturn_status":null
            },]);
        }
    }
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
                <td>{item.deedBorrowReturn_status}</td>
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
        // if (isView) {
            fetchData();
        // } else {
            // setDate(new Date())
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
                    <div className={`d-flex mb-3 flex-row-reverse ${isView ? 'd-none' : ''}`}>
                        <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => addData()}><span className="fas fa-plus fs-8"></span> เพิ่มดำเนินการในที่ดิน</button>
                    </div>
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
                                <th>ประเภทดำเนินการในที่ดิน</th>
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
                    {/* รายละเอียดดำเนินการในที่ดิน */}
                    {/* { showDetail && (
                    <div className="card shadow-none border my-2" data-component-card="data-component-card">
                        <div className="card-body p-0">
                            <div className="p-3 code-to-copy">
                                <h3 className="text-center">รายละเอียดดำเนินการในที่ดิน</h3><br />
                                <div className="row g-2">
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'ประเภทการดำเนินการในที่ดิน'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={showDetail} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                        <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} handleChange={(val) => setInstallment(val)} value={installment} disabled={showDetail} />
                                    </div>
                                </div>
                                <br />
                                <span className="text-center">เอกสารคำร้อง</span><br />
                            </div>
                        </div>
                    </div>
                    )} */}

                    {/* end รายละเอียดดำเนินการในที่ดิน */}
                    { (showEdit || showDetail ) && (<> {/* start card แก้ไขรายละเอียดดำเนินการในที่ดิน */}
                    <div className="card shadow-none border my-2" data-component-card="data-component-card">
                        <div className="card-body p-0">
                            <div className="p-3 code-to-copy">
                                <h3 className="text-center">{addTile ? 'เพิ่มดำเนินการในที่ดิน': showDetail? 'รายละเอียดดำเนินการในที่ดิน' : 'แก้ไขรายละเอียดดำเนินการในที่ดิน'}</h3><br />
                                <div className="row g-2">
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                        <Textbox title={'ประเภทการดำเนินการในที่ดิน'} containerClassname={'mb-3'}  handleChange={(val) => handleChangeCollateral('chattel_brand', val)}  value={collateralDetail?.chattel_brand} disabled={showDetail} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                        <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} handleChange={(val) => handleChangeCollateral('chattel_brand', val)}  value={collateralDetail?.chattel_brand} disabled={showDetail} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                <span className="text-center fw-bold">เอกสารคำร้อง</span>
                                </div>
                                <br />
                                <div className="col-12 mt-1 mb-3">
                                    <DropZone onChange={(f) => onFileChange('เอกสารคำร้อง', f)} clearFile={clearFile['เอกสารคำร้อง']} accept={'*'} disabled={showDetail}/>
                                </div>
                                <br />
                               
                                <div className='form-switch mb-2 d-flex justify-content-center'>
                                    <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                        <p className='fw-bold mb-0'>ใช้โฉนด</p>
                                        <Input type='switch' id='rtl' name='RTL' onChange={(e) => setUseAsset(e.target.checked)} disabled={showDetail}/>
                                    </div>
                                </div>
                                {useAsset && (<><div className="card shadow-none border my-2" data-component-card="data-component-card">
                                    <div className="card-body p-0">
                                        <div className="p-3 code-to-copy">
                                        <div className="row g-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                            <span className="fw-bold">เอกสารคำร้องขอยืมโฉนด</span><br />
                                            <div className="col-12 mt-3 mb-3">
                                                <DropZone onChange={(f) => onFileChange('เอกสารคำร้องขอยืมโฉนด', f)} clearFile={clearFile['เอกสารคำร้องขอยืมโฉนด']} accept={'*'} disabled={showDetail}/>
                                            </div>
                                            <br />
                                           
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                            <span className="fw-bold">เอกสารบันทึกข้อความที่เลขาอนุมัติ</span><br />
                                            <div className="col-12  mt-3 mb-3">
                                                <DropZone onChange={(f) => onFileChange('เอกสารบันทึกข้อความที่เลขาอนุมัติ', f)} clearFile={clearFile['เอกสารบันทึกข้อความที่เลขาอนุมัติ']} accept={'*'} disabled={showDetail}/>
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
                                                    <Textbox title={'เลขที่หนังสือยืมโฉนด'} containerClassname={'mb-3'} handleChange={(val) => handleChangeCollateral('chattel_brand', val)}  value={collateralDetail?.chattel_brand} disabled={showDetail} />
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                                    <DatePicker title={'วันที่หนังสือยืมโฉนด'} disabled={showDetail}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12 mb-4">
                                                <Textarea title={'เหตุผล'} containerClassname={'mb-3'} handleChange={(val) => handleChangeCollateral('chattel_brand', val)}  value={collateralDetail?.chattel_brand} disabled={showDetail} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>)}
                                <div className="row g-2">
                                <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <span className='fw-bold'>แบบรับทราบผลการดำเนินการ</span>
                                <br />
                                <div className="col-12 mt-3 mb-3">
                                    <DropZone onChange={(f) => onFileChange('แบบรับทราบผลการดำเนินการ', f)} clearFile={clearFile['แบบรับทราบผลการดำเนินการ']} accept={'*'} disabled={showDetail}/>
                                </div><br />
                                
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 mt-3 mb-1">
                                <span className='fw-bold'>บันทึกข้อความรายงานผลการดำเนินการ</span>
                                <br />
                                <div className="col-12 mt-3 mb-3">
                                    <DropZone onChange={(f) => onFileChange('เอกสาบันทึกข้อความรายงานผลการดำเนินการรคำร้อง', f)} clearFile={clearFile['บันทึกข้อความรายงานผลการดำเนินการ']} accept={'*'} disabled={showDetail}/>
                                </div>
                                <br />
                               
                                </div>
                                </div>
                                {useAsset && (
                                <div className='form-switch mb-2 d-flex justify-content-center'>
                                    <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                        <p className='fw-bold mb-0'>เปลี่ยนแปลงหลักทรัพย์</p>
                                        <Input type='switch' id='rtl' name='RTL' onChange={(e) => setIsAssetChanged(e.target.checked)} checked={isAssetChanged} disabled={showDetail}/>
                                    </div>
                                </div> )}
                                {isAssetChanged && (
                                <div className="card shadow-none border my-2" data-component-card="data-component-card">
                                    <div className="card-body p-0">
                                        <div className="p-3 code-to-copy">
                                            <div ref={collateralRef} className="row g-3">
                                                <div className="col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating needs-validation">
                                                        <select className="form-select" value={collateralDetail.assetType} disabled={showDetail} onChange={(e) => handleChangeCollateral('assetType', e.target?.value)}>
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
                                                        <select className="form-select" disabled={showDetail} value={collateralDetail?.collateral_status} onChange={(e) => handleChangeCollateral('collateral_status', e.target?.value)}>
                                                            <option value="โอนได้">โอนได้</option>
                                                            <option value="โอนไม่ได้">โอนไม่ได้</option>
                                                        </select>
                                                        <label htmlFor="floatingSelectTeam">สถานะหลักทรัพย์</label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating needs-validation">
                                                        <select className="form-select" value={collateralDetail?.conditions_cannot_transferred} onChange={(e) => handleChangeCollateral('conditions_cannot_transferred', e.target?.value)} disabled={collateralDetail?.collateral_status == 'โอนได้' || showDetail}>
                                                            <option value="ติดอายัติ(เจ้าหนี้อื่น)">โอติดอายัติ(เจ้าหนี้อื่น)</option>
                                                            <option value="เจ้าของหลักประกันเสียชีวิต">เจ้าของหลักประกันเสียชีวิต</option>
                                                            <option value="ติดข้อกฎหมาย">ติดข้อกฎหมาย</option>
                                                            <option value="ติดจำนองเจ้าหนี้ร่วมของบุคคลอื่น">ติดจำนองเจ้าหนี้ร่วมของบุคคลอื่น</option>
                                                        </select>
                                                        <label htmlFor="floatingSelectTeam">เงื่อนไขโอนไม่ได้</label>
                                                    </div>
                                                </div>

                                                <div className="mb-1">
                                                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                                                        <div className="card-body p-0">
                                                            <div className="p-4 code-to-copy">

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
                                                                                                    handleChange={(val) => handleChangeCollateral('parceL_no', val)}
                                                                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_no}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                    handleChange={(val) => handleChangeCollateral('parceL_volume', val)}
                                                                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_volume}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                    handleChange={(val) => handleChangeCollateral('parceL_page', val)}
                                                                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_page}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                <div className="form-floating form-floating-advance-select ">
                                                                                                    <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail?.parceL_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('parceL_province', e.target?.value)}>
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
                                                                                                <Textbox title={'ระวาง'} disabled={showDetail}
                                                                                                    handleChange={(val) => handleChangeCollateral('parceL_map_sheet', val)}
                                                                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_map_sheet}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                <Textbox title={'เลขที่ดิน'} disabled={showDetail}
                                                                                                    handleChange={(val) => handleChangeCollateral('parceL_parcel_no', val)}
                                                                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_parcel_no}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <Textbox title={'หน้าสำรวจ'} disabled={showDetail}
                                                                                                    handleChange={(val) => handleChangeCollateral('parceL_explore_page', val)}
                                                                                                    containerClassname={'mb-3'} value={collateralDetail?.parceL_explore_page}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <Textbox title={'ตำบล'} disabled={showDetail}
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
                                                                                            value={collateralDetail?.promisor} disabled={showDetail}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                        <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                            handleChange={(val) => handleChangeCollateral('contract_recipient', val)}
                                                                                            value={collateralDetail?.contract_recipient} disabled={showDetail}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                        <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                                                            handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)}
                                                                                            rai={collateralDetail?.contract_area_rai}
                                                                                            handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)}
                                                                                            ngan={collateralDetail?.contract_area_ngan}
                                                                                            handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)}
                                                                                            wa={collateralDetail?.contract_area_sqaure_wa} disabled={showDetail}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                        <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                                                            handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)}
                                                                                            rai={collateralDetail?.area_transfer_rai}
                                                                                            handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)}
                                                                                            ngan={collateralDetail?.area_transfer_ngan}
                                                                                            handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)}
                                                                                            wa={collateralDetail?.area_transfer_sqaure_wa} disabled={showDetail}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                        <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                            handleChange={(val) => handleChangeCollateral('remark', val)}
                                                                                            value={collateralDetail?.remark} disabled={showDetail}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* end card รายละเอียดสารบัญจดทะเบียน */}

                                                                <br />

                                                            </div>
                                                        </div>

                                                        <div className='form-switch mb-2 d-flex justify-content-center'>
                                                            <div className='d-flex flex-row-reverse align-items-center gap-2'>
                                                                <p className='fw-bold mb-0'>แบ่งหลักทรัพย์</p>
                                                                <Input type='switch' id='rtl' name='RTL' onChange={(e) => setIsAssetSplit(e.target.checked)} checked={isAssetSplit}/>
                                                            </div>
                                                        </div>
                                                        {isAssetSplit && !showDetail && (<>
                                                        <div className="d-flex justify-content-center">
                                                            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={handleAddForm}>
                                                                <i className="fas fa-square-plus"></i>
                                                            </button>
                                                        </div>

                                                        {collateralForms.map((form, index) => (
                                                            <div key={form.id} className="mb-1 rounded p-3 position-relative">
                                                                {/* ปุ่มบวก-ลบ */}
                                                                {!showDetail &&(
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
                                                                </div> )}
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
                                                                                                            handleChange={(val) => handleChangeCollateral('parceL_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.parceL_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('parceL_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.parceL_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('parceL_page', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.parceL_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select ">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.parceL_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('parceL_province', e.target?.value)}>
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
                                                                                                        <Textbox title={'ระวาง'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('parceL_map_sheet', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.parceL_map_sheet}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขที่ดิน'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('parceL_parcel_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.parceL_parcel_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'หน้าสำรวจ'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('parceL_explore_page', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.parceL_explore_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'} disabled={showDetail}
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
                                                                                                            handleChange={(val) => handleChangeCollateral('pre_emption_volume_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.pre_emption_volume_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('pre_emption_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.pre_emption_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('pre_emption_page', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.pre_emption_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ระวาง'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('pre_emption_map_sheet', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.pre_emption_map_sheet}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขที่ดิน'} disabled={showDetail}
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
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.pre_emption_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('pre_emption_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeCollateral('pre_emption_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.pre_emption_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'} disabled={showDetail}
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
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.nS3_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'} disabled={showDetail}
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
                                                                                                        <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3_emption_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3_emption_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3_emption_page', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3_emption_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'สารบบเล่ม/เลขที่'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3_dealing_file_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3_dealing_file_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'สารบบหน้า'} disabled={showDetail}
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
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.nS3A_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3A_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3A_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3A_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3A_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3A_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ระวางรูปถ่ายทางออกชื่อ'} disabled={showDetail}
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
                                                                                                        <Textbox title={'เลขที่'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3A_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3A_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เล่มที่'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3A_volume_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3A_volume_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3A_page', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3A_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'เลขที่ดิน'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3A_parcel_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3A_parcel_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หมายเลข'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3A_number', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3A_number}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'แผ่นที่'} disabled={showDetail}
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
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.nS3B_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3B_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3B_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3B_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3B_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3B_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หมู่ที่'} disabled={showDetail}
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
                                                                                                        <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3B_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3B_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'หน้า'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('nS3B_page', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.nS3B_page}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'เลขที่'} disabled={showDetail}
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
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.alrO_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('alrO_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeCollateral('alrO_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.alrO_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('alrO_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.alrO_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'หมู่ที่'} disabled={showDetail}
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
                                                                                                        <Textbox title={'แปลงเลขที่'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('alrO_plot_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.alrO_plot_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ระวาง ส.ป.ก. ที่'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('alrO_map_sheet', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.alrO_map_sheet}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'เลขที่'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('alrO_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.alrO_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เล่ม'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('alrO_volume', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.alrO_volume}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'} disabled={showDetail}
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
                                                                                                            handleChange={(val) => handleChangeCollateral('condO_parcel_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.condO_parcel_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <div className="form-floating form-floating-advance-select mb-3">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.condO_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('condO_province', e.target?.value)}>
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
                                                                                                            handleChange={(val) => handleChangeCollateral('condO_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.condO_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ตำบล'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('condO_sub_district', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.condO_sub_district}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <AreaTextbox title={'เนื้อที่'} containerClassname={'mb-3'} disabled={showDetail}
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
                                                                                                        <Textbox title={'ห้องชุดเลขที่'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('condO_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.condO_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ชั้นที่'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('condO_floor', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.condO_floor}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'อาคารเลขที่'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('condO_building_no', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.condO_building_no}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ชื่ออาคารชุด'} disabled={showDetail}
                                                                                                            handleChange={(val) => handleChangeCollateral('condO_building_name', val)}
                                                                                                            containerClassname={'mb-3'} value={collateralDetail?.condO_building_name}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ทะเบียนอาคารชุดเลขที่'} disabled={showDetail}
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
                                                                                                            value={collateralDetail?.promisor} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('contract_recipient', val)}
                                                                                                            value={collateralDetail?.contract_recipient} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เนื้อที่ประมาณ'} footer={'ตารางเมตร'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('area_square_meter', val)}
                                                                                                            value={collateralDetail?.area_square_meter} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'สูง'} footer={'เมตร'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('high_meter', val)}
                                                                                                            value={collateralDetail?.high_meter} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select ">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
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
                                                                                                            disabled={collateralDetail?.source_of_wealth != 'อื่นๆ' || isView}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('remark', val)}
                                                                                                            value={collateralDetail?.remark} disabled={showDetail}
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
                                                                                                            handleChange={(val) => handleChangeCollateral('labT5_parcel_no', val)}
                                                                                                            value={collateralDetail?.labT5_parcel_no} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select mb-3">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.labT5_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('labT5_province', e.target?.value)}>
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
                                                                                                            value={collateralDetail?.labT5_district} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('labT5_sub_district', val)}
                                                                                                            value={collateralDetail?.labT5_sub_district} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หมู่ที่'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('labT5_village', val)}
                                                                                                            value={collateralDetail?.labT5_village} disabled={showDetail}
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
                                                                                                    wa={collateralDetail?.total_area_sqaure_wa} disabled={showDetail}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                <div className="form-floating form-floating-advance-select ">
                                                                                                    <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                                                                                    <select className="form-select" disabled={showDetail} value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
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
                                                                                                    disabled={collateralDetail?.source_of_wealth != 'อื่นๆ' || isView}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                    handleChange={(val) => handleChangeCollateral('remark', val)}
                                                                                                    value={collateralDetail?.remark} disabled={showDetail}
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
                                                                                                            handleChange={(val) => handleChangeCollateral('house_no', val)}
                                                                                                            value={collateralDetail?.house_no} disabled={showDetail}
                                                                                                        />
                                                                                                        <div className="input-group mb-3">
                                                                                                            <span className="input-group-text" id="Search_id_card">สิ่งปลูกสร้างเลขที่</span>
                                                                                                            <input className="form-control" type="text" disabled={showDetail} aria-label="รายละเอียดน บ้าน" />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select mb-3">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.house_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('house_province', e.target?.value)}>
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
                                                                                                            value={collateralDetail?.house_district} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('house_sub_district', val)}
                                                                                                            value={collateralDetail?.house_sub_district} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตั้งอยู่บนที่ดินเลขที่'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('house_parcel_no', val)}
                                                                                                            value={collateralDetail?.house_parcel_no} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textbox title={'ลักษณะสิ่งปลูกสร้าง'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('house_type', val)}
                                                                                                            value={collateralDetail?.house_type} disabled={showDetail}
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
                                                                                                            handleChange={(val) => handleChangeCollateral('chattel_registration_date', val)}
                                                                                                            value={collateralDetail?.chattel_registration_date} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ยี่ห้อ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('chattel_brand', val)}
                                                                                                            value={collateralDetail?.chattel_brand} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ประเภท'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('chattel_type', val)}
                                                                                                            value={collateralDetail?.chattel_type} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขทะเบียน'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('chattel_registration_no', val)}
                                                                                                            value={collateralDetail?.chattel_registration_no} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ลักษณะ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('chattel_style', val)}
                                                                                                            value={collateralDetail?.chattel_style} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขตัวรถ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('chattel_vehicle_no', val)}
                                                                                                            value={collateralDetail?.chattel_vehicle_no} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'เลขเครื่องยนต์'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('chattel_engine_no', val)}
                                                                                                            value={collateralDetail?.chattel_engine_no} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'สี'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('chattel_color', val)}
                                                                                                            value={collateralDetail?.chattel_color} disabled={showDetail}
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
                                                                                                            value={collateralDetail?.name_legal_owner} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textarea title={'ชื่อผู้ครอบครอง'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('name_occupier', val)}
                                                                                                            value={collateralDetail?.name_occupier} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                        <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('remark', val)}
                                                                                                            value={collateralDetail?.remark} disabled={showDetail}
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
                                                                                handleChange={(val) => handleChangeCollateral('assetType_other', val)}
                                                                                value={collateralDetail?.assetType_other} disabled={showDetail}
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
                                                                                                            value={collateralDetail?.otheR_volume} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'หน้า'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('otheR_page', val)}
                                                                                                            value={collateralDetail?.otheR_page} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <div className="form-floating form-floating-advance-select mb-3">
                                                                                                            <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                                                                                            <select className="form-select" disabled={showDetail} value={collateralDetail?.otheR_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('otheR_province', e.target?.value)}>
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
                                                                                                            value={collateralDetail?.otheR_district} disabled={showDetail}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                        <Textbox title={'ตำบล'} containerClassname={'mb-3'}
                                                                                                            handleChange={(val) => handleChangeCollateral('otheR_sub_district', val)}
                                                                                                            value={collateralDetail?.otheR_sub_district} disabled={showDetail}
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
                                                                                                    value={collateralDetail?.promisor} disabled={showDetail}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                                                                <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'}
                                                                                                    handleChange={(val) => handleChangeCollateral('contract_recipient', val)}
                                                                                                    value={collateralDetail?.contract_recipient} disabled={showDetail}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                                                                                    handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)}
                                                                                                    rai={collateralDetail?.contract_area_rai}
                                                                                                    handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)}
                                                                                                    ngan={collateralDetail?.contract_area_ngan}
                                                                                                    handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)}
                                                                                                    wa={collateralDetail?.contract_area_sqaure_wa} disabled={showDetail}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                                                                                    handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)}
                                                                                                    rai={collateralDetail?.area_transfer_rai}
                                                                                                    handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)}
                                                                                                    ngan={collateralDetail?.area_transfer_ngan}
                                                                                                    handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)}
                                                                                                    wa={collateralDetail?.area_transfer_sqaure_wa} disabled={showDetail}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                                                                <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'}
                                                                                                    handleChange={(val) => handleChangeCollateral('remark', val)}
                                                                                                    value={collateralDetail?.remark} disabled={showDetail}
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
                                            {/* end แก้ไขรายละเอียดดำเนินการในที่ดิน */}



                                        </div>
                                    </div>
                                </div> )}
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                        <span className="fw-bold mt-0">คืนโฉนด</span>
                        </div>
                        <div className="row g-2 mt-1">
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <Textbox title={'เลขที่หนังสือยืมคืนโฉนด'} containerClassname={'mb-1'} handleChange={(val) => setInstallment(val)} value={installment} disabled={showDetail} />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <DatePicker title={'วันที่หนังสือคืนโฉนด'} />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <Textarea title={'หมายเหตุ'} containerClassname={'mb-4'}
                                handleChange={(val) => handleChangeCollateral('remark', val)}
                                value={collateralDetail?.remark} disabled={showDetail}
                            />
                        </div>
                        {/* <div className="col-12 mt-3">
                            <div className="row g-3 justify-content-center">
                                <div className="col-auto">

                                    <button className="btn btn-success me-1 mb-1" type="button" onClick={() => save()}>บันทึก</button>
                                   

                                </div>
                            </div>
                        </div> */}
                    </div>
                    {/* end card แก้ไขรายละเอียดดำเนินการในที่ดิน */}</>)}
                   
                </div>
            </form>
        </>
    );
});
export default operationLand;