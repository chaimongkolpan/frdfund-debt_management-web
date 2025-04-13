import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import DropZone from "@views/components/input/DropZone";
import { 
  getCreditorTypes,
} from "@services/api";

const ClassifyImportFilter = (props) => {
  const { handleSubmit, succeed, failed, fail_list } = props;
  const [filter, setFilter] = useState({debtType: 'NPL'});
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [clearFile, setClear] = useState(false);
  const listToString = (list) => {
    console.log('list', list, list.join(','))
    if (list && list.length > 0)
      return list.join(',');
    else return "-"
  }
  const onSubmit = async () => {
    if (handleSubmit) {
      const result = await handleSubmit(filter);
      if (result) {
        setClear(true);
        setFilter((prevState) => ({
          ...prevState,
          ...({ file: null })
        }))
      }
    }
  }
  const onChange = (key, val) => {
    setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const onFileChange = (files) => {
    if (files.length > 0)
      setClear(false);
      setFilter((prevState) => ({
        ...prevState,
        ...({ file: files[0]})
      }))
  }
  async function fetchData() {
    const resultCreditorType = await getCreditorTypes();
    if (resultCreditorType.isSuccess) {
      const temp = resultCreditorType.data.map(item => item.name);
      setFilter({
        creditorType: temp[0],
        debtType: 'NPL'
      })
      await setCreditorTypeOp(temp);
    } else await setCreditorTypeOp([]);
    await setIsMounted(true);
  }

  //** ComponentDidMount
  useEffect(() => {
    fetchData();
    return () => console.log('Clear data')
  }, []);
  useEffect(() => {
    if (isMounted) {
      $('<script src="/assets/js/config.js"></script>').appendTo('body');
      $('<script src="/assets/js/phoenix.js"></script>').appendTo('body');
    }
    return () => {}
  }, [isMounted])
  if (!isMounted) {
    return null
  }
  return (
    <>
      <form className="row g-3">
        <div class="col-sm-12 col-md-12 col-lg-6">
          <Dropdown 
            title={'ประเภทจัดการหนี้'} 
            defaultValue={'NPL'} 
            options={["NPL","NPA"]}
            handleChange={(val) => onChange('debtType', val)} 
          />
        </div>
        <div class="col-sm-12 col-md-12 col-lg-6">
          {creditorTypeOp && (
            <Dropdown 
              title={'ประเภทเจ้าหนี้'} 
              defaultValue={creditorTypeOp[0]} 
              options={creditorTypeOp}
              handleChange={(val) => onChange('creditorType', val)}
              />
          )}
        </div>
        <div className="col-12 ">
          <div className="collapse code-collapse" id="single-file-upload-code">
          </div>
          <div className="p-4">
            <DropZone onChange={onFileChange} clearFile={clearFile} />
          </div>
        </div>
        <div className="col-12 gy-6">
          <div className="row g-3 justify-content-center">
            <div className="col-auto">
              <button className="btn btn-subtle-success me-1 mb-1" type="button" onClick={onSubmit}>นำไฟล์เข้าระบบ</button>
            </div>
          </div>
        </div>
        {failed > 0 && (
          <div className="col-12">
            <div className="card text-dark bg-light border-danger"> {/* ถ้านำไฟล์เข้าไม่สำเร็จให้แสดง border-danger และไม่แสดงตาราง*/}
              <div className="card-body">
                <h4 className="card-title text-danger">นำไฟล์เข้าระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลบรรทัดที่ : {listToString(fail_list)}</h4>
              </div>
            </div>
        </div>
        )}
        {(succeed > 0 && failed == 0) && (
          <div className="col-12">
            <div className="card text-dark bg-light border-success"> 
              <div className="card-body">
                <h4 className="card-title text-success-dark">นำไฟล์เข้าระบบสำเร็จ จำนวน {succeed} รายการ</h4>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};
export default ClassifyImportFilter;