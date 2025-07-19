const ClassifyGuarantorTable = (props) => {
    const { data } = props;
    const RenderData = (item, index) => {
      return (item && (
        <tr key={index}>
          <td className="align-middle">{index + 1}</td>
          <td>{item.policyNo}</td>
          <td>{item.guarantor_idcard}</td>
          <td>{item.guarantor_name_prefix}</td>
          <td>{item.fullname}</td>
        </tr>
      ))
    }
    return (
      <>
        <div id="tableExample" data-list='{"valueNames":["id","name","province"]}'>
          <div className="table-responsive mx-n1 px-1">
            <table className="table table-sm table-striped table-bordered fs-9 mb-0">
              <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                <tr>
                  <th style={{ minWidth: 30 }}>#</th>
                  <th>เลขที่นิติกรรมสัญญา</th>
                  <th>เลขบัตรประชาชน</th>
                  <th>คำนำหน้า</th>
                  <th>ชื่อ-นามสกุล</th>
                </tr>
              </thead>
              <tbody className="list text-center align-middle">
                {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                  <tr>
                    <td className="fs-9 text-center align-middle" colSpan={5}>
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
  export default ClassifyGuarantorTable;