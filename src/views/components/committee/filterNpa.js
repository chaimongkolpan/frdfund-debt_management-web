import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getProvinces,
  getBigDataCreditors,
  getBigDataCreditorTypes,
  getDebtStatuses,
  getBranchBookNoNpa,
  getBranchBookDateNpa,
} from "@services/api";
const SearchFilter = (props) => {
  const { handleSubmit } = props;
  const status = 'รวบรวมเตรียมนำเสนอแล้ว';
  const [isMounted, setIsMounted] = useState(false)
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  const [statusDebtOp, setStatusDebtOp] = useState(null);
  const [committeeNoOp, setCommitteeNoOp] = useState(null);
  const [committeeDateOp, setCommitteeDateOp] = useState(null);
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        idCard: "",
        name: "",
        province: "all",
        creditorType: "all",
        creditor: "all",
        debtStatus: "all",
        checkingStatus: "all",
        ...filter,
        debtClassifyStatus: status,
        currentPage: 1,
        pageSize: process.env.VITE_PAGESIZE
      });
    }
  }
  const onChange = async(key, val) => {
    if (key == 'province') {
      await setCreditorTypeOp(null);
      const resultCreditorType = await getBigDataCreditorTypes(val);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: 'all'})
        }))
        await setCreditorOp(null);
        const resultCreditor = await getBigDataCreditors(val, '');
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setFilter((prevState) => ({
            ...prevState,
            ...({creditor: 'all'})
          }))
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
    }
    if (key == 'creditorType') {
      await setCreditorOp(null);
      const resultCreditor = await getBigDataCreditors(filter.province, val);
      if (resultCreditor.isSuccess) {
        const temp2 = resultCreditor.data.map(item => item.name);
        await setCreditorOp(temp2);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditor: 'all'})
        }))
      } else await setCreditorOp(null);
    }
    if (key == 'creditorType') {
      await setCommitteeDateOp(null);
      const resultCommitteeDate = await getBranchBookDateNpa(status, val);
      if (resultCommitteeDate.isSuccess) {
        const temp = resultCommitteeDate.data.map(item => item.name);
        await setCommitteeDateOp(temp);
        await setFilter((prevState) => ({
          ...prevState,
          ...({branch_proposes_approval_date: temp[0]})
        }))
      } else await setCommitteeDateOp(null);
    }
    setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  async function fetchData() {
    const resultProv = await getProvinces();
    const resultDebtSt = await getDebtStatuses();
    const resultCommitteeNo = await getBranchBookNoNpa(status);
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);if (temp.length == 1) onChange('province', temp[0]);
      const resultCreditorType = await getBigDataCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: 'all'})
        }))
        const resultCreditor = await getBigDataCreditors(null, '');
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setFilter((prevState) => ({
            ...prevState,
            ...({creditor: 'all'})
          }))
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
    } else {
       await setProvOp(null);
       await setCreditorTypeOp(null);
       await setCreditorOp(null);
    }

    if (resultDebtSt.isSuccess) {
      const temp = resultDebtSt.data.map(item => item.name);
      await setStatusDebtOp(temp);
    } else await setStatusDebtOp(null);
    if (resultCommitteeNo.isSuccess) {
      const temp = resultCommitteeNo.data.map(item => item.name);
      await setCommitteeNoOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({branch_proposes_approval_no: temp[0]})
      }));
      const resultCommitteeDate = await getBranchBookDateNpa(status, temp[0]);
      if (resultCommitteeDate.isSuccess) {
        const temp = resultCommitteeDate.data.map(item => item.name);
        await setCommitteeDateOp(temp);
        await setFilter((prevState) => ({
          ...prevState,
          ...({branch_proposes_approval_date: temp[0]})
        }))
      } else await setCommitteeDateOp(null);
    } else await setCommitteeNoOp(null);
    setIsMounted(true);
  }

  //** ComponentDidMount
  useEffect(() => {
    fetchData();
    return () => console.log('Clear data')
  }, []);
  // useEffect(() => {
  //   if (isMounted) {
  //   }
  //   return () => {}
  // }, [isMounted])
  if (!isMounted) {
    return null
  }
  return (
    <>
      <form className="row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'เลขบัตรประชาชน'} handleChange={(val) => onChange('idCard', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'ชื่อ-นามสกุลเกษตรกร'} handleChange={(val) => onChange('name', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {committeeNoOp && (
            <Dropdown 
              title={'เลขหนังสือ'} 
              defaultValue={filter?.branch_proposes_approval_no} 
              options={committeeNoOp}
              handleChange={(val) => onChange('branch_proposes_approval_no', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {committeeDateOp && (
            <Dropdown 
              title={'วันที่หนังสือ'} 
              defaultValue={filter?.branch_proposes_approval_date} 
              options={committeeDateOp}
              handleChange={(val) => onChange('branch_proposes_approval_date', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {provOp && (
            <Dropdown 
              title={'จังหวัด'} 
              defaultValue={provOp.length > 1 ? 'all' : provOp[0]} 
              options={provOp} hasAll={provOp.length > 1} hideSel={provOp.length == 1}
              handleChange={(val) => onChange('province', val)} />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorTypeOp && (
            <Dropdown 
              title={'ประเภทเจ้าหนี้'} 
              defaultValue={'all'} 
              options={creditorTypeOp}
              handleChange={(val) => onChange('creditorType', val)} hasAll
               />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorOp && (
            <Dropdown 
              title={'สถาบันเจ้าหนี้'} 
              defaultValue={'all'} 
              options={creditorOp}
              handleChange={(val) => onChange('creditor', val)} hasAll
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {statusDebtOp && (
            <Dropdown 
              title={'สถานะหนี้'} 
              defaultValue={'all'} 
              options={statusDebtOp}
              handleChange={(val) => onChange('debtStatus', val)}
              hasAll />
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
    </>
  );
};
export default SearchFilter;