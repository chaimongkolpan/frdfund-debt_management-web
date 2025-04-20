import { useEffect, useState } from "react";
import { Input, Label }  from "reactstrap";
const AreaTextbox = (props) => {
  const { title, placeholder, handleChangeRai, handleChangeNgan, handleChangeWa, containerClassname, classname, rai, ngan, wa, disabled } = props;
  const [val_rai, setValueRai] = useState(rai ?? '');
  const [val_ngan, setValueNgan] = useState(ngan ?? '');
  const [val_wa, setValueWa] = useState(wa ?? '');
  const onBlur = (type) => {
    if (type == 'rai' && handleChangeRai) handleChangeRai(val_rai);
    if (type == 'ngan' && handleChangeNgan) handleChangeNgan(val_ngan);
    if (type == 'wa' && handleChangeWa) handleChangeWa(val_wa);
  }
  const onChange = async (type, newval) => {
    const new_value = newval?.target.value
    if (type == 'rai') await setValueRai(new_value);
    if (type == 'ngan') await setValueNgan(new_value);
    if (type == 'wa') await setValueWa(new_value);
  }
  useEffect(() => {
    setValueRai(rai)
  },[rai])
  useEffect(() => {
    setValueNgan(ngan)
  },[ngan])
  useEffect(() => {
    setValueWa(wa)
  },[wa])
  return (
    <div className={`input-group ${containerClassname ?? ''}`}>
      <Label className={`input-group-text`}>{title}</Label>
      <Input className={`${classname ?? ''}`} placeholder={placeholder} onChange={(newval) => onChange('rai',newval)} value={val_rai} disabled={disabled} onBlur={() => onBlur('rai')}/>
      <Label className={`input-group-text`}>{'ไร่'}</Label>
      <Input className={`${classname ?? ''}`} placeholder={placeholder} onChange={(newval) => onChange('ngan',newval)} value={val_ngan} disabled={disabled} onBlur={() => onBlur('ngan')}/>
      <Label className={`input-group-text`}>{'งาน'}</Label>
      <Input className={`${classname ?? ''}`} placeholder={placeholder} onChange={(newval) => onChange('wa',newval)} value={val_wa} disabled={disabled} onBlur={() => onBlur('wa')}/>
      <Label className={`input-group-text`}>{'ตารางวา'}</Label>
    </div>
  )
};
export default AreaTextbox;