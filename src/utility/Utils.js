import moment from 'moment';
// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num;

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "");

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
  value,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};
export const toCurrency = (value, digit = 0) => {

  if (!value) return '0.00';
  if (typeof value == 'number')
    return value.toLocaleString();
  if (!isNaN(parseFloat(value)))
    return parseFloat(value).toLocaleString()
  return value;
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: "short", day: "numeric" };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("userData");
export const getUserData = () => JSON.parse(localStorage.getItem("userData"));

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  const prefix_url = process.env.ENVIRONMENT == 'uat' ? '/uat' : ''
  if (userRole === "admin") return prefix_url + '/debt';
  if (userRole === "client") return prefix_url + "/debt";
  return prefix_url + "/login";
};

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
});

export const validateEmail = (email) => {
  return false;
};
export const ToDateEn = (value) => {
  if (typeof value == 'string'){
    if (value.substring(6,8) == '25') {
      return value.substring(0,6) + (parseInt(value.substring(6)) - 543).toString();
    } else {
      return value;
    }
  } else return value;
};
function monthTh(m) {
  if (m == 1) return 'มกราคม';
  if (m == 2) return 'กุมภาพันธ์';
  if (m == 3) return 'มีนาคม';
  if (m == 4) return 'เมษายน';
  if (m == 5) return 'พฤษภาคม';
  if (m == 6) return 'มิถุนายน';
  if (m == 7) return 'กรกฎาคม';
  if (m == 8) return 'สิงหาคม';
  if (m == 9) return 'กันยายน';
  if (m == 10) return 'ตุลาคม';
  if (m == 11) return 'พฤศจิกายน';
  if (m == 12) return 'ธันวาคม';
}
export const spDate = (value, format) => {
  const date = moment(value, format).toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = monthTh(date.getMonth() + 1)
  return `${day} ${month}`;
};
export const stringToDateTh = (value, showTime = true, format) => {
  const date = moment(value, format).toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  let y = date.getFullYear();
  const year = y < 2500 ? y + 543 : y; // แปลงเป็นปี พ.ศ.
  const time = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return showTime
    ? `${day}/${month}/${year} ${time}`
    : `${day}/${month}/${year}`;
};
export const ToDateDb = (value, toThai = false, format) => {
  const date = moment(value, format).toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  let y = date.getFullYear();
  const year = (y < 2500 ? y: y - 543) + (toThai ? 543 : 0);
  return `${year}-${month}-${day}`;
};
export const stringToDateThShort = (value, showTime = true, format) => {
  const date = moment(value, format).toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  let y = date.getFullYear();
  const year = String(y < 2500 ? y + 543 : y).slice(-2); // แปลงเป็นปี พ.ศ.
  const time = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return showTime
    ? `${day}/${month}/${year} ${time}`
    : `${day}/${month}/${year}`;
};

export const formatDateDatatable = (value, showTime = true) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
  const time = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return showTime
    ? `${day}/${month}/${year} ${time}`
    : `${day}/${month}/${year}`;
};

export const saveDate = (value) => {
  const date = moment(value).toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  let y = date.getFullYear();
  const year = (y < 2500 ? y: y - 543) + (toThai ? 543 : 0);
  return `${year}-${month}-${day}`;
};
