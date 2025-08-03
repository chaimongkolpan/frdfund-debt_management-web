import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/FullModal";
import Loading from "@views/components/modal/loading";
import Filter from "@views/components/debtRegister/filterNpa";
import BigDataTable from "@views/components/debtRegister/bigdataTableNpa";
import BigDataRegisterTable from "@views/components/debtRegister/bigdataTableRegisterNpa";
import EditNpaModal from "@views/components/debtRegister/editNpaModal";
import SelectedTable from "@views/components/debtRegister/selectedTableNpa";
import ConfirmTable from "@views/components/debtRegister/confirmTableNpa";
import logo from '@src/assets/images/icons/logo.png'
import RegisterNPAModal from "@views/components/debtRegister/registrationNPAModal";
import FilterRegisNPA from "@views/components/debtRegister/filterResigtrationNpa";
import { 
  cleanData,
  searchBigDataNPA,
  searchRegisteredNPA,
  addRegistrationNPA,
  submitEditRegisteredNPA,
  getdetailNPA,
  getContractNPAToList ,
  removeContractNPAToList,
  addContractNPAToList,
  submitListNPA,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const DebtRegisterNpa = () => {
  const navigate = useNavigate();
  const [refreshFilter, setRefreshFilter] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editDebt, setEditDebt] = useState(null)
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [dataRegister, setDataRegister] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [filterRegister, setFilterRegister] = useState(null);
  const [makelistSelected, setMakeList] = useState(null);
  const [filterAdded, setFilterAdded] = useState({
    currentPage: 1,
    pageSize: process.env.PAGESIZE
  });
  const handleAddRegister = async (debt) => {
    const result = await addRegistrationNPA(debt);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      // await setEditDebt(null)
      // const result1 = await searchRegisteredNPA(filter);
      // if (result1.isSuccess) {
      //   await setDataRegister(result1)
      // } else {
      //   await setDataRegister(null)
      // }
    }
  }
  const handleEditRegister = async (debt) => {
    const result = await submitEditRegisteredNPA(debt);
    if (result.isSuccess) {
      await setShowEditModal(false);
      await setLoadBigData(true);
      await setEditDebt(null)
      const result1 = await searchBigDataNPA(filter);
      if (result1.isSuccess) {
        await setData(result1)
      } else {
        await setData(null)
      }
      await setLoadBigData(false);
    }
  }
  const handleCloseEdit = async () => {
    await setShowEditModal(false);
    await setLoadBigData(true);
    await setEditDebt(null)
    const result = await searchBigDataNPA(filter);
    if (result.isSuccess) {
      await setData(result)
    } else {
      await setData(null)
    }
    await setLoadBigData(false);
  }
  const onEditNpaRegister = async (debt) => {
    await setEditDebt(debt)
    await setShowEditModal(true);
  }
  const onSearchRegister = async (filter) => {
    setLoadBigData(true);
    setFilterRegister(filter)
    const result = await searchRegisteredNPA(filter);
    if (result.isSuccess) {
      setDataRegister(result)
    } else {
      setDataRegister(null)
    }
    setLoadBigData(false);
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchBigDataNPA(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const onAddBigData = async (selected) => {
    const result = await addContractNPAToList(selected);
    if (result.isSuccess) {
      await onSearch(filter);
      await fetchData(filterAdded);
    }
  }
  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await getContractNPAToList(query);
    if (result.isSuccess) {
      setAddedData(result)
    } else {
      setAddedData(null)
    }
  }
  const onRemoveMakelist = async (selected) => {
    const result = await removeContractNPAToList(selected);
    if (result.isSuccess) {
      await fetchData(filterAdded)
    }
  }
  const onSubmitMakelist = async () => {
    const result = await submitListNPA({ type: 'application/octet-stream', filename: 'จัดทำรายชื่อเกษตรกร_' + (new Date().getTime()) + '.zip', data: makelistSelected });
    if (result.isSuccess) {
    }
  }
  const onCloseMakelist = async () => {
    await setSubmit(false);
    await fetchData({ ...filterAdded, currentPage: 1 });
  }
  const onCloseRegisterNPAModel = async() => {
    await setRefreshFilter(false)
    await setShowModal(false)
    await setRefreshFilter(true)
  }
  const handleSubmit = async(selected) => {
    await setMakeList(selected);
    await setSubmit(true);
  }
  useEffect(() => {

  },[data])
  useEffect(() => {
    setLoadBigData(true);
    fetchData(filterAdded);
    return cleanData
  },[])
  return (
    <>
      <div className="content">
        <h4 >จัดทำรายชื่อเกษตรกร NPA</h4>
        <div className="d-flex flex-row-reverse">
          <div>
          <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => setShowModal(true)}><span className="fas fa-plus"></span> สร้างทะเบียน NPA</button>
            {showModal && (
                <RegisterNPAModal isOpen={showModal} setModal={setShowModal} onClose={onCloseRegisterNPAModel}  title={'สร้างทะเบียนหนี้ NPA'} closeText={'ปิด'} scrollable
                children={(
                  <>
                    <FilterRegisNPA handleSubmit={onSearchRegister} setLoading={setLoadBigData} />
                    <br />
                    {dataRegister && (
                      <BigDataRegisterTable result={dataRegister} fetchData={onSearchRegister} handleSubmit={handleAddRegister} filter={filterRegister}/>
                    )}
                  </>
                )}
              />
            )}
            </div>
        </div>
        <div className="row g-4">
          <div className="col-12 col-xl-12 order-1 order-xl-0">
            <div className="mb-9">
              <According 
                title={'ค้นหา'}
                className={"my-4"}
                children={(
                  <>
                    {refreshFilter && (
                      <Filter handleSubmit={onSearch} setLoading={setLoadBigData} />
                    )}
                    <br />
                    {data && (
                      <BigDataTable result={data} handleSubmit={onAddBigData} onEditNpaRegister={(debt) => onEditNpaRegister(debt)}/>
                    )}
                  </>
                )}
              />
              <According 
                title={'จัดทำรายชื่อเกษตรกร'}
                className={"mb-3"}
                children={(
                  <SelectedTable result={addedData} handleSubmit={handleSubmit} handleRemove={onRemoveMakelist} filter={filterAdded} getData={fetchData}/>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      {editDebt && (
        <EditNpaModal isOpen={showEditModal} setModal={setShowEditModal} 
          debt={editDebt} setDebt={setEditDebt} 
          onOk={(debt) => handleEditRegister(debt)} 
          onClose={() => handleCloseEdit()} 
        />
      )}
      <Modal isOpen={isSubmit} setModal={setSubmit} onOk={onSubmitMakelist} onClose={onCloseMakelist}  title={'จัดทำรายชื่อเกษตรกร'} okText={'ดาวน์โหลดเอกสารจัดทำรายชื่อเกษตรกร'} closeText={'ปิด'} scrollable>
        <ConfirmTable data={makelistSelected} />
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
export default DebtRegisterNpa;
