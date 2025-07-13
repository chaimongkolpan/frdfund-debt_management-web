import { useEffect, useState } from "react";
import { Input, Label }  from "reactstrap";
const Textbox = (props) => {
  const { title, placeholder, handleChange, containerClassname, classname, value, disabled, isNumber, footer } = props;
  const [val, setValue] = useState(value ?? '');
  const onBlur = () => {
    if (isNumber) {
      const newval = val.replace(',','')
      setValue(Number(newval).toLocaleString('en', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }));
      if (handleChange) handleChange(Number(newval));
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
      {footer && (
        <Label className={`input-group-text`}>{footer}</Label>
      )}
    </div>
  )
};
export default Textbox;