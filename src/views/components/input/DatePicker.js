import { useState } from "react";
import { Label }  from "reactstrap";
import DatePicker, { registerLocale } from  "react-datepicker";
import { th } from 'date-fns/locale/th';
import "react-datepicker/dist/react-datepicker.css";
registerLocale('th', th);
const DatePickerComponent = (props) => {
  const { title, placeholder, handleChange, containerClassname, classname, value, disabled } = props;
  const [val, setValue] = useState(value ?? '');
  const onChange = (newval) => {
    setValue(newval);
    if (handleChange)
      handleChange(newval);
  }
  return (
    <div className={`form-floating form-floating-advance-select ${containerClassname ?? ''}`}>
      <Label>{title}</Label>
      <DatePicker className={`form-control ${classname ?? ''}`} placeholder={placeholder} disabled={disabled}
        locale="th"
        selected={val} 
        onChange={(date) => onChange(date)} 
      />
    </div>
  )
};
export default DatePickerComponent;