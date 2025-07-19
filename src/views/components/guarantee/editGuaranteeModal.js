import { useEffect, useState, useRef } from "react";
import { ToDateDb } from "@utils";
import Textarea from "@views/components/input/Textarea";
import { 
  getProvinces,
  getLegalGuarantor,
  updateLegalGuarantor,
} from "@services/api";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";

const editGuarantee = (props) => {
  const { policy, isView } = props;
  const guarantorRef = useRef(null);
  const [isMounted, setMounted] = useState(false);
  const [guarantors, setGuarantors] = useState(null);
  const [guarantorDetail, setGuarantorDetail] = useState(null);
  const [isOpenGuarantorEdit, setOpenGuarantorEdit] = useState(false);
  const [provinces, setProvOp] = useState(null);
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
    const result = await getLegalGuarantor(policy.id_KFKPolicy);
    if (result.isSuccess) {
      const len = result.guarantors.length;
      await setGuarantors([
        ...result.guarantors,
        ...((policy.loan_amount < 100000 && len < 1) ? [{ guarantor_type: 'ทายาทเกษตรกรสมาชิก' }] : []),
        ...((policy.loan_amount < 100000 && len < 2) ? [{ guarantor_type: 'สมาชิกองค์กรเกษตรกร' }] : []),
        ...((policy.loan_amount >= 100000 && policy.loan_amount < 200000 && len < 3) ? [{ guarantor_type: 'สมาชิกองค์กรเกษตรกร' }] : []),
        ...((policy.loan_amount >= 200000 && policy.loan_amount < 500000 && len < 4) ? [{ guarantor_type: 'สมาชิกองค์กรเกษตรกร' }] : []),
        ...((policy.loan_amount >= 500000 && len < 5) ? [{ guarantor_type: 'สมาชิกองค์กรเกษตรกร' }] : []),
      ])
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
                  <td>{item.guarantor_type}</td>
                  <td>{item.guarantor_idcard}</td>
                  <td>{item.guarantor_name_prefix}</td>
                  <td>{item.fullname}</td>
                  <td>{item.guarantor_type}</td>
                  <td>{item.guarantor_idcard}</td>
                  <td>{item.guarantor_name_prefix}</td>
                  <td>{item.fullname}</td>
                  <td>{item.guarantor_type}</td>
                  <td>{item.guarantor_idcard}</td>
                  <td>{item.guarantor_name_prefix}</td>
                  <td>{item.fullname}</td>
                  <td>{item.guarantor_type}</td>
                  <td>{item.guarantor_idcard}</td>
                  <td>{item.guarantor_name_prefix}</td>
                  <td>{item.fullname}</td>
                  <td></td>
                </tr>
              ))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={6}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <div className="col-sm-12 col-md-12 col-lg-12">
            <Textarea title={'หมายเหตุ'} 
                    // handleChange={(val) => handleChangeDebt('debt_manage_remark', val)} 
                    containerClassname={'mb-3'} 
            />
        </div>
    </>
  );
};
export default editGuarantee;