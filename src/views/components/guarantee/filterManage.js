import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getBigDataProvinces,
  getSendAssetDebtManagePolicyNo,
  getSendAssetDebtManagePolicyDate,
} from "@services/api";
import { stringToDateTh } from "@utils";

const Filter = (props) => {
  const { handleSubmit, setLoading } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const [noOp, setNoOp] = useState(null);
  const [dateOp, setDateOp] = useState(null);
  const statusOp = ["โอนแล้ว","ยังไม่โอน"];
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        k_idCard: "",
        name: "",
        loan_province: "",
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
    const resultNo = await getSendAssetDebtManagePolicyNo();
    const resultDate = await getSendAssetDebtManagePolicyDate();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
    } else {
       await setProvOp(null);
    }

    if (resultNo.isSuccess) {
      const temp = resultNo.data.map(item => item.name);
      await setNoOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({debt_management_asset_no: 'all'})
      }))
    } else await setNoOp(null);
    if (resultDate.isSuccess) {
      const temp = resultDate.data.map(item => stringToDateTh(item.name, false));
      await setDateOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({debt_management_asset_date: 'all'})
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
          <Textbox title={'เลขบัตรประชาชน'} handleChange={(val) => onChange('k_idCard', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'ชื่อ-นามสกุล'} handleChange={(val) => onChange('name', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {noOp && (
            <Dropdown 
              title={'เลขที่หนังสือนำส่งจัดการหนี้'} 
              defaultValue={'all'} 
              options={noOp} hasAll
              handleChange={(val) => onChange('debt_management_asset_no', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {dateOp && (
            <Dropdown 
              title={'วันที่หนังสือนำส่งสาขาจัดการหนี้'} 
              defaultValue={'all'} 
              options={dateOp} hasAll
              handleChange={(val) => onChange('debt_management_asset_date', val)}
            />
          )}
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
          {statusOp && (
            <Dropdown 
              title={'สถานะการโอนหลักทรัพย์'} 
              defaultValue={'all'} 
              options={statusOp}
              handleChange={(val) => onChange('transferStatus', val)}
              hasAll />
          )}
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