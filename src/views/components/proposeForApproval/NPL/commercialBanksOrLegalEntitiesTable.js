import { useEffect } from "react";

const CommercialBanksOrLegalEntitiesTable = ({
  data = [],
  isSelectedAll = false,
  selected = {},
  onSelect = () => {},
  onSelectAll = () => {},
  selectable = true,
}) => {
  useEffect(() => {
    RenderAll();
  }, [selected]);

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

  const RenderData = (item, index, checked) => {
    return (
      item && (
        <tr key={index}>
          {selectable && (
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
          )}
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
          <td className="align-middle">{item.organization_no}</td>
          <td className="align-middle">{item.debt_register_round}</td>
          <td className="align-middle">{item.date_submit_debt_register}</td>
          <td className="align-middle">{item.passed_approval_no}</td>
          <td className="align-middle">{item.passed_approval_date}</td>
          <td className="align-middle">{item.creditor_type}</td>
          <td className="align-middle">{item.creditor_name}</td>
          <td className="align-middle">{item.creditor_province}</td>
          <td className="align-middle">{item.creditor_branch}</td>
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
              {selectable && (
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
              )}
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

export default CommercialBanksOrLegalEntitiesTable;
