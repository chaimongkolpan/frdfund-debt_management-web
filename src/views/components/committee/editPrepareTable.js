import { useEffect, useState } from "react";
import { stringToDateTh, toCurrency } from "@utils";
import { Input, Label } from "reactstrap";
import Dropdown from "@views/components/input/DropdownSearch";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import { 
  getCommitteeNo,
  getCommitteeDate,
  getCreditorTypes,
  searchCommitteePrepare,
  cleanData
} from "@services/api";
const EditDataTable = (props) => {
  const { bookNo, setBookNo, bookDate, setBookDate, setEditData } = props;
  const status = 'รอเสนอคณะกรรมการจัดการหนี้';
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({});
  const [committeeNoOp, setCommitteeNoOp] = useState(null);
  const [committeeDateOp, setCommitteeDateOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [coop, setCoop] = useState(true);
  const onSubmit = async () => {
    await setFilter(filter);
    const result = await searchCommitteePrepare({
      ...filter,
      debtClassifyStatus: status,
    });
    if (result.isSuccess) {
      setData(result.data);
      setEditData(result.data);
      setCoop(result.data && result.data[0]?.debt_manage_creditor_type == 'สหกรณ์')
    } else {
      setData(null);
    }
  }
  const onChange = async(key, val) => {
    await setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  async function fetchData() {
    const resultCommitteeNo = await getCommitteeNo(status);
    const resultCommitteeDate = await getCommitteeDate(status);
    const resultCreditorType = await getCreditorTypes(null);
    if (resultCommitteeNo.isSuccess) {
      const temp = resultCommitteeNo.data.map(item => item.name);
      await setCommitteeNoOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({proposal_committee_no: temp[0]})
      }))
    } else await setCommitteeNoOp(null);
    if (resultCommitteeDate.isSuccess) {
      const temp = resultCommitteeDate.data.map(item => item.name);
      await setCommitteeDateOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({proposal_committee_date: temp[0]})
      }))
    } else await setCommitteeDateOp(null);
    if (resultCreditorType.isSuccess) {
      const temp1 = resultCreditorType.data.map(item => item.name);
      await setCreditorTypeOp(temp1);
      await setFilter((prevState) => ({
        ...prevState,
        ...({creditorType: temp1[0]})
      }))
    } else {
      await setCreditorTypeOp(null);
    } 
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="align-middle">{index + 1}</td>
        <td>{item.branch_proposes_approval_no}</td>
        <td>{item.branch_proposes_approval_date ? stringToDateTh(item.branch_proposes_approval_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
        <td>{item.debt_manage_creditor_type}</td>
        <td>{item.debt_manage_creditor_name}</td>
        <td>{item.debt_manage_creditor_province}</td>
        <td>{item.debt_manage_creditor_branch}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{toCurrency(item.debt_manage_outstanding_principal)}</td>
        <td>{toCurrency(item.debt_manage_accrued_interest)}</td>
        <td>{toCurrency(item.debt_manage_fine)}</td>
        <td>{toCurrency(item.debt_manage_litigation_expenses)}</td>
        <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee)}</td>
        {!coop && (
          <>
            <td>{toCurrency(item.debt_manage_insurance_premium)}</td>
            <td>{toCurrency(item.debt_manage_other_expenses)}</td>
          </>
        )}
        <td>{toCurrency(item.debt_manage_total_expenses)}</td>
        <td>{toCurrency(item.debt_manage_total)}</td>
        <td>{item.debt_manage_objective_details}</td>
        <td>{item.debt_manage_status}</td>
        <td>{item.collateral_type}</td>
        <td>{item.collateral_no}</td>
      </tr>
    ))
  }
  useEffect(() => {
    fetchData()
    return cleanData
  },[])
  return (
    <>
      <form className="row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">
          {committeeNoOp && (
            <div className={`form-floating form-floating-advance-select`}>
              <Label>{'ครั้งที่เสนอคณะกรรมการ'}</Label>
              <Input type="select" value={filter?.proposal_committee_no} 
                className={`form-select`}
                placeholder={'ครั้งที่เสนอคณะกรรมการ'}
                onChange={(newval) => onChange('proposal_committee_no', newval.target.value)} 
              >
                {committeeNoOp && (
                  committeeNoOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </Input>
            </div>
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {committeeDateOp && (
            <div className={`form-floating form-floating-advance-select`}>
              <Label>{'วันที่เสนอคณะกรรมการ'}</Label>
              <Input type="select" value={filter?.proposal_committee_date} 
                className={`form-select`}
                placeholder={'วันที่เสนอคณะกรรมการ'}
                onChange={(newval) => onChange('proposal_committee_date', newval.target.value)} 
              >
                {committeeDateOp && (
                  committeeDateOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </Input>
            </div>
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorTypeOp && (
            <div className={`form-floating form-floating-advance-select`}>
              <Label>{'ประเภทเจ้าหนี้'}</Label>
              <Input type="select" value={filter?.creditorType} 
                className={`form-select`}
                placeholder={'ประเภทเจ้าหนี้'}
                onChange={(newval) => onChange('creditorType', newval.target.value)} 
              >
                {creditorTypeOp && (
                  creditorTypeOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </Input>
            </div>
          )}
        </div>
        <div className="col-12">
          <div className="row g-3 justify-content-center">
            <div className="col-auto">
              <button className="btn btn-success me-1 mb-1" type="button" onClick={() => onSubmit()}><span className="fas fa-search"></span> ค้นหา</button>
            </div>
          </div>
        </div>
      </form>
      {(data && data.length > 0) && (
        <div className="row">
          <div class="d-flex">
            <h5><div class="flex-grow-1 ">แก้ไขครั้งที่/วันที่เสนอคณะกรรมการ (ใหม่)</div></h5>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-6">
            <BookNo title={'ครั้งที่เสนอคณะกรรมการ(ใหม่)'} subtitle={'กฟก.'} containerClassname={'mb-3'} handleChange={(val) => setBookNo(val)} value={bookNo} />
          </div>
          <div className="col-sm-12 col-md-12 col-lg-6">
            <DatePicker title={'วันที่เสนอคณะกรรมการ(ใหม่)'}
              value={bookDate} 
              handleChange={(val) => setBookDate(val)} 
            />
          </div>
          <div data-list='{"valueNames":["id","name","province"]}'>
            <div className="table-responsive mx-n1 px-1">
              <table className="table table-sm table-striped table-bordered fs-9 mb-0">
              <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                <tr>
                  <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>#</th>
                  <th colspan="2">สาขาเสนอขออนุมัติ</th>
                  <th colSpan="4">เกษตรกร</th>
                  <th colSpan="4">เจ้าหนี้</th>
                  <th colSpan={coop ? "11" : "13"}>สัญญา</th>
                  <th>หลักทรัพย์ค้ำประกัน</th>
                </tr>
                <tr>
                  <th>เลขที่หนังสือ</th>
                  <th>วันที่หนังสือ</th>
                  <th>เลขบัตรประชาชน</th>
                  <th>คำนำหน้า</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>จังหวัด</th>
                  <th>ประเภทเจ้าหนี้</th>
                  <th>สถาบันเจ้าหนี้</th>
                  <th>จังหวัดเจ้าหนี้</th>
                  <th>สาขาเจ้าหนี้</th>
                  <th>เลขที่สัญญา</th>
                  <th>เงินต้น</th>
                  <th>ดอกเบี้ย</th>
                  <th>ค่าปรับ</th>
                  <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                  <th>ค่าถอนการยึดทรัพย์</th>
                  {!coop && (
                    <>
                      <th>ค่าเบี้ยประกัน</th>
                      <th>ค่าใช้จ่ายอื่นๆ</th>
                    </>
                  )}
                  <th>รวมค่าใช้จ่าย</th>
                  <th>รวมทั้งสิ้น</th>
                  <th>วัตถุประสงค์การกู้</th>
                  <th>สถานะหนี้</th>
                  <th>ประเภทหลักประกัน</th>
                  <th>ประเภทและเลขที่หลักทรัพย์(เลขโฉนด)</th>
                </tr>
              </thead>
                <tbody className="list text-center align-middle">
                  {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                    <tr>
                      <td className="fs-9 text-center align-middle" colSpan={coop ? 23 : 25}>
                        <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default EditDataTable;