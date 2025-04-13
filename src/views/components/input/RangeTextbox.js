import Textbox from "@views/components/input/PlainTextbox";
const RangeTextbox = (props) => {
  const { containerClassname, title, leftTitle, leftPlaceholder, leftHandleChange, leftContainerClassname, leftClassname
    , rightTitle,  rightPlaceholder,  rightHandleChange,  rightContainerClassname,  rightClassname, separator
  } = props;
  return (
    <div className={`input-group ${containerClassname ?? ''}`}>
      <span class="input-group-text">{title}</span>
      <Textbox title={leftTitle} placeholder={leftPlaceholder} handleChange={leftHandleChange} containerClassname={leftContainerClassname} classname={leftClassname} />
      <span className="input-group-text">{separator}</span>
      <Textbox title={rightTitle} placeholder={rightPlaceholder} handleChange={rightHandleChange} containerClassname={rightContainerClassname} classname={rightClassname} />
    </div>
  )
};
export default RangeTextbox;