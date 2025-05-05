import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import According from "@views/components/panel/according";
import BookNo from "@views/components/input/BookNo";
import DatePicker from "@views/components/input/DatePicker";
import Modal from "@views/components/modal/FullModal";
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
  submitListNPA,
} from "@services/api";

const BranchOfferNPL = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState({});
  const [makelistSelected, setMakeList] = useState(null);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [filterAdded, setFilterAdded] = useState({
    currentPage: 1,
    pageSize: process.env.PAGESIZE,
  });
  const [requestApproveData, setRequestApproveData] = useState([]);

  const onSearchTop = async (filter) => {
    setLoadBigData(true);
    setFilter(filter);
    const result = await searchBranchOffer({
      DebtClassifyStatus: "จำแนกมูลหนี้แล้ว",
      ...filter,
      ...(filter.creditorType === "ทั้งหมด" && { creditorType: "" }),
      ...(filter.creditor === "ทั้งหมด" && { creditor: "" }),
    });
    if (result.isSuccess) {
      console.log("onSearchTop", result);
      setData(result);
    } else {
      setData(null);
    }
    setLoadBigData(false);
  };

  const onAddBigData = async (selected) => {
    const result = await addBranchOffer(selected);
    if (result.isSuccess) {
      await onSearchTop({ ...filter, currentPage: 1});
      await fetchData(filterAdded);
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
  };

  const onRemoveMakelist = async (selected) => {
    const result = await removeBranchOffer(selected);
    if (result.isSuccess) {
      await onSearchTop({ ...filter, currentPage: 1});
      await fetchData(filterAdded);
    }
  };

  const onSubmitMakelist = async () => {
    const result = await submitListNPA({
      type: "application/octet-stream",
      filename: "สาขาเสนออนุมัติรายชื่อ_" + new Date().getTime() + ".zip",
      data: makelistSelected,
    });
    if (result.isSuccess) {
      await setBookNo(null);
      await setBookDate(null);
      await fetchData(filterAdded);
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
              <RegisterModal
                isOpen={showModal}
                setModal={setShowModal}
                onClose={onCloseRegisterNPAModel}
                title={"อัพโหลดเอกสารและเสนอขออนุมัติรายชื่อ"}
                closeText={"ปิด"}
                scrollable
                children={
                  <>
                    <FilterRegis
                      handleSubmit={onSearchTop}
                      setLoading={setLoadBigData}
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
                      handleSubmit={onSearchTop}
                      setLoading={setLoadBigData}
                    />
                    <br />
                    {data && (
                      <PrepareRequestApproveTable
                        result={data}
                        handleSubmit={onAddBigData}
                      />
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
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-6 mb-3">
            <BookNo title={'เลขหนังสือ'} subtitle={'กฟก.'} handleChange={(val) => setBookDate(val)} value={bookNo} />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6 mb-3">
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
