import { useEffect, useState, useRef } from "react";
import Paging from "@views/components/Paging";
import Textbox from "@views/components/input/Textbox";
import AreaTextbox from "@views/components/input/AreaTextbox";
import NpaRoundText from "@views/components/input/NpaRoundText";
import { stringToDateTh } from "@utils";
import { 
  getProvinces,
} from "@services/api";
const DebtRegisterBigDataTable = (props) => {
  const ref = useRef(null);
  const { result, filter, fetchData, handleSubmit } = props;
  const [provOp, setProvOp] = useState(null);
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const [debt, setDebt] = useState(null);
  const onSubmit = async() => {
    if (handleSubmit) await handleSubmit(debt);
    await setDebt(null)
  }
  const handleChangeDebt = async (key, val) => {
    await setDebt((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const selectDebt = async(item) => {
    await setDebt({ 
      ...item, 
      title_document_type: 'โฉนด',
    })
    ref.current.scrollIntoView() 
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="align-middle">{index + 1}</td>
        <td className="align-middle">{item.id_card}</td>
        <td className="align-middle">{item.name_prefix}</td>
        <td className="align-middle">{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td className="align-middle">{item.province}</td>
        <td className="align-middle">{item.date_member_first_time ? stringToDateTh(item.date_member_first_time, false, 'DD/MM/YYYY') : '-'}</td>
        <td className="align-middle">{item.date_member_current ? stringToDateTh(item.date_member_current, false, 'DD/MM/YYYY') : '-'}</td>
        <td className="align-middle">{item.organization_register_round}</td>
        <td className="align-middle">{item.organization_name}</td>
        <td className="align-middle">{item.organization_no}</td>
        <td className="align-middle">{item.debt_register_round}</td>
        <td className="align-middle">{item.date_submit_debt_register ? stringToDateTh(item.date_submit_debt_register, false, 'DD/MM/YYYY') : '-'}</td>
        <td className="align-middle">{item.passed_approval_no}</td>
        <td className="align-middle">{item.passed_approval_date ? stringToDateTh(item.passed_approval_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td className="align-middle">{item.creditor_type}</td>
        <td className="align-middle">{item.creditor_name}</td>
        <td className="align-middle">{item.creditor_province}</td>
        <td className="align-middle">{item.creditor_branch}</td>
        <td className="align-middle">{item.contract_no}</td>
        <td className="align-middle">{item.remaining_principal_contract}</td>
        <td className="align-middle">{item.dept_status}</td>
        <td className="align-middle">{item.collateral_type}</td>
        <td className="align-middle">{item.purpose_loan_contract}</td>
        <td className="align-middle">{item.purpose_type_loan_contract}</td>
        <td className="align-middle">{item.debt_management_audit_status}</td>
        <td classname="align-middle">
          <div className="d-flex justify-content-center"> 
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type="button" onClick={() => selectDebt(item)}><i className="fas fa-plus"></i></button>
          </div>
        </td>
      </tr>
    ))
  }
  async function getFilter() {
    const resultProv = await getProvinces();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
    } else {
       await setProvOp(null);
    }
  }
  useEffect(() => {
    getFilter();
  },[])
  useEffect(() => {
    if(result) {
      setData(result.data);
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage })
    }
    return () => { setData([]) }
  },[result])
  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th rowSpan="2" style={{ minWidth: 30 }}>#</th>
                <th colSpan="7">เกษตรกร</th>
                <th colSpan="2">องค์กร</th>
                <th colSpan="4">ทะเบียนหนี้</th>
                <th colSpan="4">เจ้าหนี้</th>
                <th colSpan="8">สัญญา</th>
              </tr>
              <tr>
                <th className="align-middle text-center" data-sort="name">เลขบัตรประชาชน</th>
                <th className="align-middle text-center" data-sort="email">คำนำหน้า</th>
                <th className="align-middle text-center" data-sort="age">ชื่อ-นามสกุล</th>
                <th className="align-middle text-center" data-sort="age">จังหวัด</th>
                <th className="align-middle text-center" data-sort="email">วันที่เป็นสมาชิก (ครั้งแรก)</th>
                <th className="align-middle text-center" data-sort="email">วันที่ขึ้นทะเบียนองค์กรปัจจุบัน</th>
                <th className="align-middle text-center" data-sort="age">รอบองค์กร</th>
                <th className="align-middle text-center" data-sort="age">ชื่อองค์กรการเกษตร</th>
                <th className="align-middle text-center" data-sort="age">หมายเลของค์กร</th>
                <th className="align-middle text-center" data-sort="age">รอบหนี้</th>
                <th className="align-middle text-center" data-sort="age">วันที่ยื่นขึ้นทะเบียนหนี้</th>
                <th className="align-middle text-center" data-sort="age">ผ่านความเห็นชอบครั้งที่</th>
                <th className="align-middle text-center" data-sort="age">ผ่านความเห็นชอบวันที่</th>
                <th className="align-middle text-center" data-sort="age">ประเภทเจ้าหนี้</th>
                <th className="align-middle text-center" data-sort="age">สถาบันเจ้าหนี้</th>
                <th className="align-middle text-center" data-sort="age">จังหวัดเจ้าหนี้</th>
                <th className="align-middle text-center" data-sort="age">สาขาเจ้าหนี้</th>
                <th className="align-middle text-center" data-sort="age">เลขที่สัญญา</th>
                <th className="align-middle text-center" data-sort="age">เงินต้นคงเหลือตามสัญญา</th>
                <th className="align-middle text-center" data-sort="age">สถานะหนี้</th>
                <th className="align-middle text-center" data-sort="age">ประเภทหลักประกัน</th>
                <th className="align-middle text-center" data-sort="age">วัตถุประสงค์การกู้ตามสัญญา</th>
                <th className="align-middle text-center" data-sort="age">ประเภทวัตถุประสงค์การกู้ตามสัญญา</th>
                <th className="align-middle text-center" data-sort="age">สถานะสัญญาจำแนกมูลหนี้</th>
                <th className="align-middle text-center" data-sort="age">สร้างทะเบียนหนี้ NPA</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={26}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {paging?.total > 0 && (
          <Paging currentPage={paging?.currentPage ?? 0} total={paging?.total ?? 1} totalPage={paging?.totalPage ?? 1} 
            setPage={(page) => fetchData({ ...filter, currentPage: page })} 
          />
        )}
      </div>
      <br />
      {debt && (
        <div ref={ref} className="card-body p-0">
          <div className="p-4 code-to-copy">
            <div className="row">
              <h3 className="text-center mb-4">รายละเอียดทะเบียนหนี้ NPA</h3>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <Textbox title={'เลขบัตรประชาชน'} 
                  containerClassname={'mb-3'} value={debt.id_card} disabled
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <Textbox title={'ชื่อ-นามสกุล'} 
                  containerClassname={'mb-3'} value={(debt.firstname ?? '') + ' ' + (debt.lastname ?? '')} disabled
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <NpaRoundText containerClassname={'mb-3'} value={debt?.npA_round}
                  handleChange={(val) => handleChangeDebt('npA_round', val)}
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <div className="form-floating needs-validation mb-3">
                  <select className="form-select mb-3" value={debt?.title_document_type ?? ''} onChange={(e) => handleChangeDebt('title_document_type', e.target?.value)}>
                    <option value="โฉนด">โฉนด</option>
                    <option value="ตราจอง">ตราจอง</option>
                    <option value="น.ส.3">น.ส.3</option>
                    <option value="น.ส.3 ก">น.ส.3 ก</option>
                    <option value="น.ส.3 ข">น.ส.3 ข</option>
                    <option value="ส.ป.ก.">ส.ป.ก.</option>
                    <option value="หนังสือแสดงกรรมสิทธิ์ห้องชุด">หนังสือแสดงกรรมสิทธิ์ห้องชุด</option>
                    <option value="ภ.ท.บ.5">ภ.ท.บ.5</option>
                    <optgroup label="________________________________________"></optgroup>
                    <option value="บ้าน">บ้าน</option>
                    <option value="สังหาริมทรัพย์">สังหาริมทรัพย์</option>
                    <option value="หุ้น">หุ้น</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                  <label htmlFor="floatingSelectTeam">หลักประกัน</label>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <Textbox title={'อื่นๆโปรดระบุ'} 
                  handleChange={(val) => handleChangeDebt('other', val)} 
                  containerClassname={'mb-3'} value={debt?.other}
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <Textbox title={'หลักประกันเลขที่'} 
                  handleChange={(val) => handleChangeDebt('title_document_no', val)} 
                  containerClassname={'mb-3'} value={debt?.title_document_no}
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <Textbox title={'ตำบล'} 
                  handleChange={(val) => handleChangeDebt('sub_district', val)} 
                  containerClassname={'mb-3'} value={debt?.sub_district}
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <Textbox title={'อำเภอ'} 
                  handleChange={(val) => handleChangeDebt('district', val)} 
                  containerClassname={'mb-3'} value={debt?.district}
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <div className="form-floating form-floating-advance-select mb-3">
                  <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                  <select className="form-select" value={debt?.province} onChange={(e) => handleChangeDebt('province', e.target?.value)}>
                    {provOp && (
                      provOp.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <AreaTextbox title={'เนื้อที่'} containerClassname={'mb-3'}
                  handleChangeRai={(val) => handleChangeDebt('rai', val)} 
                  rai={debt?.rai ?? 0}
                  handleChangeNgan={(val) => handleChangeDebt('ngan', val)} 
                  ngan={debt?.ngan ?? 0}
                  handleChangeWa={(val) => handleChangeDebt('sqaure_wa', val)} 
                  wa={debt?.sqaure_wa ?? 0}
                />
              </div>
            </div>
            <br />
            <div className="d-flex justify-content-center ">
              <button className="btn btn-success" type="button" onClick={() => onSubmit()}>บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DebtRegisterBigDataTable;