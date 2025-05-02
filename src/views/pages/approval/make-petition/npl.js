import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import AddModal from "@views/components/modal/CustomModal";
import Modal from "@views/components/modal/FullModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/approval/filterMakePetition";
import SearchTable from "@views/components/approval/searchMakePetitionTable";
import SelectedTable from "@views/components/approval/selectMakePetitionTable";
import ConfirmTable from "@views/components/approval/confirmMakePetitionTable";
import { 
  cleanData,
  searchMakePetition,
  getMakePetitionAddedList,
  addMakePetitionList,
  removeMakePetitionList,
} from "@services/api";

const user = getUserData();
const NPL = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [makelistSelected, setMakeList] = useState(null);
  const [isSubmit, setSubmit] = useState(false);
  const [isOpenAdd, setOpenAdd] = useState(false);
  const [filter, setFilter] = useState(null);
  const [filterAdded, setFilterAdded] = useState({
    currentPage: 1,
    pageSize: 0
  });
  
  const onAddBigData = async (selected) => {
    const result = await addMakePetitionList(selected);
    if (result.isSuccess) {
      await onSearch(filter);
      await fetchData({ ...filterAdded, currentPage: 1 });
    }
  }
  const onRemoveMakelist = async (selected) => {
    const result = await removeMakePetitionList(selected);
    if (result.isSuccess) {
      await fetchData(filterAdded)
    }
  }
  const onCloseMakelist = async () => {
    await setSubmit(false);
    await fetchData({ ...filterAdded, currentPage: 1 });
  }
  const handleSubmit = async(selected) => {
    await setMakeList(selected);
    await setSubmit(true);
  }
  const onSubmitMakelist = async () => {
    const result = await submitListNPL({ type: 'application/octet-stream', filename: 'จัดทำฎีกา_' + (new Date().getTime()) + '.zip', data: makelistSelected });
    if (result.isSuccess) {
    }
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchMakePetition(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await getMakePetitionAddedList(query);
    if (result.isSuccess) {
      setAddedData(result)
    } else {
      setAddedData(null)
    }
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
        <h4 className="mb-3">ขออนุมัติชำระหนี้แทน NPL</h4>
        <div className="d-flex flex-row-reverse">
          <div>
            <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => setOpenAdd(true)}>
              <span className="fas fa-plus"></span> เพิ่มเลขที่/วันที่หนังสือ
            </button>
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
                    <Filter handleSubmit={onSearch} setLoading={setLoadBigData} />
                    <br />
                    {data && (
                      <SearchTable result={data} handleSubmit={onAddBigData} filter={filter} getData={onSearch} />
                    )}
                  </>
                )}
              />
              <According 
                title={'จัดทำฎีกา'}
                className={"mb-3"}
                children={(
                  <>
                    <SelectedTable result={addedData} handleSubmit={handleSubmit} handleRemove={onRemoveMakelist} filter={filterAdded} getData={fetchData}/>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      
      {isOpenAdd && (
        <AddModal isOpen={isOpenAdd} setModal={setOpenAdd} 
          title={'เพิ่มเลขที่/วันที่หนังสือฎีกา'} 
          onClose={() => setOpenAdd(false)} closeText={'ปิด'} 
          onOk={() => console.log('submit')} okText={'บันทึก'}
          size={'xl'}
        >
          <form>
            <div className="row">
              <div className="col-12 p-3">
                <div>
                  <div className="table-responsive mx-n1 px-1">
                    <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                    <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
                      <tr>
                        <th>#</th>
                        <th>รายละเอียด</th>
                        <th>วันที่สร้างฎีกา</th>
                        <th>จำนวนสัญญา</th>
                        <th>เบิกจ่ายให้</th>
                        <th>จำนวนเช็ค/โอนเงิน</th>
                        <th>จำนวนเงิน</th>
                      </tr>
                    </thead>
                      <tbody className="list text-center align-middle">
                        <tr>
                          <td>1</td>
                          <td><div className="d-flex justify-content-center"> <a className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0"><i className="far fa-list-alt "></i></a></div></td>
                          <td>22/08/2566</td>
                          <td>3</td>
                          <td>เจ้าหนี้</td>
                          <td>3</td>
                          <td>120,000.00</td>
                          </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card p-3">
                  <div className="d-flex  justify-content-center p-3">
                    <h5><div className="flex-grow-1 ">เพิ่มเลขที่/วันที่หนังสือ</div></h5>
                  </div>
                  <div className="d-flex  justify-content-start">
                    <h5>
                      <div className="flex-grow-1 ">วันที่สร้างฎีกา : 22/08/2566</div>
                      <div className="flex-grow-1 ">จำนวนสัญญา : 3</div>
                    </h5>
                  </div>
                  <div className="row">
                    <div className="col-12 p-3">
                      <div>
                        <div className="table-responsive mx-n1 px-1">
                          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                          <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
                            <tr>
                              <th>เช็คที่/โอนครั้งที่</th>
                              <th>จำนวนเงินเบิกจ่าย</th>
                              <th>เบิกจ่ายให้</th>
                            </tr>
                          </thead>
                            <tbody className="list text-center align-middle">
                              <tr>
                                <td>1</td>
                                <td>100,000.00</td>
                                <td>เจ้าหนี้</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>20,000.00</td>
                                <td>เจ้าหนี้</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text">เลขที่หนังสือฎีกา</span>
                        <span className="input-group-text">กฟก</span>
                        <input className="form-control" type="text" aria-label="ค้นหา" />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="flatpickr-input-container">
                        <div className="form-floating">
                          <input className="form-control datetimepicker" type="text" placeholder="end date" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                          <label className="ps-6" for="floatingInputStartDate">วันที่หนังสือฎีกา
                          </label><span className="uil uil-calendar-alt flatpickr-icon text-body-tertiary"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </AddModal>
      )}
      <Modal isOpen={isSubmit} setModal={setSubmit} onOk={() => onSubmitMakelist()} onClose={onCloseMakelist}  title={'จัดทำฎีกา NPL'} okText={'ดาวน์โหลดเอกสาร'} closeText={'ปิด'} scrollable>
        <ConfirmTable data={makelistSelected} />
      </Modal>
      <Loading isOpen={isLoadBigData} setModal={setLoadBigData} centered scrollable size={'lg'} title={'เรียกข้อมูลทะเบียนหนี้จาก BigData'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default NPL;