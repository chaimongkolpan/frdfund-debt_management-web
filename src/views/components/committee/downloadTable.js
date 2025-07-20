import { useEffect, useState } from "react";
import { stringToDateTh, toCurrency } from "@utils";
import { Input, Label } from "reactstrap";
import Dropdown from "@views/components/input/DropdownSearch";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import { 
  getCommitteeNo,
  getCommitteeDate,
  searchCommitteePrepare,
  cleanData
} from "@services/api";
const EditDataTable = (props) => {
  const { bookNo, setBookNo, bookDate, setBookDate } = props;
  const status = 'รอเสนอคณะกรรมการจัดการหนี้';
  const [committeeNoOp, setCommitteeNoOp] = useState(null);
  const [committeeDateOp, setCommitteeDateOp] = useState(null);
  async function fetchData() {
    const resultCommitteeNo = await getCommitteeNo("\'รอเสนอคณะกรรมการจัดการหนี้\'");
    const resultCommitteeDate = await getCommitteeDate("\'รอเสนอคณะกรรมการจัดการหนี้\'");
    if (resultCommitteeNo.isSuccess) {
      const temp = resultCommitteeNo.data.map(item => item.name);
      await setCommitteeNoOp(temp);
      await setBookNo(temp[0]);
    } else await setCommitteeNoOp(null);
    if (resultCommitteeDate.isSuccess) {
      const temp = resultCommitteeDate.data.map(item => item.name);
      await setCommitteeDateOp(temp);
      await setBookDate(temp[0]);
    } else await setCommitteeDateOp(null);
  }
  useEffect(() => {
    fetchData()
    return cleanData
  },[])
  return (
    <>
      <form className="row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">
          {committeeNoOp && (
            <div className={`form-floating form-floating-advance-select`}>
              <Label>{'ครั้งที่เสนอคณะกรรมการ'}</Label>
              <Input type="select" value={bookNo} 
                className={`form-select`}
                placeholder={'ครั้งที่เสนอคณะกรรมการ'}
                onChange={(newval) => setBookNo(newval)} 
              >
                {committeeNoOp && (
                  committeeNoOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </Input>
            </div>
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {committeeDateOp && (
            <div className={`form-floating form-floating-advance-select`}>
              <Label>{'วันที่เสนอคณะกรรมการ'}</Label>
              <Input type="select" value={bookDate} 
                className={`form-select`}
                placeholder={'วันที่เสนอคณะกรรมการ'}
                onChange={(newval) => setBookDate(newval)} 
              >
                {committeeDateOp && (
                  committeeDateOp.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))
                )}
              </Input>
            </div>
          )}
        </div>
      </form>
    </>
  );
};
export default EditDataTable;