import axios from "axios";
const url = process.env.API_URL ?? "http://localhost:8080";
axios.defaults.baseURL = url;
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
export const getAlertSide = async () => {
  const path = "/common/alert";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
    return defaultErrorResponse;
  }
};
//#region Common
export const getProvinces = async () => {
  const path = "/common/provinces";
  try {
    const result = await axios.get(path);
    if (result.status == 200) return result.data;
    else return defaultErrorResponse;
  } catch (e) {
    console.error("error: " + path + " =>", e);
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
export const getBorrowerClassify = async (idcard, province, creditor_type) => {
  const path = "/classify/borrower";
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


//#endregion

//#region Approval
export const getCommitteeNo = async () => {
  const path = '/approval/no-filter';
  try {
    return {
      isSuccess: true,
      data: [{ name: '1/2566' },{ name: '2/2566' },{ name: '3/2566' },{ name: '4/2566' },{ name: '5/2568' },]
    }
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
export const getCommitteeDate = async () => {
  const path = '/approval/date-filter';
  try {
    return {
      isSuccess: true,
      data: [{ name: '20/04/2568' },{ name: '25/04/2568' },{ name: '12/03/2567' },{ name: '20/04/2566' },{ name: '20/05/2568' },]
    }
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
export const searchMakePetition = async (filter) => {
  const path = '/approval/search';
  try {
    return {
      isSuccess: true,
      data: [{ },{ },{ },{ },{ },],
      currentPage: 1,
      total: 5,
      totalPage: 1
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
export const getMakePetitionAddedList = async (params) => {
  const path = '/approval/add';
  try {
    return {
      isSuccess: true,
      data: [{ },{ },{ },{ },{ },]
    }
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
export const addMakePetitionList = async (selected) => {
  const path = '/approval/add';
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
export const removeMakePetitionList = async (selected) => {
  const path = '/approval/remove';
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
