import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, ToDateDb, getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/CustomModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/account/follow/filter";
import SearchTable from "@views/components/account/follow/searchTable";
import Textarea from "@views/components/input/Textarea";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchFollow,
  saveIsLoss,
  getIsLoss,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";


const user = getUserData();
const PageContent = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [filter, setFilter] = useState(null);
  const [detail, setSetDetail] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [isView, setIsView] = useState(false);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const [remark, setRemark] = useState(null);
  const [clearFile, setClear] = useState(false);
  const [files, setFiles] = useState(null);
  const [oldfiles, setOldFiles] = useState(null);
  const download = (file) => {
    console.log('download', file)
  }
  const RemoveFile = (index) => {
    oldfiles.splice(index, 1);
    setOldFiles(oldfiles);
  }
  const onFileChange = async (files) => {
    if (files.length > 0) {
      await setFiles(files);
      await setClear(false);
    }
  }
  const onSubmit = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      form.append('id_KFKPolicy', policy.id_KFKPolicy);
      form.append('PolicyNO', policy.policyNO);
      form.append('isLoss_no', bookNo);
      form.append('isLoss_date', ToDateDb(bookDate));
      form.append('reason', remark);
      files.forEach((item) => form.append("files", item));
      const result = await saveIsLoss(form);
      if (result.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
      } else {
        toast((t) => (
          <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
      }
    } else {
      console.error('no file upload');
      toast((t) => (
        <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchFollow(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const handleShowDetail = async (item, iv) => {
    await setIsView(iv)
    await setPolicy(item);
    const result = await getIsLoss(item.id_KFKPolicy);
    if (result.isSuccess) {
      await setSetDetail(result.data);
      await setBookNo(result.data?.isLoss_no)
      await setBookDate(result.data?.isLoss_date)
      await setRemark(result.data?.reason)
      await setFiles(null)
      await setOldFiles(result.data?.isLoss_docu.split(','))
    } else {
      await setSetDetail(null)
      await setBookNo(null)
      await setBookDate(null)
      await setRemark(null)
      await setFiles(null)
      await setOldFiles(null)
    }
    await setOpenDetail(true);
  }
  const exportFollow = async () => {

  }
  return (
    <>
      <div className="content">
        <h4 className="mb-3">การติดตามชำระหนี้คืน</h4>
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
                        <SearchTable result={data} filter={filter} getData={onSearch} 
                          handleShowDetail={handleShowDetail}
                        />
                      )}
                      {data && (
                        <div class="d-flex align-items-center justify-content-center my-3">
                          <div class="d-flex">
                            <button class="btn btn-outline-success btn-sm ms-2" type="button" onClick={() => exportFollow()}>Export</button>
                          </div>
                        </div>
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
        <Modal isOpen={openDetail} setModal={setOpenDetail} hideOk={isView} onOk={onSubmit} okText={'บันทึก'} onClose={() => setOpenDetail(false)}  title={isView ? 'เปลี่ยนสถานะหนี้ สงสัยจะสูญ' : 'รายละเอียดสถานะหนี้ สงสัยจะสูญ'} closeText={'ปิด'} scrollable fullscreen>
          <form>
            <br />
            <div className="mb-1">
              <div className="card shadow-none border my-4" data-component-card="data-component-card">
                <div className="card-body p-0">
                  <div className="p-4 code-to-copy">
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <Textbox title={'เลขที่หนังสือ'} value={bookNo} handleChange={(val) => setBookNo(val)} disabled={isView} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mt-3">
                        <DatePicker title={'วันที่หนังสือ'} value={bookDate} handleChange={(val) => setBookDate(val)} disabled={isView} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                        <Textarea title={'หมายเหตุ'} value={remark} handleChange={(val) => setRemark(val)} disabled={isView} />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                        <h5 className="text-center align-middle mb-3">เอกสารประกอบ</h5>
                        {oldfiles && (
                          <div className="col-12">
                            {oldfiles.map((file, index) => (
                              <div key={index} className="d-flex pb-3 border-bottom border-translucent media px-2">
                                <div className="border p-2 rounded-2 me-2">
                                  <img className="rounded-2" width={25} src="/assets/img/icons/file.png" alt="..." data-dz-thumbnail="data-dz-thumbnail" />
                                </div>
                                <div className="flex-1 d-flex flex-between-center">
                                  <div>
                                    <h6 data-dz-name="data-dz-name">{file}</h6>
                                  </div>
                                  <div className="dropdown">
                                    <button className="btn btn-link text-body-quaternary btn-sm dropdown-toggle btn-reveal dropdown-caret-none" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <span className="fas fa-ellipsis-h"></span>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-end border border-translucent py-2">
                                      <button className="dropdown-item" type="button" onClick={() => download(file)}>Download File</button>
                                      <button className="dropdown-item" type="button" onClick={() => RemoveFile(index)}>Remove File</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {!isView && (
                          <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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