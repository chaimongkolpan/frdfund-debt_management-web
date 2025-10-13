import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import CooperativeTable from "@views/components/proposeForApproval/NPL/cooperativeTable";
import CommercialBanksOrLegalEntitiesTable from "@views/components/proposeForApproval/NPL/commercialBanksOrLegalEntitiesTable";

const PrepareRequestApproveTable = (props) => {
  const { result, filter, handleSubmit, can_action, getData } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const [cooperativeSelected, setCooperativeSelected] = useState([]);
  const [commercialBanksOrLegalEntitiesSelected,setCommercialBanksOrLegalEntitiesSelected] = useState([]);

  const commercialBanksOrLegalEntitiesData = data.filter(
    (i) =>
      i.debt_manage_creditor_type != "สหกรณ์"
  );
  const cooperativeData = data.filter(
    (i) => i.debt_manage_creditor_type == "สหกรณ์"
  );
  const isSelectedAllCooperative =
    cooperativeData.length > 0 &&
    cooperativeSelected.length === cooperativeData.length;
  const isSelectedAllCommercialBanksOrLegalEntities =
    commercialBanksOrLegalEntitiesData.length > 0 &&
    commercialBanksOrLegalEntitiesSelected.length ===
      commercialBanksOrLegalEntitiesData.length;
  const isSelectedSome =
    cooperativeSelected.length > 0 ||
    commercialBanksOrLegalEntitiesSelected.length > 0;

  useEffect(() => {
    if (result) {
      setData(result.data);
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage })
      setCooperativeSelected([])
      setCommercialBanksOrLegalEntitiesSelected([])
    }

    return () => {
      setData([]);
    };
  }, [result]);

  const onSubmit = () => {
    handleSubmit([
      ...(data.filter((i) => cooperativeSelected.includes(i.id_debt_register))),
      ...(data.filter((i) => commercialBanksOrLegalEntitiesSelected.includes(i.id_debt_register))),
    ]);
  };

  const onSelectCommercialBanksOrLegalEntities = (id) =>
    setCommercialBanksOrLegalEntitiesSelected((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);

      return [...prev, id];
    });

  const onSelectCooperative = (id) =>
    setCooperativeSelected((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);

      return [...prev, id];
    });

  const onSelectAllCommercialBanksOrLegalEntities = () =>
    commercialBanksOrLegalEntitiesSelected.length ===
    commercialBanksOrLegalEntitiesData.length
      ? setCommercialBanksOrLegalEntitiesSelected([])
      : setCommercialBanksOrLegalEntitiesSelected(
          commercialBanksOrLegalEntitiesData.map(
            (item) => item.id_debt_register
          )
        );

  const onSelectAllCooperative = () =>
    cooperativeSelected.length === cooperativeData.length
      ? setCooperativeSelected([])
      : setCooperativeSelected(cooperativeData.map((item) => item.id_debt_register)
  );

  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
        {(cooperativeData && cooperativeData.length > 0) && (
          <CooperativeTable
            data={cooperativeData}
            selected={cooperativeSelected}
            isSelectedAll={isSelectedAllCooperative}
            onSelect={onSelectCooperative}
            onSelectAll={onSelectAllCooperative}
            selectable={can_action}
            currentPage={paging?.currentPage ?? 0}
            pageSize={process.env.VITE_PAGESIZE}
          />
        )}
        {(commercialBanksOrLegalEntitiesData && commercialBanksOrLegalEntitiesData.length > 0) && (
          <CommercialBanksOrLegalEntitiesTable
            data={commercialBanksOrLegalEntitiesData}
            selected={commercialBanksOrLegalEntitiesSelected}
            isSelectedAll={isSelectedAllCommercialBanksOrLegalEntities}
            onSelect={onSelectCommercialBanksOrLegalEntities}
            onSelectAll={onSelectAllCommercialBanksOrLegalEntities}
            selectable={can_action}
            currentPage={paging?.currentPage ?? 0}
            pageSize={process.env.VITE_PAGESIZE}
          />
        )}
        {paging?.total > 0 && (
          <Paging currentPage={paging?.currentPage ?? 0} total={paging?.total ?? 1} totalPage={paging?.totalPage ?? 1} 
            setPage={(page) => getData({ ...filter, currentPage: page })} 
          />
        )}
      </div>
      {can_action && (
        <div className="d-flex align-items-center justify-content-center my-3">
          <div className={`${isSelectedSome ? "" : "d-none"}`}>
            <div className="d-flex">
              <button
                className="btn btn-subtle-success btn-sm ms-2"
                type="button"
                onClick={() => onSubmit()}
              >
                เลือกสัญญาขออนุมัติรายชื่อ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrepareRequestApproveTable;
