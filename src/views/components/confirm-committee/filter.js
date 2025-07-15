import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getProvinces,
  getCreditors,
  getCreditorTypes,
  getDebtStatuses,
  getCommitteeNo,
  getCommitteeDate,
} from "@services/api";
const SearchFilter = (props) => {
  const { handleSubmit } = props;
  const status = 'คณะกรรมการจัดการหนี้อนุมัติ';
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
        currentPage: 1,
        pageSize: process.env.PAGESIZE
      });
    }
  }
  const onChange = async(key, val) => {
    if (key == 'province') {
      await setCreditorTypeOp(null);
      const resultCreditorType = await getCreditorTypes(val);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: temp1[0]})
        }))
        await setCreditorOp(null);
        const resultCreditor = await getCreditors(val, temp1[0]);
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
      const resultCreditor = await getCreditors(filter.province, val);
      if (resultCreditor.isSuccess) {
        const temp2 = resultCreditor.data.map(item => item.name);
        await setCreditorOp(temp2);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditor: 'all'})
        }))
      } else await setCreditorOp(null);
    }
    setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  async function fetchData() {
    const resultProv = await getProvinces();
    const resultDebtSt = await getDebtStatuses();
    const resultCommitteeNo = await getCommitteeNo("\'คณะกรรมการจัดการหนี้อนุมัติ\'");
    const resultCommitteeDate = await getCommitteeDate("\'คณะกรรมการจัดการหนี้อนุมัติ\'");
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
      const resultCreditorType = await getCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: temp1[0]}) 
        }))
        const resultCreditor = await getCreditors(null, temp1[0]);
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
              title={'ครั้งที่เสนอคณะกรรมการ'} 
              defaultValue={filter?.proposal_committee_no} 
              options={committeeNoOp}
              handleChange={(val) => onChange('proposal_committee_no', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {committeeDateOp && (
            <Dropdown 
              title={'วันที่เสนอคณะกรรมการ'} 
              defaultValue={filter?.proposal_committee_date} 
              options={committeeDateOp}
              handleChange={(val) => onChange('proposal_committee_date', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {provOp && (
            <Dropdown 
              title={'จังหวัด'} 
              defaultValue={'all'} 
              options={provOp}
              handleChange={(val) => onChange('province', val)}
              hasAll />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorTypeOp && (
            <Dropdown 
              title={'ประเภทเจ้าหนี้'} 
              defaultValue={creditorTypeOp[0]} 
              options={creditorTypeOp}
              handleChange={(val) => onChange('creditorType', val)}
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