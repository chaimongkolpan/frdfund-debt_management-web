import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/CustomModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/account/invoice/filter";
import SearchTable from "@views/components/account/invoice/searchTable";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchInvoice,
  getInvoice,
  getInvoiceByPolicyNo,
  printInvoice,
} from "@services/api";

const user = getUserData();
const PageContent = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [plans, setPlans] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const handlePrint = async (selected) => {
    const ids = selected.map(item => item.id_PlanPay)
    const selectedData = await getInvoice(ids);
    const receipts = selectedData.data;
    const param = { type: 'application/octet-stream', filename: 'หนังสือ-ใบแจ้งหนี้_' + (new Date().getTime()) + '.zip', data: { receipts } };
    const result = await printInvoice(param);
    if (result.isSuccess) {
      await onSearch(filter)
    }
  }
  const printReceipt = async (item) => {
    const ids = [item.id_PlanPay]
    const selectedData = await getInvoice(ids);
    const receipts = selectedData.data.map(item => { return { ...item, isExportExcel: false }});
    const param = { type: 'application/octet-stream', filename: 'หนังสือ-ใบแจ้งหนี้_' + (new Date().getTime()) + '.zip', data: { receipts } };
    const result = await printInvoice(param);
    if (result.isSuccess) {
      await onSearch(filter)
    }
  }
  const handleShowDetail = async (item) => {
    await setPolicy(item);
    const result = await getInvoiceByPolicyNo(item.policyNO);
    if (result.isSuccess) {
      await setPlans(result.data)
    }
    await setOpenDetail(true);
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchInvoice(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  return (
    <>
      <div className="content">
        <h4 className="mb-3">ออกใบแจ้งหนี้</h4>
        <div className="mt-4">
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
                        <SearchTable result={data} filter={filter} getData={onSearch} handlePrint={handlePrint} handleShowDetail={handleShowDetail} />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {openDetail && (
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk onClose={() => setOpenDetail(false)}  title={'ประวัติใบแจ้งหนี้'} closeText={'ปิด'} scrollable fullscreen>
          <form>
            <br />
            <div className="row">
              <div className="table-responsive mx-n1 px-1">
                <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                  <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                    <tr>
                      <th>งวดที่</th>
                      <th>วันครบกำหนดชำระ</th>
                      <th>ค่างวดตามแผน</th>
                      <th>ต้นยกมา</th>
                      <th>ดอกเบี้ย</th>
                      <th>หักเงินต้น</th>
                      <th>ยอดเงินคงเหลือ</th>
                      <th>อัตราดอกเบี้ย</th>
                      <th>อัตราค่าปรับ</th>
                      <th>สถานะออกใบแจ้งหนี้</th>
                      <th>สถานะการปริ้นใบแจ้งหนี้</th>
                      <th>วันที่ปริ้นใบแจ้งหนี้</th>
                      <th>ดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="list text-center align-middle" id="bulk-select-body">
                    {(plans && plans.length > 0) ? (plans.map((item,index) => (
                      <tr key={index}>
                        <td>{item.planNo}</td>
                        <td>{stringToDateTh(item.pDate, false)}</td>
                        <td>{toCurrency(item.installment, 2)}</td>
                        <td>{toCurrency(item.yokma, 2)}</td>
                        <td>{toCurrency(item.interest, 2)}</td>
                        <td>{toCurrency(item.deduc, 2)}</td>
                        <td>{toCurrency(item.balance, 2)}</td>
                        <td>{toCurrency(item.interesRate, 2)}</td>
                        <td>{toCurrency(item.plubRate, 2)}</td>
                        <td>{item.invStatus}</td>
                        <td>{item.printInvStatus == 0 ? 'ยังไม่ได้ปริ้น' : 'ปริ้นแล้ว'}</td>
                        <td>{stringToDateTh(item.printInvDate, false)}</td>
                        <td className="d-flex justify-content-center">
                          <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type="button" onClick={() => printReceipt(item)}><i className="fas fa-print"></i></button>
                        </td>
                      </tr>
                    ))) : (
                      <tr>
                        <td className="fs-9 text-center align-middle" colSpan={20}>
                          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </Modal>
      )}
      <Loading isOpen={isLoadBigData} setModal={setLoadBigData} centered scrollable size={'lg'} title={'เรียกข้อมูลทะเบียนหนี้จาก BigData'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default PageContent;