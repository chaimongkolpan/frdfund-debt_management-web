import axios from "axios";
import useJwt from '@src/auth/jwt/useJwt'
const config = useJwt.jwtConfig
const url = process.env.VITE_API_URL ?? (process.env.VITE_ENVIRONMENT == 'develop' 
                                      ? 'https://localhost:7039' : (
                                        process.env.VITE_ENVIRONMENT == 'uat' 
                                        ? 'https://debtinfo.frdfund.org/uat/api' 
                                        : 'https://debtinfo.frdfund.org/api'
                                    ));
axios.defaults.baseURL = url;
/*
axios.defaults.headers.common['Access-Control-Allow-Origin'] = (process.env.VITE_ENVIRONMENT == 'develop' ? 'https://localhost:7039' : 'https://debtinfo.frdfund.org');
axios.defaults.headers.common['access-control-allow-origin'] = (process.env.VITE_ENVIRONMENT == 'develop' ? 'https://localhost:7039' : 'https://debtinfo.frdfund.org');
*/
// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(config.storageTokenKeyName)}`;
// axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem(config.storageTokenKeyName)}`;
axios.interceptors.response.use(response => {
  return response;
}, error => {
  console.log('error', error)
  const currentPath = window.location.pathname;
  const exemptPaths = ['login'];
  const isExempt = exemptPaths.some(path => currentPath.includes(path))
  if (error.status == 401 && !isExempt ) {
    window.location.href = (process.env.VITE_ENVIRONMENT == 'uat' ? '/uat' : '') + '/login';
  }
  return error;
});
const defaultErrorResponse = { statusCode: 400, isSuccess: false, data: null };
function SaveAs(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
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
  const path = "/login";
  try {
    const result = await axios.post(path, params);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getUsers = async (params) => {
  const path = "/users";
  try {
    const result = await axios.get(path, { params: { ...params }});
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getNplCondition = async () => {
  const path = "/npl-condition";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getConstProvince = async () => {
  const path = "/const-province";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateConstProvince = async (params) => {
  const path = "/const-province";
  try {
    const result = await axios.post(path, params);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getAlertSide = async () => {
  const path = "/common/alert";
  try {
    if (process.env.VITE_ENVIRONMENT == 'develop')
      return { isSuccess: true, data: {} }
    else {
      const result = await axios.get(path);
      if (result.status == 200) return result.data;
      else return defaultErrorResponse;
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
//#region Common
export const getYears = async () => {
  try {
    let year = new Date().getFullYear();
    if (year < 2500) year += 543;
    return {
      isSuccess: true,
      data: [...Array(year-2544).keys()].map(i => (year - i).toString())
    };
  } catch (e) {
    console.error("error: year =>", e);
    return defaultErrorResponse;
  }
};
export const getProvinces = async () => {
  const path = "/common/provinces";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    window.location.href = (process.env.VITE_ENVIRONMENT == 'uat' ? '/uat' : '') + '/login';
    return defaultErrorResponse;
  }
};
export const getCreditors = async (province, type) => {
  const path = "/common/creditors";
  try {
    const result = await axios.get(path, { params: { province, type } });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getCreditorTypes = async (province) => {
  const path = "/common/creditor-types";
  try {
    const result = await axios.get(path, { params: { province } });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getRegisterStatuses = async () => {
  const path = "/common/register-statuses";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getDebtStatuses = async () => {
  const path = "/common/debt-statuses";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getCheckingStatuses = async () => {
  const path = "/common/checking-statuses";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
//#endregion
//#region MakeListNPL
export const getBigDataProvinces = async () => {
  const path = '/bigdata/provinces';
  //const path = '/common/provinces';
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    window.location.href = (process.env.VITE_ENVIRONMENT == 'uat' ? '/uat' : '') + '/login';
    return defaultErrorResponse;
  }
};
export const getBigDataCreditors = async (province, type) => {
  const path = '/bigdata/creditors';
  // const path = '/common/creditors';
  try {
    const result = await axios.get(path, { params: { province, type } });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getBigDataCreditorTypes = async (province) => {
  const path = '/bigdata/creditor-types';
  // const path = '/common/creditor-types';
  try {
    const result = await axios.get(path, { params: { province } });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchBigData = async (filter) => {
  const path = "/bigdata/search";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const addBigData = async (selected) => {
  const path = "/bigdata/add";
  try {
    const result = await axios.post(path, { data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const removeBigData = async (selected) => {
  const path = "/bigdata/remove";
  try {
    const result = await axios.post(path, { data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getAddedList = async (params) => {
  const path = "/bigdata/add";
  try {
    const result = await axios.get(path, { params });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitListNPL = async (params) => {
  const path = "/bigdata/submit";
  try {
    const result = await axios.post(
      path,
      { data: params.data },
      { responseType: "blob" }
    );
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
export const submitListNPLExport = async (params) => {
  const path = "/test";
  try {
    const result = await axios.post(exporturl + path, {});
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};

//#endregion
//#region Classify
export const importClassify = async (filter) => {
  const path = "/classify/import";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchClassify = async (filter) => {
  const path = "/classify/search";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getFarmerDetailClassify = async (
  idcard,
  province,
  creditor_type
) => {
  const path = "/classify/farmer-detail";
  try {
    const result = await axios.get(path, {
      params: { idcard, province, creditor_type },
    });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getDebtRegisterDetailClassify = async (
  idcard,
  province,
  creditor_type
) => {
  const path = "/classify/debt-register-contracts";
  try {
    const result = await axios.get(path, {
      params: { idcard, province, creditor_type },
    });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getDebtManagementAlreadyClassify = async (
  idcard,
  province,
  creditor_type
) => {
  const path = "/classify/debt-management-already-contracts";
  try {
    const result = await axios.get(path, {
      params: { idcard, province, creditor_type },
    });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getDebtManagementDetailClassify = async (
  idcard,
  province,
  creditor_type
) => {
  const path = "/classify/debt-management-contracts";
  try {
    const result = await axios.get(path, {
      params: { idcard, province, creditor_type },
    });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateDebtManagementDetailClassify = async (param) => {
  const path = "/classify/debt-management-contract";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getBorrowerClassify = async (idcard, province, creditor_type, debt_management_type = "NPL") => {
  const path = "/classify/borrower";
  try {
    const result = await axios.get(path, {
      params: { idcard, province, creditor_type, debt_management_type },
    });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateBorrowerClassify = async (data) => {
  const path = "/classify/borrower";
  try {
    const result = await axios.post(path, data);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const upsertGuarantorClassify = async (data) => {
  const path = "/classify/guarantor";
  try {
    const result = await axios.post(path, data);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const removeGuarantorClassify = async (data) => {
  const path = "/classify/guarantor/remove";
  try {
    const result = await axios.post(path, data);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
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
export const uploadDocumentClassify = async (data) => {
  const path = '/classify/upload-document';
  try {
    const result = await axios.post(path,data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const combineClassify = async (data) => {
  const path = '/classify/combine';
  try {
    const result = await axios.post(path,data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const cancelCombineClassify = async (data) => {
  const path = '/classify/cancel-combine';
  try {
    const result = await axios.post(path,data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const splitClassify = async (data) => {
  const path = '/classify/split';
  try {
    const result = await axios.post(path,data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const cancelSplitClassify = async (data) => {
  const path = '/classify/cancel-split';
  try {
    const result = await axios.post(path,data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
  }
};
export const createNplClassify = async (data) => {
  const path = '/classify/create-npl';
  try {
    const result = await axios.post(path,data);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const updateDebtManagementDetailClassifyNpa = async (param) => {
  const path = "/classify/debt-management-contract-npa";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchNpaClassify = async (filter) => {
  const path = '/classify/search-npa';
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
export const getDebtManagementDetailClassifyNpa = async (
  idcard,
  province,
  creditor_type
) => {
  const path = "/npa/debt-management-contracts-npa";
  try {
    const result = await axios.get(path, {
      params: { idcard, province, creditor_type },
    });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
//#endregion
//#region BranchOffer
export const searchBranchOffer = async (filter) => {
  const path = "/BranchOffer/search-branch-offer";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getBranchOffer = async () => {
  const path = "/BranchOffer/prepare-branch-offer";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const addBranchOffer = async (selected) => {
  const path = "/BranchOffer/add-branch-proposes-for-approval";
  try {
    const result = await axios.post(path, { data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const removeBranchOffer = async (selected) => {
  const path = "/BranchOffer/remove-branch-proposes-for-approval";
  try {
    const result = await axios.post(path, { data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateBranchOffer = async (param) => {
  const path = "/share/update-brn-proposes-approval";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitBranchOffer = async (params) => {
  const path = "/BranchOffer/submit-proposes-for-approval";
  try {
    const result = await axios.post(
      path,
      { data: params.data },
      { responseType: "blob" }
    );
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getBranchBookNo = async (status) => {
  const path = "/common/brn-propose-approval-no";
  try {
    const result = await axios.get(path, { params: { status } });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getBranchBookDate = async (status, bookNo) => {
  const path = "/common/brn-propose-approval-date";
  try {
    const result = await axios.get(path, { params: { status, brn_proposes_approval_no: bookNo ?? '' } });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const uploadBranchOffer = async (filter) => {
  const path = "/BranchOffer/upload-proposes-for-approval";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchPrepareForPresent = async (filter) => {
  const path = "/PrepareForPresent/search-prepare-for-present";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitBranchOfferPrepare = async (selected) => {
  const path = "/PrepareForPresent/submit-prepare-for-present";
  try {
    const result = await axios.post(path, { status: 'รวบรวมเตรียมนำเสนอแล้ว', data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateIncorrect = async (selected) => {
  const path = "/PrepareForPresent/update-notcorrectlist";
  try {
    const result = await axios.post(path, { data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
/******************************************************/
export const searchBranchOfferNpa = async (filter) => {
  const path = "/BranchOffer/search-branch-offer-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getBranchOfferNpa = async () => {
  const path = "/BranchOffer/prepare-branch-offer-npa";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const addBranchOfferNpa = async (selected) => {
  const path = "/BranchOffer/add-branch-proposes-for-approval-npa";
  try {
    const result = await axios.post(path, { data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const removeBranchOfferNpa = async (selected) => {
  const path = "/BranchOffer/remove-branch-proposes-for-approval-npa";
  try {
    const result = await axios.post(path, { data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateBranchOfferNpa = async (param) => {
  const path = "/share/update-brn-proposes-approval-npa";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitBranchOfferNpa = async (params) => {
  const path = "/BranchOffer/submit-proposes-for-approval-npa";
  try {
    const result = await axios.post(
      path,
      { data: params.data },
      { responseType: "blob" }
    );
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getBranchBookNoNpa = async (status) => {
  const path = "/common/brn-propose-approval-no-npa";
  try {
    const result = await axios.get(path, { params: { status } });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getBranchBookDateNpa = async (status, bookNo) => {
  const path = "/common/brn-propose-approval-date-npa";
  try {
    const result = await axios.get(path, { params: { status, brn_proposes_approval_no: bookNo ?? '' } });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const uploadBranchOfferNpa = async (filter) => {
  const path = "/BranchOffer/upload-proposes-for-approval-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchPrepareForPresentNpa = async (filter) => {
  const path = "/PrepareForPresent/search-prepare-for-present-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitBranchOfferPrepareNpa = async (selected) => {
  const path = "/PrepareForPresent/submit-prepare-for-present-npa";
  try {
    const result = await axios.post(path, { status: 'รวบรวมเตรียมนำเสนอแล้ว', data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateIncorrectNpa = async (selected) => {
  const path = "/PrepareForPresent/update-notcorrectlist-npa";
  try {
    const result = await axios.post(path, { data: selected });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
//#endregion
//#region Committee
export const exportCommitteePrepare = async (filter) => {
  const path = '/ProposeCommittee/export-committee-list';
  try {
    const result = await axios.post(path, filter, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: filter.type });
      SaveAs(blob, filter.filename);
      return true
    }
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchCommitteePrepare = async (filter) => {
  const path = "/ProposeCommittee/search-prepare-propose-committee";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchAddedCommitteePrepare = async (filter) => {
  const path = "/ProposeCommittee/search-prepare-propose-committee";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const addCommitteePrepare = async (selected) => {
  const path = '/share/update-statusnpl';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'เตรียมรอเสนอคณะกรรมการจัดการหนี้' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeCommitteePrepare = async (selected) => {
  const path = '/share/update-statusnpl';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'รวบรวมเตรียมนำเสนอแล้ว' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const updateCommitteePrepare = async (param) => {
  const path = "/ProposeCommittee/update-prepare-propoes-committee";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitCommitteePrepare = async (params) => {
  const path = "/ProposeCommittee/submit-prepare-propose-committee";
  try {
    const result = await axios.post(
      path,
      { data: params.data,status: params.status
        , proposal_committee_no: params.proposal_committee_no
        ,proposal_committee_date: params.proposal_committee_date },
      { responseType: "blob" }
    );
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
export const searchCommitteeUpdate = async (filter) => {
  const path = "/ProposeCommittee/search-update-propose-committee";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const approveCommitteeUpdate = async (filter) => {
  const path = "/ProposeCommittee/approve-committee";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const rejectCommitteeUpdate = async (filter) => {
  const path = "/ProposeCommittee/reject-committee";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const exportAnnouncement = async (filter) => {
  const path = '/MakePetition/export-announcement';
  try {
    const result = await axios.post(path, { data: filter.data }, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: filter.type });
      SaveAs(blob, filter.filename);
      return true
    }
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
/************************************************************/
export const searchCommitteePrepareNpa = async (filter) => {
  const path = "/ProposeCommittee/search-prepare-propose-committee-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchAddedCommitteePrepareNpa = async (filter) => {
  const path = "/ProposeCommittee/search-prepare-propose-committee-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const addCommitteePrepareNpa = async (selected) => {
  const path = '/share/update-statusnpa';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'เตรียมรอเสนอคณะกรรมการจัดการหนี้' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeCommitteePrepareNpa = async (selected) => {
  const path = '/share/update-statusnpa';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'รวบรวมเตรียมนำเสนอแล้ว' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const updateCommitteePrepareNpa = async (param) => {
  const path = "/ProposeCommittee/update-prepare-propoes-committee-npa";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitCommitteePrepareNpa = async (params) => {
  const path = "/ProposeCommittee/submit-prepare-propose-committee-npa";
  try {
    const result = await axios.post(
      path,
      { data: params.data,status: params.status
        , proposal_committee_no: params.proposal_committee_no
        ,proposal_committee_date: params.proposal_committee_date },
      { responseType: "blob" }
    );
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
export const searchCommitteeUpdateNpa = async (filter) => {
  const path = "/ProposeCommittee/search-update-propose-committee-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const approveCommitteeUpdateNpa = async (filter) => {
  const path = "/ProposeCommittee/approve-committee-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const rejectCommitteeUpdateNpa = async (filter) => {
  const path = "/ProposeCommittee/reject-committee-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const exportAnnouncementNpa = async (filter) => {
  const path = '/MakePetition/export-announcement-npa';
  try {
    const result = await axios.post(path, { data: filter.data }, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: filter.type });
      SaveAs(blob, filter.filename);
      return true
    }
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
//#endregion
//#region Confirm Committee
export const getConfirmNo = async (status,type) => {
  const path = '/common/branch-correspondence-no';
  try {
    const result = await axios.get(path, { params: {status,type} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getConfirmDate = async (status,type, branch_correspondence_no) => {
  const path = '/common/branch-correspondence-date';
  try {
    const result = await axios.get(path, { params: {status,type, branch_correspondence_no} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchConfirmCommitteePrepare = async (filter) => {
  const path = "/ConfirmCommittee/search-confirm-committee";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchConfirmCommitteePrepareAdded = async (filter) => {
  const path = "/ConfirmCommittee/search-confirm-committee";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const addConfirmCommitteePrepare = async (selected) => {
  const path = '/share/update-statusnpl';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'สาขาเตรียมยืนยันยอด' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeConfirmCommitteePrepare = async (selected) => {
  const path = '/share/update-statusnpl';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'คณะกรรมการจัดการหนี้อนุมัติ' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
/************************************************************/
export const searchConfirmCommitteePrepareNpa = async (filter) => {
  const path = "/ConfirmCommittee/search-confirm-committee-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchConfirmCommitteePrepareAddedNpa = async (filter) => {
  const path = "/ConfirmCommittee/search-confirm-committee-npa";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const addConfirmCommitteePrepareNpa = async (selected) => {
  const path = '/share/update-statusnpa';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'สาขาเตรียมยืนยันยอด' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeConfirmCommitteePrepareNpa = async (selected) => {
  const path = '/share/update-statusnpa';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'คณะกรรมการจัดการหนี้อนุมัติ' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getConfirmCommittee = async (id, type) => {
  const path = "/ConfirmCommittee/confirm-committee-detail";
  try {
    const result = await axios.get(path, { params: { id, type }});
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateConfirmCommitteePrepare = async (param) => {
  const path = "/ConfirmCommittee/confirm-committee-detail";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateConfirmCommitteeCreditor = async (param) => {
  const path = "/ConfirmCommittee/confirm-committee-creditor";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const updateConfirmCommitteeNo = async (param) => {
  const path = "/ConfirmCommittee/update-confirm-committee";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitConfirmCommitteePrepare = async (param) => {
  const path = "/ConfirmCommittee/submit-confirm-committee";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const completeConfirmCommittee = async (param) => {
  const path = "/ConfirmCommittee/complete-confirm-committee";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const notConfirmCommittee = async (param) => {
  const path = "/ConfirmCommittee/not-confirm-committee";
  try {
    const result = await axios.post(path, param);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
// #endregion
//#region Approval
export const getCommitteeNo = async (status) => {
  const path = '/common/proposal-committee-no';
  try {
    const result = await axios.get(path, { params: {status} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getCommitteeDate = async (status, proposal_committee_no) => {
  const path = '/common/proposal-committee-date';
  try {
    const result = await axios.get(path, { params: {status, proposal_committee_no} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchMakePetition = async (filter) => {
  const path = '/MakePetition/search-make-petition';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getMakePetitionAddedList = async (filter) => {
  const path = '/MakePetition/search-make-petition';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const addMakePetitionList = async (selected) => {
  const path = '/share/update-statusnpl';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'เตรียมการชำระหนี้แทน' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeMakePetitionList = async (selected) => {
  const path = '/share/update-statusnpl';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'ยืนยันยอดสำเร็จ' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const addMakePetitionBranchList = async (selected) => {
  const path = '/share/update-statusnpl';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'เตรียมการชำระหนี้แทน(สาขา)' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeMakePetitionBranchList = async (selected) => {
  const path = '/share/update-statusnpl';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'โอนเงินให้สาขาแล้ว' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const insertPetition = async (filter) => {
  const path = '/MakePetition/insert-petition';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const exportPetition = async (filter) => {
  const path = '/MakePetition/export-petition';
  try {
    const result = await axios.post(path, filter, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: filter.type });
      SaveAs(blob, filter.filename);
      return true
    }
    else
      return defaultErrorResponse;
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getPetitionList = async (filter) => {
  const path = '/MakePetition/get-petition-contracts';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};export const getPetitionBranchList = async (filter) => {
  const path = '/MakePetition/get-branch-petition-contracts';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getPetitionById = async (id_petition) => {
  const path = '/MakePetition/get-petition-contracts';
  try {
    const result = await axios.get(path, { params: {id_petition} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};

export const savePetitionBook = async (filter) => {
  const path = '/MakePetition/save-petition';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getCommitteeOfficeNo = async () => {
  const path = '/common/get-update-proposal-committee-no';
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
export const getCommitteeOfficeDate = async () => {
  const path = '/common/get-update-proposal-committee-date';
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
export const getPetitionNo = async () => {
  const path = '/common/get-petition_no_office';
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
export const getPetitionDate = async (petition_no) => {
  const path = '/common/get-petition_date_office';
  try {
    const result = await axios.get(path, { params: {petition_no} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchDisbursementStatus = async (filter) => {
  const path = '/MakePetition/search-disbursement-status';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
/*********************************************************************/
export const getCommitteeNoNpa = async (status) => {
  const path = '/common/proposal-committee-no-npa';
  try {
    const result = await axios.get(path, { params: {status} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getCommitteeDateNpa = async (status, proposal_committee_no) => {
  const path = '/common/proposal-committee-date-npa';
  try {
    const result = await axios.get(path, { params: {status, proposal_committee_no} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchMakePetitionNpa = async (filter) => {
  const path = '/MakePetition/search-make-petition-npa';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getMakePetitionAddedListNpa = async (filter) => {
  const path = '/MakePetition/search-make-petition-npa';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const addMakePetitionListNpa = async (selected) => {
  const path = '/share/update-statusnpa';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'เตรียมการชำระหนี้แทน' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeMakePetitionListNpa = async (selected) => {
  const path = '/share/update-statusnpa';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'ยืนยันยอดสำเร็จ' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const addMakePetitionBranchListNpa = async (selected) => {
  const path = '/share/update-statusnpa';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'เตรียมการชำระหนี้แทน(สาขา)' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const removeMakePetitionBranchListNpa = async (selected) => {
  const path = '/share/update-statusnpa';
  try {
    const result = await axios.post(path,{ ids: selected, status: 'โอนเงินให้สาขาแล้ว' });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const insertPetitionNpa = async (filter) => {
  const path = '/MakePetition/insert-petition-npa';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const exportPetitionNpa = async (filter) => {
  const path = '/MakePetition/export-petition-npa';
  try {
    const result = await axios.post(path, filter, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: filter.type });
      SaveAs(blob, filter.filename);
      return true
    }
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getPetitionListNpa = async (filter) => {
  const path = '/MakePetition/get-petition-contracts-npa';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getPetitionBranchListNpa = async (filter) => {
  const path = '/MakePetition/get-branch-petition-contracts-npa';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchDisbursementStatusNpa = async (filter) => {
  const path = '/MakePetition/search-disbursement-status-npa';
  try {
    const result = await axios.post(path, filter);
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
//#region Legal Contract
export const searchLegalPrepare = async (filter) => {
  const path = '/LegalContract/search-prepare-legal-contract';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const updateLegalPolicyNoPrepare = async (filter) => {
  const path = '/LegalContract/update-policy-no-prepare';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchOperationLand = async (filter) => {
  const path = '/operationLand/search-operationland';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getOperationDetail = async (id) => {
  const path = '/operationLand/get-operationland';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getExpropriationDetail = async (id) => {
  const path = '/operationLand/get-expropriation';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};

export const getSurveyDetail = async (id) => {
  const path = '/operationLand/get-surveying';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getRentalDetail = async (id) => {
  const path = '/operationLand/get-rental';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getReceiveRent = async (id) => {
  const path = '/operationLand/get-receiverent';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getExpropriationReceiveRent = async (id) => {
  const path = '/operationLand/get-expropriation-receiverent';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const updateExpropriationLog = async (params) => {
  const path = '/OperationLand/update-expropriationlog';
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
export const insertExpropriationLog = async (params) => {
  const path = '/OperationLand/insert-expropriationlog';
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
export const getOperationChangeCollateral = async (id) => {
  const path = '/operationLand/view-operationland-changecollateral';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getOperationSeparateCollateral = async (id) => {
  const path = '/operationLand/view-operationland-separatecollateral';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getOperationSeparateUsedeed = async (params) => {
  const path = '/operationLand/view-operationland-usedeed';
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

export const getExpropriationChange = async (id) => {
  const path = '/operationLand/view-expropriation-changecollateral';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getExpropriationSeparate = async (id) => {
  const path = '/operationLand/view-expropriation-separatecollateral';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getExpropriationSeparateUsedeed = async (params) => {
  const path = '/operationLand/view-expropriation-usedeed';
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
export const getSurveyChangeCollateral = async (id) => {
  const path = '/operationLand/view-surveying-changecollateral';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getSurveySeparateCollateral = async (id) => {
  const path = '/operationLand/view-surveying-separatecollateral';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getSurveySeparateUsedeed = async (params) => {
  const path = '/operationLand/view-surveying-usedeed';
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
export const updateOperationLand = async (params) => {
  const path = '/operationLand/update-operationland';
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
export const updateExpropriation = async (params) => {
  const path = '/operationLand/update-expropriation';
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
export const updateSurvey = async (params) => {
  const path = '/operationLand/update-surveying';
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
export const viewLegalDetail = async (id) => {
  const path = '/LegalContract/legal-contract-debt-management';
  try {
    const result = await axios.get(path, { params: {id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getLegalAsset = async (id) => {
  const path = '/LegalContract/asset';
  try {
    const result = await axios.get(path, { params: {id_KFKPolicy: id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const updateLegalAsset = async (params) => {
  const path = '/LegalContract/asset';
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
export const deleteLegalAsset = async (params) => {
  const path = '/LegalContract/remove-asset';
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
export const getLegalGuarantor = async (id) => {
  const path = '/LegalContract/guarantor';
  try {
    const result = await axios.get(path, { params: {id_KFKPolicy: id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const updateLegalGuarantor = async (params) => {
  const path = '/LegalContract/guarantor';
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
export const getLegalSpouses = async (id) => {
  const path = '/LegalContract/getspouses';
  try {
    const result = await axios.get(path, { params: {id_KFKPolicy: id} });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const saveLegalSpouses = async (params) => {
  const path = '/LegalContract/insert-spouses';
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
export const removeLegalSpouses = async (params) => {
  const path = '/LegalContract/delete-spouses';
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
export const getPlanPay = async (id,no) => {
  const path = '/LegalContract/get-refund-planpay';
  try {
    const result = await axios.get(path, { params: { id_KFKPolicy: id, policyNo: no } });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const savePlanPay = async (params) => {
  const path = '/LegalContract/save-refund-planpay';
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
export const saveAssetRental = async (params) => {
  const path = '/OperationLand/insert-assetrental';
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
export const updateAssetRental = async (params) => {
  const path = '/OperationLand/update-assetrental';
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
export const saveRecieveRent = async (params) => {
  const path = '/OperationLand/insert-assetrentallog';
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
export const updateRecieveRent = async (params) => {
  const path = '/OperationLand/update-assetrentallog';
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
export const printPlanPay = async (params) => {
  const path = '/LegalContract/print-refund-planpay';
  try {
    const result = await axios.post(
      path,
      params.data,
      { responseType: "blob" }
    );
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
export const saveDocumentPolicy = async (filter) => {
  const path = "/share/save-documentpolicy";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitSendLegal = async (params) => {
  const path = '/LegalContract/submit-sendlegalcontract';
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
export const searchLegalCheck = async (filter) => {
  const path = '/LegalContract/search-check-legal-contract';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getBranchPolicyNo = async () => {
  const path = "/common/branch-policy-no";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getBranchPolicyDate = async (no) => {
  const path = "/common/branch-policy-date";
  try {
    const result = await axios.get(path, { param: { no }});
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getDebtManagementPolicyNo = async () => {
  const path = "/common/debt-management-policy-no";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getDebtManagementPolicyDate = async (no) => {
  const path = "/common/debt-management-policy-date";
  try {
    const result = await axios.get(path, { param: { no }});
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const printLegalContract = async (params) => {
  const path = '/LegalContract/print-legal-contract';
  try {
    const result = await axios.post(path, params.data, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
//#endregion
//#region Guarantee
export const searchGuaranteePrepare = async (filter) => {
  const path = '/Guarantee/search-guarantee';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchGuaranteeCheck = async (filter) => {
  const path = '/Guarantee/search-check-guarantee';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchGuaranteeManage = async (filter) => {
  const path = '/Guarantee/search-manage-guarantee';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getPostponeGuarantee = async (id_KFKPolicy) => {
  const path = '/Guarantee/gettransfersecurities';
  try {
    const result = await axios.get(path, { params: { id_KFKPolicy } });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const savePostponeGuarantee = async (params) => {
  const path = '/Guarantee/postpone-assetpolicy';
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
export const sendGuarantee = async (params) => {
  const path = '/Guarantee/insert-sendassetpolicy';
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
export const getSendAssetPolicyNo = async (status) => {
  const path = "/common/send-asset-policy-no";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getSendAssetPolicyDate = async (status, no) => {
  const path = "/common/send-asset-policy-date";
  try {
    const result = await axios.get(path, { param: { status, no }});
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getSendAssetDebtManagePolicyNo = async (status) => {
  const path = "/common/send-asset-debt-management-policy-no";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getSendAssetDebtManagePolicyDate = async (status, no) => {
  const path = "/common/send-asset-debt-management-policy-date";
  try {
    const result = await axios.get(path, { param: { status, no }});
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const saveAssetGuarantee = async (params) => {
  const path = '/Guarantee/update-assetpolicy';
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
export const saveSendAssetGuarantee = async (params) => {
  const path = '/Guarantee/update-sendassetpolicy';
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
//#endregion
//#region Account
//#region Operation Land
export const searchOperation = async (filter) => {
  const path = '/Operation/search-legal-contract';
  try {
    return {
      isSuccess: true,
      data: [
        1,1,1,1,1,1
      ]
    }
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchSurvey = async (filter) => {
  const path = '/Operation/search-legal-contract';
  try {
    return {
      isSuccess: true,
      data: [
        1,1,1,1,1,1
      ]
    }
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchRental = async (filter) => {
  const path = '/Operation/search-legal-contract';
  try {
    return {
      isSuccess: true,
      data: [
        1,1,1,1,1,1
      ]
    }
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchExpropriated = async (filter) => {
  const path = '/Operation/search-legal-contract';
  try {
    return {
      isSuccess: true,
      data: [
        1,1,1,1,1,1
      ]
    }
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchBorrow = async (filter) => {
  const path = '/Account/search-deed-borrow';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getBorrowHistory = async (id) => {
  const path = '/Account/get-deed-borrow-history';
  try {
    const result = await axios.get(path, { params: { id } });
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
//#region Reimbursement
export const searchReimbursement = async (filter) => {
  const path = '/Account/search-reimbursement';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getReimbursementPlan = async (filter) => {
  const path = '/Account/get-reimbursement-plan';
  try {
    const result = await axios.get(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getReimbursementSummary = async (filter) => {
  const path = '/Account/get-reimbursement-summary';
  try {
    const result = await axios.get(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const printPlanRe = async (params) => {
  const path = '/report/Print-PayLog';
  try {
    const result = await axios.post(path, params.data, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
export const getReimbursementCard = async (filter) => {
  const path = '/Account/get-reimbursement-card';
  try {
    const result = await axios.get(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const printCardRe = async (params) => {
  const path = '/report/Print-Card';
  try {
    const result = await axios.post(path, params.data, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
//#endregion
//#region Adjust
export const searchAdjust = async (filter) => {
  const path = '/Adjust/search-legal-contract';
  try {
    return {
      isSuccess: true,
      data: [
        1,1,1,1,1,1
      ]
    }
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchAdjustNotValid = async (filter) => {
  const path = '/Adjust/search-legal-contract';
  try {
    return {
      isSuccess: true,
      data: [
        1,1,1,1,1,1
      ]
    }
    const result = await axios.post(path, filter);
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
//#region Follow
export const searchFollow = async (filter) => {
  const path = '/Account/search-follow';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const exportSaveFollow = async (filter) => {
  const path = '/Account/export-follow';
  try {
    const result = await axios.post(path, filter, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: 'application/octet-stream' });
      SaveAs(blob, 'การติดตามชำระหนี้คืน.xlsx');
    }
  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
  return;
};
export const saveIsLoss = async (params) => {
  const path = '/Account/add-is-loss';
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
export const getIsLoss = async (id) => {
  const path = '/Account/get-is-loss';
  try {
    const result = await axios.get(path, { params: { id } });
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
//#region Debt Acknowledge
export const searchDebtAcknowledge = async (filter) => {
  const path = '/Restructure/search-restructure';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const saveRestructureDocumentPolicy = async (filter) => {
  const path = '/Restructure/save-document-policy';
  try {
    const result = await axios.post(path, filter);
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
//#region Debt Accept
export const searchDebtAccept = async (filter) => {
  const path = '/Restructure/search-restructure';
  try {
    const result = await axios.post(path, filter);
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
//#region Invoice
export const searchInvoice = async (filter) => {
  const path = '/Account/search-invoice';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getInvoiceByPolicyNo = async (no) => {
  const path = '/Account/get-invoice-policy';
  try {
    const result = await axios.get(path, { params: { policyNo: no } });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getInvoice = async (ids) => {
  const path = '/Account/get-invoice';
  try {
    const result = await axios.post(path, { ids });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const printInvoice = async (params) => {
  // const path = 'https://debtinfo.frdfund.org/report-old/report/Print-Receipt';
  const path = '/Account/Print-Receipt';
  try {
    const result = await axios.post(path, params.data, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
//#endregion
//#region Restructure
export const searchRestructuring = async (filter) => {
  const path = '/Restructure/search-restructure';
  try {
    const result = await axios.post(path, filter);
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
//#endregion
//#region Close
export const searchClose = async (filter) => {
  const path = '/Account/search-close';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getCalClose = async (filter) => {
  const path = '/Account/cal-close';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const getPrintClose = async (filter) => {
  const path = '/Account/print-close';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const printClose = async (params) => {
  const path = '/report/Print-Close';
  try {
    const data = {
      ...params.data,
      isClose: true,
    }
    const result = await axios.post(path, data, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
export const exportClose = async (params) => {
  const path = '/report/Export-Close?LegalNo=';
  try {
    const result = await axios.get(path, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
export const requestClose = async (filter) => {
  const path = '/Account/request-close';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const redeemClose = async (filter) => {
  const path = '/Account/redeem-assset-close';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const refundClose = async (filter) => {
  const path = '/Account/refund-close';
  try {
    const result = await axios.post(path, filter);
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

// #region NPA
export const getNpaRoundFilter = async () => {
  const path = '/npa/npa-round-filter';
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
export const getNpaCollateralFilter = async (round) => {
  const path = '/npa/npa-collateral-filter';
  try {
    const result = await axios.get(path, { params: { npaRound: round }});
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error('error: ' + path + ' =>', e);
    return defaultErrorResponse;
  }
};
export const searchBigDataNPA = async (filter) => {
  const path = "/npa/searchBigData";
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const addRegistrationNPA = async (selected) => {
  const path = "/npa/registrationNPA";
  try {
    const result = await axios.post(path,{ ...selected });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const searchRegisteredNPA = async (filter) => {
  const path = '/npa/searchNPA';
  try {
    const result = await axios.post(path, filter);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getdetailNPA = async (id) => {
  const path = '/npa/getdetailNPA';
  try {
    const result = await axios.get(path, { params: { id } });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitEditRegisteredNPA = async (params) => {
  const path = "/npa/submit-edit-registered-NPA";
  try {
    const result = await axios.post(path, { ...params });
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
};
export const addContractNPAToList = async (selected) => {
  const path = '/npa/addContractNPAToList';
  try {
    const result = await axios.post(path,[...selected ]);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const removeContractNPAToList = async (selected) => {
  const path = '/npa/removeContractNPAToList';
  try {
    const result = await axios.post(path,[...selected ]);
    if (result.status == 200)
      return result.data;
    else
      return defaultErrorResponse;

  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const getContractNPAToList = async (params) => {
  const path = '/npa/getContractNPAToList';
  try {
    const result = await axios.get(path, { params });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
export const submitListNPA = async (params) => {
  const path = '/npa/submitNPA';
  try {
    const result = await axios.post(
      path,
      { data: params.data },
      { responseType: "blob" }
    );
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return;
};
export const updateNPAstatus = async (selected, status) => {
  const path = "/Share/update-statusnpa";
  try {
    const result = await axios.post(path, {
      ids: selected,
      status,
    });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
// #endregion

// #region NPL
export const updateNPLstatus = async (selected, status) => {
  const path = "/Share/update-statusnpl";
  try {
    const result = await axios.post(path, {
      ids: selected,
      status,
    });
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
// #endregion
// #region Report
export const downloadReport = async (filter, filename) => {
  const path = "/report/download";
  try {
    const result = await axios.post(
      path, filter, { responseType: "blob" }
    );
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: filter.type });
      SaveAs(blob, filename);
      return true
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return false;
};

export const downloadOldReport = async (params) => {
  const path = "https://debtinfo.frdfund.org/report-old/report/Download?exportpdf=true&";
  try {
    let reportId = 0;
    if (params.reportId == 1) reportId = 4; if (params.reportId == 2) reportId = 5;
    if (params.reportId == 3) reportId = 7; if (params.reportId == 4) reportId = 38;
    if (params.reportId == 5) reportId = 9; if (params.reportId == 6) reportId = 20;
    if (params.reportId == 7) reportId = 13; if (params.reportId == 8) reportId = 11;
    if (params.reportId == 9) reportId = 14; if (params.reportId == 10) reportId = 39;

    var param = 'id=' + reportId + '&';
    var start = params.startDate;
    if (start != null && start != undefined && start != '') param += 'start=' + start + '&';
    var stop = params.endDate;
    if (stop != null && stop != undefined && stop != '') param += 'stop=' + stop + '&';
    if (params.year != null && params.year != undefined && params.year != '') param += 'year=' + (params.year == 'all' ? '0' : params.year) + '&';
    else param += 'year=0&';
    var CreditorType = (params.creditorType == 'all' ? 'ทั้งหมด' : params.creditorType);
    if (CreditorType != null && CreditorType != undefined && CreditorType != '') param += 'creditortype=' + CreditorType + '&';
    var Creditor = (params.creditor == 'all' ? '0' : params.creditor);
    if (Creditor != null && Creditor != undefined && Creditor != '') param += 'creditor=' + Creditor + '&';
    var DebtType = (params.debtType == 'all' ? 'ทั้งหมด' : params.debtType);
    if (DebtType != null && DebtType != undefined && DebtType != '') param += 'debttype=' + DebtType + '&';
    var LegalNo = (params.accountType == 'all' ? 'ทั้งหมด' : params.accountType);
    if (LegalNo != null && LegalNo != undefined && LegalNo != '') param += 'legalno=' + LegalNo + '&';
    var ApproveNo = params.committee;
    if (ApproveNo != null && ApproveNo != undefined && ApproveNo != '') param += 'approveno=' + ApproveNo + '&';
    var ProvinceId = params.province;
    if (ProvinceId != null && ProvinceId != undefined && ProvinceId != '') param += 'province=' + ProvinceId + '&';
    var AccountStatus = (params.debtStatus == 'all' ? 'ทั้งหมด' : params.debtStatus);
    if (AccountStatus != null && AccountStatus != undefined && AccountStatus != '') param += 'account_status=' + AccountStatus + '&'; 
    const result = await axios.get(path + param, { responseType: "blob" });
    if (result.status == 200) {
      const blob = new Blob([result.data], { type: params.type });
      SaveAs(blob, params.filename);
    }
  } catch (e) {
    console.error("error: " + path + " =>", e);
  }
  return true;
};
// #endregion