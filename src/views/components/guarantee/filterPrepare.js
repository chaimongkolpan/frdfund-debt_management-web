import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getBigDataProvinces,
  getBigDataCreditors,
  getBigDataCreditorTypes,
  getCommitteeNo,
  getCommitteeDate,
} from "@services/api";

const Filter = (props) => {
  const { handleSubmit, setLoading } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  const statusOp = ["โอนแล้ว","ยังไม่โอน"];
  const typeOp = ["NPA","NPL"];
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        k_idCard: "",
        name: "",
        loan_province: "",
        ...filter,
        currentPage: 1,
        pageSize: process.env.VITE_PAGESIZE,
        //  transferStatus: ((filter?.transferStatus == 'all' || !filter?.transferStatus) ? statusOp : [filter?.transferStatus])
      });
    }
  }
  const onChange = async (key, val) => {
    // if (key == 'province') {
    //   setLoading(true);
    //   await setCreditorTypeOp(null);
    //   const resultCreditorType = await getBigDataCreditorTypes(val);
    //   if (resultCreditorType.isSuccess) {
    //     const temp1 = resultCreditorType.data.map(item => item.name);
    //     await setCreditorTypeOp(temp1);
    //     await setFilter((prevState) => ({
    //       ...prevState,
    //       ...({creditorType: 'all'})
    //     }))
    //     await setCreditorOp(null);
    //     const resultCreditor = await getBigDataCreditors(val, '');
    //     if (resultCreditor.isSuccess) {
    //       const temp2 = resultCreditor.data.map(item => item.name);
    //       await setCreditorOp(temp2);
    //       await setFilter((prevState) => ({
    //         ...prevState,
    //         ...({creditor: 'all'})
    //       }))
    //     } else await setCreditorOp(null);
    //   } else {
    //     await setCreditorTypeOp(null);
    //     await setCreditorOp(null);
    //   } 
    //   setLoading(false);
    // }
    // if (key == 'creditorType') {
    //   setLoading(true);
    //   await setCreditorOp(null);
    //   const resultCreditor = await getBigDataCreditors(filter.province, val);
    //   if (resultCreditor.isSuccess) {
    //     const temp2 = resultCreditor.data.map(item => item.name);
    //     await setCreditorOp(temp2);
    //     await setFilter((prevState) => ({
    //       ...prevState,
    //       ...({creditor: 'all'})
    //     }))
    //   } else await setCreditorOp(null);
    //   setLoading(false);
    // }
    setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  async function fetchData() {
    const resultProv = await getBigDataProvinces();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);if (temp.length == 1) onChange('loan_province', temp[0]);
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
    setIsMounted(true);
    setLoading(false);
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
          <Textbox title={'เลขที่นิติกรรมสัญญา'} handleChange={(val) => onChange('policyNo', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'เลขบัตรประชาชน'} handleChange={(val) => onChange('k_idCard', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'ชื่อ-นามสกุล'} handleChange={(val) => onChange('name', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {provOp && (
            <Dropdown 
              title={'จังหวัด'} 
              defaultValue={provOp.length > 1 ? 'all' : provOp[0]} 
              options={provOp} hasAll={provOp.length > 1} hideSel={provOp.length == 1}
              handleChange={(val) => onChange('loan_province', val)} />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Dropdown 
            title={'สถานะการโอนหลักทรัพย์'} 
            defaultValue={'all'} 
            options={statusOp}
            handleChange={(val) => onChange('transferStatus', val)}
            hasAll />
        </div>
        <div className="col-12">
          <div className="row g-3 justify-content-center">
            <div className="col-auto">
              <button className="btn btn-success me-1 mb-1" type="button" onClick={() => onSubmit()}><span class="fas fa-search"></span> ค้นหา</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default Filter;