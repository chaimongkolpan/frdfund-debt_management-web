import { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
const DropdownSearch = (props) => {
  const { title, placeholder, handleChange, containerClassname, classname, hasAll, defaultValue, options } = props;
  const [val, setValue] = useState(defaultValue ?? null);
  const onChange = (newval) => {
    setValue(newval?.target.value);
    if (handleChange)
      handleChange(newval?.target.value);
  }
  useEffect(() => {
    const choicesInit = () => {
      const { getData } = window.phoenix.utils;
  
      if (window.Choices) {
        const elements = document.querySelectorAll('[data-choices]');
        elements.forEach(item => {
          const userOptions = getData(item, 'options');
          const choices = new window.Choices(item, {
            itemSelectText: '',
            addItems: true,
            allowHTML: true,
            ...userOptions,
            shouldSort: false,
          });
  
          const needsValidation = document.querySelectorAll('.needs-validation');
  
          needsValidation.forEach(validationItem => {
            const selectFormValidation = () => {
              validationItem.querySelectorAll('.choices').forEach(choicesItem => {
                const singleSelect = choicesItem.querySelector(
                  '.choices__list--single'
                );
                const multipleSelect = choicesItem.querySelector(
                  '.choices__list--multiple'
                );
  
                if (choicesItem.querySelector('[required]')) {
                  if (singleSelect) {
                    if (
                      singleSelect
                        .querySelector('.choices__item--selectable')
                        ?.getAttribute('data-value') !== ''
                    ) {
                      choicesItem.classList.remove('invalid');
                      choicesItem.classList.add('valid');
                    } else {
                      choicesItem.classList.remove('valid');
                      choicesItem.classList.add('invalid');
                    }
                  }
                  // ----- for multiple select only ----------
                  if (multipleSelect) {
                    if (choicesItem.getElementsByTagName('option').length) {
                      choicesItem.classList.remove('invalid');
                      choicesItem.classList.add('valid');
                    } else {
                      choicesItem.classList.remove('valid');
                      choicesItem.classList.add('invalid');
                    }
                  }
  
                  // ------ select end ---------------
                }
              });
            };
  
            validationItem.addEventListener('submit', () => {
              selectFormValidation();
            });
  
            item.addEventListener('change', () => {
              selectFormValidation();
            });
          });
  
          return choices;
        });
      }
    };
    choicesInit();
  },[options])
  return (
    <div className={`form-floating form-floating-advance-select ${containerClassname ?? ''}`}>
      <Label>{title}</Label>
      <Input type="select" value={val ?? defaultValue} 
        className={`form-select ${classname ?? ''}`}
        placeholder={placeholder ?? title}
        onChange={(newval) => onChange(newval)} 
        data-choices="data-choices" 
        data-options='{"removeItemButton":true,"placeholder":true}'
      >
        <option value="" selected>กรุณาเลือกข้อมูล...</option>
        {hasAll && (
          <option value="all">ทั้งหมด</option>
        )}
        {options && (
          options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))
        )}
      </Input>
    </div>
  )
};
export default DropdownSearch;