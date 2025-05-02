import { useEffect, useState } from "react";
import DatePicker from "@views/components/input/DatePicker";
import moment from 'moment';
import { stringToDateThShort } from "@utils";
import { Input }  from "reactstrap";
const NpaRoundText = (props) => {
  const { value, containerClassname, handleChange } = props;
  const [val, setValue] = useState(null);
  const [date, setDate] = useState(null);
  const onBlur = () => {
    console.log('round',val,date)
    // if (handleChange && val && date) handleChange('NPA ' + val + ' (' + stringToDateThShort(date, false, 'DD/MM/YYYY') + ')');
    if (handleChange) handleChange(val);
  }
  useEffect(() => {
    if (value) {
      console.log('round value',value)
      setValue(value)
      // var arr = value.split('(');
      // if (arr.length == 2 ) {
      //   setValue(arr[0].replace('NPA', '').trim())
      //   const tempdate = arr[1].replace(')', '').trim();
      //   setDate(moment(tempdate, 'DD/MM/YYYY', 'th').toDate())
      // } else {
      //   setValue(null)
      //   setDate(null)
      // }
    } else {
      setValue(null)
      setDate(null)
    }
  },[value])
  return (
    <div className={`input-group ${containerClassname ?? ''}`}>
      <span className="input-group-text">รอบ NPA</span>
      <Input onChange={(newval) => setValue(newval.target?.value)} value={val ?? ''} onBlur={() => onBlur()}/>
      {/* <span className="input-group-text">NPA</span>
      <Input onChange={(newval) => setValue(newval.target.value)} value={val} onBlur={() => onBlur()}/>
      <span className="input-group-text">{'('}</span>
      <DatePicker value={date} onBlur={() => onBlur()}
        handleChange={(val) => setDate(val)} 
      />
      <span className="input-group-text">{')'}</span> */}
    </div>
  )
};
export default NpaRoundText;