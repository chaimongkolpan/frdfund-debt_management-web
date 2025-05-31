import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import DropZone from "@views/components/input/DropZone";
import { 
  getBranchBookNo,
  getBranchBookDate
} from "@services/api";

const FilterResigtration = (props) => {
  const { bookNo, setBookNo, bookDate, setBookDate, files, setFiles } = props;
  const [bookNoOp, setBookNoOp] = useState(null);
  const [bookDateOp, setBookDateOp] = useState(null);
  const [clearFile, setClear] = useState(false);
  const status = 'รอรวบรวมเตรียมนำเสนอ';
  const onFileChange = (files) => {
    if (files.length > 0)
      setClear(false);
      setFiles((prevState) => ([
        ...prevState,
        ...files
      ]))
  }
  async function fetchData() {
    const resultBookNo = await getBranchBookNo(status);
    if (resultBookNo.isSuccess) {
      const temp = resultBookNo.data.map(item => item.name);
      setBookNo(temp[0])
      await setBookNoOp(temp);
    } else await setBookNoOp([]);
  }
  useEffect(() => {
    async function getDate() {
      const resultBookDate = await getBranchBookDate(status, bookNo);
      if (resultBookDate.isSuccess) {
        const temp = resultBookDate.data.map(item => item.name);
        await setBookDate(temp[0])
        await setBookDateOp(temp);
      } else await setBookDateOp([]);
    }
    getDate();
    return () => console.log('Clear data')
  }, [bookNo]);
  useEffect(() => {
    return () => console.log('Clear data')
  }, [bookDate]);
  //** ComponentDidMount
  useEffect(() => {
    fetchData();
    return () => console.log('Clear data')
  }, []);
  return (
    <>
      <form className="row g-3">
        <div class="col-sm-12 col-md-12 col-lg-6">
          {bookNoOp && (
            <Dropdown 
              title={'เลขหนังสือ'} 
              defaultValue={bookNo} 
              options={bookNoOp}
              handleChange={(val) => setBookNo(val)} 
            />
          )}
        </div>
        <div class="col-sm-12 col-md-12 col-lg-6">
          {bookDateOp && (
            <Dropdown 
              title={'วันที่หนังสือ'} 
              defaultValue={bookDate} 
              options={bookDateOp}
              handleChange={(val) => setBookDate(val)}
              />
          )}
        </div>
        <div className="col-12 ">
          <div className="collapse code-collapse" id="single-file-upload-code">
          </div>
          <div className="p-4">
            <DropZone onChange={onFileChange} clearFile={clearFile} accept={{'Custom Files': ['*/*']}} maxFiles={50} />
          </div>
        </div>
      </form>
    </>
  );
};
export default FilterResigtration;