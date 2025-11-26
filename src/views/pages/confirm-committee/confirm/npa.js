import { useEffect, useState } from "react";
import { getUserData, toCurrency, stringToDateTh } from "@utils";
import { Spinner } from "reactstrap";
import Loading from "@views/components/modal/loading";
import logo from "@src/assets/images/icons/logo.png";
import According from "@views/components/panel/according";
import CustomerModal from "@views/components/modal/customModal";
import Filter from "@views/components/confirm-committee/filterConfirmNpa";
import SearchDataTable from "@views/components/confirm-committee/searchListTableNpa";
import SelectDataTable from "@views/components/confirm-committee/selectListTableNpa";
import { 
  searchConfirmCommitteePrepareNpa,
  completeConfirmCommittee,
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
  const status = 'สาขายืนยันยอด';
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState({});
  const [count, setCount] = useState(0);
  const [contracts, setContracts] = useState(0);
  const [sumTotal, setSumTotal] = useState(0);
  const [filterAdded, setFilterAdded] = useState({
    debtClassifyStatus: "เตรียมยืนยันยอด",
    currentPage: 1,
    pageSize: 0,
  });
  const [requestApproveData, setRequestApproveData] = useState([]);
  const onSubmit = async () => {
    const ids = requestApproveData.map(item => item.id_debt_confirm.toString());
    const result = await completeConfirmCommittee({ ids, status: "ยืนยันยอด"});
    if (result.isSuccess) {
      const ids = requestApproveData.map(item => item.id_debt_management)
      if (await updateNPAstatus(ids, "ยืนยันยอดสำเร็จ")) {
        toast((t) => (
          <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
        await onSearchTop({ ...filter, currentPage: 1});
        await fetchData(filterAdded);
      }
    }
  }
  const onSearchTop = async (filter) => {
    setLoadBigData(true);
    setFilter(filter);
    const result = await searchConfirmCommitteePrepareNpa({
      ...filter,
      ...(filter.creditorType === "ทั้งหมด" && { creditorType: "" }),
      ...(filter.creditor === "ทั้งหมด" && { creditor: "" }),
      debtClassifyStatus: "สาขายืนยันยอด",
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
    const result = await searchConfirmCommitteePrepareNpa(query);
    if (result.isSuccess) {
      setAddedData(result);
    } else {
      setAddedData(null);
    }
    setLoadBigData(false);
  };
  const onAddBigData = async (selected) => {
    const ids = selected.map(item => item.id_debt_management)
    const result = await updateNPAstatus(ids, "เตรียมยืนยันยอด");
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await onSearchTop({ ...filter, currentPage: 1});
      await fetchData(filterAdded);
    }
  };
  const onRemoveMakelist = async (selected) => {
    const ids = selected.map(item => item.id_debt_management)
    const result = await updateNPAstatus(ids, "สาขายืนยันยอด");
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await onSearchTop({ ...filter, currentPage: 1});
      await fetchData(filterAdded);
    }
  };
  const handleSubmit = async(selected) => {
    const custs = selected.reduce((prev, item) => { return prev.includes(item.id_card) ? prev : [ ...prev, item.id_card ]; }, []);
    const sum = selected.reduce((prev, item) => { return prev + (item.frD_total_payment_cf ?? item.frD_total_payment); }, 0)
    await setCount(toCurrency(custs.length));
    await setContracts(toCurrency(selected.length));
    await setSumTotal(toCurrency(sum,2));
    await setRequestApproveData(selected);
    await setSubmit(true);
  }
  const onCloseMakelist = async () => {
    await setSubmit(false);
    await fetchData({ ...filterAdded, currentPage: 1 });
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.proposal_committee_no}</td>
        <td>{item.proposal_committee_date}</td>
        <td>{item.branch_correspondence_no}</td>
        <td>{item.branch_correspondence_date ? stringToDateTh(item.branch_correspondence_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
        <td>{item.debt_manage_creditor_type}</td>
        <td>{item.debt_manage_creditor_name}</td>
        <td>{item.debt_manage_creditor_province}</td>
        <td>{item.debt_manage_creditor_branch}</td>
        <td>{item.npA_round}</td>
        <td>{item.title_document_no}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{toCurrency(item.estimated_price_creditors)}</td>
        <td>{toCurrency(item.npA_property_sales_price)}</td>
        <td>{toCurrency(item.npL_creditors_receive)}</td>
        <td>{toCurrency(item.litigation_expenses)}</td>
        <td>{toCurrency(item.insurance_premium)}</td>
        <td>{toCurrency(item.total_xpenses)}</td>
        <td>{toCurrency(item.frD_total_payment)}</td>
        <td>{item.debt_manage_status}</td>
        <td>{item.debt_manage_objective}</td>
        <td>{item.debt_manage_objective_details}</td>
        <td>{item.regulation_no}</td>
        <td>{item.collateral_type}</td>
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
        <h4>รวบรวมยืนยันยอด NPA</h4>
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
                  title={'สาขายืนยันยอด'}
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
        title={'ยืนยันยอด'} 
        okText={'ยืนยันยอด'} 
        closeText={'ปิด'} centered fullscreen
      >
        <div className="row">
          <div className="mb-2" data-list='{"valueNames":["name","email","age"]}'>
            <div className="table-responsive mx-n1 px-1">
              <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                  <tr>
                    <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>#</th>
                    <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                    <th colSpan="2">สาขายืนยันยอด</th>
                    <th colSpan="4">เกษตรกร</th>
                    <th colSpan="4">เจ้าหนี้</th>
                    <th colSpan={"15"}>สัญญา</th>
                  </tr>
                  <tr>
                    <th>ครั้งที่เสนอคณะกรรมการ</th>
                    <th>วันที่เสนอคณะกรรมการ</th>
                    <th>เลขที่หนังสือสาขายืนยันยอด</th>
                    <th>วันที่หนังสือสาขายืนยันยอด</th>
                    <th>เลขบัตรประชาชน</th>
                    <th>คำนำหน้า</th>
                    <th>ชื่อ-นามสกุล</th>
                    <th>จังหวัด</th>
                    <th>ประเภทเจ้าหนี้</th>
                    <th>สถาบันเจ้าหนี้</th>
                    <th>จังหวัดเจ้าหนี้</th>
                    <th>สาขาเจ้าหนี้</th>
                    <th>รอบ NPA</th>
                    <th>เอกสารสิทธิ์</th>
                    <th>เลขที่สัญญา</th>
                    <th>ราคาประเมินของเจ้าหนี้</th>
                    <th>ราคาขายทรัพย์ NPA</th>
                    <th>เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)</th>
                    <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                    <th>ค่าเบี้ยประกัน</th>
                    <th>รวมค่าใช้จ่าย</th>
                    <th>รวมทั้งสิ้น</th>
                    <th>สถานะหนี้</th>
                    <th>วัตถุประสงค์การกู้</th>    
                    <th>รายละเอียดวัตถุประสงค์การกู้</th>    
                    <th>ซื้อทรัพย์ตามระเบียบฯ</th>                  
                    <th>ประเภทหลักประกัน</th>
                  </tr>
                </thead>
                <tbody className="list text-center align-middle" id="bulk-select-body">
                  {(requestApproveData && requestApproveData.length > 0) ? (requestApproveData.map((item,index) => RenderData(item, index))) : (
                    <tr>
                      <td className="fs-9 text-center align-middle" colSpan={25}>
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
export default NPA;