import { useEffect, useState } from "react";
import Dropdown from "@views/components/input/DropdownSearch";
import Textbox from "@views/components/input/Textbox";
import { 
  getBigDataProvinces,
  getBigDataCreditors,
  getBigDataCreditorTypes,
  getCommitteeNoNpa,
  getCommitteeDateNpa,
  getPetitionNo,
  getPetitionDate,
} from "@services/api";

const Filter = (props) => {
  const { handleSubmit, setLoading } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState({});
  const [provOp, setProvOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  const [statusDebtOp, setStatusDebtOp] = useState(null);
  const [committeeNoOp, setCommitteeNoOp] = useState(null);
  const [committeeDateOp, setCommitteeDateOp] = useState(null);
  const [petitionNoOp, setPetitionNoOp] = useState(null);
  const [petitionDateOp, setPetitionDateOp] = useState(null);
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit({
        idCard: "",
        name: "",
        province: "",
        creditorType: "",
        creditor: "",
        DebtClassifyStatusList: ['อยู่ระหว่างการโอนเงินให้สาขา','อยู่ระหว่างการชำระหนี้แทน','ชำระหนี้แทนแล้ว'],
        ...filter,
        currentPage: 1,
        pageSize: process.env.PAGESIZE
      });
    }
  }
  const onChange = async (key, val) => {
    if (key == 'province') {
      setLoading(true);
      await setCreditorTypeOp(null);
      const resultCreditorType = await getBigDataCreditorTypes(val);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: 'all'})
        }))
        await setCreditorOp(null);
        const resultCreditor = await getBigDataCreditors(val, '');
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setFilter((prevState) => ({
            ...prevState,
            ...({creditor: 'all'})
          }))
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
      setLoading(false);
    }
    if (key == 'creditorType') {
      setLoading(true);
      await setCreditorOp(null);
      const resultCreditor = await getBigDataCreditors(filter.province, val);
      if (resultCreditor.isSuccess) {
        const temp2 = resultCreditor.data.map(item => item.name);
        await setCreditorOp(temp2);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditor: 'all'})
        }))
      } else await setCreditorOp(null);
      setLoading(false);
    }
    setFilter((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  async function fetchData() {
    const resultProv = await getBigDataProvinces();
    const resultCommitteeNo = await getCommitteeNoNpa("\'อยู่ระหว่างการโอนเงินให้สาขา\',\'อยู่ระหว่างการชำระหนี้แทน\',\'ชำระหนี้แทนแล้ว\'");
    const resultCommitteeDate = await getCommitteeDateNpa("\'อยู่ระหว่างการโอนเงินให้สาขา\',\'อยู่ระหว่างการชำระหนี้แทน\',\'ชำระหนี้แทนแล้ว\'");
    const resultPetitionNo = await getPetitionNo();
    const resultPetitionDate = await getPetitionDate();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
      const resultCreditorType = await getBigDataCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setFilter((prevState) => ({
          ...prevState,
          ...({creditorType: 'all'})
        }))
        const resultCreditor = await getBigDataCreditors(null, null);
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setFilter((prevState) => ({
            ...prevState,
            ...({creditor: 'all'})
          }))
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
    } else {
       await setProvOp(null);
       await setCreditorTypeOp(null);
       await setCreditorOp(null);
    }
    await setStatusDebtOp([
      'รอชำระหนี้แทน',
      'อยู่ระหว่างการโอนเงินให้สาขา',
      'โอนเงินให้สาขาแล้ว',
      'ชำระหนี้แทนแล้ว'
    ]);
    if (resultCommitteeNo.isSuccess) {
      const temp = resultCommitteeNo.data.map(item => item.name);
      await setCommitteeNoOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({proposal_committee_no: 'all'})
      }))
    } else await setCommitteeNoOp(null);
    if (resultCommitteeDate.isSuccess) {
      const temp = resultCommitteeDate.data.map(item => item.name);
      await setCommitteeDateOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({proposal_committee_date: 'all'})
      }))
    } else await setCommitteeDateOp(null);
    if (resultPetitionNo.isSuccess) {
      const temp = resultPetitionNo.data.map(item => item.name);
      await setPetitionNoOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({petition_no: 'all'})
      }))
    } else await setPetitionNoOp(null);
    if (resultPetitionDate.isSuccess) {
      const temp = resultPetitionDate.data.map(item => item.name);
      await setPetitionDateOp(temp);
      await setFilter((prevState) => ({
        ...prevState,
        ...({petition_date: 'all'})
      }))
    } else await setPetitionDateOp(null);
    setIsMounted(true);
    setLoading(false);
  }

  //** ComponentDidMount
  useEffect(() => {
    fetchData();
    return () => console.log('Clear data')
  }, []);
  // useEffect(() => {
  //   if (isMounted) {
  //   }
  //   return () => {}
  // }, [isMounted])
  if (!isMounted) {
    return null
  }
  return (
    <>
      <form className="row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'เลขบัตรประชาชน'} handleChange={(val) => onChange('idCard', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <Textbox title={'ชื่อ-นามสกุลเกษตรกร'} handleChange={(val) => onChange('name', val)} />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {committeeNoOp && (
            <Dropdown 
              title={'ครั้งที่เสนอคณะกรรมการ'} 
              defaultValue={'all'} 
              options={committeeNoOp} hasAll
              handleChange={(val) => onChange('proposal_committee_no', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {committeeDateOp && (
            <Dropdown 
              title={'วันที่เสนอคณะกรรมการ'} 
              defaultValue={'all'} 
              options={committeeDateOp} hasAll
              handleChange={(val) => onChange('proposal_committee_date', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {petitionNoOp && (
            <Dropdown 
              title={'เลขที่หนังสือฎีกาจัดการหนี้'} 
              defaultValue={'all'} 
              options={petitionNoOp} hasAll
              handleChange={(val) => onChange('petition_no', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {petitionDateOp && (
            <Dropdown 
              title={'วันที่หนังสือฎีกาจัดการหนี้'} 
              defaultValue={'all'} 
              options={petitionDateOp} hasAll
              handleChange={(val) => onChange('petition_date', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {provOp && (
            <Dropdown 
              title={'จังหวัด'} 
              defaultValue={'all'} 
              options={provOp} hasAll={provOp.length > 1}
              handleChange={(val) => onChange('province', val)} />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorTypeOp && (
            <Dropdown 
              title={'ประเภทเจ้าหนี้'} 
              defaultValue={'all'} 
              options={creditorTypeOp} hasAll
              handleChange={(val) => onChange('creditorType', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {creditorOp && (
            <Dropdown 
              title={'สถาบันเจ้าหนี้'} 
              defaultValue={'all'} 
              options={creditorOp} hasAll
              handleChange={(val) => onChange('creditor', val)}
            />
          )}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          {statusDebtOp && (
            <Dropdown 
              title={'สถานะการชำระหนี้แทน'} 
              defaultValue={'all'} 
              options={statusDebtOp}
              handleChange={(val) => onChange('debtStatus', val)}
              hasAll />
          )}
        </div>
        <div className="col-12">
          <div className="row g-3 justify-content-center">
            <div className="col-auto">
              <button className="btn btn-success me-1 mb-1" type="button" onClick={() => onSubmit()}><span className="fas fa-search"></span> ค้นหา</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default Filter;