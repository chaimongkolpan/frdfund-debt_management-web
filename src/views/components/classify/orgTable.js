import { useEffect, useState } from "react";
import { 
  getFarmerDetailClassify,
} from "@services/api";
import { stringToDateTh } from "@utils";
const ClassifyOrgTable = (props) => {
  const { idcard, province, creditorType } = props;
  const [data, setData] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="align-middle">{index + 1}</td>
        <td className="align-middle">{item.id_card}</td>
        <td className="align-middle">{item.name_prefix}</td>
        <td className="align-middle">{(item.fullname ?? '')}</td>
        <td className="align-middle">{item.province}</td>
        <td>{item.date_member_first_time ? stringToDateTh(item.date_member_first_time, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.date_submit_debt_register ? stringToDateTh(item.date_submit_debt_register, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.organization_register_round}</td>
        <td>{item.organization_name}</td>
        <td>{item.organization_no}</td>
      </tr>
    ))
  }
  const fetchData = async() => {
    const result = await getFarmerDetailClassify(idcard, province, creditorType);
    if (result.isSuccess) {
      setData(result.farmers)
    } else {
      setData(null)
    }
  }
  useEffect(() => {
    fetchData();
  },[])
  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["id","name","province"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{backgroundColor: '#d9fbd0',border: '#cdd0c7'}}>
              <tr>
                <th rowSpan="2" style={{ minWidth: 30 }}>#</th>
                <th colSpan="7">เกษตรกร</th>
                <th colSpan="2">องค์กร</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>วันที่เป็นสมาชิกองค์กร (ครั้งแรก)</th>
                <th>วันที่ขึ้นทะเบียนองค์กรปัจจุบัน</th>
                <th>รอบองค์กร</th>
                <th>ชื่อองค์กรการเกษตร</th>
                <th>หมายเลของค์กร</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={10}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default ClassifyOrgTable;