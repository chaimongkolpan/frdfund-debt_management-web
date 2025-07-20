import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { getUserData } from "@utils";

import Filter from "@views/components/classify/filter";
import According from "@views/components/panel/according";
import DataTable from "@views/components/classify/dataTable";

import { 
  searchClassify,
} from "@services/api";

const user = getUserData();
const SearchClassifyNPL = () => {
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);
  // const navigate = useNavigate();
  const viewDetail = async (debt) => {
    // navigate(`/classify/searchNPL/detail/${debt.idCard}?province=${debt.province}&creditor-type=${debt.creditorType}`);
    window.open(`${process.env.BASE_URL ?? ''}/classify/searchNPL/detail/${debt.idCard}?province=${debt.province}&creditor-type=${debt.creditorType}`, '_blank', 'noopener,noreferrer');
  }
  const onSearch = async (filter) => {
    setFilter(filter)
    const result = await searchClassify(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
  }
  return (
    <>
      <div className="content">
        <h4 className="mb-3">ค้นหาจำแนกมูลหนี้ NPL</h4>
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
    </>
  );
};
export default SearchClassifyNPL;