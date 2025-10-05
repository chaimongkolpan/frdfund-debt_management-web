import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getBigDataProvinces,
  getYears,
} from "@services/api";

const Filter = (props) => {
  const { handleSubmit, setLoading } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const [yearOp, setYearOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        idcard: "",
        name: "",
        loan_province: "",
        region: "",
        year: "",
        month: "",
        debtStatusType: "",
        ...filter,
        currentPage: 1,
        pageSize: process.env.PAGESIZE,
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
    const resultProv = await getBigDataProvinces();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
    } else {
       await setProvOp(null);
    }
    const resultYear = await getYears();
    if (resultYear.isSuccess) {
      await setYearOp(resultYear.data);
    } else {
       await setYearOp(null);
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
          <Dropdown 
            title={'ภาค'} 
            defaultValue={'all'} 
            options={['กลาง','ตะวันออกเฉียงเหนือ','ใต้','เหนือ']}
            handleChange={(val) => onChange('region', val)}
            hasAll />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {provOp && (
            <Dropdown 
              title={'จังหวัด'} 
              defaultValue={provOp.length > 1 ? 'all' : provOp[0]} 
              options={provOp} hasAll={provOp.length > 1}
              handleChange={(val) => onChange('loan_province', val)}  />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {yearOp && (
            <Dropdown 
              title={'ปีงบประมาณ'} 
              defaultValue={'all'} 
              options={yearOp}
              handleChange={(val) => onChange('year', val)}
              hasAll />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Dropdown 
            title={'เดือน'} 
            defaultValue={'all'} 
            options={['1-มกราคม','2-กุมภาพันธ์','3-มีนาคม','4-เมษายน','5-พฤษภาคม','6-มิถุนายน','7-กรกฎาคม','8-สิงหาคม','9-กันยายน','10-ตุลาคม','11-พฤศจิกายน','12-ธันวาคม']}
            handleChange={(val) => onChange('month', val)}
            hasAll />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Dropdown 
            title={'ประเภทสถานะบัญชีลูกหนี้'} 
            defaultValue={'all'} 
            options={['หนี้ปกติ','หนี้ผิดนัด (งวดที่ 1,2)','หนี้ผิดนัด (2 งวดติดต่อกัน)','หนี้ผิดนัด (งวดที่ 3 ขึ้นไป)','หนี้ผิดนัด (3 งวดติดต่อกัน)','ลูกหนี้สิ้นสุดอายุสัญญา','สงสัยจะสูญ']}
            handleChange={(val) => onChange('debtStatusType', val)}
            hasAll />
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