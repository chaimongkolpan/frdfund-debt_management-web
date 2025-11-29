import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import According from "@views/components/panel/according";
import BookNo from "@views/components/input/BookNo";
import DatePicker from "@views/components/input/DatePicker";
import Modal from "@views/components/modal/fullModal";
import CustomerModal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import Filter from "@views/components/proposeForApproval/NPL/filter";
import PrepareRequestApproveTable from "@views/components/proposeForApproval/NPL/prepareRequestApproveTable";
import RequestApproveTable from "@views/components/proposeForApproval/NPL/requestApproveTable";
import ConfirmTable from "@views/components/proposeForApproval/NPL/confirmTable";
import RegisterModal from "@views/components/proposeForApproval/NPL/registrationModal";
import FilterRegis from "@views/components/proposeForApproval/NPL/filterResigtration";
import logo from "@src/assets/images/icons/logo.png";
import {
  cleanData,
  searchBranchOffer,
  getBranchOffer,
  addBranchOffer,
  removeBranchOffer,
  updateBranchOffer,
  submitBranchOffer,
  uploadBranchOffer,
} from "@services/api";
import { stringToDateTh, getUserData, getBookNo } from "@utils";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const BranchOfferNPL = () => {
  const allow_roles = [1,2,4,7,8,9];
  const can_action = allow_roles.includes(user?.role)
  const [showModal, setShowModal] = useState(false);
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState({});
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadBookNo, setUploadBookNo] = useState(null);
  const [uploadBookDate, setUploadBookDate] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [filterAdded, setFilterAdded] = useState({
    currentPage: 1,
    pageSize: process.env.VITE_PAGESIZE,
  });
  const [requestApproveData, setRequestApproveData] = useState([]);
  const onUpload = async () => {
    const form = new FormData();
    form.append('book_no', uploadBookNo);
    form.append('book_date', uploadBookDate);
    await Promise.all(
      files.map(async(file) => {
        form.append('files', file);
      })
    )

    const result = await uploadBranchOffer(form)
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      setUploadSuccess(true);
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };
  const onSearchTop = async (filter) => {
    setLoadBigData(true);
    setFilter(filter);
    const result = await searchBranchOffer({
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

  const onAddBigData = async (selected) => {
    const result = await addBranchOffer(selected);
    if (result.isSuccess) {
      // toast((t) => (
      //   <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      // ));
      await setLoadBigData(true);
      await fetchData(filterAdded);
      await onSearchTop({ ...filter, currentPage: 1});
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };

  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await getBranchOffer();
    if (result.isSuccess) {
      setAddedData(result);
    } else {
      setAddedData(null);
    }
    await setLoadBigData(false);
  };

  const onRemoveMakelist = async (selected) => {
    const result = await removeBranchOffer(selected);
    if (result.isSuccess) {
      // toast((t) => (
      //   <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      // ));
      await setLoadBigData(true);
      await fetchData(filterAdded);
      await onSearchTop({ ...filter, currentPage: 1});
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };

  const onSubmitMakelist = async () => {
    const ids = requestApproveData.map(item => item.id_debt_management.toString())
    const param = {
        ids,
        text_no: 'กฟก.' + getBookNo() + bookNo,
        date: stringToDateTh(bookDate,false)
    }
    const resultUpdate = await updateBranchOffer(param)
    if (resultUpdate.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      const result = await submitBranchOffer({
        type: "application/octet-stream",
        filename: "สาขาเสนออนุมัติรายชื่อ_" + new Date().getTime() + ".zip",
        data: requestApproveData,
      });
      if (result) {
        await setBookNo(null);
        await setBookDate(null);
        await fetchData(filterAdded);
      }
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };

  const onCloseMakelist = async () => {
    setSubmit(false);
  };

  const onCloseRegisterNPAModel = () => {
    setShowModal(false);
  };

  const handleSubmit = async (selected) => {
    setRequestApproveData(selected);
    setSubmit(true);
  };

  useEffect(() => {}, [data]);

  useEffect(() => {
    setLoadBigData(true);
    fetchData(filterAdded);
    // onSearchTop(filter);
    return cleanData;
  }, []);

  return (
    <>
      <div className="content">
        <h4>สาขาเสนอขออนุมัติรายชื่อ NPL</h4>
        {can_action && (
          <div className="d-flex flex-row-reverse">
            <div>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-2"
                onClick={() => setShowModal(true)}
              >
                <span className="fas fa-file-upload"></span>{" "}
                อัพโหลดเอกสารและเสนอขออนุมัติรายชื่อ
              </button>
              {showModal && (
                <CustomerModal
                  isOpen={showModal}
                  setModal={setShowModal}
                  onOk={onUpload}
                  onClose={onCloseRegisterNPAModel}
                  title={"อัพโหลดเอกสารและเสนอขออนุมัติรายชื่อ"}
                  okText={"เสนอขออนุมัติรายชื่อ"}
                  closeText={"ปิด"}
                  size={'xl'}
                  children={
                    <>
                      <FilterRegis
                        bookNo={uploadBookNo}
                        setBookNo={setUploadBookNo}
                        bookDate={uploadBookDate}
                        setBookDate={setUploadBookDate}
                        files={files}
                        setFiles={setFiles}
                      />
                    </>
                  }
                />
              )}
            </div>
          </div>
        )}
        <div className="row g-4">
          <div className="col-12 col-xl-12 order-1 order-xl-0">
            <div className="mb-9">
              <According
                title={"ค้นหา"}
                className={"my-4"}
                children={
                  <>
                    <Filter
                      handleSubmit={onSearchTop}
                      setLoading={setLoadBigData}
                    />
                    <br />
                    {data && (
                      <PrepareRequestApproveTable
                        result={data}
                        handleSubmit={onAddBigData}
                        filter={filter} getData={onSearchTop}
                        can_action={can_action}
                      />
                    )}
                  </>
                }
              />
              {can_action && (
                <According
                  title={"เสนอขออนุมัติรายชื่อ"}
                  className={"mb-3"}
                  children={
                    <RequestApproveTable
                      result={addedData}
                      handleSubmit={handleSubmit}
                      handleRemove={onRemoveMakelist}
                      filter={filterAdded}
                      getData={fetchData}
                    />
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isSubmit}
        setModal={setSubmit}
        onOk={onSubmitMakelist}
        onClose={onCloseMakelist}
        title={"เสนอขออนุมัติรายชื่อ"}
        okText={"ดาวน์โหลดเอกสารและบันทึก"}
        closeText={"ปิด"}
        scrollable
      >
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-6 mb-3">
            <BookNo title={'เลขหนังสือ'} subtitle={'กฟก.' + getBookNo()} handleChange={(val) => setBookNo(val)} value={bookNo} />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 mb-3">
            <DatePicker title={'วันที่หนังสือ'}
              value={bookDate} 
              handleChange={(val) => setBookDate(val)} 
            />
          </div>
        </div>
        <ConfirmTable data={requestApproveData} />
      </Modal>
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

export default BranchOfferNPL;
