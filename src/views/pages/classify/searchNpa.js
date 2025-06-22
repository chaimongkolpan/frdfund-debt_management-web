import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@utils";

import Filter from "@views/components/classify/filterNpa";
import According from "@views/components/panel/according";
import DataTable from "@views/components/classify/dataTable";

import { 
  searchClassify,
} from "@services/api";

const user = getUserData();
const SearchClassifyNPA = () => {
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const viewDetail = async (debt) => {
    // navigate(`/classify/searchNPA/detail/${debt.idCard}?province=${debt.province}&creditor-type=${debt.creditorType}`);
    window.open(`${process.env.BASE_URL ?? ''}/classify/searchNPA/detail/${debt.idCard}?province=${debt.province}&creditor-type=${debt.creditorType}`, '_blank', 'noopener,noreferrer');
  }
  const onSearch = async (filter) => {
    setFilter(filter)
    const result = await searchClassify(filter);
    if (result.isSuccess) {
      setData(result.data)
    } else {
      setData(null)
    }
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
                      <DataTable data={data} view={viewDetail}/>
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
export default SearchClassifyNPA;