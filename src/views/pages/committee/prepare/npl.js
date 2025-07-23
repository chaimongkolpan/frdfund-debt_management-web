import { useEffect, useState } from "react";
import { getUserData, toCurrency, stringToDateTh } from "@utils";
import { Spinner } from "reactstrap";
import Loading from "@views/components/modal/loading";
import logo from "@src/assets/images/icons/logo.png";
import According from "@views/components/panel/according";
import CustomerModal from "@views/components/modal/CustomModal";
import Filter from "@views/components/committee/filter";
import SearchDataTable from "@views/components/committee/searchPrepareTable";
import SelectDataTable from "@views/components/committee/selectPrepareTable";
import EditDataTable from "@views/components/committee/editPrepareTable";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import { 
  searchCommitteePrepare,
  searchAddedCommitteePrepare,
  addCommitteePrepare,
  removeCommitteePrepare,
  submitCommitteePrepare,
  updateCommitteePrepare,
  updateNPLstatus,
  cleanData
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const NPL = () => {
  const status = 'รอเสนอคณะกรรมการจัดการหนี้';
  const [showModal, setShowModal] = useState(false);
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState({});
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [bookNoEdit, setBookNoEdit] = useState(null);
  const [bookDateEdit, setBookDateEdit] = useState(null);
  const [editData, setEditData] = useState([]);
  const [count, setCount] = useState(0);
  const [contracts, setContracts] = useState(0);
  const [sumTotal, setSumTotal] = useState(0);
  const [filterAdded, setFilterAdded] = useState({
    debtClassifyStatus: "เตรียมรอเสนอคณะกรรมการจัดการหนี้",
    currentPage: 1,
    pageSize: 0,
  });
  const [requestApproveData, setRequestApproveData] = useState([]);
  
  const onSearchTop = async (filter) => {
    setLoadBigData(true);
    setFilter(filter);
    const result = await searchCommitteePrepare({
      ...filter,
      ...(filter.creditorType === "ทั้งหมด" && { creditorType: "" }),
      ...(filter.creditor === "ทั้งหมด" && { creditor: "" }),
    });
    if (result.isSuccess) {
      setData(result);
    } else {
      setData(null);
    }
    setLoadBigData(false);
  };
  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await searchAddedCommitteePrepare(query);
    if (result.isSuccess) {
      setAddedData(result);
    } else {
      setAddedData(null);
    }
    setLoadBigData(false);
  };
  const onAddBigData = async (selected) => {
    const selectId = selected.map(item => item.id_debt_management)
    const result = await addCommitteePrepare(selectId);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await onSearchTop({ ...filter, currentPage: 1});
      await fetchData(filterAdded);
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };
  const onRemoveMakelist = async (selected) => {
    const selectId = selected.map(item => item.id_debt_management)
    const result = await removeCommitteePrepare(selectId);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await onSearchTop({ ...filter, currentPage: 1});
      await fetchData(filterAdded);
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };
  const handleSubmit = async(selected) => {
    const custs = selected.reduce((prev, item) => { return prev.includes(item.id_card) ? prev : [ ...prev, item.id_card ]; }, []);
    const sum = selected.reduce((prev, item) => { return prev + item.debt_manage_total; }, 0)
    await setCount(toCurrency(custs.length));
    await setContracts(toCurrency(selected.length));
    await setSumTotal(toCurrency(sum,2));
    await setRequestApproveData(selected);
    await setSubmit(true);
  }
  const onSubmitMakelist = async () => {
    const ids = requestApproveData.map(item => item.id_debt_management.toString())
    const param = {
      ids,
      proposal_committee_no: 'กฟก.' + bookNo,
      proposal_committee_date: stringToDateTh(bookDate,false)
    }
    const resultUpdate = await updateNPLstatus(ids, status)
    if (resultUpdate.isSuccess) {
      const resultUpdate = await updateCommitteePrepare(param);
      if (resultUpdate) {
        toast((t) => (
          <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
        const result = await submitCommitteePrepare({
          type: "application/octet-stream",
          filename: "คณะกรรมการจัดการหนี้อนุมัติรายชื่อ_" + new Date().getTime() + ".zip",
          data: requestApproveData,
          status
        });
        if (result) {
          await setBookNo(null);
          await setBookDate(null);
          await fetchData(filterAdded);
        }
      } else {
        toast((t) => (
          <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
      }
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };
  const onSubmitEdit = async () => {
    const ids = editData.map(item => item.id_debt_management.toString())
    const param = {
      ids,
      proposal_committee_no: 'กฟก.' + bookNoEdit,
      proposal_committee_date: stringToDateTh(bookDateEdit,false)
    }
    const resultUpdate = await updateCommitteePrepare(param);
    if (resultUpdate) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      const result = await submitCommitteePrepare({
        type: "application/octet-stream",
        filename: "คณะกรรมการจัดการหนี้อนุมัติรายชื่อ_" + new Date().getTime() + ".zip",
        data: editData,
        status
      });
      if (result) {
        await setBookNoEdit(null);
        await setBookDateEdit(null);
      }
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };
  const onCloseMakelist = async () => {
    await setSubmit(false);
    await fetchData({ ...filterAdded, currentPage: 1 });
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
        <h4>จัดทำรายชื่อเสนอคณะกรรมการจัดการหนี้ NPL</h4>
        <div className="d-flex flex-row-reverse">
          <div>
            <button
              type="button"
              className="btn btn-primary btn-sm ms-2"
              onClick={() => setShowModal(true)}
            >
              <span className="fas fa-file-upload"></span>{" "}
              แก้ไขครั้งที่/วันที่เสนอคณะกรรมการ
            </button>
            {showModal && (
              <CustomerModal
                isOpen={showModal}
                setModal={setShowModal}
                onOk={onSubmitEdit}
                onClose={() => setShowModal(false)}
                title={"แก้ไขครั้งที่/วันที่เสนอคณะกรรมการ"}
                okText={"ดาวน์โหลดเอกสารและบันทึก"}
                closeText={"ปิด"}
                fullscreen
                children={
                  <EditDataTable 
                    bookNo={bookNoEdit} 
                    setBookNo={setBookNoEdit}
                    bookDate={bookDateEdit}
                    setBookDate={setBookDateEdit}
                    setEditData={setEditData}
                  />
                }
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
                    <Filter
                      handleSubmit={onSearchTop}
                      setLoading={setLoadBigData}
                    />
                    <br />
                    {data && (
                      <SearchDataTable
                        result={data}
                        handleSubmit={onAddBigData}
                      />
                    )}
                  </>
                )}
              />
              <According 
                title={'เสนอคณะกรรมการจัดการหนี้'}
                className={"mb-3"}
                children={(
                  <>
                    <SelectDataTable
                      result={addedData}
                      handleSubmit={handleSubmit}
                      handleRemove={onRemoveMakelist}
                      filter={filterAdded}
                      getData={fetchData}
                    />
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <CustomerModal isOpen={isSubmit} setModal={setSubmit} 
        onOk={() => onSubmitMakelist()} 
        onClose={onCloseMakelist}  
        title={'จัดทำรายชื่อเสนอคณะกรรมการจัดการหนี้ NPL'} 
        okText={'ดาวน์โหลดเอกสารและบันทึก'} 
        closeText={'ปิด'} size={'xl'}
      >
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-6">
            <BookNo title={'ครั้งที่เสนอคณะกรรมการ'} subtitle={'กฟก.'} containerClassname={'mb-3'} handleChange={(val) => setBookNo(val)} value={bookNo} />
          </div>
          <div className="col-sm-12 col-md-12 col-lg-6">
            <DatePicker title={'วันที่เสนอคณะกรรมการ'}
              value={bookDate} 
              handleChange={(val) => setBookDate(val)} 
            />
          </div>
          <div className="col-12">
            {(count && contracts && sumTotal) ? (
              <h6>
                <div className="d-flex">
                  <div className="flex-grow-1 ">{`จำนวน ${count} ราย ,${contracts} สัญญา ,ยอดเงินรวม ${sumTotal} บาท`}</div>
                </div>
              </h6>
            ) : null}
          </div>
        </div>
      </CustomerModal>
      <Loading
        isOpen={isLoadBigData}
        setModal={setLoadBigData}
        centered
        scrollable
        size={"lg"}
        title={"เรียกข้อมูลทะเบียนหนี้จาก BigData"}
        hideFooter
      >
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img
            className="mb-5"
            src={logo}
            alt="logo"
            width={150}
            height={150}
          />
          <Spinner className="mb-3" style={{ height: "3rem", width: "3rem" }} />
        </div>
      </Loading>
    </>
  );
};
export default NPL;