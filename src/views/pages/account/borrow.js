import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/account/operation-land/filterBorrow";
import SearchTable from "@views/components/account/operation-land/searchTableBorrow";
import DetailAsset from "@views/components/account/operation-land/detailAssetModal";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchBorrow,
  getBorrowHistory,
} from "@services/api";

const user = getUserData();
const PageContent = () => {
  const allow_roles = [1,2,4,5];
  const can_action = allow_roles.includes(user?.role)
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [histories, setHistories] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const onSearch = async (filter) => {
    await setLoadBigData(true);
    await setFilter(filter)
    const result = await searchBorrow(filter);
    if (result.isSuccess) {
      await setData(result)
    } else {
      await setData(null)
    }
    await setLoadBigData(false);
  }
  const handleShowDetail = async (item) => {
    await setPolicy(item);
    await setOpenDetail(true);
  }
  const handleHistory = async (item) => {
    await setPolicy(item);
    const result = await getBorrowHistory(item.id_AssetPolicy);
    if (result.isSuccess) {
      await setHistories(result.data)
    } else {
      await setHistories(null)
    }
    await setOpenHistory(true);
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index} style={{ backgroundColor: `${item.deedBorrowReturn_status == 'แจ้งเตือน' ? '#fdeae7' : '#ffffff'}` }}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.borrowdeed_no}</td>
        <td>{stringToDateTh(item.borrowdeed_date, false)}</td>
        <td>{item.borrowdeed_reason}</td>
        <td>{toCurrency(item.totalDate)}</td>
        <td>{item.returndeed_no}</td>
        <td>{stringToDateTh(item.returndeed_date, false)}</td>
        <td>{item.returndeed_remark}</td>
        <td>{item.operations_type}</td>
        <td>{item.isEdit && (<i className="fas fa-check"></i>)}</td>
        <td>{item.isSplit && (<i className="fas fa-check"></i>)}</td>
        <td>{item.policyNO}</td>
        <td>{item.indexAssetPolicy}</td>
        <td>{item.assetType}</td>
        <td>{item.collateralOwner}</td>
        <td>{item.collateral_no}</td>
        <td>{item.collateral_province}</td>
        <td>{item.collateral_district}</td>
        <td>{item.collateral_sub_district}</td>
        <td>{item.contract_area_rai}</td>
        <td>{item.contract_area_ngan}</td>
        <td>{item.contract_area_sqaure_wa}</td>
      </tr>
    ))
  }
  return (
    <>
      <div className="content">
        <h4 className="mb-3">ยืม-คืนโฉนด</h4>
        <div className="mt-4">
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
                        <SearchTable result={data} filter={filter} getData={onSearch} handleShowDetail={handleShowDetail} handleHistory={handleHistory} can_action={can_action} />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {openDetail && (
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk onClose={() => setOpenDetail(false)}  title={'รายละเอียดหลักทรัพย์'} closeText={'ปิด'} scrollable fullscreen>
          <DetailAsset policy={policy} isView /> 
        </Modal>
      )}
      {openHistory && (
        <Modal isOpen={openHistory} setModal={setOpenHistory} hideOk onClose={() => setOpenHistory(false)}  title={'ประวัติการยืม-คืนโฉนด'} closeText={'ปิด'} scrollable fullscreen>
          <form>
            <br />
            <div className="row">
              <div className="table-responsive ">
                <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                  <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                    <tr>
                      <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>#</th>
                      <th colSpan="4">ยืมโฉนด</th>
                      <th colSpan="3">คืนโฉนด</th>
                      <th colSpan="3">การดำเนินการในที่ดิน</th>                                     
                      <th colSpan="11">หลักประกัน</th>
                    </tr>
                    <tr>
                      <th>เลขที่หนังสือ</th>
                      <th>วันที่หนังสือ</th>
                      <th>เหตุผล</th>
                      <th>จำนวนวันยืมโฉนด</th>
                      <th>เลขที่หนังสือ</th>
                      <th>วันที่หนังสือ</th>
                      <th>หมายเหตุ</th>
                      <th>ประเภทการดำเนินการในที่ดิน</th>
                      <th>แก้ไขหลักทรัพย์</th>
                      <th>แบ่งหลักทรัพย์</th>
                      <th>เลขที่นิติกรรมสัญญา</th>
                      <th>ดัชนีจัดเก็บหลักประกัน</th>
                      <th>ประเภทหลักประกัน</th>
                      <th>เจ้าของหลักประกัน</th>
                      <th>เลขที่หลักประกัน</th>
                      <th>จังหวัด</th>
                      <th>อำเภอ</th>
                      <th>ตำบล</th>
                      <th>ไร่</th>
                      <th>งาน</th>
                      <th>ตารางวา</th>
                    </tr>
                  </thead>
                  <tbody className="list text-center align-middle" id="bulk-select-body">
                    {(histories && histories.length > 0) ? (histories.map((item,index) => RenderData(item, index))) : (
                      <tr>
                        <td className="fs-9 text-center align-middle" colSpan={20}>
                          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
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
export default PageContent;