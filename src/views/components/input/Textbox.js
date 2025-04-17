import { useEffect, useState } from "react";
import { Input, Label }  from "reactstrap";
const Textbox = (props) => {
  const { title, placeholder, handleChange, containerClassname, classname, value, disabled, isNumber } = props;
  const [val, setValue] = useState(value ?? '');
  const onBlur = () => {
    if (isNumber) {
      setValue(Number(val).toLocaleString('en', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }));
      if (handleChange) handleChange(Number(val));
    } else if (handleChange) handleChange(val);
    
  }
  const onChange = async (newval) => {
    const new_value = newval?.target.value
    await setValue(new_value)
  }
  useEffect(() => {
    if (isNumber) {
      setValue(Number(value).toLocaleString('en', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }));
    } else {
      setValue(value)
    }
  },[value])
  return (
    <div className={`input-group ${containerClassname ?? ''}`}>
      <Label className={`input-group-text`}>{title}</Label>
      <Input className={`${classname ?? ''}`} placeholder={placeholder} onChange={(newval) => onChange(newval)} value={val} disabled={disabled} onBlur={() => onBlur()}/>
    </div>
  )
};
export default Textbox;