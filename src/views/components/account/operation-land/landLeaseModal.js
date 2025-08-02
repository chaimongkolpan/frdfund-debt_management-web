import { useEffect, useState, useRef } from "react";
import EditLandLease from './editLandLease';
import EditRentPayment from './rentPaymentLandLease';
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
    getRentalDetail
} from "@services/api";

const landLease = (props) => {
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
    const [provinces, setProvOp] = useState(null);
    const [useAsset, setUseAsset] = useState(false);
    const [isAssetChanged, setIsAssetChanged] = useState(false);
    const [isEditLandLease,setIsEditLandLease] = useState(false);
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
    const [collateralForms, setCollateralForms] = useState([
        // { id: Date.now(), assetType: '' }, // ชุดแรก default
    ]);
    const [openEditRentPaymentModal, setOpenEditRentPaymentModal] = useState(false);
    const [openEditLandLeaseModal, setOpenEditLandLeaseModal] = useState(false);
    const [titleEditLandLease, setTitleEditLandLease] = useState(null);
    const [itemLandLease, setItemLandLease] = useState(null);

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
        const result = await getRentalDetail(policy.id_KFKPolicy);
        if (result.isSuccess) {
            await setDate(result.data.policyStartDate)
            await setYear(result.data.numberOfYearPayback)
            await setInstallment(result.data.numberOfPeriodPayback)
            //await setData(result.data);
            await setData([{
                "id_KFKPolicy": 0,
                "policyNO": "string",
                "id_AssetPolicy": 0,
                "id_debt_management": "string",
                "k_idcard": "string",
                "k_name_prefix": "string",
                "k_firstname": "string",
                "k_lastname": "string",
                "loan_province": "string",
                "indexAssetPolicy": "string",
                "collateralOwner": "string",
                "assetType": "string",
                "collateral_no": "string",
                "collateral_sub_district": "string",
                "collateral_district": "string",
                "collateral_province": "string",
                "parceL_no": "string",
                "pre_emption_volume_no": "string",
                "nS3_dealing_file_no": "string",
                "nS3A_no": "string",
                "nS3B_no": "string",
                "alrO_plot_no": "string",
                "condO_parcel_no": "string",
                "labT5_parcel_no": "string",
                "house_no": "string",
                "chattel_engine_no": "string",
                "otheR_volume": "string",
                "parceL_province": "string",
                "pre_emption_province": "string",
                "nS3_province": "string",
                "nS3A_province": "string",
                "nS3B_province": "string",
                "alrO_province": "string",
                "condO_province": "string",
                "labT5_province": "string",
                "house_province": "string",
                "otheR_province": "string",
                "parceL_district": "string",
                "pre_emption_district": "string",
                "nS3_district": "string",
                "nS3A_district": "string",
                "nS3B_district": "string",
                "alrO_district": "string",
                "condO_district": "string",
                "labT5_district": "string",
                "house_district": "string",
                "otheR_district": "string",
                "parceL_sub_district": "string",
                "pre_emption_sub_district": "string",
                "nS3_sub_district": "string",
                "nS3A_sub_district": "string",
                "nS3B_sub_district": "string",
                "alrO_sub_district": "string",
                "condO_sub_district": "string",
                "labT5_sub_district": "string",
                "house_sub_district": "string",
                "otheR_sub_district": "string",
                "contract_area_rai": "string",
                "contract_area_ngan": "string",
                "contract_area_sqaure_wa": 0,
                "borrowdeed_no": "string",
                "borrowdeed_date": "2025-08-02T13:15:22.725Z",
                "borrowdeed_reason": "string",
                "returndeed_no": "string",
                "returndeed_date": "2025-08-02T13:15:22.725Z",
                "returndeed_remark": "string",
                "asset_operations_type": "string",
                "asset_operations_other": "string",
                "req_docu": "string",
                "borrowdeed_docu": "string",
                "approve_docu": "string",
                "results_docu": "string",
                "report_docu": "string",
                "deedBorrowReturn_status": "string",
                "color": "string",
                "assetOperations_type": "string",
                "change_asset": 0,
                "operations_type": "string",
                "id_AssetOperations": 0,
                "separate_asset": 0,
                "id_operations_type": 0,
                "external": 0,
                "license_farmers_docu": "string",
                "id_AssetSurveying": 0,
                "id_AssetRental": 0,
                "asset_operations_name": "string",
                "consent_docu": "string",
                "rental_contract_docu": "string",
                "ack_farmers_docu": "string",
                "contract_rental_date": "string",
                "rental_agency": "string",
                "rental_area_rai": "string",
                "rental_area_ngan": "string",
                "rental_area_sqaure_wa": 0,
                "rental_years_period": "string",
                "rental_start": "string",
                "rental_end": "string",
                "rental_remark": "string"
              }]);
        }
    }
    const handleOpenEditLandLease = (item) => {
        setOpenEditLandLeaseModal(true);
        setItemLandLease(item);

    }
    const RenderData = (item, index, checked) => {
        return (item && (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>
                    <div class="d-flex justify-content-center">
                        <button type="button" class="btn btn-outline-success btn-sm ms-2" id="OpenEditLandRental" onClick={() => handleOpenEditLandLease(item)}><span class="fas fa-list"></span></button>
                    </div>
                </td>
                <td>
                    <div class="d-flex justify-content-center">
                        <button type="button" class="btn btn-outline-success btn-sm ms-2" id="OpenLandRentalNO" onClick={() => setOpenEditRentPaymentModal(true)}><span class="fas fa-money-check-alt"></span></button>
                    </div>
                </td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>
                <td>{item.assetType}</td>

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
    const addLandLeaseModal = () => {
        setOpenEditLandLeaseModal(true);
        setTitleEditLandLease('เพิ่มการเช่า');
    }
    return (
        <>
            <form>
                <br />
                <div className="row g-3">
                    <div className={`d-flex mb-3 flex-row-reverse `}>
                        <button type="button" className="btn btn-primary btn-sm ms-2" onClick={addLandLeaseModal}><span className="fas fa-plus fs-8"></span> เพิ่มการเช่า</button>
                    </div>
                    <div className="table-responsive mx-n1 px-1">
                    <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                        <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0', border: '#cdd0c7' }}>
                            <tr>
                                <th rowSpan="2">#</th>
                                <th colSpan="4">ดำเนินการในที่ดิน</th>
                                <th colSpan="11">หลักประกัน</th>
                            </tr>
                            <tr>
                                <th>รายละเอียด</th>
                                <th>รับเงินค่าเช่า</th>
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
                    </div>
                </div>
            </form>
            <EditLandLease
                isOpen={openEditLandLeaseModal}
                title={titleEditLandLease}
                policy={policy}
                data={itemLandLease}
                setModal={() => setOpenEditLandLeaseModal(false)}
                onOk={() => {
                    setOpenEditLandLeaseModal(false);
                }}
            />
            <EditRentPayment
                isOpen={openEditRentPaymentModal}
                policy={policy}
                onClose={() => setOpenEditRentPaymentModal(false)}
                onOk={() => {
                    setOpenEditRentPaymentModal(false);
                }}
                setModal={() =>setOpenEditRentPaymentModal(false)}
            />
        </>
    );
};
export default landLease;