import { useEffect, useState } from "react";

const PrepareRequestApproveTable = (props) => {
  const { result, handleSubmit } = props;
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    RenderAll();
  }, [selected]);

  useEffect(() => {
    if (result) {
      setData(result.data);
    }

    return () => {
      setData([]);
    };
  }, [result]);

  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit(selected);
    }
  };

  const onSelect = (id) =>
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);

      return [...prev, id];
    });

  const onSelectAll = () =>
    selected.length === data.length
      ? setSelected([])
      : setSelected(data.map((item) => item.id_debt_register));

  const RenderAll = () => {
    return data && data.length > 0 ? (
      data.map((item, index) =>
        RenderData(item, index, selected[index] ?? false)
      )
    ) : (
      <tr>
        <td className="fs-9 text-center align-middle" colSpan={26}>
          <div className="mt-5 mb-5 fs-8">
            <h5>ไม่มีข้อมูล</h5>
          </div>
        </td>
      </tr>
    );
  };

  const isSelectedAll = selected.length === data.length;
  const isSelectedSome = selected.length > 0;
  const CommercialBanksOrLegalEntitiesData = [{}];
  const CooperativeData = [{}]

  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
        <CooperativeTable
          data={CooperativeData}
          isSelectedAll={isSelectedAll}
          onSelect={onSelect}
          onSelectAll={onSelectAll}
        />
        <CommercialBanksOrLegalEntitiesTable
          data={CommercialBanksOrLegalEntitiesData}
          isSelectedAll={isSelectedAll}
          onSelect={onSelect}
          onSelectAll={onSelectAll}
        />
        {/* <div className="d-flex justify-content-between mt-3"><span className="d-none d-sm-inline-block" data-list-info="data-list-info"></span>
          <div className="d-flex">
            <button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
            <ul className="mb-0 pagination">

            </ul>
            <button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
          </div>
        </div> */}
      </div>
      <div className="d-flex align-items-center justify-content-center my-3">
        <div className={`${isSelectedSome ? "" : "d-none"}`}>
          <div className="d-flex">
            <button
              className="btn btn-subtle-success btn-sm ms-2"
              type="button"
              onClick={() => onSubmit()}
            >
              เลือกสัญญาจัดทำรายชื่อเกษตรกร
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const CommercialBanksOrLegalEntitiesTable = ({
  data,
  isSelectedAll,
  onSelect,
  onSelectAll,
}) => {
  const RenderData = (item, index, checked) => {
    return (
      item && (
        <tr key={index}>
          <td className="fs-9 align-middle">
            <div className="form-check ms-2 mb-0 fs-8">
              <input
                className="form-check-input"
                type="checkbox"
                checked={checked}
                onChange={() => onSelect(item.id_debt_register)}
              />
            </div>
          </td>
          <td className="align-middle">{item.id_card}</td>
          <td className="align-middle">{item.name_prefix}</td>
          <td className="align-middle">
            {(item.firstname ?? "") + " " + (item.lastname ?? "")}
          </td>
          <td className="align-middle">{item.province}</td>
          <td className="align-middle">{item.debt_manage_creditor_type}</td>
          <td className="align-middle">{item.debt_manage_creditor_name}</td>
          <td className="align-middle">{item.debt_manage_creditor_province}</td>
          <td className="align-middle">{item.debt_manage_creditor_branch}</td>
          <td className="align-middle">{item.debt_manage_contract_no}</td>
          <td className="align-middle">{item.debt_manage_outstanding_principal}</td>
          <td className="align-middle">{item.debt_manage_accrued_interest}</td>
          <td className="align-middle">{item.debt_manage_fine}</td>
          <td className="align-middle">{item.debt_manage_litigation_expenses}</td>
          <td className="align-middle">{item.debt_manage_forfeiture_withdrawal_fee}</td>
          <td className="align-middle">{item.debt_manage_insurance_premium}</td>
          <td className="align-middle">{item.debt_manage_other_expenses}</td>
          <td className="align-middle">{item.debt_manage_total_expenses}</td>
          <td className="align-middle">{item.debt_manage_total}</td>
          <td className="align-middle">{item.debt_manage_status}</td>
          <td className="align-middle">{item.collateral_type}</td>
          <td className="align-middle">{item.debt_manage_objective}</td>
        </tr>
      )
    );
  };

  return (
    <>
      <div className="table-responsive mx-n1 px-1">
        <table className="table table-sm table-striped table-bordered fs-9 mb-0">
          <thead
            className="align-middle text-center text-nowrap"
            style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}
          >
            <tr>
              <th
                className="white-space-nowrap fs-9 align-middle ps-0"
                rowSpan="2"
              >
                <div className="form-check ms-2 me-0 mb-0 fs-8">
                  <input
                    className={"form-check-input"}
                    type="checkbox"
                    checked={isSelectedAll}
                    onChange={() => onSelectAll()}
                  />
                </div>
              </th>
              <th className="text-center" colSpan="4">
                เกษตรกร
              </th>
              <th className="text-center" colSpan="4">
                เจ้าหนี้
              </th>
              <th className="text-center" colSpan="15">
                สัญญา
              </th>
            </tr>
            <tr>
              <th className="align-middle text-center" data-sort="name">
                เลขบัตรประชาชน
              </th>
              <th className="align-middle text-center" data-sort="email">
                คำนำหน้า
              </th>
              <th className="align-middle text-center" data-sort="age">
                ชื่อ-นามสกุล
              </th>
              <th className="align-middle text-center" data-sort="age">
                จังหวัด
              </th>
              <th className="align-middle text-center" data-sort="age">
                ประเภทเจ้าหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                สถาบันเจ้าหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                จังหวัดเจ้าหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                สาขาเจ้าหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                เลขที่สัญญา
              </th>
              <th className="align-middle text-center" data-sort="email">
                เงินต้น
              </th>
              <th className="align-middle text-center" data-sort="email">
                ดอกเบี้ย
              </th>
              <th className="align-middle text-center" data-sort="age">
                ค่าปรับ
              </th>
              <th className="align-middle text-center" data-sort="age">
                ค่าใช้จ่ายในการดำเนินคดี
              </th>
              <th className="align-middle text-center" data-sort="age">
                ค่าถอนการยึดทรัพย์
              </th>
              <th className="align-middle text-center" data-sort="age">
                ค่าเบี้ยประกัน
              </th>
              <th className="align-middle text-center" data-sort="age">
                ค่าใช้จ่ายอื่นๆ
              </th>
              <th className="align-middle text-center" data-sort="age">
                รวมค่าใช้จ่าย
              </th>
              <th className="align-middle text-center" data-sort="age">
                รวมทั้งสิ้น
              </th>
              <th className="align-middle text-center" data-sort="age">
                สถานะหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                ประเภทหลักประกัน
              </th>
              <th className="align-middle text-center" data-sort="age">
                วัตถุประสงค์การกู้
              </th>
            </tr>
          </thead>
          <tbody className="list text-center" id="bulk-select-body">
            {data && data.length > 0 ? (
              data.map((item, index) => RenderData(item, index, isSelectedAll))
            ) : (
              <tr>
                <td className="fs-9 text-center align-middle" colSpan={26}>
                  <div className="mt-5 mb-5 fs-8">
                    <h5>ไม่มีข้อมูล</h5>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

const CooperativeTable = ({ data, isSelectedAll, onSelect, onSelectAll }) => {
  const RenderData = (item, index, checked) => {
    return (
      item && (
        <tr key={index}>
          <td className="fs-9 align-middle">
            <div className="form-check ms-2 mb-0 fs-8">
              <input
                className="form-check-input"
                type="checkbox"
                checked={checked}
                onChange={() => onSelect(item.id_debt_register)}
              />
            </div>
          </td>
          <td className="align-middle">{item.id_card}</td>
          <td className="align-middle">{item.name_prefix}</td>
          <td className="align-middle">
            {(item.firstname ?? "") + " " + (item.lastname ?? "")}
          </td>
          <td className="align-middle">{item.province}</td>
          <td className="align-middle">{item.debt_manage_creditor_type}</td>
          <td className="align-middle">{item.debt_manage_creditor_name}</td>
          <td className="align-middle">{item.debt_manage_creditor_province}</td>
          <td className="align-middle">{item.debt_manage_creditor_branch}</td>
          <td className="align-middle">{item.debt_manage_contract_no}</td>
          <td className="align-middle">{item.debt_manage_outstanding_principal}</td>
          <td className="align-middle">{item.debt_manage_accrued_interest}</td>
          <td className="align-middle">{item.debt_manage_fine}</td>
          <td className="align-middle">{item.debt_manage_litigation_expenses}</td>
          <td className="align-middle">{item.debt_manage_forfeiture_withdrawal_fee}</td>
          <td className="align-middle">{item.debt_manage_total_expenses}</td>
          <td className="align-middle">{item.debt_manage_total}</td>
          <td className="align-middle">{item.debt_manage_status}</td>
          <td className="align-middle">{item.collateral_type}</td>
          <td className="align-middle">{item.debt_manage_objective}</td>

          
        </tr>
      )
    );
  };

  return (
    <>
      <div className="table-responsive mx-n1 px-1">
        <table className="table table-sm table-striped table-bordered fs-9 mb-0">
          <thead
            className="align-middle text-center text-nowrap"
            style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}
          >
            <tr>
              <th
                className="white-space-nowrap fs-9 align-middle ps-0"
                rowSpan="2"
              >
                <div className="form-check ms-2 me-0 mb-0 fs-8">
                  <input
                    className={"form-check-input"}
                    type="checkbox"
                    checked={isSelectedAll}
                    onChange={() => onSelectAll()}
                  />
                </div>
              </th>
              <th className="text-center" colSpan="4">
                เกษตรกร
              </th>
              <th className="text-center" colSpan="4">
                เจ้าหนี้
              </th>
              <th className="text-center" colSpan="14">
                สัญญา
              </th>
            </tr>
            <tr>
              <th className="align-middle text-center" data-sort="name">
                เลขบัตรประชาชน
              </th>
              <th className="align-middle text-center" data-sort="email">
                คำนำหน้า
              </th>
              <th className="align-middle text-center" data-sort="age">
                ชื่อ-นามสกุล
              </th>
              <th className="align-middle text-center" data-sort="age">
                จังหวัด
              </th>
              <th className="align-middle text-center" data-sort="age">
                ประเภทเจ้าหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                สถาบันเจ้าหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                จังหวัดเจ้าหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                สาขาเจ้าหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                เลขที่สัญญา
              </th>
              <th className="align-middle text-center" data-sort="email">
                เงินต้น
              </th>
              <th className="align-middle text-center" data-sort="email">
                ดอกเบี้ย
              </th>
              <th className="align-middle text-center" data-sort="age">
                ค่าปรับ
              </th>
              <th className="align-middle text-center" data-sort="age">
                ค่าใช้จ่ายในการดำเนินคดี
              </th>
              <th className="align-middle text-center" data-sort="age">
                ค่าถอนการยึดทรัพย์
              </th>
              <th className="align-middle text-center" data-sort="age">
                รวมค่าใช้จ่าย
              </th>
              <th className="align-middle text-center" data-sort="age">
                รวมทั้งสิ้น
              </th>
              <th className="align-middle text-center" data-sort="age">
                สถานะหนี้
              </th>
              <th className="align-middle text-center" data-sort="age">
                ประเภทหลักประกัน
              </th>
              <th className="align-middle text-center" data-sort="age">
                วัตถุประสงค์การกู้
              </th>
            </tr>
          </thead>
          <tbody className="list text-center" id="bulk-select-body">
            {data && data.length > 0 ? (
              data.map((item, index) => RenderData(item, index, isSelectedAll))
            ) : (
              <tr>
                <td className="fs-9 text-center align-middle" colSpan={26}>
                  <div className="mt-5 mb-5 fs-8">
                    <h5>ไม่มีข้อมูล</h5>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PrepareRequestApproveTable;
