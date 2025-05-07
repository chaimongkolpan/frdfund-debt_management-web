import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getBigDataProvinces,
  getBigDataCreditors,
  getBigDataCreditorTypes,
  getDebtStatuses,
  getCheckingStatuses,
} from "@services/api";

const DebtRegisterFilterNpa = (props) => {
  const { handleSubmit, setLoading } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  const [statusDebtOp, setStatusDebtOp] = useState(null);
  const [checkingStatusOp, setCheckingStatusOp] = useState(null);
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        idCard: "",
        name: "",
        province: "",
        creditorType: "",
        creditor: "",
        debtStatus: "",
        checkingStatus: "",
        min: 0,
        max: 0,
        ...filter,
        currentPage: 1,
        pageSize: process.env.PAGESIZE
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
          ...({creditorType: temp1[0]})
        }))
        await setCreditorOp(null);
        const resultCreditor = await getBigDataCreditors(val, temp1[0]);
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setFilter((prevState) => ({
            ...prevState,
            ...({creditor: temp2[0]})
          }))
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
      setLoading(false);
    }
    if (key == 'creditorType') {
      setLoading(true);
      await setCreditorOp(null);
      const resultCreditor = await getBigDataCreditors(filter.province, val);
      if (resultCreditor.isSuccess) {
        const temp2 = resultCreditor.data.map(item => item.name);
        await setCreditorOp(temp2);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditor: temp2[0]})
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
    const resultDebtSt = await getDebtStatuses();
    const resultChecking = await getCheckingStatuses();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
      const resultCreditorType = await getBigDataCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: temp1[0]})
        }))
        const resultCreditor = await getBigDataCreditors(null, temp1[0]);
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setFilter((prevState) => ({
            ...prevState,
            ...({creditor: temp2[0]})
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
          <Textbox title={'เลขบัตรประชาชน'} handleChange={(val) => onChange('idCard', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'ชื่อ-นามสกุลเกษตรกร'} handleChange={(val) => onChange('name', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {provOp && (
            <div class="form-floating form-floating-advance-select mb-3">
              <label htmlFor="Search_province">จังหวัด</label>
              <select class="form-select" value={filter?.province} onChange={(e) => onChange('province', e.target?.value)}>
                <option value="all" >ทั้งหมด</option>
                {provOp && (
                  provOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorTypeOp && (
            <div class="form-floating form-floating-advance-select mb-3">
              <label htmlFor="Search_province">ประเภทเจ้าหนี้</label>
              <select class="form-select" value={filter?.creditorType} onChange={(e) => onChange('creditorType', e.target?.value)}>
                {creditorTypeOp && (
                  creditorTypeOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorOp && (
            <div class="form-floating form-floating-advance-select mb-3">
              <label htmlFor="Search_province">สถาบันเจ้าหนี้</label>
              <select class="form-select" value={filter?.creditor} onChange={(e) => onChange('creditor', e.target?.value)}>
                {creditorOp && (
                  creditorOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {statusDebtOp && (
            <div class="form-floating form-floating-advance-select mb-3">
              <label htmlFor="Search_province">สถานะหนี้</label>
              <select class="form-select" value={filter?.debtStatus} onChange={(e) => onChange('debtStatus', e.target?.value)}>
                <option value="all" >ทั้งหมด</option>
                {statusDebtOp && (
                  statusDebtOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {checkingStatusOp && (
            <div class="form-floating form-floating-advance-select mb-3">
              <label htmlFor="Search_province">สถานะสัญญาจำแนกมูลหนี้</label>
              <select class="form-select" value={filter?.checkingStatus} onChange={(e) => onChange('checkingStatus', e.target?.value)}>
                <option value="all" >ทั้งหมด</option>
                {checkingStatusOp && (
                  checkingStatusOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>
        <div className="col-12">
          <div className="row g-3 justify-content-center">
            <div className="col-auto">
              <button className="btn btn-subtle-success me-1 mb-1" type="button" onClick={() => onSubmit()}>ค้นหา</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default DebtRegisterFilterNpa;