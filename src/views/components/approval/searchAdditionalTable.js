import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
        <td>{item.debt_manage_creditor_type}</td>
        <td>{item.debt_manage_creditor_name}</td>
        <td>{item.debt_manage_creditor_province}</td>
        <td>{item.debt_manage_creditor_branch}</td>
        <td>{item.proposal_committee_no}</td>
        <td>{item.proposal_committee_date}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{toCurrency(item.contract_amount)}</td>
        <td>{item.petition_no_office}</td>
        <td>{item.petition_date_office ?? '-'}</td>
        <td>{item.disbursement}</td>
        <td>{toCurrency(item.petition_amount)}</td>
        <td>{item.petition_no_branch}</td>
        <td>{item.petition_date_branch ?? '-'}</td>
        <td>{item.disbursement_branch}</td>
        <td>{toCurrency(item.petition_amount_branch)}</td>
        <td>{item.wp_transfer_date ? stringToDateTh(item.wp_transfer_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.wp_Cheque_no}</td>
        <td>{item.wp_Cheque_date ? stringToDateTh(item.wp_Cheque_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.wp_pay_docuno}</td>
        <td>{item.wp_pay_docudate ? stringToDateTh(item.wp_pay_docudate, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.wp_transfer_docuno}</td>
        <td>{item.wp_transfer_docudate ? stringToDateTh(item.wp_transfer_docudate, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.debt_payment_status}</td>
      </tr>
    ))
  }
  useEffect(() => {
    if(result) {
      setData(result.data);
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage })
    }
    return () => { setData([]) }
  },[result])

  return (
    <>
      <div data-list='{"valueNames":["name","email","age"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th rowSpan="2" style={{ minWidth: 30 }}>#</th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="4">เจ้าหนี้</th>
                <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                <th colSpan="2">สัญญา</th> 
                <th colSpan="4">ชำระหนี้แทน (จัดการหนี้)</th>
                <th colSpan="4">ชำระหนี้แทน (สาขา)</th>
                <th colSpan="7">ข้อมูลจาก WinSpeed</th> 
                <th rowSpan="2">สถานะการชำระหนี้แทน</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>ประเภทเจ้าหนี้</th>
                <th>สถาบันเจ้าหนี้</th>
                <th>จังหวัดเจ้าหนี้</th>
                <th>สาขาเจ้าหนี้</th>  
                <th>ครั้งที่เสนอคณะกรรมการ</th>
                <th>วันที่เสนอคณะกรรมการ</th>
                <th>เลขที่สัญญา</th>
                <th>เงินต้นตามสัญญา</th>
                <th>เลขที่หนังสือฎีกาจัดการหนี้</th>
                <th>วันที่หนังสือฎีกาจัดการหนี้</th>
                <th>เบิกจ่ายให้</th>
                <th>จำนวนเงินเบิกจ่าย</th>
                <th>เลขที่หนังสือฎีกาสาขา</th>
                <th>วันที่หนังสือฎีกาสาขา</th>
                <th>เบิกจ่ายให้</th>
                <th>จำนวนเงินเบิกจ่าย</th>
                <th>วันที่โอนเงิน</th>
                <th>เลขที่เช็ค</th>
                <th>วันที่เช็ค</th>
                <th>เลขที่ใบสำคัญจ่ายทางบัญชี</th>
                <th>วันที่ใบสำคัญจ่ายทางบัญชี</th>
                <th>เลขที่โอนลูกหนี้</th>
                <th>วันที่โอนลูกหนี้</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={29}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {paging?.total > 0 && (
          <Paging currentPage={paging?.currentPage ?? 0} total={paging?.total ?? 1} totalPage={paging?.totalPage ?? 1} 
            setPage={(page) => getData({ ...filter, currentPage: page })} 
          />
        )}
      </div>
    </>
  );
};
export default SearchTable;