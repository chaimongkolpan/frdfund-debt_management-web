import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/FullModal";
import Loading from "@views/components/modal/loading";
import Filter from "@views/components/debtRegister/filter";
import BigDataTable from "@views/components/debtRegister/bigdataTable";
import SelectedTable from "@views/components/debtRegister/selectedTable";
import ConfirmTable from "@views/components/debtRegister/confirmTable";
import logo from '@src/assets/images/icons/logo.png'
import { 
  cleanData,
  searchBigData,
  addBigData,
  removeBigData,
  getAddedList,
  submitListNPL,
} from "@services/api";

const user = getUserData();
const DebtRegister = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [makelistSelected, setMakeList] = useState(null);
  const [filterAdded, setFilterAdded] = useState({
    currentPage: 1,
    pageSize: 0
  });
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchBigData(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const onAddBigData = async (selected) => {
    const result = await addBigData(selected);
    if (result.isSuccess) {
      await onSearch(filter);
      await fetchData({ ...filterAdded, currentPage: 1 });
    }
  }
  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await getAddedList(query);
    if (result.isSuccess) {
      setAddedData(result)
    } else {
      setAddedData(null)
    }
  }
  const onRemoveMakelist = async (selected) => {
    const result = await removeBigData(selected);
    if (result.isSuccess) {
      await fetchData(filterAdded)
    }
  }
  const onSubmitMakelist = async () => {
    const result = await submitListNPL({ type: 'application/octet-stream', filename: 'จัดทำรายชื่อเกษตรกร_' + (new Date().getTime()) + '.zip', data: makelistSelected });
    if (result.isSuccess) {
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
        <h4 className="mb-3">จัดทำรายชื่อเกษตรกร NPL</h4>
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
                        <BigDataTable result={data} handleSubmit={onAddBigData} filter={filter} getData={onSearch} />
                      )}
                    </>
                  )}
                />
                <According 
                  title={'จัดทำรายชื่อเกษตรกร'}
                  className={"mb-3"}
                  children={(
                    <SelectedTable result={addedData} handleSubmit={handleSubmit} handleRemove={onRemoveMakelist} filter={filterAdded} getData={fetchData}/>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isSubmit} setModal={setSubmit} onOk={() => onSubmitMakelist()} onClose={onCloseMakelist}  title={'จัดทำรายชื่อเกษตรกร'} okText={'ดาวน์โหลดเอกสารจัดทำรายชื่อเกษตรกร'} closeText={'ปิด'} scrollable>
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
export default DebtRegister;
