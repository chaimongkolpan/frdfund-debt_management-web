import { useEffect, useState } from "react";
import { getUserData, toCurrency, stringToDateTh, getBookNo } from "@utils";
import { Spinner } from "reactstrap";
import DropZone from "@views/components/input/DropZone";
import Loading from "@views/components/modal/loading";
import logo from "@src/assets/images/icons/logo.png";
import According from "@views/components/panel/according";
import CustomerModal from "@views/components/modal/customModal";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import Filter from "@views/components/confirm-committee/filter";
import SearchDataTable from "@views/components/confirm-committee/searchPrepareTable";
import SelectDataTable from "@views/components/confirm-committee/selectPrepareTable";
import { 
  searchConfirmCommitteePrepare,
  submitConfirmCommitteePrepare,
  updateNPLstatus,
  cleanData
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const NPL = () => {
  const allow_roles = [1,2,4,7,8,9];
  const can_action = allow_roles.includes(user?.role)
  const status = 'สาขายืนยันยอด';
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState({});
  const [coop, setCoop] = useState(true);
  const [clearFile, setClear] = useState(false);
  const [branchNo, setBranchNo] = useState(null);
  const [branchDate, setBranchDate] = useState(null);
  const [count, setCount] = useState(0);
  const [contracts, setContracts] = useState(0);
  const [sumTotal, setSumTotal] = useState(0);
  const [filterAdded, setFilterAdded] = useState({
    debtClassifyStatus: "สาขาเตรียมยืนยันยอด",
    confirmStatus: "'กำลังดำเนินการ','แก้ไขยืนยันยอด'",
    currentPage: 1,
    pageSize: 0,
  });
  const [requestApproveData, setRequestApproveData] = useState([]);
  const [files, setFiles] = useState(null);
  const onSubmit = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      await new Promise((resolve, reject) => {
        try {
          const param = requestApproveData.map((item,index) => {
            form.append('ids[' + index + ']', item.id_debt_confirm.toString());
            return {
              id_debt_confirm: item.id_debt_confirm
            }
          });
          resolve(param);
        } catch {
          reject(null);
        }
      });
      files.forEach((item) => form.append("files", item));
      form.append("debt_manage_type", 'NPL')
      form.append("branch_correspondence_no", 'กฟก.'+ getBookNo()  + branchNo)
      form.append("branch_correspondencel_date", stringToDateTh(branchDate, false))
      const result = await submitConfirmCommitteePrepare(form);
      if (result.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
        await setCount(toCurrency(0));
        await setContracts(toCurrency(0));
        await setSumTotal(toCurrency(0,2));
        await fetchData(filterAdded);
      } else {
        toast((t) => (
          <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
      }
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'กรุณาอัปโหลดไฟล์'} />
      ));
      console.error('no file upload');
    }
  }
  const onFileChange = async (files) => {
    if (files.length > 0) {
      await setFiles(files);
      await setClear(false);
    }
  }
  const onSearchTop = async (filter) => {
    setLoadBigData(true);
    setFilter(filter);
    const result = await searchConfirmCommitteePrepare({
      ...filter,
      ...(filter.creditorType === "ทั้งหมด" && { creditorType: "" }),
      ...(filter.creditor === "ทั้งหมด" && { creditor: "" }),
      debtClassifyStatus: "คณะกรรมการจัดการหนี้อนุมัติ",
      confirmStatus: "'กำลังดำเนินการ','แก้ไขยืนยันยอด'",
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
    const result = await searchConfirmCommitteePrepare(query);
    if (result.isSuccess) {
      setAddedData(result);
    } else {
      setAddedData(null);
    }
    setLoadBigData(false);
  };
  const onAddBigData = async (selected) => {
    const ids = selected.map(item => item.id_debt_management)
    const result = await updateNPLstatus(ids, "สาขาเตรียมยืนยันยอด");
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
    const ids = selected.map(item => item.id_debt_management)
    const result = await updateNPLstatus(ids, "คณะกรรมการจัดการหนี้อนุมัติ");
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
    const sum = selected.reduce((prev, item) => { return prev + (item.debt_manage_total_cf ?? item.debt_manage_total); }, 0)
    await setCount(toCurrency(custs.length));
    await setContracts(toCurrency(selected.length));
    await setSumTotal(toCurrency(sum,2));
    await setRequestApproveData(selected);
    await setCoop(selected && selected[0]?.debt_manage_creditor_type == 'สหกรณ์')
    await setSubmit(true);
  }
  const onCloseMakelist = async () => {
    await setSubmit(false);
    await fetchData({ ...filterAdded, currentPage: 1 });
  }
  const RenderData = (item, index, checked) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.proposal_committee_no}</td>
        <td>{item.proposal_committee_date}</td>
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
        <td>{item.debt_manage_creditor_type}</td>
        <td>{item.debt_manage_creditor_name}</td>
        <td>{item.debt_manage_creditor_province}</td>
        <td>{item.debt_manage_creditor_branch}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{toCurrency(item.debt_manage_outstanding_principal)}</td>
        <td>{toCurrency(item.debt_manage_accrued_interest)}</td>
        <td>{toCurrency(item.debt_manage_fine)}</td>
        <td>{toCurrency(item.debt_manage_litigation_expenses)}</td>
        <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee)}</td>
        {!coop && (
          <>
            <td>{toCurrency(item.debt_manage_insurance_premium)}</td>
            <td>{toCurrency(item.debt_manage_other_expenses)}</td>
          </>
        )}
        <td>{toCurrency(item.debt_manage_total_expenses)}</td>
        <td>{toCurrency(item.debt_manage_total)}</td>
        <td>{item.debt_manage_status}</td>
        <td>{item.collateral_type}</td>
        <td>{item.debt_manage_objective}</td>
        <td>{item.debt_manage_objective_details}</td>
      </tr>
    ))
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
        <h4>สาขายืนยันยอด NPL</h4>
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
                        filter={filter}
                        getData={onSearchTop}
                        can_action={can_action}
                      />
                    )}
                  </>
                )}
              />
              {can_action && (
                <According 
                  title={'รวบรวมยืนยันยอด'}
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
              )}
            </div>
          </div>
        </div>
      </div>
      <CustomerModal isOpen={isSubmit} setModal={setSubmit} 
        onOk={() => onSubmit()} 
        onClose={onCloseMakelist}  
        title={'สาขายืนยันยอด'} 
        okText={'บันทึก'} 
        closeText={'ปิด'} centered fullscreen
      >
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-6">
            <BookNo title={'เลขหนังสือนำส่งสาขา'} subtitle={'กฟก.'+ getBookNo() } containerClassname={'mb-3'} handleChange={(val) => setBranchNo(val)} value={branchNo} />
          </div>
          <div className="col-sm-12 col-md-12 col-lg-6">
            <DatePicker title={'วันที่หนังสือนำส่งสาขา'}
              value={branchDate} 
              handleChange={(val) => setBranchDate(val)} 
            />
          </div>
          <div className="col-12 ">
            <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
          </div>
          <div className="col-12">
            <div className="row justify-content-center mt-2">
              <div className="col-auto">
                <button className="btn btn-subtle-success me-1 mb-1" type="button" onClick={() => onSubmit()}>นำไฟล์เข้าระบบ</button>
              </div>
            </div>
          </div>
          <div className="mb-2" data-list='{"valueNames":["name","email","age"]}'>
            <div className="table-responsive mx-n1 px-1">
              <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                  <tr>
                    <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>#</th>
                    <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                    <th colSpan="4">เกษตรกร</th>
                    <th colSpan="4">เจ้าหนี้</th>
                    <th colSpan={coop ? "12" : "14"}>สัญญา</th>
                  </tr>
                  <tr>
                    <th>ครั้งที่เสนอคณะกรรมการ</th>
                    <th>วันที่เสนอคณะกรรมการ</th>
                    <th>เลขบัตรประชาชน</th>
                    <th>คำนำหน้า</th>
                    <th>ชื่อ-นามสกุล</th>
                    <th>จังหวัด</th>
                    <th>ประเภทเจ้าหนี้</th>
                    <th>สถาบันเจ้าหนี้</th>
                    <th>จังหวัดเจ้าหนี้</th>
                    <th>สาขาเจ้าหนี้</th>
                    <th>เลขที่สัญญา</th>
                    <th>เงินต้น</th>
                    <th>ดอกเบี้ย</th>
                    <th>ค่าปรับ</th>
                    <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                    <th>ค่าถอนการยึดทรัพย์</th>
                    {!coop && (
                      <>
                        <th>ค่าเบี้ยประกัน</th>
                        <th>ค่าใช้จ่ายอื่นๆ</th>
                      </>
                    )}
                    <th>รวมค่าใช้จ่าย</th>
                    <th>รวมทั้งสิ้น</th>
                    <th>สถานะหนี้</th>
                    <th>ประเภทหลักประกัน</th>
                    <th>วัตถุประสงค์การกู้</th>
                    <th>รายละเอียดวัตถุประสงค์การกู้</th>
                  </tr>
                </thead>
                <tbody className="list text-center align-middle" id="bulk-select-body">
                  {(requestApproveData && requestApproveData.length > 0) ? (requestApproveData.map((item,index) => RenderData(item, index))) : (
                    <tr>
                      <td className="fs-9 text-center align-middle" colSpan={coop ? 23 : 25}>
                        <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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