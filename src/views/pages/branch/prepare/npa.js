import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, stringToDateTh, toCurrency } from "@utils";
import { Spinner } from 'reactstrap'
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import AddModal from "@views/components/modal/customModal";
import Modal from "@views/components/modal/fullModal";
import According from "@views/components/panel/according";
import Filter from "@views/components/branch/filterNpa";
import SearchTable from "@views/components/branch/searchTableNpa";
import { 
  searchPrepareForPresentNpa,
  submitBranchOfferPrepareNpa,
  updateIncorrectNpa,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const NPL = () => {
  const allow_roles = [1,2,7,8,9];
  const can_action = allow_roles.includes(user?.role)
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isOpenAdd, setOpenAdd] = useState(false);
  const [isIncorrectAdd, setIncorrectAdd] = useState(false);
  const [filter, setFilter] = useState(null);
  const [cust, setCust] = useState(0);
  const [cont, setCont] = useState(0);
  const [sum, setSum] = useState(0.0);
  
  const onAddBigData = async (selected) => {
    const result = await submitBranchOfferPrepareNpa(selected);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await setOpenAdd(false);
      await onSearch(filter);
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const handleSubmit = async(selected) => {
    const sel_data = selected.reduce((accu, cur) => {
      if (!accu.list.includes(cur.id_card)) {
        accu.list.push(cur.id_card);
        accu.cust += 1;
      }
      accu.cont += 1;
      accu.sum += cur.frD_total_payment;
      return accu;
    }, { list: [], cust: 0, cont: 0, sum: 0.0 });
    await setCust(sel_data.cust);
    await setCont(sel_data.cont);
    await setSum(sel_data.sum);
    await setSelected(selected);
    await setOpenAdd(true);
  }
  const handleSubmitFail = async(selected) => {
    await setSelected(selected.map(item => { return { ...item, incorrect: [false, false, false, false, false,false, false, false, false]};}));
    await setIncorrectAdd(true);
  }
  const onCheckChange = async(index, ind, checked) => {
    await setSelected((prev) => {
      let inc = prev[index].incorrect;
      let item = {
        ...prev[index],
        incorrect: inc.map((a, b) => {
          return b == ind ? checked : a;
        })
      };
      return prev.map((it, i) => {
        return i == index ? item : it
      });
    });
  }
  const onRemoveMakelist = async (selected) => {
    const selectItem = selected.map((item) => {
      return {
        id: item.id_debt_management,
        id_debt_register: item.id_debt_register,
        not_correct_list: item.incorrect.map(i => i ? '1' : '0').join(),
      }
    });
    const result = await updateIncorrectNpa(selectItem);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await onSearch(filter)
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter({ ...filter, DebtClassifyStatus: 'รอรวบรวมเตรียมนำเสนอ' })
    const result = await searchPrepareForPresentNpa(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const RenderData = (item, index, c) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.branch_proposes_approval_no}</td>
        <td>{item.branch_proposes_approval_date ? stringToDateTh(item.branch_proposes_approval_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
        <td>{item.organization_register_round}</td>
        <td>{item.debt_register_round}</td>
        <td>{item.date_submit_debt_register ? stringToDateTh(item.date_submit_debt_register, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.passed_approval_no}</td>
        <td>{item.passed_approval_date ? stringToDateTh(item.passed_approval_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.debt_manage_creditor_type}</td>
        <td>{item.debt_manage_creditor_name}</td>
        <td>{item.debt_manage_creditor_province}</td>
        <td>{item.debt_manage_creditor_branch}</td>
        <td>{item.npA_round}</td>
        <td>{item.title_document_no}</td>
        <td><input className="form-check-input" type="checkbox" checked={item.incorrect[0]} 
        onChange={(e) => onCheckChange(index, 0, e.target.checked)} /><br />{item.debt_manage_contract_no}</td>
        <td><input className="form-check-input" type="checkbox" checked={item.incorrect[1]} 
        onChange={(e) => onCheckChange(index, 1, e.target.checked)} /><br />{toCurrency(item.estimated_price_creditors)}</td>
        <td><input className="form-check-input" type="checkbox" checked={item.incorrect[2]} 
        onChange={(e) => onCheckChange(index, 2, e.target.checked)} /><br />{toCurrency(item.npA_property_sales_price)}</td>
        <td><input className="form-check-input" type="checkbox" checked={item.incorrect[3]} 
        onChange={(e) => onCheckChange(index, 3, e.target.checked)} /><br />{toCurrency(item.npL_creditors_receive)}</td>
        <td><input className="form-check-input" type="checkbox" checked={item.incorrect[4]} 
        onChange={(e) => onCheckChange(index, 4, e.target.checked)} /><br />{toCurrency(item.litigation_expenses)}</td>
        <td><input className="form-check-input" type="checkbox" checked={item.incorrect[5]} 
        onChange={(e) => onCheckChange(index, 5, e.target.checked)} /><br />{toCurrency(item.insurance_premium)}</td>
        <td>{toCurrency(item.total_xpenses)}</td>
        <td>{toCurrency(item.frD_total_payment)}</td>
        <td><input className="form-check-input" type="checkbox" checked={item.incorrect[6]} 
        onChange={(e) => onCheckChange(index, 6, e.target.checked)} /><br />{item.debt_manage_status}</td>
        <td><input className="form-check-input" type="checkbox" checked={item.incorrect[7]} 
        onChange={(e) => onCheckChange(index, 7, e.target.checked)} /><br />{item.debt_manage_objective}</td>
        <td><input className="form-check-input" type="checkbox" checked={item.incorrect[8]} 
        onChange={(e) => onCheckChange(index, 8, e.target.checked)} /><br />{item.regulation_no}</td>
        <td>{item.collateral_type}</td>
        <td>{item.collateral_no}</td>
        <td>{item.collateral_count}</td>
        <td>{item.collateral_status}</td>
      </tr>
    ))
  }
  useEffect(() => {
  },[selected])
  useEffect(() => {
  },[data])
  return (
    <>
      <div className="content">
        <h4>รวบรวมเตรียมนำเสนอขออนุมัติรายชื่อ NPA</h4>
        <div>
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'ค้นหา'}
                  className={"my-4"}
                  children={(
                    <>
                      <Filter handleSubmit={onSearch} setLoading={setLoadBigData} />
                      <br />
                      {data && (
                        <SearchTable result={data} handleSubmit={handleSubmit} handleSubmitFail={handleSubmitFail} filter={filter} getData={onSearch} can_action={can_action} />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenAdd && (
        <AddModal isOpen={isOpenAdd} setModal={setOpenAdd} 
          title={'รวบรวมเตรียมนำเสนอ'} 
          onClose={() => setOpenAdd(false)} closeText={'ยกเลิก'} 
          onOk={() => onAddBigData(selected)} okText={'ยืนยัน'}
          centered size={'xs'}
        >
          <p className="text-body-tertiary lh-lg mb-0">{`ยืนยันรวบรวมเตรียมนำเสนอ จำนวน ${cust} ราย ,${cont} สัญญา ,ยอดเงินรวม ${toCurrency(sum)} บาท`}</p>
        </AddModal>
      )}
      {isIncorrectAdd && (
        <Modal isOpen={isIncorrectAdd} setModal={setIncorrectAdd} 
          title={'ข้อมูลไม่ถูกต้องครบถ้วน'} 
          onClose={() => setIncorrectAdd(false)} closeText={'ปิด'} 
          onOk={() => onRemoveMakelist(selected)} okText={'ข้อมูลไม่ถูกต้องครบถ้วน'}
          okColor={"danger"}
        >
          <div className="row">
            <form>
              <div data-list='{"valueNames":["id","name","province"]}'>
                <div className="table-responsive mx-n1 px-1">
                  <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                    <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                      <tr>
                        <th rowSpan="2" style={{ minWidth: 30 }}>#</th>
                        <th rowSpan="2">เลขที่หนังสือ</th>
                        <th rowSpan="2">วันที่หนังสือ</th>
                        <th colSpan="4">เกษตรกร</th>
                        <th colSpan="1">องค์กร</th>
                        <th colSpan="4">ทะเบียนหนี้</th>
                        <th colSpan="4">เจ้าหนี้</th>
                        <th colSpan={"14"}>สัญญา</th>
                        <th colSpan="4">หลักทรัพย์ค้ำประกัน</th>
                      </tr>
                      <tr>
                        <th>เลขบัตรประชาชน</th>
                        <th>คำนำหน้า</th>
                        <th>ชื่อ-นามสกุล</th>
                        <th>จังหวัด</th>
                        <th>รอบองค์กร</th>
                        <th>รอบหนี้</th>
                        <th>วันที่ยื่นขึ้นทะเบียนหนี้</th>
                        <th>ผ่านความเห็นชอบครั้งที่</th>
                        <th>ผ่านความเห็นชอบวันที่</th>
                        <th>ประเภทเจ้าหนี้</th>
                        <th>สถาบันเจ้าหนี้</th>
                        <th>จังหวัดเจ้าหนี้</th>
                        <th>สาขาเจ้าหนี้</th>
                        <th>รอบ NPA</th>
                        <th>เอกสารสิทธิ์</th>
                        <th>เลขที่สัญญา</th>
                        <th>ราคาประเมินของเจ้าหนี้</th>
                        <th>ราคาขายทรัพย์ NPA</th>
                        <th>เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)</th>
                        <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                        <th>ค่าเบี้ยประกัน</th>
                        <th>รวมค่าใช้จ่าย</th>
                        <th>รวมทั้งสิ้น</th>
                        <th>สถานะหนี้</th>
                        <th>วัตถุประสงค์การกู้</th>
                        <th>ซื้อทรัพย์ตามระเบียบฯ</th>                                
                        <th>ประเภทหลักประกัน</th>
                        <th>ประเภทและเลขที่หลักทรัพย์(เลขโฉนด)</th>
                        <th>จำนวนแปลง</th>
                        <th>การตรวจสอบการอายัด</th>
                      </tr>
                    </thead>
                    <tbody className="list text-center align-middle">
                      {(selected && selected.length > 0) ? (selected.map((item,index) => RenderData(item, index, []))) : (
                        <tr>
                          <td className="fs-9 text-center align-middle" colSpan={34}>
                            <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}
      <Loading isOpen={isLoadBigData} setModal={setLoadBigData} centered scrollable size={'lg'} title={'เรียกข้อมูลทะเบียนหนี้จาก BigData'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default NPL;