import { useEffect, useState } from "react";
import { stringToDateTh, toCurrency, getBookNo } from "@utils";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import { 
  cleanData,
  getPetitionList,
  getPetitionById,
} from "@services/api";
const BookDateTable = (props) => {
  const { savePetition, setSavePetition, loadPetition, setLoadPetition } = props;
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState({
    currentPage: 1,
    pageSize: 0
  });
  const [showDetail, setShowDetail] = useState(false);
  const [petition, setPetition] = useState(null);
  const [detail, setDetail] = useState(null);
  const onChange = async (key, val) => {
    await setSavePetition((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const GetDetail = async (item) => {
    await setShowDetail(false);
    await setDetail(null);
    const result = await getPetitionById(item.id_petition);
    if (result.isSuccess) {
      await setSavePetition((prevState) => ({
        ...prevState,
        id_petition: item.id_petition,
        petition_no_office: null,
        petition_date_office: null,
      }))
      await setPetition(item);
      await setDetail(result.data);
      await setShowDetail(true);
    }
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{index + 1}</td>
        <td><div className="d-flex justify-content-center"><button type="button" className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => GetDetail(item)}><i className="far fa-list-alt "></i></button></div></td>
        <td>{stringToDateTh(item.created_at,false)}</td>
        <td>{item.num_of_contracts}</td>
        <td>{item.disbursement}</td>
        <td>{item.num_of_Cheques}</td>
        <td>{toCurrency(item.petition_amount)}</td>
      </tr>
    ))
  }
  const RenderDetail = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{item.cheques_no}</td>
        <td>{toCurrency(item.cashier_check_amount)}</td>
        <td>{item.disbursement}</td>
      </tr>
    ))
  }
  const fetchData = async () => {
    const result = await getPetitionList(filter);
    if (result.isSuccess) {
      await setLoadPetition(false);
      await setShowDetail(false);
      await setData(result.data);
    } else {
      await setData(null);
    }
  }
  useEffect(() => {
    if (loadPetition) fetchData();
  },[loadPetition])
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
                    <div className="flex-grow-1">วันที่สร้างฎีกา : {stringToDateTh(petition.created_at,false)}</div>
                    <div className="flex-grow-1">จำนวนสัญญา : {petition.num_of_contracts}</div>
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
                            {(detail && detail.length > 0) ? (detail.map((item,index) => RenderDetail(item, index))) : (
                              <tr>
                                <td className="fs-9 text-center align-middle" colSpan={3}>
                                  <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <BookNo title={'เลขที่หนังสือฎีกา'} subtitle={'กฟก.'+ getBookNo() } containerClassname={'mb-3'} handleChange={(val) => onChange('petition_no_office',val)} value={savePetition?.petition_no_office} />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <DatePicker title={'วันที่หนังสือฎีกา'}
                      value={savePetition?.petition_date_office} 
                      handleChange={(val) => onChange('petition_date_office',val)} 
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