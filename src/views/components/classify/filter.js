import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getProvinces,
  getCreditors,
  getCreditorTypes,
  getDebtStatuses,
  getCheckingStatuses,
} from "@services/api";
const ClassifySearchFilter = (props) => {
  const { handleSubmit } = props;
  const [isMounted, setIsMounted] = useState(false)
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  const [statusDebtOp, setStatusDebtOp] = useState(null);
  const [checkingStatusOp, setCheckingStatusOp] = useState(null);
  const [errors, setErrors] = useState({
    creditor: null,
    creditorType: null,
  });
  const setError = (key, value) => {
    try {
      setErrors((prevState) => {
        return {
          ...prevState,
          [key]: value,
        };
      });
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmit = () => {
    if (handleSubmit) {
      if (!filter.idCard && !filter.name && !filter.creditor) setError('creditor', 'error');
      if (!filter.idCard && !filter.name && !filter.creditorType) setError('creditorType', 'error');
      if (!filter.idCard && !filter.name && (!filter.creditor || !filter.creditorType)) return;
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
          await setError('creditor', null);
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
    if (key == 'creditor') {
      setError('creditor', null);
    }
    if (key == 'creditorType') {
      await setCreditorOp(null);
      setError('creditorType', null);
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
    const resultChecking = await getCheckingStatuses();

    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
      const resultCreditorType = await getCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: 'all'})
        }))
        const resultCreditor = await getCreditors(null, 'all');
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
    if (resultChecking.isSuccess) {
      const temp = resultChecking.data.map(item => item.name);
      await setCheckingStatusOp(temp);
    } else await setCheckingStatusOp(null);
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
              containerClassname={`${errors?.creditorType ? 'border-error' : ''}`}
              defaultValue={'all'} 
              options={creditorTypeOp}
              handleChange={(val) => onChange('creditorType', val)}
              hasAll />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorOp && (
            <Dropdown 
              title={'สถาบันเจ้าหนี้'} 
              containerClassname={`${errors?.creditor ? 'border-error' : ''}`}
              defaultValue={'all'} 
              options={creditorOp}
              handleChange={(val) => onChange('creditor', val)}
              hasAll />
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
        <div className="col-sm-12 col-md-6 col-lg-6">
          {checkingStatusOp && (
            <Dropdown 
              title={'สถานะสัญญาจำแนกมูลหนี้'} 
              defaultValue={'all'} 
              options={checkingStatusOp}
              handleChange={(val) => onChange('checkingStatus', val)}
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
export default ClassifySearchFilter;