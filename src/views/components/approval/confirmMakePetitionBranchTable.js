import { useEffect, useState } from "react";
import { stringToDateTh } from "@utils";
const ConfirmTable = (props) => {
  const { data } = props;
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
        <td>{item.date_member_first_time ? stringToDateTh(item.date_member_first_time, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.date_member_current ? stringToDateTh(item.date_member_current, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.status}</td>
        <td>{item.organization_register_round}</td>
        <td>{item.organization_name}</td>
        <td>{item.organization_no}</td>
        <td>{item.debt_register_round}</td>
        <td>{item.date_submit_debt_register ? stringToDateTh(item.date_submit_debt_register, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.passed_approval_no}</td>
        <td>{item.passed_approval_date ? stringToDateTh(item.passed_approval_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.creditor_type}</td>
        <td>{item.creditor_name}</td>
        <td>{item.creditor_province}</td>
        <td>{item.creditor_branch}</td>
        <td>{item.contract_no}</td>
        <td>{item.remaining_principal_contract}</td>
        <td>{item.dept_status}</td>
        <td>{item.collateral_type}</td>
        <td>{item.status}</td>
      </tr>
    ))
  }
  return (
    <>
      <br />
      <div class="row">
        <div className="d-flex">
          <div className="square border border-1"  style={{ background: "#fff", height: 20, width: 30 }}></div>
          <div className="ms-1">ปกติ</div>
          <div className="ms-2 square border border-1"  style={{ background: "rgb(255, 242, 205)", height: 20, width: 30 }}></div>
          <div className="ms-1">เพิ่มเงิน</div>
        </div>
        <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
          <div className="table-responsive mx-n1 px-1">
            <table className="table table-sm table-striped table-bordered fs-9 mb-0">
              <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                <tr>
                  <th rowSpan="2" style={{ minWidth: 40 }}>#</th>
                  <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                  <th colSpan="4">เกษตรกร</th>
                  <th colSpan="4">เจ้าหนี้</th>
                  <th colSpan="11">สัญญา</th>
                  <th>หลักทรัพย์ค้ำประกัน</th>
                  <th rowSpan="2">สถานะสัญญา</th>
                </tr>
                <tr>
                  <th>ครั้งที่เสนอคณะกรรมการ</th>
                  <th>วันที่เสนอคณะกรรมการ</th>
                  <th>เลขบัตรประชาชน</th>
                  <th>คำนำหน้า</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>จังหวัด</th>
                  <th>ประเภทเจ้าหนี้</th>
                  <th>สถาบันเจ้าหนี้</th>
                  <th>จังหวัดเจ้าหนี้</th>
                  <th>สาขาเจ้าหนี้</th>
                  <th>เลขที่สัญญา</th>
                  <th>เงินต้น</th>
                  <th>ดอกเบี้ย</th>
                  <th>ค่าปรับ</th>
                  <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                  <th>ค่าถอนการยึดทรัพย์</th>
                  <th>รวมค่าใช้จ่าย</th>
                  <th>รวมทั้งสิ้น</th>
                  <th>วัตถุประสงค์การกู้</th>
                  <th>สถานะหนี้</th>
                  <th>ประเภทหลักประกัน</th>
                  <th>ประเภทและเลขที่หลักทรัพย์(เลขโฉนด)</th>
                </tr>
              </thead>
              <tbody className="list text-center align-middle">
                {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                  <tr>
                    <td className="fs-9 text-center align-middle" colSpan={24}>
                      <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="p-4 code-to-copy">
          <div class="row g-3">
            <div class="card p-3" >
              <h3>
                <div class="d-flex justify-content-center">
                  <div>เจ้าหนี้</div>
                </div>
              </h3>
                <div class="row">
                  <div class="d-flex justify-content-center p-3">
                    <div class="col-sm-12 col-md-12 col-lg-8">
                      <div class="form-floating">
                        <select class="form-select" id="floatingSelectPrivacy">
                          <option value="" selected>เลือกข้อมูล...</option>
                          <option value="เบิกจ่ายเต็มจำนวน" >เบิกจ่ายเต็มจำนวน</option>
                          <option value="แยกเช็ค">แยกเช็ค</option>
                        </select>
                        <label for="floatingSelectPrivacy">ประเภทการเบิกจ่าย</label>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center p-3">
                    <div class="col-sm-12 col-md-12 col-lg-8" >
                    <div class="card p-3">
                      <h5>
                        <div class="d-flex justify-content-center p-3">
                          <div>เบิกจ่ายเต็มจำนวน</div>
                        </div>
                      </h5>
                      <div class="input-group mb-3">
                        <span class="input-group-text" id="Search_id_card">จำนวนเบิกจ่าย</span>
                        <input class="form-control" type="text" aria-label="รายละเอียดเช็ค" disabled/>
                        <span class="input-group-text" id="Search_id_card">บาท</span>
                      </div>
                      <div class="d-flex justify-content-center ">
                        <button class="btn btn-success" type="submit">บันทึก</button>
                      </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center p-3">
                    <div class="col-sm-12 col-md-12 col-lg-8">
                      <div class="card p-3">
                        <h5>
                          <div class="d-flex justify-content-center ">
                            <div>จ่ายแยกเช็ค</div>
                          </div>
                        </h5>
                          <div class="col-sm-12 col-md-12 col-lg-12" >
                            <div class="table-responsive mx-n1 px-1">
                              <table class="table table-borderless">
                                <tr class="list text-center align-middle">
                                  <td colspan="5">                                    
                                    <div class="input-group mb-3">
                                    <span class="input-group-text" id="Search_id_card">เช็คที่ 1</span>
                                    <span class="input-group-text" id="Search_id_card">จำนวนเบิกจ่าย</span>
                                    <input class="form-control" type="text" aria-label="รายละเอียดเช็ค" disabled/>
                                    <span class="input-group-text" id="Search_id_card">บาท</span>
                                  </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td><input class="form-check-input" type="checkbox"/> &nbsp;เงินต้น</td>
                                  <td><input class="form-check-input" type="checkbox"/> &nbsp;ดอกเบี้ย</td>
                                  <td><input class="form-check-input" type="checkbox"/> &nbsp;ค่าปรับ</td>
                                  <td><input class="form-check-input" type="checkbox"/> &nbsp;ค่าใช้จ่ายในการดำเนินคดี</td>
                                  <td><input class="form-check-input" type="checkbox"/> &nbsp;ค่าถอนการยึดทรัพย์</td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        <div class="col-sm-12 col-md-12 col-lg-12" >
                          <div class="table-responsive mx-n1 px-1">
                            <table class="table table-borderless">
                              <tr class="list text-center align-middle">
                                <td colspan="5">                                    
                                  <div class="input-group mb-3">
                                  <span class="input-group-text" id="Search_id_card">เช็คที่ 2</span>
                                  <span class="input-group-text" id="Search_id_card">จำนวนเบิกจ่าย</span>
                                  <input class="form-control" type="text" aria-label="รายละเอียดเช็ค" disabled/>
                                  <span class="input-group-text" id="Search_id_card">บาท</span>
                                </div>
                                </td>
                              </tr>
                              <tr>
                                <td><input class="form-check-input" type="checkbox"/> &nbsp;เงินต้น</td>
                                <td><input class="form-check-input" type="checkbox"/> &nbsp;ดอกเบี้ย</td>
                                <td><input class="form-check-input" type="checkbox"/> &nbsp;ค่าปรับ</td>
                                <td><input class="form-check-input" type="checkbox"/> &nbsp;ค่าใช้จ่ายในการดำเนินคดี</td>
                                <td><input class="form-check-input" type="checkbox"/> &nbsp;ค่าถอนการยึดทรัพย์</td>
                              </tr>
                            </table>
                          </div>
                        </div>
                        <div class="d-flex justify-content-center ">
                        <button class="btn btn-primary" type="button">เพิ่มเช็ค</button>&nbsp;
                        <button class="btn btn-danger" type="button">ลบเช็ค</button>&nbsp;
                        <button class="btn btn-success" type="submit">บันทึก</button>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfirmTable;