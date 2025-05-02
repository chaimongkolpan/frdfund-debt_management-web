import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/FullModal";
import Loading from "@views/components/modal/loading";
import Filter from "@views/components/proposeForApproval/NPA/filter";
import PrepareRequestApproveTable from "@views/components/proposeForApproval/NPA/prepareRequestApproveTable";
import RequestApproveTable from "@views/components/proposeForApproval/NPA/requestApproveTable";
import ConfirmTable from "@views/components/proposeForApproval/NPA/confirmTable";
import RegisterModal from "@views/components/proposeForApproval/NPA/registrationModal";
import FilterRegis from "@views/components/proposeForApproval/NPA/filterResigtration";
import logo from "@src/assets/images/icons/logo.png";
import {
  cleanData,
  searchRegisteredNPA,
  getContractNPAToList,
  removeContractNPAToList,
  addContractNPAToList,
  submitListNPA,
} from "@services/api";

const BranchOfferNPA = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [makelistSelected, setMakeList] = useState(null);
  const [filterAdded, setFilterAdded] = useState({
    currentPage: 1,
    pageSize: process.env.PAGESIZE,
  });

  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter);
    const result = await searchRegisteredNPA(filter);
    if (result.isSuccess) {
      setData(result);
    } else {
      setData(null);
    }
    setLoadBigData(false);
  };

  const onAddBigData = async (selected) => {
    const result = await addContractNPAToList(selected);
    if (result.isSuccess) {
      await onSearch(filter);
      await fetchData(filterAdded);
    }
  };

  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await getContractNPAToList(query);
    if (result.isSuccess) {
      setAddedData(result);
    } else {
      setAddedData(null);
    }
  };

  const onRemoveMakelist = async (selected) => {
    const result = await removeContractNPAToList(selected);
    if (result.isSuccess) {
      await fetchData(filterAdded);
    }
  };

  const onSubmitMakelist = async () => {
    setSubmit(false);
    setLoadBigData(true);
    const clearTimer = setTimeout(() => {
      setLoadBigData(false);
      // show timeout
    }, 10000);
    const result = await submitListNPA({
      type: "application/octet-stream",
      filename: "จัดทำรายชื่อเกษตรกร_" + new Date().getTime() + ".zip",
      data: makelistSelected,
    });
    if (result.isSuccess) {
      await fetchData(filterAdded);
    }
    clearTimeout(clearTimer);
    setLoadBigData(false);
  };

  const onCloseMakelist = async () => {
    setSubmit(false);
  };

  const onCloseRegisterNPAModel = () => {
    setShowModal(false);
  };

  const handleSubmit = async (selected) => {
    await setMakeList(selected);
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
                      handleSubmit={onSearch}
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
        <ConfirmTable data={makelistSelected} />
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
