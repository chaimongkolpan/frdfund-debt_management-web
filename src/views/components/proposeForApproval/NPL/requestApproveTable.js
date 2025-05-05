import { useEffect, useState } from "react";
import CooperativeTable from "@views/components/proposeForApproval/NPL/cooperativeTable";
import CommercialBanksOrLegalEntitiesTable from "@views/components/proposeForApproval/NPL/commercialBanksOrLegalEntitiesTable";

const DebtRegisterSelectedTableNpa = (props) => {
  const { result, handleSubmit, handleRemove } = props;
  const [data, setData] = useState([]);
  const [cooperativeSelected, setCooperativeSelected] = useState([]);
  const [commercialBanksOrLegalEntitiesSelected,setCommercialBanksOrLegalEntitiesSelected] = useState([]);

  const commercialBanksOrLegalEntitiesData = data.filter(
    (i) =>
      i.debt_manage_creditor_type == "ธนาคารพาณิชย์" ||
      i.debt_manage_creditor_type == "นิติบุคคล"
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
  const onRemove = () => {
    handleRemove([
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
      : setCooperativeSelected(
          cooperativeData.map((item) => item.id_debt_register)
        );

  return (
    <>
      <div id="tableExample1" data-list='{"valueNames":["name","email","age"]'>
        {(cooperativeData && cooperativeData.length > 0) && (
          <CooperativeTable
            data={cooperativeData}
            selected={cooperativeSelected}
            isSelectedAll={isSelectedAllCooperative}
            onSelect={onSelectCooperative}
            onSelectAll={onSelectAllCooperative}
          />
        )}
        {(commercialBanksOrLegalEntitiesData && commercialBanksOrLegalEntitiesData.length > 0) && (
          <CommercialBanksOrLegalEntitiesTable
            data={commercialBanksOrLegalEntitiesData}
            selected={commercialBanksOrLegalEntitiesSelected}
            isSelectedAll={isSelectedAllCommercialBanksOrLegalEntities}
            onSelect={onSelectCommercialBanksOrLegalEntities}
            onSelectAll={onSelectAllCommercialBanksOrLegalEntities}
          />
        )}
        {/* <div className="d-flex justify-content-between mt-3"><span className="d-none d-sm-inline-block" data-list-info="data-list-info"></span>
          <div className="d-flex">
            <button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
            <ul className="mb-0 pagination"></ul>
            <button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
          </div>
        </div> */}
      </div>
      <div className="d-flex align-items-center justify-content-center my-3">
        <div className={`${isSelectedSome ? "" : "d-none"}`}>
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-success btn-sm ms-2"
              onClick={() => onSubmit()}
            >
              เสนอขออนุมัติรายชื่อ
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm ms-2"
              onClick={() => onRemove()}
            >
              ไม่เสนอขออนุมัติรายชื่อ
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DebtRegisterSelectedTableNpa;
