import { useEffect, useState } from "react";
import { stringToDateTh } from "@utils";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import { 
  cleanData,
  getPetitionListNpa,
} from "@services/api";
const BookDateTable = () => {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState({
    currentPage: 1,
    pageSize: 0
  });
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [bookNo, setBookNo] = useState(null);
  const [bookDate, setBookDate] = useState(null);
  const GetDetail = async (item) => {
    await setShowDetail(false);
    await setDetail(null);
    // get detail
    await setDetail(null);
    await setShowDetail(true);
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{index + 1}</td>
        <td><div className="d-flex justify-content-center"><button type="button" className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => GetDetail(item)}><i className="far fa-list-alt "></i></button></div></td>
        {/* <td>{item.id_card}</td> */}
        <td>22/08/2566</td>
        <td>3</td>
        <td>เจ้าหนี้</td>
        <td>3</td>
        <td>120,000.00</td>
      </tr>
    ))
  }
  const fetchData = async () => {
    const result = await getPetitionListNpa(filter);
    if (result.isSuccess) {
      setData(result.data)
    } else {
      setData(null)
    }
  }
  useEffect(() => {
    fetchData();
  },[])
  return (
    <>
      <form>
        <div className="row">
          <div className="col-12 p-3">
            <div>
              <div className="table-responsive mx-n1 px-1">
                <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
                  <tr>
                    <th style={{ minWidth: 30 }}>#</th>
                    <th>รายละเอียด</th>
                    <th>วันที่สร้างฎีกา</th>
                    <th>จำนวนสัญญา</th>
                    <th>เบิกจ่ายให้</th>
                    <th>จำนวนเช็ค/โอนเงิน</th>
                    <th>จำนวนเงิน</th>
                  </tr>
                </thead>
                  <tbody className="list text-center align-middle">
                    {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                      <tr>
                        <td className="fs-9 text-center align-middle" colSpan={7}>
                          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {showDetail && (
            <div className="col-12">
              <div className="card p-3">
                <div className="d-flex  justify-content-center p-3">
                  <h5><div className="flex-grow-1 ">เพิ่มเลขที่/วันที่หนังสือ</div></h5>
                </div>
                <div className="d-flex justify-content-start">
                  <h5>
                    <div className="flex-grow-1">วันที่สร้างฎีกา : 22/08/2566</div>
                    <div className="flex-grow-1">จำนวนสัญญา : 3</div>
                  </h5>
                </div>
                <div className="row">
                  <div className="col-12 p-3">
                    <div>
                      <div className="table-responsive mx-n1 px-1">
                        <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                        <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
                          <tr>
                            <th>เช็คที่/โอนครั้งที่</th>
                            <th>จำนวนเงินเบิกจ่าย</th>
                            <th>เบิกจ่ายให้</th>
                          </tr>
                        </thead>
                          <tbody className="list text-center align-middle">
                            <tr>
                              <td>1</td>
                              <td>100,000.00</td>
                              <td>เจ้าหนี้</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>20,000.00</td>
                              <td>เจ้าหนี้</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <BookNo title={'เลขที่หนังสือฎีกา'} subtitle={'กฟก.'} containerClassname={'mb-3'} handleChange={(val) => setBookNo(val)} value={bookNo} />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <DatePicker title={'วันที่หนังสือฎีกา'}
                      value={bookDate} 
                      handleChange={(val) => setBookDate(val)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  );
};
export default BookDateTable;