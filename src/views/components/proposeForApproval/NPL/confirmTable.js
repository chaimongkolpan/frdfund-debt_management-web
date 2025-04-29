import CooperativeTable from "@views/components/proposeForApproval/NPL/cooperativeTable";
import CommercialBanksOrLegalEntitiesTable from "@views/components/proposeForApproval/NPL/commercialBanksOrLegalEntitiesTable";

const ConfirmTable = (props) => {
  const { data } = props;

  const commercialBanksOrLegalEntitiesData = data.filter(
    (i) =>
      i.debt_manage_creditor_type == "ธนาคารพาณิชย์" ||
      i.debt_manage_creditor_type == "นิติบุคคล"
  );
  const cooperativeData = data.filter(
    (i) => i.debt_manage_creditor_type == "สหกรณ์"
  );

  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
        <CooperativeTable selectable={false} data={cooperativeData} />
        <CommercialBanksOrLegalEntitiesTable
          selectable={false}
          data={commercialBanksOrLegalEntitiesData}
        />
      </div>
    </>
  );
};
export default ConfirmTable;
