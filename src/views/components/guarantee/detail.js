import { useEffect, useState } from "react";
import { 
  cleanData,
  viewLegalDetail,
} from "@services/api";
import According from "@views/components/panel/according";
import OrgTable from "@views/components/classify/orgTable";
import DebtTable from "@views/components/classify/debtTable";
import DebtManageTable from "@views/components/legal-contract/debtManageTable";
import CollateralTable from "@views/components/legal-contract/collateralTable";
import GuarantorTable from "@views/components/legal-contract/guarantorTable";

const LegalDetail = (props) => {
  const { policy } = props;
  const [debts, setDebts] = useState(null);
  const [collaterals, setCollaterals] = useState(null);
  const [guarantors, setGuarantors] = useState(null);
  const fetchData = async () => {
    const result = await viewLegalDetail(policy.id_KFKPolicy);
    if (result.isSuccess) {
      await setDebts(result.contracts)
      await setCollaterals(result.collaterals)
      await setGuarantors(result.guarantors)
    } else {
      await setDebts(null)
      await setCollaterals(null)
      await setGuarantors(null)
    }
  }
  useEffect(() => {
    fetchData();
  },[])
  return (
    <>
      <According 
        title={'ทะเบียนเกษตรกร + องค์กร'}
        className={"my-4"}
        children={(<OrgTable idcard={policy.k_idcard} province={policy.loan_province} creditorType={policy.loan_creditor_type} />)}
      />
      <According 
        title={'ทะเบียนหนี้'}
        className={"my-4"}
        children={(<DebtTable idcard={policy.k_idcard} province={policy.loan_province} creditorType={policy.loan_creditor_type} />)}
      />
      <According 
        title={'จัดการหนี้'}
        className={"my-4"}
        children={(<DebtManageTable data={debts} />)}
      />
      <According 
        title={'หลักทรัพย์ค้ำประกัน'}
        className={"my-4"}
        children={(<CollateralTable data={collaterals} />)}
      />
      <According 
        title={'บุคคลค้ำประกัน'}
        className={"my-4"}
        children={(<GuarantorTable data={guarantors} />)}
      />
    </>
  );
};
export default LegalDetail;