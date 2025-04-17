const ClassifyDebtManageTable = (props) => {
  const { data, handleCombine, handleSplit, handleShowDetail, handleCancelCombine, handleCancelSplit } = props;
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index} style={{
        ...(item.isCombine && ({backgroundColor: '#ddefff'})),
        ...(item.isSplit && ({backgroundColor: '#fdeae7'})),
      }}>
        <td className="align-middle">{index + 1}</td>
        <td>{item.checking_management_status}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{item.creditor_type}</td>
        <td>{item.creditor_name}</td>
        <td>{item.debt_manage_outstanding_principal}</td>
        <td>{item.frD_paymen_amount}</td>
        <td>{item.purpose_loan_contract}</td>
        <td>{item.dept_status}</td>
        <td>{item.collateral_type}</td>
        <td>{item.borrower_status}</td>
        <td>{item.hasDocument && (<i className="fas fa-check"></i>)}</td>
        <td>{item.hasNPA && (<i className="fas fa-check"></i>)}</td>
        <td>
          <div className="d-flex justify-content-center"> 
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => handleShowDetail(item)}><i className="far fa-list-alt "></i></button>
          </div>
        </td>
        <td className="align-middle white-space-nowrap text-center pe-0">
          {item.isCombine ? (
            <div className="btn-reveal-trigger position-static">
              <button className="btn btn-phoenix-secondary btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10"></span></button>
              <div className="dropdown-menu dropdown-menu-end py-2">
                <button className="dropdown-item text-danger" onClick={() => handleCancelCombine()}>ยกเลิกรวมสัญญา</button>
              </div>
            </div>
          ) : (item.isSplit ? (
            <div className="btn-reveal-trigger position-static">
              <button className="btn btn-phoenix-secondary btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10"></span></button>
              <div className="dropdown-menu dropdown-menu-end py-2">
                <button className="dropdown-item text-danger" type="button" onClick={() => handleCancelSplit()}>ยกเลิกแยกสัญญา</button>
              </div>
            </div>
          ) : (
            <div className="btn-reveal-trigger position-static">
              <button className="btn btn-phoenix-secondary btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10"></span></button>
              <div className="dropdown-menu dropdown-menu-end py-2">
                <button className="dropdown-item" type="button" onClick={() => handleSplit()}>แยกสัญญา</button>
                <button className="dropdown-item" type="button" onClick={() => handleCombine()}>รวมสัญญา</button>
              </div>
            </div>
          ))}
        </td>
      </tr>
    ))
  }
  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["id","name","province"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th style={{ minWidth: 30 }}>#</th>
                <th>สถานะสัญญาจำแนกมูลหนี้</th>
                <th>เลขที่สัญญา</th>
                <th>ประเภทเจ้าหนี้</th>
                <th>สถานบันเจ้าหนี้</th>
                <th>เงินต้นคงเหลือตามสัญญา</th>
                <th>กฟก.ชำระเงินจำนวน</th>
                <th>วัตถุประสงค์การกู้</th>
                <th>สถานะหนี้</th>
                <th>ประเภทหลักประกัน </th>
                <th>สถานะผู้กู้</th>
                <th>เอกสารประกอบ</th>
                <th>สัญญา NPA </th>
                <th>จำแนกมูลหนี้ </th>
                <th>ดำเนินการ </th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={14}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default ClassifyDebtManageTable;