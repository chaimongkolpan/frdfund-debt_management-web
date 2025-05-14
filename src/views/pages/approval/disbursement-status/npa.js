import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@utils";
import { Spinner } from 'reactstrap'
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import According from "@views/components/panel/according";
import Filter from "@views/components/approval/filterDisbursementStatus";
import SearchTable from "@views/components/approval/searchDisbursementStatusTable";
import { 
  cleanData,
  searchDisbursementStatus,
} from "@services/api";

const user = getUserData();
const NPA = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter({ ...filter, DebtClassifyStatus: 'ยืนยันยอดสำเร็จ' })
    const result = await searchDisbursementStatus(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  useEffect(() => {
  },[data])
  return (
    <>
      <div className="content">
        <h4>สถานะการชำระหนี้แทน NPA</h4>
        <div>
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
                        <SearchTable result={data} filter={filter} getData={onSearch} />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Loading isOpen={isLoadBigData} setModal={setLoadBigData} centered scrollable size={'lg'} title={'เรียกข้อมูลทะเบียนหนี้จาก BigData'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default NPA;