import { useEffect, useState } from "react";
import { toCurrency } from "@utils";

const CommercialBanksOrLegalEntitiesTable = ({
  data = [],
  isSelectedAll = false,
  selected = {},
  onSelect = () => {},
  onSelectAll = () => {},
  selectable = true,
  currentPage = 1,
  pageSize = 10
}) => {
  const [selData, setSelected] = useState([]);
  const handleSelectAll = async() => {
    await setSelected((prev) => { return prev.map(i => !isSelectedAll); })
    await onSelectAll()
  }
  const handleSelect = async(id, ind) => {
    await setSelected((prev) => {
      prev[ind] = !prev[ind];
      return prev;
    })
    await onSelect(id)
  }
  useEffect(() => {
    setSelected(data.map(i => false))
  }, []);

  const RenderData = (item, index, checked) => {
    return (
      item && (
        <tr key={index}>
          {selectable ? (
            <td className="fs-9 align-middle">
              <div className="form-check ms-2 mb-0 fs-8">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleSelect(item.id_debt_register, index)}
                />
              </div>
            </td>
          ) : (
            <td className="fs-9 align-middle">{(((currentPage - 1) * pageSize) + index + 1)}</td>
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
          <td className="align-middle">{item.debt_manage_contract_no}</td>
          <td className="align-middle">{toCurrency(item.debt_manage_outstanding_principal,2)}</td>
          <td className="align-middle">{toCurrency(item.debt_manage_accrued_interest,2)}</td>
          <td className="align-middle">{toCurrency(item.debt_manage_fine,2)}</td>
          <td className="align-middle">{toCurrency(item.debt_manage_litigation_expenses,2)}</td>
          <td className="align-middle">{toCurrency(item.debt_manage_forfeiture_withdrawal_fee,2)}</td>
          <td className="align-middle">{toCurrency(item.debt_manage_insurance_premium,2)}</td>
          <td className="align-middle">{toCurrency(item.debt_manage_other_expenses,2)}</td>
          <td className="align-middle">{toCurrency(item.debt_manage_total_expenses,2)}</td>
          <td className="align-middle">{toCurrency(item.debt_manage_total,2)}</td>
          <td className="align-middle">{item.debt_manage_status}</td>
          <td className="align-middle">{item.collateral_type}</td>
          <td className="align-middle">{item.debt_manage_objective}</td>
          <td className="align-middle">{item.debt_manage_objective_details}</td>
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
              {selectable ? (
                <th
                  className="white-space-nowrap fs-9 align-middle ps-0"
                  rowSpan="2"
                >
                  <div className="form-check ms-2 me-0 mb-0 fs-8">
                    <input
                      className={"form-check-input"}
                      type="checkbox"
                      checked={isSelectedAll}
                      onChange={() => handleSelectAll()}
                    />
                  </div>
                </th>
              ) : (
                <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>#</th>
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
              <th className="align-middle text-center">
                เลขบัตรประชาชน
              </th>
              <th className="align-middle text-center">
                คำนำหน้า
              </th>
              <th className="align-middle text-center" style={{ minWidth: 150 }}>
                ชื่อ-นามสกุล
              </th>
              <th className="align-middle text-center">
                จังหวัด
              </th>
              <th className="align-middle text-center" style={{ minWidth: 150 }}>
                ประเภทเจ้าหนี้
              </th>
              <th className="align-middle text-center" style={{ minWidth: 180 }}>
                สถาบันเจ้าหนี้
              </th>
              <th className="align-middle text-center">
                จังหวัดเจ้าหนี้
              </th>
              <th className="align-middle text-center">
                สาขาเจ้าหนี้
              </th>
              <th className="align-middle text-center">
                เลขที่สัญญา
              </th>
              <th className="align-middle text-center">
                เงินต้น
              </th>
              <th className="align-middle text-center">
                ดอกเบี้ย
              </th>
              <th className="align-middle text-center">
                ค่าปรับ
              </th>
              <th className="align-middle text-center">
                ค่าใช้จ่ายในการดำเนินคดี
              </th>
              <th className="align-middle text-center">
                ค่าถอนการยึดทรัพย์
              </th>
              <th className="align-middle text-center">
                ค่าเบี้ยประกัน
              </th>
              <th className="align-middle text-center">
                ค่าใช้จ่ายอื่นๆ
              </th>
              <th className="align-middle text-center">
                รวมค่าใช้จ่าย
              </th>
              <th className="align-middle text-center">
                รวมทั้งสิ้น
              </th>
              <th className="align-middle text-center">
                สถานะหนี้
              </th>
              <th className="align-middle text-center">
                ประเภทหลักประกัน
              </th>
              <th className="align-middle text-center">
                วัตถุประสงค์การกู้
              </th>
              <th className="align-middle text-center">
                รายละเอียดวัตถุประสงค์การกู้
              </th>
            </tr>
          </thead>
          <tbody className="list text-center" id="bulk-select-body">
            {data && data.length > 0 ? (
              data.map((item, index) => RenderData(item, index, selData[index]))
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
