import { useEffect, useState, forwardRef } from "react";
import DatePicker from  "react-datepicker";
import th from 'date-fns/locale/th';
import { getMonth, getYear } from "date-fns";
import range from "lodash/range";
import "react-datepicker/dist/react-datepicker.css";
import { stringToDateTh, ToDateEn } from "@utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "react-feather";
const CustomDatePickerInput = forwardRef(({ value, onClick, placeholder }, ref) => {
  const [val, setValue] = useState(value ?? '');
  useEffect(() => {
    setValue(stringToDateTh(value,false,'DD/MM/YYYY'))
  },[value])
  return (
  <div className="custom-datepicker-input-container" style={{ position: 'relative', width: '100%' }}>
    <div className="form-floating">
      <input type="hidden" value={value} ref={ref} />
      <input
        ref={ref}
        className="form-control"
        value={val}
        onClick={onClick}
        placeholder={placeholder}
        style={{ 
          width: '100%',
          height: '36px',
          paddingLeft: '36px',
          paddingTop: '32px'
        }}
      />
      <label className="ps-6" htmlFor="floatingInputStartDate">{placeholder}</label>
      <div 
        style={{ 
          position: 'absolute', 
          left: '12px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}
      >
        <span className="uil uil-calendar-alt text-body-tertiary"></span>
      </div>
    </div>
  </div>
)});
const DatePickerComponent = (props) => {
  const { title, handleChange, containerClassname, value, onBlur } = props;
  const [val, setValue] = useState(value ?? '');
  const [showM, setShowM] = useState(true);
  const [showY, setShowY] = useState(true);
  const ToDate = (date) => {
    if (date) {
      return new Date(date)
    } else return null;
  }
  const onChange = (newval) => {
    setValue(newval);
    if (handleChange) {
      if (newval) {
        // handleChange(new Date(date).toLocaleString("th-TH", { day: "numeric", month: "numeric", year: "numeric" }));
        handleChange(new Date(newval));
      } else handleChange(null);
    }
  }
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const years = range(2535, getYear(new Date()) + 543 + 1, 1);
  const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
  ];

  const style = {
    searchContainer: {
      borderRadius: "10px 10px 0px 0px",
    },
  };
  useEffect(() => {
    setValue(ToDateEn(value))
  },[value])
  return (
    <div className={`form-floating form-floating-advance-select ${containerClassname ?? ''}`}>
      <DatePicker
        className="date-picker-full-width"
        todayButton="วันนี้"
        locale={th}
        selected={ToDate(val)}
        onChange={(date) => onChange(date)}
        onBlur={() => onBlur ? onBlur() : null}
        dateFormat="dd/MM/yyyy"
        placeholderText={title}
        popperClassName="custom-datepicker-popper"
        wrapperClassName="d-flex"
        customInput={<CustomDatePickerInput />}
        renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, decreaseYear, increaseYear }) => (
          <div className="react-datepicker__header">
            <button type="button"
              onClick={decreaseYear}
              className="react-datepicker__navigation react-datepicker__navigation--previous"
            >
              <ChevronsLeft size={24} color="#344054" />
            </button>
            <button type="button"
              onClick={decreaseMonth}
              className="react-datepicker__navigation"
              style={{ left: 20 }}
            >
              <ChevronLeft size={24} color="#344054" />
            </button>
            <span className="react-datepicker__current-month">
              {showM ? (
                <b onClick={() => setShowM(false)}>{new Date(date).toLocaleString("th-TH", { month: "long" })}</b>
              ) : (
                <select
                  className="custom-select-style"
                  value={months[getMonth(date)]}
                  onChange={({ target: { value } }) => {
                      changeMonth(months.indexOf(value))
                      setShowM(true);
                    }
                  }
                  onBlur={() => setShowM(true)}
                >
                  {months.map((option) => (
                      <option key={option} value={option}>
                          {option}
                      </option>
                  ))}
                </select>
              )}
              <span>{'    '}</span>
              {showY ? (
                <b onClick={() => setShowY(false)}>{new Date(date).toLocaleString("th-TH", { year: "numeric" }).replace('พ.ศ. ', '')}</b>
              ) : (
                <select
                  className="custom-select-style"
                  value={getYear(date)}
                  onChange={({ target: { value } }) => {
                      changeYear(value);
                      setShowY(true);
                    }
                  }
                  onBlur={() => setShowY(true)}
                >
                  {years.map((option) => (
                      <option key={option} value={option - 543}>
                          {option}
                      </option>
                  ))}
                </select>
              )}
            </span>

            <button type="button"
              onClick={increaseMonth}
              className="react-datepicker__navigation"
              style={{ right: 20 }}
            >
              <ChevronRight size={24} color="#344054" />
            </button>
            <button type="button"
              onClick={increaseYear}
              className="react-datepicker__navigation react-datepicker__navigation--next"
            >
              <ChevronsRight size={24} color="#344054" />
            </button>
            
          </div>
        )}
        renderDayContents={(day) => (
          <div className="react-datepicker__day-wrapper">
            <div>{day}</div>
          </div>
        )}
        dayClassName={(date) =>
          isToday(date)
            ? "react-datepicker__day--today"
            : date.getDate() === 1 || date.getDate() === 2
            ? "react-datepicker__day--with-dot"
            : undefined
        }
      />
    </div>
  )
};
export default DatePickerComponent;