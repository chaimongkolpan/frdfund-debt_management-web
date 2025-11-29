import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router"
import { useNavigate } from "react-router-dom";
import { getUserData, toCurrency } from "@utils";
import { 
  getDebtManagementDetailClassify,
  combineClassify,
  cancelCombineClassify,
  splitClassify,
  cancelSplitClassify,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

import According from "@views/components/panel/according";
import OrgTable from "@views/components/classify/orgTable";
import DebtTable from "@views/components/classify/debtTable";
import AlreadyTable from "@views/components/classify/alreadyTable";
import DebtManageTable from "@views/components/classify/debtManageTable";
import CollateralTable from "@views/components/classify/collateralTable";
import GuarantorTable from "@views/components/classify/guarantorTable";
import CombineModal from "@views/components/classify/combineModal";
import BorrowModal from "@views/components/classify/borrowModal";
import DocumentModal from "@views/components/classify/documentModal";
import EditDetailModal from "@views/components/classify/editClassifyDetailModal";
import CustomModal from "@views/components/modal/customModal";

const user = getUserData();
const SearchClassifyNPLDetail = () => {
  const allow_roles = [1,2,4,7,8,9];
  const can_action = allow_roles.includes(user?.role)
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const qprov = searchParams.get("province");
  const qcreditorType = searchParams.get("creditor-type");
  const [debts, setDebts] = useState(null);
  const [debt, setDebt] = useState(null);
  const [collaterals, setCollaterals] = useState(null);
  const [guarantors, setGuarantors] = useState(null);
  const [selectedDebt, setShowDebts] = useState(null);
  const [total_collateral, setTotalColl] = useState(null);
  const [isOpenCombine, setOpenCombine] = useState(false);
  const [isOpenBorrow, setOpenBorrow] = useState(false);
  const [isOpenDocument, setOpenDocument] = useState(false);
  const [isOpenSplitNPL, setOpenSplitNPL] = useState(false);
  const [isOpenNPLDetail, setOpenNPLDetail] = useState(false);
  const [isOpenCancelSplit, setOpenCancelSplit] = useState(false);
  const [id_combine, setCombine] = useState(null);
  const [contract_no, setContractNo] = useState(null);
  const [id_split, setSplit] = useState(null);
  const [id_cancel_split, setCancelSplit] = useState(null);
  const [ids, setIds] = useState(null);
  const navigate = useNavigate();
  const handleCombine = async(id) => {
    await setCombine(id)
    await setOpenCombine(true);
  }
  const submitCombine = async(param) => {
    const result = await combineClassify(param);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await fetchData();
      await setOpenCombine(false);
      await setCombine(null);
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const handleSplit = async(id) => {
    const debt = debts.find(x => x.id_debt_management == id)
    await setContractNo(debt?.debt_manage_contract_no)
    await setSplit(id)
    await setOpenSplitNPL(true);
  }
  const submitSplit = async(id) => {
    const result = await splitClassify({ id_debt_management: id });
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await fetchData();
      await setOpenSplitNPL(false);
      await setContractNo(null);
      await setSplit(null);
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const handleCloseDetail = async () => {
    await fetchData();
    await setOpenNPLDetail(false);
    await setShowDebts(null);
  }
  const handleShowDetail = async (debt) => {
    await setShowDebts(null);
    await setShowDebts(debt);
    await setOpenNPLDetail(true);
  }
  const handleCancelCombine = async(id) => {
    const result = await cancelCombineClassify({ id_combining: id });
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await fetchData();
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const handleCancelSplit = async(id) => {
    const debt = debts.find(x => x.id_separate == id)
    await setContractNo(debt?.debt_manage_contract_no)
    await setCancelSplit(id)
    await setOpenCancelSplit(true);
  }
  const submitCancelSplit = async(id) => {
    const result = await cancelSplitClassify({ id_separate: id });
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await fetchData();
      await setOpenCancelSplit(false);
      await setContractNo(null);
      await setCancelSplit(null);
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const handleBorrow = () => {
    setOpenBorrow(true);
  }
  const handleBorrowerClose = async() => {
    await fetchData()
    await setOpenBorrow(false);
  }
  const handleDocument = (item) => {
    setDebt(item)
    setOpenDocument(true);
  }
  const handleCloseDocument = (flag) => {
    setDebt(flag ? debt : null)
    setOpenDocument(flag);
  }
  const handleSubmitDocument = async () => {
    toast((t) => (
      <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
    ));
    setDebt(null)
    await fetchData();
    await setOpenDocument(false);
  }
  const fetchData = async() => {
    const result = await getDebtManagementDetailClassify(params.idcard, qprov, qcreditorType);
    if (result.isSuccess) {
      await setDebts(result.contracts)
      const id = result.contracts.map(item => item.id_debt_management)
      await setIds(id)
      await setCollaterals(result.collaterals)
      await setGuarantors(result.guarantors)
      await setTotalColl(result.total_collateral)
    } else {
      await setDebts(null)
      await setCollaterals(null)
      await setGuarantors(null)
      await setTotalColl(null)
    }
  }
  useEffect(() => {
    fetchData();
  },[])
  return (
    <>
      <div className="content">
        <h4 className="mb-3">จำแนกมูลหนี้ NPL</h4>
        <div className="mt-4">
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              {/*start ทะเบียนเกษตรกร + องค์กร*/}             
              <div className="mb-1">
                <According 
                  title={'ทะเบียนเกษตรกร + องค์กร'}
                  className={"my-4"}
                  children={(
                    <>
                      <OrgTable idcard={params.idcard} province={qprov} creditorType={qcreditorType} />
                    </>
                  )}
                />
              </div>
              {/*end ทะเบียนเกษตรกร + องค์กร*/}
              {/*start ทะเบียนหนี้*/}
              <div className="mb-1">
                <According 
                  title={'ทะเบียนหนี้'}
                  className={"my-4"}
                  children={(
                    <>
                      <DebtTable idcard={params.idcard} province={qprov} creditorType={qcreditorType} />
                    </>
                  )}
                />
              </div>
              {/*end ทะเบียนหนี้*/}
              {/*start ข้อมูลที่ได้รับการจัดการหนี้แล้ว */}
              <div className="mb-1">
                <According 
                  title={'ข้อมูลที่ได้รับการจัดการหนี้แล้ว'}
                  className={"my-4"}
                  children={(
                    <AlreadyTable idcard={params.idcard} province={qprov} creditorType={qcreditorType} />
                  )}
                />
              </div>
              {/*end ข้อมูลที่ได้รับการจัดการหนี้แล้ว */}   
              {/*start จัดการหนี้ */}
              <div className="mb-1">
                <According 
                  title={'จัดการหนี้'}
                  className={"my-4"}
                  children={(
                    <>
                      <div className="d-flex mb-3 flex-row-reverse">
                        {/* {can_action && (
                          <button type="button" className="btn btn-info btn-sm ms-2" onClick={() => handleDocument()}><span className="far fa-file-alt"></span> เอกสารประกอบ</button>
                        )} */}
                        <button type="button" className="btn btn-warning btn-sm ms-2" onClick={() => handleBorrow()}><span className="fas fa-users"></span> ผู้รับสภาพหนี้แทน</button>
                      </div>
                      <DebtManageTable data={debts} 
                        handleCombine={handleCombine} 
                        handleSplit={handleSplit} 
                        handleShowDetail={handleShowDetail} 
                        handleCancelCombine={handleCancelCombine} 
                        handleCancelSplit={handleCancelSplit} 
                        handleDocument={handleDocument}
                        can_action={can_action}
                      />
                      <br />
                      {(debts && debts.length > 0) && (
                        <h6>
                          <div className="d-flex">
                            <div className="flex-grow-1 ">รวม {debts.length} บัญชี จำนวนเงินกู้ {toCurrency(debts.reduce((sum,{frD_paymen_amount}) => sum + frD_paymen_amount,0),2)} บาท</div>
                            <div className="ms-3 square border border-1" style={{background: '#ddefff'}}></div>
                            <div className="ms-1">รวมสัญญา</div>
                            <div className="ms-3 square border border-1" style={{background: '#fdeae7'}}></div>
                            <div className="ms-1">แยกสัญญา</div>
                          </div>
                        </h6>
                      )}
                    </>
                  )}
                />
              </div>
              {/*end จัดการหนี้ */}  
              {/*start หลักทรัพย์ค้ำประกัน */}
              <div className="mb-1">
                <According 
                  title={'หลักทรัพย์ค้ำประกัน'}
                  className={"my-4"}
                  children={(
                    <>
                      <CollateralTable data={collaterals} />
                      <br />
                      {(collaterals && collaterals.length > 0) && (
                        <h6>
                          <div className="d-flex flex-column align-items-sm-start">
                            <div>รวม {collaterals.length} หลักทรัพย์ เนื้อที่รวม(ไร่-งาน-ตรว.) {total_collateral.area}</div>
                          </div>
                        </h6>
                      )}
                    </>
                  )}
                />
              </div>
              {/*end หลักทรัพย์ค้ำประกัน */}      
              {/*start บุคคลค้ำประกัน */}
              <div className="mb-1">
                <According 
                  title={'บุคคลค้ำประกัน'}
                  className={"my-4"}
                  children={(
                    <>
                      <GuarantorTable data={guarantors} />
                      <br />
                      {(guarantors && guarantors.length > 0) && (
                        <h6>
                          <div className="d-flex flex-column align-items-sm-start">
                            <div>รวม {guarantors.length} บุคคลค้ำประกัน</div>
                          </div>
                        </h6>
                      )}
                    </>
                  )}
                />
              </div>
              {/*end บุคคลค้ำประกัน */}

              {/*---------------modal-------------------*/}

              {/*start modal รวมสัญญา*/}
              {isOpenCombine && (
                <CombineModal isOpen={isOpenCombine} setModal={setOpenCombine} data={debts.filter(x => !x.isCombine && !x.isSplit)} onClose={() => setOpenCombine(false)} onOk={submitCombine} id_debt_register={id_combine} />
              )}
              {/*end modal รวมสัญญา*/}

              {/*start modal ผู้รับสภาพหนี้แทน*/}
              {isOpenBorrow && (
                <BorrowModal isOpen={isOpenBorrow} setModal={setOpenBorrow} onClose={() => handleBorrowerClose()} 
                  idcard={params.idcard} province={qprov} creditorType={qcreditorType} ids={ids} can_action={can_action}
                />
              )}
              {/*end modal ผู้รับสภาพหนี้แทน*/}
              
              {/* start modal เอกสารประกอบ*/}
              {isOpenDocument && (
                <DocumentModal isOpen={isOpenDocument} setModal={handleCloseDocument} onOk={handleSubmitDocument} onClose={() => handleCloseDocument(false)} data={debt} />
              )}
              {/* end modal เอกสารประกอบ*/}

              {/*start modal รายละเอียดจำแนกมูลหนี้ NPL ตามสัญญา*/}
              {isOpenNPLDetail && (
                <EditDetailModal isOpen={isOpenNPLDetail && selectedDebt} setModal={setOpenNPLDetail} onClose={() => handleCloseDetail()} 
                  data={selectedDebt}
                />
              )}
              {/*end modal รายละเอียดจำแนกมูลหนี้ NPL ตามสัญญา*/}

              {/*start Modal แยกสัญญา NPL */}
              {isOpenSplitNPL && (
                <CustomModal isOpen={isOpenSplitNPL} setModal={setOpenSplitNPL} 
                  title={'แยกสัญญา NPL'} 
                  onClose={() => setOpenSplitNPL(false)} closeText={'ยกเลิก'} 
                  onOk={() => submitSplit(id_split)} okText={'แยกสัญญา NPL'}
                >
                  <p className="text-body-tertiary lh-lg mb-0">ต้องการแยกสัญญา NPL (เลขที่สัญญา {contract_no}) </p>
                </CustomModal>
              )}
              {/*end Modal แยกสัญญา NPL */}

              {/*start Modal ยกเลิกแยกสัญญา */}
              {isOpenCancelSplit && (
                <CustomModal isOpen={isOpenCancelSplit} setModal={setOpenCancelSplit} 
                  title={'ยกเลิกการแยกสัญญา'} 
                  onClose={() => setOpenCancelSplit(false)} closeText={'ยกเลิก'} 
                  onOk={() => submitCancelSplit(id_cancel_split)} okText={'ลบ'}
                >
                  <p className="text-body-tertiary lh-lg mb-0">ต้องการลบการแยกสัญญา (เลขที่สัญญา {contract_no}) </p>
                </CustomModal>
              )}
              {/*end Modal ยกเลิกแยกสัญญา */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchClassifyNPLDetail;