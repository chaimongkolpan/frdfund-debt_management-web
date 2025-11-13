import CooperativeTable from "@views/components/proposeForApproval/NPL/cooperativeTable";
import CommercialBanksOrLegalEntitiesTable from "@views/components/proposeForApproval/NPL/commercialBanksOrLegalEntitiesTable";

const ConfirmTable = (props) => {
  const { data } = props;

  const commercialBanksOrLegalEntitiesData = data.filter(
    (i) => i.debt_manage_creditor_type != "สหกรณ์"
      // i.debt_manage_creditor_type == "ธนาคารพาณิชย์" || i.debt_manage_creditor_type == "นิติบุคคล"
  );
  const cooperativeData = data.filter(
    (i) => i.debt_manage_creditor_type == "สหกรณ์"
  );

  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
        {(cooperativeData && cooperativeData.length > 0) && (
          <CooperativeTable selectable={false} data={cooperativeData} />
        )}
        {(commercialBanksOrLegalEntitiesData && commercialBanksOrLegalEntitiesData.length > 0) && (
          <CommercialBanksOrLegalEntitiesTable selectable={false} data={commercialBanksOrLegalEntitiesData} />
        )}
      </div>
    </>
  );
};
export default ConfirmTable;
