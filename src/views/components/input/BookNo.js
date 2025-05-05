import { useEffect, useState } from "react";
import { Input }  from "reactstrap";
const BookNo = (props) => {
  const { value, title, subtitle, containerClassname, handleChange } = props;
  const [val, setValue] = useState(null);
  const onBlur = () => {
    if (handleChange) handleChange(val);
  }
  useEffect(() => {
    if (value) {
      setValue(value)
    } else {
      setValue(null)
    }
  },[value])
  return (
    <div className={`input-group ${containerClassname ?? ''}`}>
      <span className="input-group-text">{title}</span>
      <span className="input-group-text">{subtitle}</span>
      <Input onChange={(newval) => setValue(newval.target?.value)} value={val ?? ''} onBlur={() => onBlur()}/>
    </div>
  )
};
export default BookNo;