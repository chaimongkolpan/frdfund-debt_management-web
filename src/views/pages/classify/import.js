import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@utils";
import Filter from "@views/components/classify/filterImport";
import According from "@views/components/panel/according";
import DataTable from "@views/components/classify/importTable";
import { 
  importClassify
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const ImportClassify = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(0);
  const [fail_list, setFailList] = useState([]);
  const [succeed, setSuceed] = useState(0);
  const onSubmit = async (filter) => {
    if (filter.file) {
      const form = new FormData();
      form.append('debtType', filter.debtType);
      form.append('creditorType', filter.creditorType);
      form.append('file', filter.file);
      const result = await importClassify(form);
      if (result.isSuccess) {
        setFailed(result.failed);
        setFailList(result.fail_list);
        setSuceed(result.succeed);
        if (!result.hasFail) {
          toast((t) => (
            <ToastContent t={t} title={'บันทีกข้อมูล'} message={'บันทึกสำเร็จ'} />
          ));
          setData(result.contracts);
          return true
        } else {
        toast((t) => (
          <ToastError t={t} title={'บันทีกข้อมูล'} message={'มีข้อมูลไม่ถูกต้อง'} />
        ));
          return false
        }
      } else {
        toast((t) => (
          <ToastError t={t} title={'บันทีกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
        setData(null)
        return false
      }
    } else {
      toast((t) => (
        <ToastError t={t} title={'อัปโหลดไฟล์'} message={'กรุณาอัปโหลดไฟล์'} />
      ));
      console.error('file not upload.')
    }
  }
  return (
    <>
      <div className="content">
        <h4 className="mb-3">นำไฟล์เข้าระบบจำแนกมูลหนี้</h4>
        <div className="mt-4">
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'เลือกข้อมูลไฟล์นำเข้า'}
                  className={"my-4"}
                  children={(
                    <>
                      <Filter handleSubmit={onSubmit} succeed={succeed} failed={failed} fail_list={fail_list}/>
                      {(data && data.length > 0) && (
                        <>
                          <br />
                          <DataTable data={data}/>
                        </>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ImportClassify;