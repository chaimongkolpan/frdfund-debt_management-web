import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getProvinces,
  getBigDataCreditors,
  getBigDataCreditorTypes,
  getDebtStatuses,
  getCheckingStatuses,
  getNpaRoundFilter,
  getNpaCollateralFilter,
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
  const [npaRoundOp, setRoundOp] = useState(null);
  const [collateralOp, setCollateralOp] = useState(null);
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
      const resultCreditorType = await getBigDataCreditorTypes(val);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: "all"})
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
    if (key == 'npaRound') {
      await setCollateralOp(null);
      const resultCollateral = await getNpaCollateralFilter(val);
      if (resultCollateral.isSuccess) {
        const temp = resultCollateral.data.map(item => item.name);
        await setCollateralOp(temp);
        await setFilter((prevState) => ({
          ...prevState,
          ...({collateralNo: 'all'})
        }))
      } else await setCollateralOp(null);
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
    const resultRound = await getNpaRoundFilter();
    const resultCollateral = await getNpaCollateralFilter(null);

    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
      const resultCreditorType = await getBigDataCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: 'all'})
        }))
        const resultCreditor = await getBigDataCreditors(null, 'all');
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
    if (resultRound.isSuccess) {
      const temp = resultRound.data.map(item => item.name);
      await setRoundOp(temp);
    } else await setRoundOp(null);
    if (resultCollateral.isSuccess) {
      const temp = resultCollateral.data.map(item => item.name);
      await setCollateralOp(temp);
    } else await setCollateralOp(null);
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
              handleChange={(val) => onChange('creditorType', val)}
              hasAll />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorOp && (
            <Dropdown 
              title={'สถาบันเจ้าหนี้'} 
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
          {npaRoundOp && (
            <Dropdown 
              title={'รอบ NPA'} 
              defaultValue={'all'} 
              options={npaRoundOp}
              handleChange={(val) => onChange('npaRound', val)}
              hasAll />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {collateralOp && (
            <Dropdown 
              title={'เอกสารสิทธิ์'} 
              defaultValue={'all'} 
              options={collateralOp}
              handleChange={(val) => onChange('collateralNo', val)}
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