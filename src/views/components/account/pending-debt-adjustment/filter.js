import { useState } from "react";
import Textbox from "@views/components/input/Textbox";

const Filter = (props) => {
  const { handleSubmit } = props;
  const [filter, setFilter] = useState({});
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        import_filename: "",
        policyNo: "",
        idCard: "",
        name: "",
        status: ["รอดำเนินการ"],
        ...filter,
        currentPage: 1,
        pageSize: process.env.VITE_PAGESIZE,
      });
    }
  }
  const onChange = (key, val) => {
    setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  return (
    <>
      <form className="row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'ชื่อไฟล์นำเข้า'} handleChange={(val) => onChange('import_filename', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'เลขที่นิติกรรมสัญญา'} handleChange={(val) => onChange('policyNo', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'เลขบัตรประชาชน'} handleChange={(val) => onChange('idCard', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'ชื่อ-นามสกุล'} handleChange={(val) => onChange('name', val)} />
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
