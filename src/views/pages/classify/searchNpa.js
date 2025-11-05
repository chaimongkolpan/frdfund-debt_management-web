import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@utils";

import Filter from "@views/components/classify/filterNpa";
import According from "@views/components/panel/according";
import DataTable from "@views/components/classify/dataTable";
import { Spinner } from 'reactstrap'
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'

import { 
  searchNpaClassify,
} from "@services/api";

const user = getUserData();
const SearchClassifyNPA = () => {
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);
  const [isLoadBigData, setLoadBigData] = useState(false);
  const navigate = useNavigate();
  const viewDetail = async (debt) => {
    // navigate(`/classify/searchNPA/detail/${debt.idCard}?province=${debt.province}&creditor-type=${debt.creditorType}`);
    window.open(`${process.env.VITE_BASE_URL ?? ''}/classify/searchNPA/detail/${debt.idCard}?province=${debt.province}&creditor-type=${debt.creditorType}`, '_blank', 'noopener,noreferrer');
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchNpaClassify(filter);
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
        <h4 className="mb-3">ค้นหาจำแนกมูลหนี้ NPA</h4>
        <div className="mt-4">
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'ค้นหา'}
                  className={"my-4"}
                  children={(
                    <>
                      <Filter handleSubmit={onSearch} />
                      <br />
                      <DataTable result={data} filter={filter} view={viewDetail} getData={onSearch}/>
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
export default SearchClassifyNPA;