import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const RenderData = (item, index) => {
    const maxbranch = item.branch?.length ?? 1;
    const maxoffice = item.office?.length ?? 0;
    const obranch = item.office.find(x => x.disbursement == 'สาขา');
    const maxrow = obranch ? (maxbranch > 1 ? maxbranch - 1 : 1 + maxoffice - 1) : maxoffice;
    return (item && (
      <>
        <tr key={index + '-1'}>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{(paging?.currentPage - 1) * paging?.pageSize + index + 1}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.id_card}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.name_prefix}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.province}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.debt_manage_creditor_type}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.debt_manage_creditor_name}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.debt_manage_creditor_province}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.debt_manage_creditor_branch}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.proposal_committee_no}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.proposal_committee_date}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{item.debt_manage_contract_no}</td>
          <td rowSpan={maxrow > 0 ? maxrow : 1}>{toCurrency(item.contract_amount)}</td>
          <>
            {item.office?.length > 0 && (
              <>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].petition_no_office}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].petition_date_office ?? '-'}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].disbursement}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{toCurrency(item.office[0].petition_amount)}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].no ?? 1}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].wp_transfer_date ? stringToDateTh(item.office[0].wp_transfer_date, false, 'DD/MM/YYYY') : '-'}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].wp_Cheque_no}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].wp_Cheque_date ? stringToDateTh(item.office[0].wp_Cheque_date, false, 'DD/MM/YYYY') : '-'}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].wp_pay_docuno}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].wp_pay_docudate ? stringToDateTh(item.office[0].wp_pay_docudate, false, 'DD/MM/YYYY') : '-'}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].wp_transfer_docuno}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].wp_transfer_docudate ? stringToDateTh(item.office[0].wp_transfer_docudate, false, 'DD/MM/YYYY') : '-'}</td>
                <td rowSpan={(item.office[0].disbursement == 'สาขา' && maxbranch > 1) ? maxbranch - 1 : 1}>{item.office[0].debt_payment_status}</td>
              </>
            )}
          </>
          <>
            {(item.branch?.length > 0 && item.office[0].disbursement == 'สาขา') ? (
              <>
                <td>{item.branch[0].petition_no_office}</td>
                <td>{item.branch[0].petition_date_office ?? '-'}</td>
                <td>{item.branch[0].disbursement}</td>
                <td>{toCurrency(item.branch[0].debt_manage_outstanding_principal)}</td>
                <td>{toCurrency(item.branch[0].debt_manage_accrued_interest)}</td>
                <td>{toCurrency(item.branch[0].debt_manage_fine)}</td>
                <td>{toCurrency(item.branch[0].debt_manage_litigation_expenses)}</td>
                <td>{toCurrency(item.branch[0].debt_manage_forfeiture_withdrawal_fee)}</td>
                <td>{toCurrency(item.branch[0].debt_manage_insurance_premium)}</td>
                <td>{toCurrency(item.branch[0].debt_manage_other_expenses)}</td>
                <td>{toCurrency(item.branch[0].debt_manage_total_expenses)}</td>
                <td>{toCurrency(item.branch[0].debt_manage_total)}</td>
                <td>{toCurrency(item.branch[0].petition_amount)}</td>
                <td>{item.branch[0].no ?? 1}</td>
                <td>{item.branch[0].wp_transfer_date ? stringToDateTh(item.branch[0].wp_transfer_date, false, 'DD/MM/YYYY') : '-'}</td>
                <td>{item.branch[0].wp_Cheque_no}</td>
                <td>{item.branch[0].wp_Cheque_date ? stringToDateTh(item.branch[0].wp_Cheque_date, false, 'DD/MM/YYYY') : '-'}</td>
                <td>{item.branch[0].wp_pay_docuno}</td>
                <td>{item.branch[0].wp_pay_docudate ? stringToDateTh(item.branch[0].wp_pay_docudate, false, 'DD/MM/YYYY') : '-'}</td>
                <td>{item.branch[0].wp_transfer_docuno}</td>
                <td>{item.branch[0].wp_transfer_docudate ? stringToDateTh(item.branch[0].wp_transfer_docudate, false, 'DD/MM/YYYY') : '-'}</td>
                <td>{item.branch[0].debt_payment_status}</td>
              </>
            ) : (
              <>
                <td colSpan={22}>-</td>
              </>
            )}
          </>
        </tr>
        {(item.branch?.length > 1 && item.office[0].disbursement == 'สาขา') && (
          item.branch.slice(1).map((subitem, subindex) => (
            <tr key={index + '-2-' + (subindex + 1)}>
              <td>{subitem.petition_no_office}</td>
              <td>{subitem.petition_date_office ?? '-'}</td>
              <td>{subitem.disbursement}</td>
              <td>{toCurrency(subitem.debt_manage_outstanding_principal)}</td>
              <td>{toCurrency(subitem.debt_manage_accrued_interest)}</td>
              <td>{toCurrency(subitem.debt_manage_fine)}</td> 
              <td>{toCurrency(subitem.debt_manage_litigation_expenses)}</td>
              <td>{toCurrency(subitem.debt_manage_forfeiture_withdrawal_fee)}</td>
              <td>{toCurrency(subitem.debt_manage_insurance_premium)}</td>
              <td>{toCurrency(subitem.debt_manage_other_expenses)}</td>
              <td>{toCurrency(subitem.debt_manage_total_expenses)}</td>
              <td>{toCurrency(subitem.debt_manage_total)}</td>
              <td>{toCurrency(subitem.petition_amount)}</td>
              <td>{subitem.no ?? 1}</td>
              <td>{subitem.wp_transfer_date ? stringToDateTh(subitem.wp_transfer_date, false, 'DD/MM/YYYY') : '-'}</td>
              <td>{subitem.wp_Cheque_no}</td>
              <td>{subitem.wp_Cheque_date ? stringToDateTh(subitem.wp_Cheque_date, false, 'DD/MM/YYYY') : '-'}</td>
              <td>{subitem.wp_pay_docuno}</td>
              <td>{subitem.wp_pay_docudate ? stringToDateTh(subitem.wp_pay_docudate, false, 'DD/MM/YYYY') : '-'}</td>
              <td>{subitem.wp_transfer_docuno}</td>
              <td>{subitem.wp_transfer_docudate ? stringToDateTh(subitem.wp_transfer_docudate, false, 'DD/MM/YYYY') : '-'}</td>
              <td>{subitem.debt_payment_status}</td>
            </tr>
          ))
        )}
        {(item.office?.length > 1 && item.office[0].disbursement != 'สาขา') ? (
          item.office.slice(1).map((subitem, subindex) => (
            <tr key={index + '-3-' + (subindex + 1)}>
              <td>{subitem.petition_no_office}</td> 
              <td>{subitem.petition_date_office ?? '-'}</td>
              <td>{subitem.disbursement}</td>
              <td>{toCurrency(subitem.petition_amount)}</td>
              <td>{subitem.no ?? 1}</td>
              <td>{subitem.wp_transfer_date ? stringToDateTh(subitem.wp_transfer_date, false, 'DD/MM/YYYY') : '-'}</td>
              <td>{subitem.wp_Cheque_no}</td>
              <td>{subitem.wp_Cheque_date ? stringToDateTh(subitem.wp_Cheque_date, false, 'DD/MM/YYYY') : '-'}</td>
              <td>{subitem.wp_pay_docuno}</td>
              <td>{subitem.wp_pay_docudate ? stringToDateTh(subitem.wp_pay_docudate, false, 'DD/MM/YYYY') : '-'}</td>
              <td>{subitem.wp_transfer_docuno}</td>
              <td>{subitem.wp_transfer_docudate ? stringToDateTh(subitem.wp_transfer_docudate, false, 'DD/MM/YYYY') : '-'}</td>
              <td>{subitem.debt_payment_status}</td>
              <td colSpan={22}>-</td>
            </tr>
          ))
        ) : (
          <></>
        )}
      </>
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
                <th colSpan="9">ข้อมูลจาก WinSpeed (จัดการหนี้)</th> 
                <th colSpan="13">ชำระหนี้แทน (สาขา)</th>
                <th colSpan="9">ข้อมูลจาก WinSpeed (สาขา)</th> 
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
                <th>เช็คที่</th>
                <th>วันที่โอนเงิน</th>
                <th>เลขที่เช็ค</th>
                <th>วันที่เช็ค</th>
                <th>เลขที่ใบสำคัญจ่ายทางบัญชี</th>
                <th>วันที่ใบสำคัญจ่ายทางบัญชี</th>
                <th>เลขที่โอนลูกหนี้</th>
                <th>วันที่โอนลูกหนี้</th>
                <th>สถานะการชำระหนี้แทน</th>

                <th>เลขที่หนังสือฎีกาสาขา</th>
                <th>วันที่หนังสือฎีกาสาขา</th>
                <th>เบิกจ่ายให้</th>
                <th>เงินต้น</th>
                <th>ดอกเบี้ย</th>
                <th>ค่าปรับ</th>
                <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                <th>ค่าถอนการยึดทรัพย์</th>
                <th>ค่าเบี้ยประกัน</th>
                <th>ค่าใช้จ่ายอื่นๆ</th>
                <th>รวมค่าใช้จ่าย</th>
                <th>รวมเบิกจ่ายทั้งสิ้น</th>
                <th>จำนวนเงินเบิกจ่าย</th>
                <th>เช็คที่</th>
                <th>วันที่โอนเงิน</th>
                <th>เลขที่เช็ค</th>
                <th>วันที่เช็ค</th>
                <th>เลขที่ใบสำคัญจ่ายทางบัญชี</th>
                <th>วันที่ใบสำคัญจ่ายทางบัญชี</th>
                <th>เลขที่โอนลูกหนี้</th>
                <th>วันที่โอนลูกหนี้</th>
                <th>สถานะการชำระหนี้แทน</th>
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