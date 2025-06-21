import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import { 
  getCommitteeNo,
  getCommitteeDate,
  getCreditorTypes,
} from "@services/api";
const SearchFilter = (props) => {
  const { handleSubmit } = props;
  const status = 'รอเสนอคณะกรรมการจัดการหนี้';
  const [isMounted, setIsMounted] = useState(false)
  const [filter, setFilter] = useState({});
  const [committeeNoOp, setCommitteeNoOp] = useState(null);
  const [committeeDateOp, setCommitteeDateOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        ...filter,
        // debtClassifyStatus: status,
        currentPage: 1,
        pageSize: process.env.PAGESIZE
      });
    }
  }
  const onChange = async(key, val) => {
    setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  async function fetchData() {
    const resultCommitteeNo = await getCommitteeNo('');
    const resultCommitteeDate = await getCommitteeDate('');
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
          {creditorTypeOp && (
            <Dropdown 
              title={'ประเภทเจ้าหนี้'} 
              defaultValue={creditorTypeOp[0]} 
              options={creditorTypeOp}
              handleChange={(val) => onChange('creditorType', val)}
               />
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