import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getBigDataProvinces,
  getBigDataCreditors,
  getBigDataCreditorTypes,
  getDebtManagementPolicyNo,
  getDebtManagementPolicyDate,
} from "@services/api";

const Filter = (props) => {
  const { handleSubmit, setLoading } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  const [noOp, setNoOp] = useState(null);
  const [dateOp, setDateOp] = useState(null);
  const statusOp = ["ตรวจสอบนิติกรรมสัญญา","แก้ไขโอนหลักทรัพย์ (บริหารสินทรัพย์)","นิติกรรมสัญญาสมบูรณ์"];
  const typeOp = ["NPA","NPL"];
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        idCard: "",
        name: "",
        loan_province: "",
        loan_creditor_type: "",
        loan_creditor_name: "",
        debtStatus: "",
        ...filter,
        currentPage: 1,
        pageSize: process.env.PAGESIZE,
        policyStatus: ((filter?.policyStatus == 'all' || !filter?.policyStatus) ? statusOp : [filter?.policyStatus])
      });
    }
  }
  const onChange = async (key, val) => {
    if (key == 'loan_province') {
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
        const resultCreditor = await getBigDataCreditors(val, '');
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
      const resultCreditor = await getBigDataCreditors(filter.loan_province, val);
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
    const resultProv = await getBigDataProvinces();
    const resultNo = await getDebtManagementPolicyNo();
    const resultDate = await getDebtManagementPolicyDate();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
      const resultCreditorType = await getBigDataCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({loan_creditor_type: 'all'})
        }))
        const resultCreditor = await getBigDataCreditors(null, '');
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

    if (resultNo.isSuccess) {
      const temp = resultNo.data.map(item => item.name);
      await setNoOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({debt_management_policy_no: 'all'})
      }))
    } else await setNoOp(null);
    if (resultDate.isSuccess) {
      const temp = resultDate.data.map(item => item.name);
      await setDateOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({debt_management_policy_date: 'all'})
      }))
    } else await setDateOp(null);
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
          {noOp && (
            <Dropdown 
              title={'เลขที่หนังสือนำส่งจัดการหนี้'} 
              defaultValue={'all'} 
              options={noOp} hasAll
              handleChange={(val) => onChange('debt_management_policy_no', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {dateOp && (
            <Dropdown 
              title={'วันที่หนังสือนำส่งสาขาจัดการหนี้'} 
              defaultValue={'all'} 
              options={dateOp} hasAll
              handleChange={(val) => onChange('debt_management_policy_date', val)}
            />
          )}
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
              defaultValue={'all'} 
              options={provOp}
              handleChange={(val) => onChange('loan_province', val)}
              hasAll />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Dropdown 
            title={'ประเภทจัดการหนี้'} 
            defaultValue={'all'} 
            options={typeOp}
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
              options={creditorOp}
              handleChange={(val) => onChange('loan_creditor_name', val)} hasAll
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {statusOp && (
            <Dropdown 
              title={'สถานะนิติกรรมสัญญา'} 
              defaultValue={'all'} 
              options={statusOp}
              handleChange={(val) => onChange('policyStatus', val)}
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
export default Filter;