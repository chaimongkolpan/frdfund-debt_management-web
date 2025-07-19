import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/CustomModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/close/filter";
import SearchTable from "@views/components/close/searchTable";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchClose,
} from "@services/api";

const user = getUserData();
const Close = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openRequestClose, setOpenRequestClose] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchClose(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const handleRequestClose = async (item) => {
    await setPolicy(item);
    await setOpenRequestClose(true);
  }
  const handleShowDetail = async (item) => {
    await setPolicy(item);
    await setShowCal(false);
    await setOpenDetail(true);
  }
  const print = async () => {
    // print
  }
  const cal = async () => {
    await setShowCal(true);
  }
  return (
    <>
      <div className="content">
        <h4 className="mb-3">ปิดสัญญา</h4>
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
                        <SearchTable result={data} filter={filter} getData={onSearch} 
                          handleShowDetail={handleShowDetail}
                          handleRequestClose={handleRequestClose}
                        />
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
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk onClose={() => setOpenDetail(false)}  title={'คำนวนยอดปิดสัญญา'} closeText={'ปิด'} scrollable fullscreen>
          <form>
            <br />
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <Textbox title={'วันที่ปิดสัญญา'} disabled containerClassname={'mb-3'} value={stringToDateTh(new Date(), false)} />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                <button className="btn btn-primary ms-2" type="button" onClick={() => cal()}>คำนวณ</button>
              </div>
              {showCal && (
                <div className="mb-1 mt-1">
                  <div className="card shadow-none border my-4" data-component-card="data-component-card">
                    <div className="card-body p-0">
                      <div className="mb-3">
                        <div className="table-responsive mx-n1 px-1">
                          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                              <tr>
                                <th style={{ minWidth: 30 }}>#</th>
                                <th>ค่าปรับยกมา ณ วันที่</th>
                                <th>วันที่ปิดสัญญา</th>
                                <th>รวม</th>
                              </tr>
                            </thead>
                            <tbody className="list text-center align-middle">
                              <tr>
                                <td>ต้นเงินยกมา</td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                              </tr>
                              <tr>
                                <td>ค่าปรับ</td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                              </tr>
                              <tr>
                                <td>ค่าจัดการ</td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                              </tr>
                              <tr>
                                <td colSpan={3}><b>ยอดปิดบัญชี</b></td>
                                <td>{toCurrency(policy.loan_amount)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className={`d-flex justify-content-center`}>
                        <button className="btn btn-success me-2" type="button" onClick={() => print()}>
                          <i className="fas fa-print me-2"></i>ออกใบแจ้งหนี้ปิดสัญญา
                        </button>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Modal>
      )}
      {openRequestClose && (
        <Modal isOpen={openRequestClose} setModal={setOpenRequestClose} hideOk onClose={() => setOpenRequestClose(false)}  title={'ยื่นคำร้องปิดสัญญา'} closeText={'ปิด'} scrollable fullscreen>
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
export default Close;