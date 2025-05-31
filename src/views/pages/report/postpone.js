import { useEffect, useState } from "react";
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import DatePicker from "@views/components/input/DatePicker";
import { Spinner } from 'reactstrap'
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import { 
  cleanData
} from "@services/api";

const user = getUserData();
const Report = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoad, setLoad] = useState(false);
  
  const download = async (id) => {
    setLoad(true);
    // download get progress
  }
  return (
    <>
      <div className="content">
        <h4>รายงาน</h4>
        <div>
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'ชะลอหนี้'}
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
                                  <td className="text-center">1</td><td style={{ paddingLeft: 20 }}>รายงานทะเบียนคุมสัญญา</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(1)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">2</td><td style={{ paddingLeft: 20 }}>รายงานทะเบียนคุมสินทรัพย์</td>
                                  <td>
                                    <div className="d-flex justify-content-center"> 
                                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-secondary-dark px-0" disabled onClick={() => download(2)}>
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">3</td><td style={{ paddingLeft: 20 }}>รายงานทะเบียนคุมบุคคลค้ำประกัน</td>
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