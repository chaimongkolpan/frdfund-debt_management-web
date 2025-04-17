import { useState } from "react";
import { Input, Label }  from "reactstrap";
const Textarea = (props) => {
  const { title, placeholder, handleChange, containerClassname, classname, value, disabled } = props;
  const [val, setValue] = useState(value ?? '');
  const onChange = (newval) => {
    setValue(newval?.target.value);
    if (handleChange)
      handleChange(newval?.target.value);
  }
  return (
    <div className={`input-group ${containerClassname ?? ''}`}>
      <Label className={`input-group-text`}>{title}</Label>
      <Input className={`${classname ?? ''}`} type={'textarea'} placeholder={placeholder} onChange={(newval) => onChange(newval)} value={val} disabled={disabled} />
    </div>
  )
};
export default Textarea;