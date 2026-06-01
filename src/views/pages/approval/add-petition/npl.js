import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData, ToDateDb, getBookNo, stringToDateTh } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/fullModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/approval/filterAddPetition";
import SearchTable from "@views/components/approval/searchAdditionalPetitionTable";
import RejectTable from "@views/components/approval/rejectAddTable";
import ApproveTable from "@views/components/approval/approveAddTable";
import { 
  cleanData,
  searchAdditionalPetition,
  updateApproveAddPetition,
  updateRejectAddPetition,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const NPL = () => {
  const allow_roles = [1,2,7,8,9];
  const can_action = allow_roles.includes(user?.role)
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [petition, setPetition] = useState(null);
  const [addPetition, setAddPetition] = useState(null);
  const [savePetition, setSavePetition] = useState(null);
  const [loadPetition, setLoadPetition] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isSubmit, setSubmit] = useState(false);
  const [isOpenReject, setOpenReject] = useState(false);
  const [filter, setFilter] = useState(null);
  
  const handleReject = async (selected) => {
    await setSelected(selected);
    await setOpenReject(true);
  }
  const handleSubmit = async (selected) => {
    await setSelected(selected);
    await setSubmit(true);
  }
  const onSaveReturn = async (book_no,book_date,remark) => {
    const ids = selected.map((item) => item.id_debt_management);
    const result = await updateApproveAddPetition({ ids,book_no,book_date: ToDateDb(book_date),reason: remark,debt_management_type: 'NPL' });
    if (result.isSuccess) {
      await setSubmit(false)
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onSaveReject = async () => {
    const ids = selected.map((item) => item.id_debt_management);
    const result = await updateRejectAddPetition({ ids,debt_management_type: 'NPL' });
    if (result.isSuccess) {
      await setOpenReject(false)
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter({ ...filter })
    const result = await searchAdditionalPetition(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  useEffect(() => {
  },[data])
  useEffect(() => {
    return cleanData
  },[])
  return (
    <>
      <div className="content">
        <h4 className="mb-3">เพิ่มเงินชำระหนี้เกษตรกร NPL</h4>
        <div className="row g-4">
          <div className="col-12 col-xl-12 order-1 order-xl-0">
            <div className="mb-9">
              <According 
                title={'ค้นหา'}
                className={"my-4"}
                children={(
                  <>
                    <Filter handleSubmit={onSearch} setLoading={setLoadBigData} />
                    <br />
                    {data && (
                      <SearchTable result={data} handleSubmit={handleSubmit} handleReject={handleReject} filter={filter} getData={onSearch} can_action={can_action} />
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isSubmit} setModal={setSubmit} onClose={() => setSubmit(false)}  title={'เพิ่มเงินชำระหนี้เกษตรกร'} hideOk closeText={'ปิด'} scrollable>
        <ApproveTable data={selected} onSave={onSaveReturn} />
      </Modal>
      <Modal isOpen={isOpenReject} setModal={setOpenReject} onClose={() => setOpenReject(false)}  title={'ส่งคืนสาขา'} hideOk closeText={'ปิด'} scrollable>
        <RejectTable data={selected} onSave={onSaveReject} />
      </Modal>
      <Loading isOpen={isLoadBigData} setModal={setLoadBigData} centered scrollable size={'lg'} title={'เรียกข้อมูลทะเบียนหนี้จาก BigData'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default NPL;