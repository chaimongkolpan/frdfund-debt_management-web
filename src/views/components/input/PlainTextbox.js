import { useState } from "react";
import { Input, Label }  from "reactstrap";
const PlainTextbox = (props) => {
  const { title, placeholder, handleChange, containerClassname, classname } = props;
  const [val, setValue] = useState('');
  const onChange = (newval) => {
    setValue(newval?.target.value);
    if (handleChange)
      handleChange(newval?.target.value);
  }
  return (
    <div className={`form-floating ${containerClassname ?? ''}`}>
      <Input className={`${classname ?? ''}`} placeholder={placeholder ?? title} onChange={(newval) => onChange(newval)} value={val} />
      <Label>{title}</Label>
    </div>
  )
};
export default PlainTextbox;