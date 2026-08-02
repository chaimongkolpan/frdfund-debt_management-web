import { useEffect, useState, useRef } from "react";
import { ToDateDb, stringToDateTh, toCurrency } from "@utils";
import Textarea from "@views/components/input/Textarea";
import { 
  getProvinces,
  getTransferGuarantee,
  updateLegalGuarantor,
} from "@services/api";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
const returnGuarantee = (props) => {
  const { policy, isView } = props;
  const guarantorRef = useRef(null);
  const [isMounted, setMounted] = useState(false);
  const [guarantors, setGuarantors] = useState(null);
  const [guarantorDetail, setGuarantorDetail] = useState(null);
  const [isOpenGuarantorEdit, setOpenGuarantorEdit] = useState(false);
  const [provinces, setProvOp] = useState(null);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [clearFile, setClear] = useState(false);
  const [files, setFiles] = useState(null);
  const onFileChange = async (files) => {
    if (files.length > 0) {
      await setFiles(files);
      await setClear(false);
    }
  }
  const editGuarantor = async(item) => {
    await setGuarantorDetail(item)
    await setOpenGuarantorEdit(true)
    if (guarantorRef.current) {
      guarantorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  const saveGuarantor = async() => {
    const result = await updateLegalGuarantor({ 
      ...guarantorDetail, 
      id_KFKPolicy: policy.id_KFKPolicy,
      guarantor_birthday: ToDateDb(guarantorDetail.guarantor_birthday)
    });
    if (result.isSuccess) {
      await fetchData();
      await setOpenGuarantorEdit(false)
      await setGuarantorDetail(null)
    }
  }
  const handleChangeGuarantor = async (key, val) => {
    await setGuarantorDetail((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const fetchData = async () => {
    const result = await getTransferGuarantee(policy.id_AssetPolicy, 'ส่งคืนโอนหลักทรัพย์', 'หนังสือส่งคืนโอนหลักทรัพย์');
    if (result.isSuccess) {
      await setGuarantors(result.data);
    } else {
      await setGuarantors(null)
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
  useEffect(() => {},[guarantorRef]);
  useEffect(() => {
    if (!isMounted) {
      fetchData();
      getProvince();
    }
  },[])
  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
              <tr>
              <th colSpan="4">เกษตรกร</th>
                <th colSpan="5">นิติกรรมสัญญา</th>
                <th colSpan="10">หลักทรัพย์</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>ประเภทจัดการหนี้</th>
                <th>วันที่ทำสัญญา</th>
                <th>ยอดเงินตามสัญญา</th>
                <th>จำนวนเงินที่ชดเชย</th>
                <th>สถานะการโอนหลักทรัพย์</th>
                <th>จำนวนวัน</th>
                <th>ประเภทหลักทรัพย์</th>
                <th>หลักทรัพย์เลขที่</th>
                <th>จังหวัด</th>
                <th>อำเภอ</th>
                <th>ตำบล</th>
                <th>ไร่</th>
                <th>งาน</th>
                <th>ตารางวา</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle">
              {(guarantors && guarantors.length > 0) ? (guarantors.map((item,index) => (
                <tr key={index}>
                  <td>{policy.k_idcard}</td>
                  <td>{policy.k_name_prefix}</td>
                  <td>{(policy.k_firstname ?? '') + ' ' + (policy.k_lastname ?? '')}</td>
                  <td>{policy.loan_province}</td>
                  <td>{policy.policyNO}</td>
                  <td>{policy.loan_debt_type}</td>
                  <td>{policy.policyStartDate ? stringToDateTh(policy.policyStartDate, false) : '-'}</td>
                  <td>{toCurrency(policy.loan_amount)}</td>
                  <td>{toCurrency(policy.compensation_amount)}</td>
                  <td>{item.transferStatus}</td>
                  <td>{item.numberOfDay}</td>
                  <td>{item.assetType}</td>
                  <td>{item.collateral_no}</td>
                  <td>{item.collateral_province}</td>
                  <td>{item.collateral_district}</td>
                  <td>{item.collateral_sub_district}</td>
                  <td>{`${item.contract_area_rai ? item.contract_area_rai : 0}`}</td>
                  <td>{`${item.contract_area_ngan ? item.contract_area_ngan : 0}`}</td>
                  <td>{`${item.contract_area_sqaure_wa ? item.contract_area_sqaure_wa : 0}`}</td>
                  <td></td>
                </tr>
              ))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={19}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <div class="row">
      <div class="col-sm-12 col-md-6 col-lg-6 mt-3">
                <Textbox title={'เลขที่หนังสือส่งคืน'} disabled={isView} containerClassname={'mb-3'} value={bookNo} />
              </div>
              <div class="col-sm-12 col-md-6 col-lg-6 mt-3">
                <DatePicker title={'วันที่หนังสือส่งคืน'} value={bookDate} disabled={isView} />
              </div>
              </div>
              <br />
      <div className="col-sm-12 col-md-12 col-lg-12">
            <Textarea title={'หมายเหตุ'} disabled={isView} value={policy?.return_asset_reason ?? ''}
                    // handleChange={(val) => handleChangeDebt('debt_manage_remark', val)} 
                    containerClassname={'mb-3'} 
            />
        </div>
        <br /><br/>
        <div className="col-12">
                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
              </div>
    </>
  );
};
export default returnGuarantee;