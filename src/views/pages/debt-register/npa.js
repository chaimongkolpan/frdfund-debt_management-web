import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/FullModal";
import Loading from "@views/components/modal/loading";
import Filter from "@views/components/debtRegister/filterNpa";
import BigDataTable from "@views/components/debtRegister/bigdataTableNpa";
import SelectedTable from "@views/components/debtRegister/selectedTableNpa";
import ConfirmTable from "@views/components/debtRegister/confirmTable";
import logo from '@src/assets/images/icons/logo.png'
import { 
  cleanData,
  searchBigData,
  addBigData,
  removeBigData,
  getAddedList,
  submitListNPL,
} from "@services/api";

const user = getUserData();
const DebtRegisterNpa = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [makelistSelected, setMakeList] = useState(null);
  const [filterAdded, setFilterAdded] = useState({
    currentPage: 1,
    pageSize: process.env.PAGESIZE
  });
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchBigData(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const onAddBigData = async (selected) => {
    const result = await addBigData(selected);
    if (result.isSuccess) {
      await onSearch(filter);
      await fetchData(filterAdded);
    }
  }
  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await getAddedList(query);
    if (result.isSuccess) {
      setAddedData(result)
    } else {
      setAddedData(null)
    }
  }
  const onRemoveMakelist = async (selected) => {
    const result = await removeBigData(selected);
    if (result.isSuccess) {
      await fetchData(filterAdded)
    }
  }
  const onSubmitMakelist = async () => {
    setSubmit(false);
    setLoadBigData(true);
    const clearTimer = setTimeout(() => {
      setLoadBigData(false);
      // show timeout
    }, 10000);
    const result = await submitListNPL({ type: 'application/octet-stream', filename: 'จัดทำรายชื่อเกษตรกร_' + (new Date().getTime()) + '.zip', data: makelistSelected });
    if (result.isSuccess) {
      await fetchData(filterAdded)
    }
    clearTimeout(clearTimer);
    setLoadBigData(false);
  }
  const onCloseMakelist = async () => {
    setSubmit(false);
  }
  const handleSubmit = async(selected) => {
    await setMakeList(selected);
    await setSubmit(true);
  }
  useEffect(() => {

  },[data])
  useEffect(() => {
    setLoadBigData(true);
    fetchData(filterAdded);
    return cleanData
  },[])
  return (
    <>
      <div className="content">
        <h4 >จัดทำรายชื่อเกษตรกร NPA</h4>
        <div className="d-flex flex-row-reverse">
          <div><button type="button" className="btn btn-primary btn-sm ms-2" data-bs-toggle="modal" data-bs-target="#ModalRegisterNPA" ><span className="fas fa-plus"></span> สร้างทะเบียน NPA</button></div>
        </div>
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
                        <BigDataTable result={data} handleSubmit={onAddBigData} />
                      )}
                      <div id="tableSearch" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
                        <div className="table-responsive mx-n1 px-1">
                          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0",border: "#cdd0c7" }}>
                              <tr>
                                <th className="white-space-nowrap fs-9 ps-0" rowspan="2" style={{ maxWidth:20, width:18 }}>
                                  <div className="form-check ms-2 mb-0 fs-8">
                                    <input className="form-check-input" type="checkbox" data-bulk-select='{"body":"bulk-select-body","actions":"bulk-select-actions","replacedElement":"bulk-select-replace-element"}' />
                                  </div>
                                </th>
                                <th colspan="7">เกษตรกร</th>
                                <th colspan="2">องค์กร</th>
                                <th colspan="4">ทะเบียนหนี้</th>
                                <th colspan="4">เจ้าหนี้</th>
                                <th colspan="8">สัญญา</th>
                                <th colspan="7">ข้อมูลทรัพย์ NPA</th>
                              </tr>
                              <tr>
                                <th>เลขบัตรประชาชน</th>
                                <th>คำนำหน้า</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>จังหวัด</th>
                                <th>วันที่เป็นสมาชิก (ครั้งแรก)</th>
                                <th>วันที่ขึ้นทะเบียนองค์กรปัจจุบัน</th>
                                <th>รอบองค์กร</th>
                                <th>ชื่อองค์กรการเกษตร</th>
                                <th>หมายเลของค์กร</th>
                                <th>รอบหนี้</th>
                                <th>วันที่ยื่นขึ้นทะเบียนหนี้</th>
                                <th>ผ่านความเห็นชอบครั้งที่</th>
                                <th>ผ่านความเห็นชอบวันที่</th>
                                <th>ประเภทเจ้าหนี้</th>
                                <th>สถาบันเจ้าหนี้</th>
                                <th>จังหวัดเจ้าหนี้</th>
                                <th>สาขาเจ้าหนี้</th>
                                <th>เลขที่สัญญา</th>
                                <th>เงินต้นคงเหลือตามสัญญา</th>
                                <th>สถานะหนี้</th>
                                <th>ประเภทหลักประกัน</th>
                                <th>วัตถุประสงค์การกู้ตามสัญญา</th>
                                <th>ประเภทวัตถุประสงค์การกู้ตามสัญญา</th>
                                <th>สถานะสัญญาจำแนกมูลหนี้</th>
                                <th>รอบ NPA</th>
                                <th>หลักประกัน</th>
                                <th>เลขที่หลักประกัน</th>
                                <th>ตำบล</th>
                                <th>อำเภอ</th>
                                <th>จังหวัด</th>
                                <th>เนื้อที่(ไร่-งาน-ตร.ว.)</th>
                                <th>แก้ไขทะเบียนหนี้ NPA</th>
                              </tr>
                            </thead>
                            <tbody className="list text-center align-middle" id="bulk-select-body">
                              <tr>
                                <td className="fs-9">
                                  <div className="form-check ms-2 mb-0 fs-8">
                                    <input className="form-check-input" type="checkbox" data-bulk-select-row="{&quot;name&quot;:&quot;Anna&quot;,&quot;email&quot;:&quot;anna@example.com&quot;,&quot;age&quot;:18}" />
                                  </div>
                                </td>
                                <td>3100300295557</td>
                                <td>นาง</td>
                                <td>ต้อย แมมะ</td>
                                <td>กรุงเทพมหานคร</td>
                                <td>29/12/2549</td>
                                <td>29/12/2549</td>
                                <td>5</td>
                                <td>กลุ่มเพื่อนเกษตร 2000</td>
                                <td>1043000631</td>
                                <td>2</td>
                                <td>29/12/2549</td>
                                <td>3/2551</td>
                                <td>24 ม.ค.2551</td>
                                <td>สหกรณ์</td>
                                <td>สหกรณ์การเกษตรเมืองมีนบุรี จำกัด</td>
                                <td>กรุงเทพมหานคร</td>
                                <td>มีนบุรี</td>
                                <td>1910</td>
                                <td>30,000.00</td>
                                <td>ผิดนัดชำระ</td>
                                <td>บุคคลค้ำ</td>
                                <td>เพื่อการเกษตร</td>
                                <td>ไร่ข้าวโพด</td>
                                <td>ยังไม่ได้ตรวจสอบ</td>
                                <td>NPA 1 (13/02/65)</td>
                              <td>โฉนด</td>
                              <td>2608</td>
                              <td>ตำบล1</td>
                              <td>อำเภอ1</td>
                              <td>สระบุรี</td>
                              <td>1-2-99.99</td>
                              <td><div className="d-flex justify-content-center"> <a className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" data-bs-toggle="modal" data-bs-target="#ModalEditRegisterNPA"><i className="far fa-edit"></i></a></div></td>
                              </tr>
                              <tr>
                                <td className="fs-9">
                                  <div className="form-check ms-2 mb-0 fs-8">
                                    <input className="form-check-input" type="checkbox" data-bulk-select-row="{&quot;name&quot;:&quot;Anna&quot;,&quot;email&quot;:&quot;anna@example.com&quot;,&quot;age&quot;:18}" />
                                  </div>
                                </td>
                                <td>3100300295557</td>
                                <td>นาง</td>
                                <td>ต้อย แมมะ</td>
                                <td>กรุงเทพมหานคร</td>
                                <td>29/12/2549</td>
                                <td>29/12/2549</td>
                                <td>5</td>
                                <td>กลุ่มเพื่อนเกษตร 2000</td>
                                <td>1043000631</td>
                                <td>2</td>
                                <td>29/12/2549</td>
                                <td>3/2551</td>
                                <td>24 ม.ค.2551</td>
                                <td>สหกรณ์</td>
                                <td>สหกรณ์การเกษตรเมืองมีนบุรี จำกัด</td>
                                <td>กรุงเทพมหานคร</td>
                                <td>มีนบุรี</td>
                                <td>1910</td>
                                <td>30,000.00</td>
                                <td>ผิดนัดชำระ</td>
                                <td>บุคคลค้ำ</td>
                                <td>เพื่อการเกษตร</td>
                                <td>ไร่ข้าวโพด</td>
                                <td>ยังไม่ได้ตรวจสอบ</td>
                                <td>NPA 1 (13/02/65)</td>
                              <td>โฉนด</td>
                              <td>2608</td>
                              <td>ตำบล1</td>
                              <td>อำเภอ1</td>
                              <td>สระบุรี</td>
                              <td>1-2-99.99</td>
                              <td><div className="d-flex justify-content-center"> <a className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" data-bs-toggle="modal" data-bs-target="#ModalEditRegisterNPA"><i className="far fa-edit"></i></a></div></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="d-flex justify-content-between mt-3"><span className="d-none d-sm-inline-block" data-list-info="data-list-info"></span>
                          <div className="d-flex">
                            <button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                            <ul className="mb-0 pagination"></ul>
                            <button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                          </div>
                        </div>
                      </div>

                    </>
                  )}
                />
                <According 
                  title={'จัดทำรายชื่อเกษตรกร'}
                  className={"mb-3"}
                  children={(
                    <SelectedTable result={addedData} handleSubmit={handleSubmit} handleRemove={onRemoveMakelist} filter={filterAdded} getData={fetchData}/>
                  )}
                />
                <div className="card shadow-none border mb-3" data-component-card="data-component-card">
                  <div className="card-header p-4 border-bottom bg-success-dark">
                    <div className="row g-3 justify-content-between align-items-center">
                      <div className="col-12 col-md">
                        <h4 className="text-secondary-subtle mb-0">จัดทำรายชื่อเกษตรกร</h4>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="p-4 code-to-copy">
                  {/* start ตารางจัดทำรายชื่อเกษตรกรNPA*/}                                              
                    <div id="tableMakelist" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
                      <div className="table-responsive mx-n1 px-1">
                        <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                          <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0",border: "#cdd0c7" }}>
                            <tr>
                              <th className="white-space-nowrap fs-9 ps-0" rowspan="2" style={{ maxWidth:20, width:18 }}>
                                <div className="form-check ms-2 mb-0 fs-8">
                                  <input className="form-check-input" id="bulk-select-example2" type="checkbox" data-bulk-select='{"body":"bulk-select-body2","actions":"bulk-select-actions2","replacedElement":"bulk-select-replace-element"}' />
                                </div>
                              </th>
                              <th colspan="7">เกษตรกร</th>
                              <th colspan="2">องค์กร</th>
                              <th colspan="4">ทะเบียนหนี้</th>
                              <th colspan="4">เจ้าหนี้</th>
                              <th colspan="8">สัญญา</th>
                              <th colspan="6">ข้อมูลทรัพย์ NPA</th>
                            </tr>
                            <tr>
                              <th >เลขบัตรประชาชน</th>
                              <th>คำนำหน้า</th>
                              <th >ชื่อ-นามสกุล</th>
                              <th >จังหวัด</th>
                              <th>วันที่เป็นสมาชิก (ครั้งแรก)</th>
                              <th>วันที่ขึ้นทะเบียนองค์กรปัจจุบัน</th>
                              <th>รอบองค์กร</th>
                              <th>ชื่อองค์กรการเกษตร</th>
                              <th>หมายเลของค์กร</th>
                              <th>รอบหนี้</th>
                              <th>วันที่ยื่นขึ้นทะเบียนหนี้</th>
                              <th>ผ่านความเห็นชอบครั้งที่</th>
                              <th>ผ่านความเห็นชอบวันที่</th>
                              <th>ประเภทเจ้าหนี้</th>
                              <th>สถาบันเจ้าหนี้</th>
                              <th>จังหวัดเจ้าหนี้</th>
                              <th>สาขาเจ้าหนี้</th>
                              <th>เลขที่สัญญา</th>
                              <th>เงินต้นคงเหลือตามสัญญา</th>
                              <th>สถานะหนี้</th>
                              <th>ประเภทหลักประกัน</th>
                              <th>วัตถุประสงค์การกู้ตามสัญญา</th>
                              <th>ประเภทวัตถุประสงค์การกู้ตามสัญญา</th>
                              <th>สถานะการตรวจสอบจำแนกมูลหนี้</th>
                              <th>รอบ NPA</th>
                              <th>หลักประกัน</th>
                              <th>เลขที่หลักประกัน</th>
                              <th>ตำบล</th>
                              <th>อำเภอ</th>
                              <th>จังหวัด</th>
                              <th>เนื้อที่(ไร่-งาน-ตร.ว.)</th>
                            </tr>
                          </thead>
                          <tbody className="list text-center align-middle" id="bulk-select-body2">
                            <tr>
                              <td className="fs-9">
                                <div className="form-check ms-2 mb-0 fs-8">
                                  <input className="form-check-input" type="checkbox" data-bulk-select-row="{&quot;name&quot;:&quot;Anna&quot;,&quot;email&quot;:&quot;anna@example.com&quot;,&quot;age&quot;:18}" />
                                </div>
                              </td>
                              <td>1234567891235</td>
                              <td>นาง</td>
                              <td>ต้อย แมมะ</td>
                              <td>กรุงเทพมหานคร</td>
                              <td>29/12/2549</td>
                              <td>29/12/2549</td>
                              <td>5</td>
                              <td>กลุ่มเพื่อนเกษตร 2000</td>
                              <td>1043000631</td>
                              <td>2</td>
                              <td>29/12/2549</td>
                              <td>3/2551</td>
                              <td>24 ม.ค.2551</td>
                              <td>สหกรณ์</td>
                              <td>สหกรณ์การเกษตรเมืองมีนบุรี จำกัด</td>
                              <td>กรุงเทพมหานคร</td>
                              <td>มีนบุรี</td>
                              <td>1910</td>
                              <td>30,000.00</td>
                              <td>ผิดนัดชำระ</td>
                              <td>บุคคลค้ำ</td>
                              <td>เพื่อการเกษตร</td>
                              <td>ไร่ข้าวโพด</td>
                              <td>ยังไม่ได้ตรวจสอบ</td>
                              <td>NPA 1 (13/02/65)</td>
                              <td>โฉนด</td>
                              <td>2608</td>
                              <td>ตำบล1</td>
                              <td>อำเภอ1</td>
                              <td>สระบุรี</td>
                              <td>1-2-99.99</td>
                            </tr>
                            <tr>
                              <td className="fs-9">
                                <div className="form-check ms-2 mb-0 fs-8">
                                  <input className="form-check-input" type="checkbox" data-bulk-select-row="{&quot;name&quot;:&quot;Anna&quot;,&quot;email&quot;:&quot;anna@example.com&quot;,&quot;age&quot;:18}" />
                                </div>
                              </td>
                              <td>1199944687375</td>
                              <td>นาง</td>
                              <td>ต้อย แมมะ</td>
                              <td>กรุงเทพมหานคร</td>
                              <td>29/12/2549</td>
                              <td>29/12/2549</td>
                              <td>5</td>
                              <td>กลุ่มเพื่อนเกษตร 2000</td>
                              <td>1043000631</td>
                              <td>2</td>
                              <td>29/12/2549</td>
                              <td>3/2551</td>
                              <td>24 ม.ค.2551</td>
                              <td>สหกรณ์</td>
                              <td>สหกรณ์การเกษตรเมืองมีนบุรี จำกัด</td>
                              <td>กรุงเทพมหานคร</td>
                              <td>มีนบุรี</td>
                              <td>1910</td>
                              <td>30,000.00</td>
                              <td>ผิดนัดชำระ</td>
                              <td>บุคคลค้ำ</td>
                              <td>เพื่อการเกษตร</td>
                              <td>ไร่ข้าวโพด</td>
                              <td>ยังไม่ได้ตรวจสอบ</td>
                              <td>NPA 1 (13/02/65)</td>
                              <td>โฉนด</td>
                              <td>2608</td>
                              <td>ตำบล1</td>
                              <td>อำเภอ1</td>
                              <td>สระบุรี</td>
                              <td>1-2-99.99</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex justify-content-between mt-3"><span className="d-none d-sm-inline-block" data-list-info="data-list-info"></span>
                        <div className="d-flex">
                          <button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                          <ul className="mb-0 pagination"></ul>
                          <button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                        </div>
                      </div>
                    </div>
                  {/* end ตารางจัดทำรายชื่อเกษตรกรNPA*/}
                      <div className="d-flex align-items-center justify-content-center my-3">
                        <div className="d-none ms-3" id="bulk-select-actions2">
                          <div className="d-flex">
                            <button type="button" className="btn btn-success btn-sm ms-2" data-bs-toggle="modal" data-bs-target="#exampleModal" >จัดทำรายชื่อเกษตรกร</button>
                            <button type="button" className="btn btn-danger btn-sm ms-2" >ไม่จัดทำรายชื่อ</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <Modal isOpen={isSubmit} setModal={setSubmit} onOk={onSubmitMakelist} onClose={onCloseMakelist}  title={'จัดทำรายชื่อเกษตรกร'} okText={'ดาวน์โหลดเอกสารจัดทำรายชื่อเกษตรกร'} closeText={'ปิด'} scrollable>
        <ConfirmTable data={makelistSelected} />
      </Modal>
      <Loading isOpen={isLoadBigData} setModal={setLoadBigData} centered scrollable size={'lg'} title={'เรียกข้อมูลทะเบียนหนี้จาก BigData'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default DebtRegisterNpa;
