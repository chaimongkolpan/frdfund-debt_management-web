import { useEffect, useCallback, useState } from "react";
import { getUserData, toCurrency, stringToDateTh } from "@utils";
import { Spinner } from "reactstrap";
import Loading from "@views/components/modal/loading";
import logo from "@src/assets/images/icons/logo.png";
import CustomerModal from "@views/components/modal/CustomModal";
import According from "@views/components/panel/according";
import Filter from "@views/components/committee/updateFilterNpa";
import DataTable from "@views/components/committee/updateTableNpa";
import DataRejectTable from "@views/components/committee/updateRejectTableNpa";
import EditDataTable from "@views/components/committee/downloadTableNpa";
import { 
  searchCommitteeUpdateNpa,
  approveCommitteeUpdateNpa,
  rejectCommitteeUpdateNpa,
  updateNPAstatus,
  cleanData
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const NPA = () => {
  const allow_roles = [1,2,7,8,9];
  const can_action = allow_roles.includes(user?.role)
  const status = 'คณะกรรมการจัดการหนี้อนุมัติ';
  const [showModal, setShowModal] = useState(false);
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [isReject, setReject] = useState(false);
  const [data, setData] = useState(null);
  const [dataReject, setDataReject] = useState(null);
  const [filter, setFilter] = useState({});
  const [bookNoEdit, setBookNoEdit] = useState(null);
  const [bookDateEdit, setBookDateEdit] = useState(null);
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState(null);
  const onSearchTop = async (filter) => {
    setLoadBigData(true);
    setFilter(filter);
    setData(null);
    const result = await searchCommitteeUpdateNpa({
      ...filter,
      // debtClassifyStatus: "รอเสนอคณะกรรมการจัดการหนี้",
    });
    if (result.isSuccess) {
      setData(result);
    } else {
      setData(null);
    }
    setLoadBigData(false);
  };
  const onAddBigData = async (selected) => {
    const selectId = selected.map(item => item.id_debt_management);
    await setSelected(selectId);
    await setSubmit(true);
  };
  const onRemoveMakelist = async (selected) => {
    const selectId = selected.map(item => item.id_debt_management);
    await setDataReject(selected);
    await setSelected(selectId);
    await setReject(true);
  };
  const onApprove = async () => {
    const result = await updateNPAstatus(selected,status);
    if (result) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await approveCommitteeUpdateNpa({ ids: selected });
      await onSearchTop(filter);
      await setSubmit(false);
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };
  const onReject = async () => {
    const result = await updateNPAstatus(selected,"คณะกรรมการจัดการหนี้ไม่อนุมัติ");
    if (result) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await rejectCommitteeUpdateNpa({ ids: selected, remark });
      await onSearchTop(filter);
      await setReject(false);
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  };
  return (
    <>
      <div className="content">
        <h4>ปรับปรุงรายชื่อที่ผ่านการอนุมัติจากคณะกรรมการ NPA</h4>
        {can_action && (
          <div className="d-flex flex-row-reverse">
            <div>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-2"
                onClick={() => setShowModal(true)}
              >
                <span className="fas fa-file-upload"></span>{" "}
                ดาวน์โหลดเอกสารประกาศรายชื่อ
              </button>
              {showModal && (
                <CustomerModal
                  isOpen={showModal}
                  setModal={setShowModal}
                  // onOk={onSubmitEdit}
                  onClose={() => setShowModal(false)}
                  title={"ดาวน์โหลดเอกสารประกาศรายชื่อ"}
                  okText={"ดาวน์โหลด"}
                  closeText={"ปิด"}
                  size={'xl'}
                  children={
                    <EditDataTable 
                      bookNo={bookNoEdit} 
                      setBookNo={setBookNoEdit}
                      bookDate={bookDateEdit}
                      setBookDate={setBookDateEdit}
                    />
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
                      <DataTable
                        result={data}
                        handleSubmit={onAddBigData}
                        handleReject={onRemoveMakelist}
                        can_action={can_action}
                      />
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <CustomerModal
        isOpen={isSubmit}
        setModal={setSubmit}
        onOk={onApprove}
        onClose={() => setSubmit(false)}
        title={"ยืนยันการอนุมัติจากคณะกรรมการจัดการหนี้"}
        okText={"ยืนยัน"}
        closeText={"ยกเลิก"}
        centered
        children={<p className="text-body-tertiary lh-lg mb-0">ยืนยันอนุมัติ</p>}
      />
      <CustomerModal
        isOpen={isReject}
        setModal={setReject}
        onOk={onReject}
        onClose={() => setReject(false)}
        title={"ยืนยันการไม่อนุมัติจากคณะกรรมการจัดการหนี้"}
        okColor={'danger'}
        okText={"ยืนยันไม่อนุมัติ"}
        closeText={"ปิด"}
        fullscreen
        children={
          <>
            {dataReject && (
              <DataRejectTable
                result={dataReject}
                remark={remark} setRemark={setRemark}
              />
            )}
          </>
        }
      />
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
export default NPA;