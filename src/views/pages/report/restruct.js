import { useEffect, useCallback, useState } from "react";
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import DatePicker from "@views/components/input/DatePicker";
import Dropdown from "@views/components/input/DropdownSearch";
import { Spinner } from 'reactstrap'
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import { 
  getProvinces,
  getBigDataCreditors,
  getBigDataCreditorTypes,
  getYears,
} from "@services/api";

const user = getUserData();
const Report = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [year, setYear] = useState(null);
  const [province, setProvince] = useState(null);
  const [creditorType, setCreditorType] = useState(null);
  const [creditor, setCreditor] = useState(null);
  const [isLoad, setLoad] = useState(false);
  const [yearOp, setYearOp] = useState(null);
  const [provOp, setProvOp] = useState(null);
  const [creditorTypeOp, setCreditorTypeOp] = useState(null);
  const [creditorOp, setCreditorOp] = useState(null);
  
  const download = async (id) => {
    setLoad(true);
    // download get progress
  }
  const onChange = async(key, val) => {
    if (key == 'province') {
      await setCreditorTypeOp(null);
      await setProvince(val)
      const resultCreditorType = await getBigDataCreditorTypes(val);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        await setCreditorType('all');
        await setCreditorOp(null);
        const resultCreditor = await getBigDataCreditors(val);
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
          await setCreditor('all');
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
    } else if (key == 'creditorType') {
      await setCreditorOp(null);
      await setCreditorType(val);
      const resultCreditor = await getBigDataCreditors(province, val);
      if (resultCreditor.isSuccess) {
        const temp2 = resultCreditor.data.map(item => item.name);
        await setCreditorOp(temp2);
        await setCreditor('all');
      } else await setCreditorOp(null);
    } else {
      await setCreditor(val);
    }
  }
  async function fetchData() {
    const resultYear = await getYears();
    const resultProv = await getProvinces();
    if (resultYear.isSuccess) {
      await setYearOp(resultYear.data);
    } else await setYearOp(null);
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
      const resultCreditorType = await getBigDataCreditorTypes(null);
      if (resultCreditorType.isSuccess) {
        const temp1 = resultCreditorType.data.map(item => item.name);
        await setCreditorTypeOp(temp1);
        const resultCreditor = await getBigDataCreditors(null, temp1[0]);
        if (resultCreditor.isSuccess) {
          const temp2 = resultCreditor.data.map(item => item.name);
          await setCreditorOp(temp2);
        } else await setCreditorOp(null);
      } else {
        await setCreditorTypeOp(null);
        await setCreditorOp(null);
      } 
    } else {
       await setProvOp(null);
       await setCreditorTypeOp(null);
       await setCreditorOp(null);
    }
  }

  //** ComponentDidMount
  useEffect(() => {
    fetchData();
    return () => console.log('Clear data')
  }, []);
  return (
    <>
      <div className="content">
        <h4>รายงาน</h4>
        <div>
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'ปรับปรุงโครงสร้างหนี้ฯ'}
                  className={"my-4"}
                  children={(
                    <>
                      <form className="row g-3">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <DatePicker title={'วันที่เริ่มต้น'}
                            value={startDate} 
                            handleChange={(val) => setStartDate(val)} 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <DatePicker title={'วันที่สิ้นสุด'}
                            value={endDate} 
                            handleChange={(val) => setEndDate(val)} 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          {yearOp && (
                            <Dropdown 
                              title={'ปีงบประมาณ'} 
                              containerClassname={'mb-3'} 
                              defaultValue={'all'} 
                              options={yearOp}
                              handleChange={(val) => setYear(val)}
                              hasAll />
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          {provOp && (
                            <Dropdown 
                              title={'จังหวัด'} 
                              containerClassname={'mb-3'} 
                              defaultValue={'all'} 
                              options={provOp}
                              handleChange={(val) => onChange('province', val)}
                              hasAll />
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          {creditorTypeOp && (
                            <Dropdown 
                              title={'ประเภทเจ้าหนี้'} 
                              containerClassname={'mb-3'} 
                              defaultValue={'all'} 
                              options={creditorTypeOp}
                              handleChange={(val) => onChange('creditorType', val)}
                              hasAll
                              />
                          )}
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          {creditorOp && (
                            <Dropdown 
                              title={'สถาบันเจ้าหนี้'} 
                              containerClassname={'mb-3'} 
                              defaultValue={'all'} 
                              options={creditorOp}
                              handleChange={(val) => onChange('creditor', val)}
                              hasAll
                            />
                          )}
                        </div>
                      </form>
                      <br />
                      <div className="row">
                        <div data-list='{"valueNames":["name","email","age"]}'>
                          <div className="table-responsive mx-n1 px-1">
                            <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                              <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                                <tr>
                                  <th style={{ minWidth: 30 }}>#</th>
                                  <th>รายงาน</th>
                                  <th>ดำเนินการ</th>
                                </tr>
                              </thead>
                              <tbody className="list align-middle">
                                <tr>
                                  <td className="text-center">1</td><td style={{ paddingLeft: 20 }}>รายงานวิเคราะห์ลูกหนี้แบบแจกแจง</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(1)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">2</td><td style={{ paddingLeft: 20 }}>รายงานสรุปวิเคราะห์อายุลูกหนี้ รายจังหวัด</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(2)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">3</td><td style={{ paddingLeft: 20 }}>รายงานสรุปการติดตามการชำระหนี้คืนของเกษตรกร</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(3)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">4</td><td style={{ paddingLeft: 20 }}>รายงานสรุปการติดตามการชำระหนี้คืน รายจังหวัด</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(3)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">5</td><td style={{ paddingLeft: 20 }}>รายงานวิเคราะห์ลูกหนี้เกษตรกร (รายตัว)</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(3)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">6</td><td style={{ paddingLeft: 20 }}>ลูกหนี้เกินกำหนดสัญญา</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(3)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">7</td><td style={{ paddingLeft: 20 }}>รายงานการขยายงวดการชำระ</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(3)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">8</td><td style={{ paddingLeft: 20 }}>รายงานการรับสภาพหนี้</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(3)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">9</td><td style={{ paddingLeft: 20 }}>รายงานการรับสภาพการบังคับตามสัญญา</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(3)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Loading isOpen={isLoad} setModal={setLoad} centered scrollable size={'lg'} title={'เรียกข้อมูลรายงาน'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default Report;