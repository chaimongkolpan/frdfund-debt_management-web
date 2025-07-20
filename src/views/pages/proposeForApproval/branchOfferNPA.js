import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import According from "@views/components/panel/according";
import BookNo from "@views/components/input/BookNo";
import DatePicker from "@views/components/input/DatePicker";
import Modal from "@views/components/modal/FullModal";
import Loading from "@views/components/modal/loading";
import Filter from "@views/components/proposeForApproval/NPA/filter";
import CustomerModal from "@views/components/modal/CustomModal";
import PrepareRequestApproveTable from "@views/components/proposeForApproval/NPA/prepareRequestApproveTable";
import RequestApproveTable from "@views/components/proposeForApproval/NPA/requestApproveTable";
import ConfirmTable from "@views/components/proposeForApproval/NPA/confirmTable";
import FilterRegis from "@views/components/proposeForApproval/NPA/filterResigtration";
import logo from "@src/assets/images/icons/logo.png";
import { stringToDateTh } from "@utils";
import {
  cleanData,
  searchBranchOfferNpa,
  getBranchOfferNpa,
  addBranchOfferNpa,
  removeBranchOfferNpa,
  updateBranchOfferNpa,
  submitBranchOfferNpa,
  uploadBranchOfferNpa,
} from "@services/api";

const BranchOfferNPA = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadBookNo, setUploadBookNo] = useState(null);
  const [uploadBookDate, setUploadBookDate] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [requestApproveData, setRequestApproveData] = useState([]);
  const [filterAdded, setFilterAdded] = useState({
    currentPage: 1,
    pageSize: process.env.PAGESIZE,
  });
  const onUpload = async () => {
    const form = new FormData();
    form.append('book_no', uploadBookNo);
    form.append('book_date', uploadBookDate);
    await Promise.all(
      files.map(async(file) => {
        form.append('files', file);
      })
    )

    const result = await uploadBranchOfferNpa(form)
    if (result.isSuccess) {
      setUploadSuccess(true);
    }
  };
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter);
    const result = await searchBranchOfferNpa(filter);
    if (result.isSuccess) {
      setData(result);
    } else {
      setData(null);
    }
    setLoadBigData(false);
  };
  const onAddBigData = async (selected) => {
    const result = await addBranchOfferNpa(selected);
    if (result.isSuccess) {
      await onSearch(filter);
      await fetchData(filterAdded);
    }
  };
  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await getBranchOfferNpa(query);
    if (result.isSuccess) {
      setAddedData(result);
    } else {
      setAddedData(null);
    }
  };
  const onRemoveMakelist = async (selected) => {
    const result = await removeBranchOfferNpa(selected);
    if (result.isSuccess) {
      await fetchData(filterAdded);
    }
  };
  const onSubmitMakelist = async () => {
    const ids = requestApproveData.map(item => item.id_debt_management.toString())
    const param = {
        ids,
        text_no: 'กฟก.' + bookNo,
        date: stringToDateTh(bookDate,false)
    }
    const resultUpdate = await updateBranchOfferNpa(param)
    if (resultUpdate.isSuccess) {
      const result = await submitBranchOfferNpa({
        type: "application/octet-stream",
        filename: "สาขาเสนออนุมัติรายชื่อ_" + new Date().getTime() + ".zip",
        data: requestApproveData,
      });
      if (result) {
        await setBookNo(null);
        await setBookDate(null);
        await fetchData(filterAdded);
      }
    }
  };
  const onCloseMakelist = async () => {
    setSubmit(false);
  };
  const onCloseRegisterNPAModel = () => {
    setShowModal(false);
  };
  const handleSubmit = async (selected) => {
    await setRequestApproveData(selected);
    await setSubmit(true);
  };
  useEffect(() => {}, [data]);
  useEffect(() => {
    setLoadBigData(true);
    fetchData(filterAdded);
    return cleanData;
  }, []);

  return (
    <>
      <div className="content">
        <h4>สาขาเสนอขออนุมัติรายชื่อ NPA</h4>
        <div className="d-flex flex-row-reverse">
          <div>
            <button
              type="button"
              className="btn btn-primary btn-sm ms-2"
              onClick={() => setShowModal(true)}
            >
              <span className="fas fa-file-upload"></span> อัพโหลดเอกสารและเสนอขออนุมัติรายชื่อ
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
        <div className="row g-4">
          <div className="col-12 col-xl-12 order-1 order-xl-0">
            <div className="mb-9">
              <According
                title={"ค้นหา"}
                className={"my-4"}
                children={
                  <>
                    <Filter
                      handleSubmit={onSearch}
                      setLoading={setLoadBigData}
                    />
                    <br />
                    {data && (
                      <PrepareRequestApproveTable result={data} handleSubmit={onAddBigData} />
                    )}
                  </>
                }
              />
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
            <BookNo title={'เลขหนังสือ'} subtitle={'กฟก.'} handleChange={(val) => setBookNo(val)} value={bookNo} />
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

export default BranchOfferNPA;
