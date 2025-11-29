import { useEffect, useState } from "react";
import { stringToDateTh, spDate, toCurrency, ToDateDb } from "@utils";
import Textarea from "@views/components/input/Textarea";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  getPostponeGuarantee,
  savePostponeGuarantee
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const PostPone = (props) => {
  const { policy, isView } = props;
  const [data, setData] = useState([]);
  const [clearFile, setClear] = useState(false);
  const [files, setFiles] = useState(null);
  const [detail, setDetail] = useState(null);
  const [id, setId] = useState(null);
  const [remark, setRemark] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [edit, setEdit] = useState(false);
  const onFileChange = async (files) => {
    if (files.length > 0) {
      await setFiles(files);
      await setClear(false);
    }
  }
  const save = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      form.append('id_AssetPolicy', policy.id_AssetPolicy);
      if (id == 0) {
        form.append('date_pp1', ToDateDb(new Date()));
        form.append('remark_pp1', remark);  
      } else {
        form.append('date_pp1', detail.date_pp1);
        form.append('remark_pp1', detail.remark_pp1);
        form.append('date_pp2', ToDateDb(new Date()));
        form.append('remark_pp2', remark);
      }
      files.forEach((item) => form.append("files", item));
      const result = await savePostponeGuarantee(form);
      if (result.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
        await fetchData();
      } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
      }
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'ยังไม่ได้เลือกไฟล์'} />
      ));
      console.error('no file upload');
    }
  }
  const remove = async () => {
    const form = new FormData();
    form.append('id_AssetPolicy', policy.id_AssetPolicy);
    if (id == 1) {
      form.append('date_pp1', detail.date_pp1);
      form.append('remark_pp1', detail.remark_pp1);  
    } 
    const result = await savePostponeGuarantee(form);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await fetchData();
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }

  const handleAdd = async() => {
    if (data && data?.length > 0) await setDetail(data[0]);
    else await setDetail(null);
    await setId(data?.length ?? 0);
    await setRemark(null);
    await setEdit(true);
    await setOpenEdit(true);
  }
  const handleView = async(item) => {
    await setDetail(null);
    await setRemark(null);
    await setOpenEdit(false);
    await setDetail(item);
    await setRemark(item.remark);
    await setEdit(false);
    await setOpenEdit(true);
  }
  const handleEdit = async(item, index) => {
    await setDetail(item);
    await setRemark(item.remark);
    await setId(index);
    await setEdit(true);
    await setOpenEdit(true);
  }
  const fetchData = async () => {
    await setData(null)
    await setDetail(null);
    await setId(null);
    await setEdit(false);
    await setOpenEdit(false);
    const result = await getPostponeGuarantee(policy.id_AssetPolicy);
    if (result.isSuccess) {
      await setData(result.data)
    } 
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.policyNO}</td>
        <td>{item.assetType}</td>
        <td>{item.collateral_no}</td>
        <td>{item.collateral_province}</td>
        <td>{item.collateral_district}</td>
        <td>{item.collateral_sub_district}</td>
        <td>{`${item.contract_area_rai ? item.contract_area_rai : 0}`}</td>
        <td>{`${item.contract_area_ngan ? item.contract_area_ngan : 0}`}</td>
        <td>{`${item.contract_area_sqaure_wa ? item.contract_area_sqaure_wa : 0}`}</td>
        <td>{item.transferStatus}</td>
        <td>{stringToDateTh(item.date, false)}</td>
        <td>{item.remark}</td>
        <td>
          <div className='d-flex justify-content-center'>
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => handleView(item)}>
              <i className="far fa-eye"></i>
            </button>
          </div>
        </td>
        {((data?.length ?? 0) - 1 == index) ? (
          <>
            <td>
              <div className='d-flex justify-content-center'>
                <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => handleEdit(item, index)} >
                  <i className="far fa-edit"></i>
                </button>
              </div>
            </td>
            <td>
              <div className='d-flex justify-content-center'>
                <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => handleEdit(item, index)} >
                  <i className="far fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td></td><td></td>
          </>
        )}
      </tr>
    ))
  }
  useEffect(() => {
    fetchData();
  },[])
  return (
    <>
      <form>
        <br />
        <div className="row g-3">
          {(!data || data?.length < 2) && (
            <div className={`d-flex mb-3 flex-row-reverse ${isView ? 'd-none' : ''}`}>
              <button type="button" className="btn btn-warning btn-sm ms-2" onClick={() => handleAdd()}><span className="fas fa-plus fs-8"></span> เลื่อนโอนหลักทรัพย์</button>
            </div>
          )}
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
              <th rowSpan="2">#</th>
                <th colSpan="10">นิติกรรมสัญญา</th>
                <th colSpan="2">เลื่อนโอนหลักทรัพย์</th>
                <th colSpan="3">ดำเนินการ</th>
              </tr>
              <tr>
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>ประเภทหลักทรัพย์</th>
                <th>หลักทรัพย์เลขที่</th>
                <th>จังหวัด</th>
                <th>อำเภอ</th>
                <th>ตำบล</th>
                <th>ไร่</th>
                <th>งาน</th>
                <th>ตารางวา</th>
                <th>สถานะการโอนหลักทรัพย์</th>
                <th>วันที่</th>
                <th>หมายเหตุ</th>
                <th>ดูข้อมูล</th>
                <th>แก้ไขข้อมูล</th>
                <th>ลบข้อมูล</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={20}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {openEdit && (
            <>
              <div className="card shadow-none border my-2" data-component-card="data-component-card">
                <div className="card-body p-0">
                  <div className="p-3 code-to-copy">
                    <h3 className="text-center">รายละเอียดเลื่อนโอนหลักทรัพย์</h3><br />
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-4">
                      <Textarea title={'เหตุผลการเลื่อน'} containerClassname={'mb-3'}  handleChange={(val) => setRemark(val)} value={remark} disabled={isView || !edit} />
                    </div>
                    <div className="col-12 mt-3">
                      {/*  Show old file  */}
                      {edit && (
                        <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                      )}
                    </div>
                    {/*
                    <div className="row justify-content-center mt-3 mb-3">
                      <div className="col-auto">
                        <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                      </div>
                    </div>
                    */}
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="row g-3 justify-content-center">
                  <div className="col-auto">
                    <button className="btn btn-success me-1 mb-1" type="button" onClick={() => save()}>บันทึก</button>
                    {(edit && detail) && (
                      <button className="btn btn-danger me-1 mb-1" type="button" onClick={() => remove()}>ลบข้อมูล</button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </>
  );
};
export default PostPone;