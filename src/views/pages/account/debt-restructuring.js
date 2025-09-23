import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { stringToDateTh, toCurrency, getUserData } from "@utils";
import According from "@views/components/panel/according";
import Modal from "@views/components/modal/customModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/account/debt-restructuring/filter";
import SearchTable from "@views/components/account/debt-restructuring/searchTable";
import DropZone from "@views/components/input/DropZone";
import { 
  cleanData,
  searchRestructuring,
} from "@services/api";

const user = getUserData();
const PageContent = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [clearFile, setClear] = useState(false);
  const [files, setFiles] = useState(null);
  const [oldfiles, setOldFiles] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const onFileChange = async (files) => {
    if (files.length > 0) {
      await setFiles(files);
      await setClear(false);
    }
  }
  const download = (file) => {
    console.log('download', file)
  }
  const RemoveFile = (index) => {
    oldfiles.splice(index, 1);
    setOldFiles(oldfiles);
  }
  const onSubmitFile = async () => {
    if (files && files.length > 0) {
      const form = new FormData();
      form.append('ids[]', policy.id_KFKPolicy);
      form.append('document_type', 'เอกสารปรับโครงสร้างหนี้');
      form.append('id_RestructurePolicy', policy.id_RestructurePolicy);
      form.append('RestructurePolicyStatus', 'ปรับโครงสร้างหนี้แล้ว');
      files.forEach((item) => form.append("files", item));
      const result = await saveRestructureDocumentPolicy(form);
      if (result.isSuccess) {
        await setUploadStatus("success");
      } else {
        await setUploadStatus("fail");
      }
    } else {
      console.error('no file upload');
    }
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter(filter)
    const result = await searchRestructuring(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const handleUpload = async (item) => {
    await setPolicy(item);
    if (item.document_name) {
      await setOldFiles(item.document_name.split(','))
    } else await setOldFiles(null)
    await setUploadStatus(null);
    await setOpenUpload(true);
  }
  const handleCloseUpload = async () => {
    await onSearch(filter);
    await setOpenUpload(false);
  }
  return (
    <>
      <div className="content">
        <h4 className="mb-3">ปรับโครงสร้างหนี้</h4>
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
                        <SearchTable result={data} filter={filter} getData={onSearch} handleUpload={handleUpload} />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {openUpload && (
        <Modal isOpen={openUpload} setModal={setOpenUpload} hideOk onClose={() => handleCloseUpload()}  title={`อัพโหลดเอกสารประกอบปรับโครงสร้างหนี้ นิติกรรมสัญญาเลขที่ ${policy?.policyNO}`} closeText={'ปิด'} scrollable size={'xl'}>
          <form>
            <br />
            <div className="row">
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
              <div className="col-12">
                <DropZone onChange={onFileChange} clearFile={clearFile} accept={'*'} />
              </div>
              <div className="row justify-content-center mt-3 mb-3">
                <div className="col-auto">
                  <button className="btn btn-primary me-1 mb-1" type="button" onClick={onSubmitFile}>นำไฟล์เข้าระบบ</button>
                </div>
              </div>
              {uploadStatus && (
                <div className={`alert alert-outline-${uploadStatus == "success" ? 'success' : 'danger'} d-flex align-items-center`} role="alert">
                  <p className="mb-0 flex-1 text-center"><span className={`fas ${uploadStatus == "success" ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'} fs-5 me-3`} ></span>
                    {uploadStatus == "success" ? 'บันทึกข้อมูลสำเร็จ' : 'บันทึกข้อมูลไม่สำเร็จ กรุณาตรวสอบไฟล์'}
                  </p>
                </div>
              )}
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