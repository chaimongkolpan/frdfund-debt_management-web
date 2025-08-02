import { useEffect, useState, useRef } from "react";
import { stringToDateTh, spDate, toCurrency } from "@utils";
import Textarea from "@views/components/input/Textarea";
import Textbox from "@views/components/input/Textbox";
import AreaTextbox from "@views/components/input/AreaTextbox";
import DropZone from "@views/components/input/DropZone";
import { Input, Label } from 'reactstrap'
import DatePicker from "@views/components/input/DatePicker";
import EditExpropriation from './editExpropriation';
import ExpropriationPayment from './expropriationPayment';
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
    const [receiveRentForms, setReceiveRentForms] = useState([
       // { id: Date.now(), assetType: '' }, // ชุดแรก default
    ]);
    const [openExpropriationPaymentModal, setOpenExpropriationPaymentModal] = useState(false);
    const [openEditExpropriationModal, setOpenEditExpropriationModal] = useState(false);
    const [titleEditExpropriation, setTitleEditExpropriation] = useState(null);
    const [itemExpropriation, setItemExpropriation] = useState(null);
    const handleAddForm = () => {
        setCollateralForms([...collateralForms, { id: Date.now(), assetType: '' }]);
    };

    const handleRemoveForm = (idToRemove) => {
        setCollateralForms(collateralForms.filter(({ id }) => id !== idToRemove));
    };
    const handleAddReceiveRentForm = () => {
        setReceiveRentForms([...receiveRentForms, { id: Date.now(), assetType: '' }]);
    };

    const handleRemoveReceiveRentForm = (idToRemove) => {
        setReceiveRentForms(receiveRentForms.filter(({ id }) => id !== idToRemove));
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

            const mockData =[{
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
                "borrowdeed_date": "2025-08-02T19:47:53.346Z",
                "borrowdeed_reason": "string",
                "returndeed_no": "string",
                "returndeed_date": "2025-08-02T19:47:53.346Z",
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
              }]
            await setData(mockData);
        }
    }
    const RenderData = (item, index, checked) => {
        return (item && (
            <tr key={index}>
                <td></td>
                <td>
                    <div class="d-flex justify-content-center">
                        <button type="button" class="btn btn-outline-success btn-sm ms-2" id="OpenEditLandRental" onClick={() => handleOpenEditExpropriation(item)}><span class="fas fa-list"></span></button>
                    </div>
                </td>
                <td>
                    <div class="d-flex justify-content-center">
                        <button type="button" class="btn btn-outline-success btn-sm ms-2" id="OpenLandRentalNO" onClick={() => setOpenExpropriationPaymentModal(true)}><span class="fas fa-money-check-alt"></span></button>
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
        if (isView) {
            fetchData();
        } else {
            setDate(new Date())
        }
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
        setOpenEditExpropriationModal(true);
        setTitleEditExpropriation('เพิ่มการเวนคืน');
    }
    const handleOpenEditExpropriation = (item) => {
        setOpenEditExpropriationModal(true);
        setItemExpropriation(item);
        setTitleEditExpropriation('แก้ไขการเวนคืน');

    }
    return (
        <>
            <form>
                <br />
                <div className="row g-3">
                    <div className={`d-flex mb-3 flex-row-reverse`}>
                        <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => addData()}><span className="fas fa-plus fs-8"></span> เพิ่มการเวนคืน</button>
                    </div>
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
            </form>
            <EditExpropriation
                isOpen={openEditExpropriationModal}
                title={titleEditExpropriation}
                policy={policy}
                data={itemExpropriation}
                setModal={() => setOpenEditExpropriationModal(false)}
                onOk={() => {
                    setOpenEditExpropriationModal(false);
                }}
            />
            <ExpropriationPayment
                isOpen={openExpropriationPaymentModal}
                policy={policy}
                onClose={() => setOpenExpropriationPaymentModal(false)}
                onOk={() => {
                    setOpenExpropriationPaymentModal(false);
                }}
                setModal={() =>setOpenExpropriationPaymentModal(false)}
            />
        </>
    );
};
export default PlanPay;