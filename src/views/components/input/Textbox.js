import { useState } from "react";
import { Input, Label }  from "reactstrap";
const Textbox = (props) => {
  const { title, placeholder, handleChange, containerClassname, classname } = props;
  const [val, setValue] = useState('');
  const onChange = (newval) => {
    setValue(newval?.target.value);
    if (handleChange)
      handleChange(newval?.target.value);
  }
  return (
    <div className={`input-group ${containerClassname ?? ''}`}>
      <Label className={`input-group-text`}>{title}</Label>
      <Input className={`${classname ?? ''}`} placeholder={placeholder} onChange={(newval) => onChange(newval)} value={val} />
    </div>
  )
};
export default Textbox;