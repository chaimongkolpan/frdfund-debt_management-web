import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import { 
  getBigDataProvinces,
  getBigDataCreditors,
  getBigDataCreditorTypes,
  getYears,
} from "@services/api";

const Filter = (props) => {
  const nextMonth = new Date(new Date().getTime()+(365*24*3600000));
  const { handleSubmit, setLoading } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const [yearOp, setYearOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  const statusOp = ["แจ้งเตือน","ปกติ","สิ้นสุดสัญญา"];
  const monthOp = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน"
    ,"กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        idcard: "",
        name: "",
        loan_province: "",
        printStatus: "",
        year: (new Date().getFullYear() + 543).toString(),
        month: (new Date().getMonth() + 1).toString(),
        ...filter,
        currentPage: 1,
        pageSize: process.env.VITE_.PAGESIZE,
      });
    }
  }
  const onChange = async (key, val) => {
    if (key == 'province') {
      setLoading(true);
      await setCreditorTypeOp(null);
      const resultCreditorType = await getBigDataCreditorTypes(val);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({loan_creditor_type: 'all'})
        }))
        await setCreditorOp(null);
        const resultCreditor = await getBigDataCreditors(val, 'all');
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setFilter((prevState) => ({
            ...prevState,
            ...({loan_creditor_name: 'all'})
          }))
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
      setLoading(false);
    }
    if (key == 'loan_creditor_type') {
      setLoading(true);
      await setCreditorOp(null);
      const resultCreditor = await getBigDataCreditors(filter.province, val);
      if (resultCreditor.isSuccess) {
        const temp2 = resultCreditor.data.map(item => item.name);
        await setCreditorOp(temp2);
        await setFilter((prevState) => ({
          ...prevState,
          ...({loan_creditor_name: 'all'})
        }))
      } else await setCreditorOp(null);
      setLoading(false);
    }
    setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  async function fetchData() {
    const resultYear = await getYears();
    const resultProv = await getBigDataProvinces();
    if (resultYear.isSuccess) {
      await setYearOp([
        ...([nextMonth.getFullYear() + 543]),
        ...resultYear.data,
      ]);
    } else await setYearOp(null);
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);  if (temp.length == 1) onChange('loan_province', temp[0]);
      const resultCreditorType = await getBigDataCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({loan_creditor_type: 'all'})
        }))
        const resultCreditor = await getBigDataCreditors(null, null);
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setFilter((prevState) => ({
            ...prevState,
            ...({loan_creditor_name: 'all'})
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
          <Textbox title={'เลขบัตรประชาชน'} handleChange={(val) => onChange('idcard', val)} />
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
              handleChange={(val) => onChange('loan_province', val)}
              />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Dropdown 
            title={'ประเภทจัดการหนี้'} 
            defaultValue={'all'} 
            options={['NPL','NPA']}
            handleChange={(val) => onChange('loan_debt_type', val)}
            hasAll />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorTypeOp && (
            <Dropdown 
              title={'ประเภทเจ้าหนี้'} 
              defaultValue={'all'} 
              options={creditorTypeOp} hasAll
              handleChange={(val) => onChange('loan_creditor_type', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorOp && (
            <Dropdown 
              title={'สถาบันเจ้าหนี้'} 
              defaultValue={'all'} 
              options={creditorOp} hasAll
              handleChange={(val) => onChange('loan_creditor_name', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {statusOp && (
            <Dropdown 
              title={'สถานะออกใบแจ้งหนี้'} 
              defaultValue={'all'} 
              options={statusOp}
              handleChange={(val) => onChange('printStatus', val)}
              hasAll />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {yearOp && (
            <Dropdown 
              title={'ปี'} 
              defaultValue={new Date().getFullYear() + 543} 
              options={yearOp}
              handleChange={(val) => onChange('year', val)} />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {yearOp && (
            <Dropdown 
              title={'เดือน'} 
              defaultValue={monthOp[new Date().getMonth()]} 
              options={monthOp}
              handleChange={(val) => onChange('month', (monthOp.indexOf(val) + 1).toString())} />
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