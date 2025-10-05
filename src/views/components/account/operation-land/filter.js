import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getBigDataProvinces,
} from "@services/api";

const Filter = (props) => {
  const { handleSubmit, setLoading } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const statusOp = ["แจ้งเตือนปิดบัญชี","สัญญาปกติ"];
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
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
    } else {
       await setProvOp(null);
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
          <Textbox title={'ดัชนีจัดเก็บหลักประกัน'} handleChange={(val) => onChange('indexAssetPolicy', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'เจ้าของหลักประกัน'} handleChange={(val) => onChange('collateralowner', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'เลขที่หลักประกัน'} handleChange={(val) => onChange('collateralNumber', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'เลขบัตรประชาชน'} handleChange={(val) => onChange('k_idCard', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'ชื่อ-นามสกุล'} handleChange={(val) => onChange('name', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">    
            <Dropdown 
              title={'จังหวัด'} 
              defaultValue={'all'} 
              options={provOp} hasAll={provOp.length > 1}
              handleChange={(val) => onChange('loan_province', val)} />
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