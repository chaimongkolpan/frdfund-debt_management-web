import axios from "axios";
const url = process.env.API_URL ?? 'http://localhost:8080';
axios.defaults.baseURL = url;
const defaultErrorResponse = { statusCode: 400, isSuccess: false,  data: null };
function SaveAs (blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.setAttribute("download", filename);
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(url);
}

export const cleanData = () => {
  return console.log("clean data");
};
export const login = async (params) => {
  const path = '/login';
  try {
    const result = await axios.post(path, params);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getAlertSide = async () => {
  const path = '/common/alert';
  try {
    const result = await axios.get(path);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
//#region Common
export const getProvinces = async () => {
  const path = '/common/provinces';
  try {
    const result = await axios.get(path);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getCreditors = async (province, type) => {
  const path = '/common/creditors';
  try {
    const result = await axios.get(path, { params: { province, type }});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getCreditorTypes = async (province) => {
  const path = '/common/creditor-types';
  try {
    const result = await axios.get(path, { params: { province }});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getRegisterStatuses = async () => {
  const path = '/common/register-statuses';
  try {
    const result = await axios.get(path);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getDebtStatuses = async () => {
  const path = '/common/debt-statuses';
  try {
    const result = await axios.get(path);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getCheckingStatuses = async () => {
  const path = '/common/checking-statuses';
  try {
    const result = await axios.get(path);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
//#endregion
//#region MakeListNPL
export const getBigDataProvinces = async () => {
  // const path = '/bigdata/provinces';
  const path = '/common/provinces';
  try {
    const result = await axios.get(path);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getBigDataCreditors = async (province, type) => {
  // const path = '/bigdata/creditors';
  const path = '/common/creditors';
  try {
    const result = await axios.get(path, { params: { province, type }});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getBigDataCreditorTypes = async (province) => {
  // const path = '/bigdata/creditor-types';
  const path = '/common/creditor-types';
  try {
    const result = await axios.get(path, { params: { province } });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchBigData = async (filter) => {
  const path = '/bigdata/search';
  try {
    const result = await axios.post(path,filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const addBigData = async (selected) => {
  const path = '/bigdata/add';
  try {
    const result = await axios.post(path,{ data: selected });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeBigData = async (selected) => {
  const path = '/bigdata/remove';
  try {
    const result = await axios.post(path,{ data: selected });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getAddedList = async (params) => {
  const path = '/bigdata/add';
  try {
    const result = await axios.get(path, {params});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const submitListNPL = async (params) => {
  const path = '/bigdata/submit';
  try {
    const result = await axios.post(path, { data: params.data }, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
  }
  return;
};
export const submitListNPLExport = async (params) => {
  const path = '/bigdata/export';
  try {
    const result = await axios.post(path, { data: params.data }, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
  }
  return;
};
//#endregion
//#region Classify
export const importClassify = async (filter) => {
  const path = '/classify/import';
  try {
    const result = await axios.post(path,filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchClassify = async (filter) => {
  const path = '/classify/search';
  try {
    const result = await axios.post(path,filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getFarmerDetailClassify = async (idcard, province, creditor_type) => {
  const path = '/classify/farmer-detail';
  try {
    const result = await axios.get(path, { params: { idcard, province, creditor_type }});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getDebtRegisterDetailClassify = async (idcard, province, creditor_type) => {
  const path = '/classify/debt-register-contracts';
  try {
    const result = await axios.get(path, { params: { idcard, province, creditor_type }});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getDebtManagementAlreadyClassify = async (idcard, province, creditor_type) => {
  const path = '/classify/debt-management-already-contracts';
  try {
    const result = await axios.get(path, { params: { idcard, province, creditor_type }});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getDebtManagementDetailClassify = async (idcard, province, creditor_type) => {
  const path = '/classify/debt-management-contracts';
  try {
    const result = await axios.get(path, { params: { idcard, province, creditor_type }});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const updateDebtManagementDetailClassify = async (param) => {
  const path = '/classify/debt-management-contract';
  try {
    const result = await axios.post(path, param);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getBorrowerClassify = async (idcard, province, creditor_type) => {
  const path = '/classify/borrower';
  try {
    const result = await axios.get(path, { params: { idcard, province, creditor_type }});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const updateBorrowerClassify = async (data) => {
  const path = '/classify/borrower';
  try {
    const result = await axios.post(path, data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const upsertGuarantorClassify = async (data) => {
  const path = '/classify/guarantor';
  try {
    const result = await axios.post(path, data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeGuarantorClassify = async (data) => {
  const path = '/classify/guarantor/remove';
  try {
    const result = await axios.post(path, data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const upsertCollateralClassify = async (data) => {
  const path = '/classify/collateral';
  try {
    const result = await axios.post(path, data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeCollateralClassify = async (data) => {
  const path = '/classify/collateral/remove';
  try {
    const result = await axios.post(path, data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
//#endregion