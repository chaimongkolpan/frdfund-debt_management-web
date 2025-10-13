import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import { 
  getBranchBookNo,
  getBranchBookDate,
} from "@services/api";

const Filter = (props) => {
  const status = 'รอรวบรวมเตรียมนำเสนอ';
  const { handleSubmit, setLoading } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState({});
  const [committeeNoOp, setCommitteeNoOp] = useState(null);
  const [committeeDateOp, setCommitteeDateOp] = useState(null);
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        debtClassifyStatus: status,
        ...filter,
        currentPage: 1,
        pageSize: process.env.VITE_PAGESIZE
      });
    }
  }
  const onChange = async (key, val) => {
    setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  async function fetchData() {
    const resultCommitteeNo = await getBranchBookNo(status);
    const resultCommitteeDate = await getBranchBookDate(status);
    if (resultCommitteeNo.isSuccess) {
      const temp = resultCommitteeNo.data.map(item => item.name);
      await setCommitteeNoOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({branch_proposes_approval_no: temp[0]})
      }))
    } else await setCommitteeNoOp(null);
    if (resultCommitteeDate.isSuccess) {
      const temp = resultCommitteeDate.data.map(item => item.name);
      await setCommitteeDateOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({branch_proposes_approval_date: temp[0]})
      }))
    } else await setCommitteeDateOp(null);
    setIsMounted(true);
  }
  useEffect(() => {
    async function getDate() {
      await setCommitteeDateOp(null);
      const resultCommitteeDate = await getBranchBookDate(status, filter?.branch_proposes_approval_no);
      if (resultCommitteeDate.isSuccess) {
        const temp = resultCommitteeDate.data.map(item => item.name);
        await setCommitteeDateOp(temp);
        await setFilter((prevState) => ({
          ...prevState,
          ...({branch_proposes_approval_date: temp[0]})
        }))
      } else await setCommitteeDateOp(null);
    }
    getDate();
    return () => console.log('Clear data')
  }, [filter?.branch_proposes_approval_no]);

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
              title={'เลขหนังสือ'} 
              containerClassname={'mb-3'} 
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
              containerClassname={'mb-3'} 
              defaultValue={filter?.branch_proposes_approval_date} 
              options={committeeDateOp}
              handleChange={(val) => onChange('branch_proposes_approval_date', val)}
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
export default Filter;