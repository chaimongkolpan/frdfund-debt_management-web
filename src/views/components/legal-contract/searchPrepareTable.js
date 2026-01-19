import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency, ToDateDb } from "@utils";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import CustomerModal from "@views/components/modal/customModal";
import { 
  updateLegalPolicyNoPrepare,
} from "@services/api";
const SearchTable = (props) => {
  const [isOpenPolicyNo, setOpenPolicyNo] = useState(false);
  const [policyNo, setPolicyNo] = useState('');
  const [policyDate, setPolicyDate] = useState('');
  const [policy, setPolicy] = useState(null);
  const { result, filter, getData, handleShowDetail, handlePlan, handleAsset, handleGuarantor, handleSpouse, handlePrint, can_action } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>
          <div className="d-flex justify-content-center"> 
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" disabled={!can_action} onClick={() => handleShowPolicyNo(item)}><i className="far fa-edit "></i></button>
          </div>
        </td>
        <td>{item.k_idcard}</td>
        <td>{item.k_name_prefix}</td>
        <td>{(item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
        <td>{item.loan_province}</td>
        <td>{item.loan_creditor_type}</td>
        <td>{item.loan_creditor_name}</td>
        <td>{item.loan_creditor_province}</td>
        <td>{item.loan_creditor_branch}</td>
        <td>{item.policyNO}</td>
        <td>{item.loan_debt_type}</td>
        <td>{item.policyStartDate ? stringToDateTh(item.policyStartDate, false) : '-'}</td>
        <td>{item.numberOfPeriodPayback}</td>
        <td>{item.numberOfYearPayback}</td>
        <td>{toCurrency(item.loan_amount)}</td>
        <td>{toCurrency(item.compensation_amount)}</td>
        <td>{item.policyStatus}</td>
        <td>{`${item.assetCount ? item.assetCount : 0} แปลง`}</td>
        <td>{`${item.guarantorCount ? item.guarantorCount : 0} คน`}</td>
        <td className="align-middle white-space-nowrap text-center pe-0">
          <div className="btn-reveal-trigger position-static">
            <button className="btn btn-phoenix-secondary btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10"></span></button>
            <div className="dropdown-menu dropdown-menu-end py-2">
              <button className="dropdown-item" type="button" onClick={() => handleShowDetail(item)}>รายละเอียดจัดการหนี้</button>
              {can_action && (<button className="dropdown-item" type="button" onClick={() => handlePlan(item)}>แผนการชำระเงินคืน</button>)}
              {can_action && (<button className="dropdown-item" type="button" onClick={() => handleAsset(item)}>หลักทรัพย์ค้ำประกัน</button>)}
              {can_action && (<button className="dropdown-item" type="button" onClick={() => handleGuarantor(item)}>บุคคลค้ำประกัน</button>)}
              {can_action && (<button className="dropdown-item" type="button" onClick={() => handleSpouse(item)}>ข้อมูลคู่สมรส</button>)}
              <button className="dropdown-item" type="button" onClick={() => handlePrint(item)}>ปริ้นนิติกรรมสัญญา</button>
            </div>
          </div>
        </td>
      </tr>
    ))
  }
  const handleShowPolicyNo = async(item) => {
    await setPolicy(item);
    await setPolicyNo(item.policyNO);
    await setPolicyDate(item.policyStartDate ? stringToDateTh(item.policyStartDate, false) : '');
    await setOpenPolicyNo(true);
  }
  const submitPolicyNo = async() => {
    const result = await updateLegalPolicyNoPrepare({
      id_KFKPolicy: policy?.id_KFKPolicy, policyNo, policyDate: ToDateDb(policyDate, false, 'DD/MM/YYYY')
    });
    if (result.isSuccess) {
      await getData(filter);
      await setOpenPolicyNo(false);
    }
  }
  useEffect(() => {
    if(result) {
      setData(result.data);
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage })
    }
    return () => { setData([]) }
  },[result])

  return (
    <>
      <div data-list='{"valueNames":["name","email","age"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th rowSpan="2" style={{ minWidth: 30 }}>#</th>
                <th rowSpan="2">ดำเนินการ</th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="4">เจ้าหนี้</th>
                <th colSpan="8">นิติกรรมสัญญา</th>
                <th colSpan="2">หลักประกัน</th>
                <th rowSpan="2">ดำเนินการ</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>ประเภทเจ้าหนี้</th>
                <th>สถาบันเจ้าหนี้</th>
                <th>จังหวัดเจ้าหนี้</th>
                <th>สาขาเจ้าหนี้</th>
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>ประเภทจัดการหนี้</th>
                <th>วันที่ทำสัญญา</th>
                <th>จำนวนงวด</th>
                <th>จำนวนปี</th>
                <th>ยอดเงินตามสัญญา</th>
                <th>จำนวนเงินที่ชดเชย</th>
                <th>สถานะนิติกรรมสัญญา</th>
                <th>หลักทรัพย์ค้ำประกัน</th>
                <th>บุคคลค้ำประกัน</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={20}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {paging?.total > 0 && (
          <Paging currentPage={paging?.currentPage ?? 0} total={paging?.total ?? 1} totalPage={paging?.totalPage ?? 1} 
            setPage={(page) => getData({ ...filter, currentPage: page })} 
          />
        )}
        <CustomerModal isOpen={isOpenPolicyNo} setModal={setOpenPolicyNo} 
          onOk={() => submitPolicyNo()} 
          title={'แก้ไขเลขที่นิติกรรมสัญญา'} 
          okText={'บันทึก'} size={'lg'}
          onClose={() => { setPolicyNo(''); setOpenPolicyNo(false); }}
          closeText={'ปิด'} centered
        >
          <form>
            <br />
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <Textbox title={'เลขที่นิติกรรมสัญญา'} 
                  handleChange={(val) => setPolicyNo(val)} 
                  containerClassname={'mb-3'} value={policyNo} 
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6">
                <DatePicker title={'วันที่ทำสัญญา'}
                  value={policyDate} 
                  handleChange={(val) => setPolicyDate(val)} 
                />
              </div>
            </div>
          </form>
        </CustomerModal>
      </div>
    </>
  );
};
export default SearchTable;