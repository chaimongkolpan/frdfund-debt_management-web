import { useEffect, useState, useRef } from "react";
import { stringToDateTh, spDate, toCurrency } from "@utils";
import { 
  getProvinces,
  getLegalAsset,
  updateLegalAsset,
  deleteLegalAsset,
} from "@services/api";
import Textbox from "@views/components/input/Textbox";
import AreaTextbox from "@views/components/input/AreaTextbox";
import Textarea from "@views/components/input/Textarea";

const Asset = (props) => {
  const { policy, isView } = props;
  const collateralRef = useRef(null);
  const [isMounted, setMounted] = useState(false);
  const [collaterals, setCollaterals] = useState(null);
  const [collateral_type, setCollateralType] = useState('โฉนด');
  const [collateralDetail, setCollateralDetail] = useState({ 
    id_KFKPolicy: policy.id_KFKPolicy, 
    policyNO: policy.policyNO, 
    assetType: 'โฉนด', 
    collateral_status: 'โอนได้',
    parceL_province:'',
    pre_emption_province:'',
    nS3_province:'',
    nS3A_province:'',
    nS3B_province:'',
    alrO_province:'', 
    condO_province:'',
    labT5_province:'',
    house_province:'',
    otheR_province:'',
});
  const [isOpenCollateralAdd, setOpenCollateralAdd] = useState(true);
  const [isOpenCollateralEdit, setOpenCollateralEdit] = useState(true);
  const [provinces, setProvOp] = useState(null);
  const saveCollateral = async() => {
    const result = await updateLegalAsset(collateralDetail);
    if (result.isSuccess) {
      await fetchData();
      await setOpenCollateralAdd(false)
      await setOpenCollateralEdit(false)
      await setCollateralDetail(null)
    }
  }
  const removeCollateral = async(item) => {
    const result = await deleteLegalAsset(item);
    if (result.isSuccess) {
      await fetchData();
      await setOpenCollateralEdit(false)
      await setCollateralDetail(null)
    }
  }
  const handleChangeCollateral = async (key, val) => {
    if (key == 'assetType') {
      await setCollateralType(val);
      await setCollateralDetail((prevState) => ({
        ...prevState,
        ...({stock_status: (val == 'หุ้น' ? 'Y' : 'N')})
      }))
    }
    await setCollateralDetail((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const fetchData = async () => {
    const result = await getLegalAsset(policy.id_KFKPolicy);
    if (result.isSuccess) {
      await setCollaterals(result.collaterals)
    } else {
      await setCollaterals(null)
    }
  }
  const getProvince = async () => {
    const resultProv = await getProvinces();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
    } else {
      await setProvOp(null);
    }
    await setMounted(true);
  }
  useEffect(() => {},[collateralRef]);
  useEffect(() => {
    if (!isMounted) {
      fetchData();
      getProvince();
    }
  },[])
  return (
    <>
      <div className={`d-flex mb-3 flex-row-reverse ${isView ? 'd-none' : ''}`}>
        {/* <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => addCollateral()}><span className="fas fa-plus fs-8"></span> เพิ่มหลักประกัน</button> */}
      </div>
        <div ref={collateralRef} className="row g-3">
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="form-floating needs-validation">
              <select className="form-select" value={collateralDetail.assetType} disabled={isView} onChange={(e) => handleChangeCollateral('assetType', e.target?.value)}>
                <option value="โฉนด">โฉนด</option>
                <option value="ตราจอง">ตราจอง</option>
                <option value="น.ส.3">น.ส.3</option>
                <option value="น.ส.3 ก">น.ส.3 ก</option>
                <option value="น.ส.3 ข">น.ส.3 ข</option>
                <option value="ส.ป.ก.">ส.ป.ก.</option>
                <option value="หนังสือแสดงกรรมสิทธิ์ห้องชุด">หนังสือแสดงกรรมสิทธิ์ห้องชุด</option>
                <option value="ภ.ท.บ.5">ภ.ท.บ.5</option>
                <optgroup label="___________________________________________"></optgroup>
                <option value="บ้าน">บ้าน</option>
                <option value="สังหาริมทรัพย์">สังหาริมทรัพย์</option>
                <option value="หุ้น">หุ้น</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
              <label htmlFor="floatingSelectTeam">หลักทรัพย์</label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="form-floating needs-validation">
              <select className="form-select" disabled={isView} value={collateralDetail?.collateral_status} onChange={(e) => handleChangeCollateral('collateral_status', e.target?.value)}>
                <option value="โอนได้">โอนได้</option>
                <option value="โอนไม่ได้">โอนไม่ได้</option>
              </select>
              <label htmlFor="floatingSelectTeam">สถานะหลักทรัพย์</label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="form-floating needs-validation">
              <select className="form-select" value={collateralDetail?.conditions_cannot_transferred} onChange={(e) => handleChangeCollateral('conditions_cannot_transferred', e.target?.value)} disabled={collateralDetail?.collateral_status == 'โอนได้' ||  isView}>
                <option value="ติดอายัติ(เจ้าหนี้อื่น)">โอติดอายัติ(เจ้าหนี้อื่น)</option>
                <option value="เจ้าของหลักประกันเสียชีวิต">เจ้าของหลักประกันเสียชีวิต</option>
                <option value="ติดข้อกฎหมาย">ติดข้อกฎหมาย</option>
                <option value="ติดจำนองเจ้าหนี้ร่วมของบุคคลอื่น">ติดจำนองเจ้าหนี้ร่วมของบุคคลอื่น</option>
              </select>
              <label htmlFor="floatingSelectTeam">เงื่อนไขโอนไม่ได้</label>
            </div>
          </div>
        </div>
        {/* start card รายละเอียดหลักทรัพย์ */}
        <div className="mb-1">
          <div className="card shadow-none border my-4" data-component-card="data-component-card">
            <div className="card-body p-0">
              <div className="p-4 code-to-copy">

                    {/* start card รายละเอียดโฉนดที่ดิน */}
                    <h3 className="text-center">โฉนดที่ดิน</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">โฉนดที่ดิน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'เลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('parceL_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.parceL_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เล่ม'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('parceL_volume', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.parceL_volume}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'หน้า'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('parceL_page', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.parceL_page}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-floating form-floating-advance-select ">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.parceL_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('parceL_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'อำเภอ'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('parceL_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.parceL_district}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ระวาง'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('parceL_map_sheet', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.parceL_map_sheet}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เลขที่ดิน'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('parceL_parcel_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.parceL_parcel_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'หน้าสำรวจ'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('parceL_explore_page', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.parceL_explore_page}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ตำบล'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('parceL_sub_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.parceL_sub_district}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียดโฉนดที่ดิน */}      

                    {/* start card รายละเอียดตราจอง */}
                    <h3 className="text-center">ตราจอง</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ตราจอง</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'เล่มที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('pre_emption_volume_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.pre_emption_volume_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เล่ม'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('pre_emption_volume', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.pre_emption_volume}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'หน้า'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('pre_emption_page', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.pre_emption_page}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ระวาง'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('pre_emption_map_sheet', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.pre_emption_map_sheet}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เลขที่ดิน'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('pre_emption_parcel_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.pre_emption_parcel_no}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-floating form-floating-advance-select mb-3">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.pre_emption_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('pre_emption_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'อำเภอ'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('pre_emption_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.pre_emption_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ตำบล'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('pre_emption_sub_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.pre_emption_sub_district}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียดตราจอง */}



                    {/* start card รายละเอียดหนังสือรับรองการทำประโยชน์(น.ส.3) */}
                    <h3 className="text-center">หนังสือรับรองการทำประโยชน์(น.ส.3)</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-floating form-floating-advance-select mb-3">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.nS3_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'อำเภอ'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ตำบล'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3_sub_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3_sub_district}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ทะเบียน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'เล่ม'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3_emption_volume', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3_emption_volume}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'หน้า'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3_emption_page', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3_emption_page}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'สารบบเล่ม/เลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3_dealing_file_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3_dealing_file_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'สารบบหน้า'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3_dealing_page_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3_dealing_page_no}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียดหนังสือรับรองการทำประโยชน์(น.ส.3) */}
       


                    {/* start card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ก) */}
                    <h3 className="text-center">หนังสือรับรอการทำประโยชน์(น.ส.3 ก)</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-floating form-floating-advance-select mb-3">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.nS3A_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3A_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'อำเภอ'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3A_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3A_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ตำบล'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3A_sub_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3A_sub_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ระวางรูปถ่ายทางออกชื่อ'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3A_map_sheet', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3A_map_sheet}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ทะเบียน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'เลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3A_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3A_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เล่มที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3A_volume_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3A_volume_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'หน้า'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3A_page', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3A_page}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'เลขที่ดิน'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3A_parcel_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3A_parcel_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'หมายเลข'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3A_number', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3A_number}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'แผ่นที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3A_sheet_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3A_sheet_no}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ก) */}



                    {/* start card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ข) */}
                    <h3 className="text-center">หนังสือรับรอการทำประโยชน์(น.ส.3 ข)</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-floating form-floating-advance-select mb-3">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.nS3B_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('nS3B_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'อำเภอ'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3B_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3B_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ตำบล'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3B_sub_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3B_sub_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'หมู่ที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3B_village', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3B_village}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ทะเบียน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'เล่ม'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3B_volume', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3B_volume}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'หน้า'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3B_page', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3B_page}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'เลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('nS3B_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.nS3B_no}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียดหนังสือรับรอการทำประโยชน์(น.ส.3 ข) */}



                    {/* start card รายละเอียด ส.ป.ก. */}
                    <h3 className="text-center">ส.ป.ก.</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-floating form-floating-advance-select mb-3">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.alrO_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('alrO_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'อำเภอ'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('alrO_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.alrO_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ตำบล'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('alrO_sub_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.alrO_sub_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'หมู่ที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('alrO_village', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.alrO_village}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ทะเบียน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'แปลงเลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('alrO_plot_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.alrO_plot_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ระวาง ส.ป.ก. ที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('alrO_map_sheet', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.alrO_map_sheet}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'เลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('alrO_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.alrO_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เล่ม'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('alrO_volume', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.alrO_volume}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'หน้า'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('alrO_page', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.alrO_page}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียด ส.ป.ก. */}

  
 
                    {/* start card รายละเอียด หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2) */}
                    <h3 className="text-center">หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2)</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'โฉนดที่ดินเลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('condO_parcel_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.condO_parcel_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-floating form-floating-advance-select mb-3">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.condO_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('condO_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'อำเภอ'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('condO_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.condO_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ตำบล'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('condO_sub_district', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.condO_sub_district}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <AreaTextbox title={'เนื้อที่'} containerClassname={'mb-3'} disabled={isView}
                                      handleChangeRai={(val) => handleChangeCollateral('condO_rai', val)} 
                                      rai={collateralDetail?.condO_rai}
                                      handleChangeNgan={(val) => handleChangeCollateral('condO_ngan', val)} 
                                      ngan={collateralDetail?.condO_ngan}
                                      handleChangeWa={(val) => handleChangeCollateral('condO_sqaure_wa', val)} 
                                      wa={collateralDetail?.condO_sqaure_wa}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ที่ตั้งห้องชุด</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ห้องชุดเลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('condO_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.condO_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ชั้นที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('condO_floor', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.condO_floor}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'อาคารเลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('condO_building_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.condO_building_no}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ชื่ออาคารชุด'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('condO_building_name', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.condO_building_name}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ทะเบียนอาคารชุดเลขที่'}  disabled={isView}
                                      handleChange={(val) => handleChangeCollateral('condO_registration_no', val)} 
                                      containerClassname={'mb-3'} value={collateralDetail?.condO_registration_no}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12">                
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                      value={collateralDetail?.promisor} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                      value={collateralDetail?.contract_recipient} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เนื้อที่ประมาณ'} footer={'ตารางเมตร'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('area_square_meter', val)} 
                                      value={collateralDetail?.area_square_meter} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'สูง'} footer={'เมตร'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('high_meter', val)} 
                                      value={collateralDetail?.high_meter} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-floating form-floating-advance-select ">
                                      <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                        <option value="จำนอง">จำนอง</option>
                                        <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                        <option value="สืบทรัพย์">สืบทรัพย์</option>
                                        <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                        <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                        <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                        <option value="อื่นๆ">อื่นๆ</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                      value={collateralDetail?.source_of_wealth_other}
                                      disabled={collateralDetail?.source_of_wealth != 'อื่นๆ' || isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('remark', val)} 
                                      value={collateralDetail?.remark} disabled={isView}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียด หนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2) */}
  

                    {/* start card รายละเอียด ภ.ท.บ.5 */}
                    <h3 className="text-center">ภ.ท.บ.5</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ที่ดินตั้งอยู่</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ที่ดินตั้งอยู่เลขที่'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('labT5_parcel_no', val)} 
                                      value={collateralDetail?.labT5_parcel_no} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-floating form-floating-advance-select mb-3">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.labT5_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('labT5_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'อำเภอ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('labT5_district', val)} 
                                      value={collateralDetail?.labT5_district} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ตำบล'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('labT5_sub_district', val)} 
                                      value={collateralDetail?.labT5_sub_district} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'หมู่ที่'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('labT5_village', val)} 
                                      value={collateralDetail?.labT5_village} disabled={isView}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียด ภ.ท.บ.5 */}
                    {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                    <div className="mb-1">
                      <div className="card shadow-none border my-4" data-component-card="data-component-card">
                        <div className="card-body p-0">
                          <div className="p-4 code-to-copy">
                            <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                            <div className="row g-3">
                              <div className="col-sm-12 col-md-12 col-lg-12">
                                <AreaTextbox title={'เนื้อที่ทั้งหมด'} containerClassname={'mb-3'}
                                  handleChangeRai={(val) => handleChangeCollateral('total_area_rai', val)} 
                                  rai={collateralDetail?.total_area_rai}
                                  handleChangeNgan={(val) => handleChangeCollateral('total_area_ngan', val)} 
                                  ngan={collateralDetail?.total_area_ngan}
                                  handleChangeWa={(val) => handleChangeCollateral('total_area_sqaure_wa', val)} 
                                  wa={collateralDetail?.total_area_sqaure_wa} disabled={isView}
                                />
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-6">
                                <div className="form-floating form-floating-advance-select ">
                                  <label htmlFor="floaTingLabelSingleSelect">ที่มาของทรัพย์</label>
                                  <select className="form-select" disabled={isView} value={collateralDetail?.source_of_wealth} onChange={(e) => handleChangeCollateral('source_of_wealth', e.target?.value)}>
                                    <option value="จำนอง">จำนอง</option>
                                    <option value="จำนองเฉพาะส่วน ขึ้นเนื้อที่">จำนองเฉพาะส่วน ขึ้นเนื้อที่</option>
                                    <option value="สืบทรัพย์">สืบทรัพย์</option>
                                    <option value="โอนตามมาตรา">โอนตามมาตรา 76</option>
                                    <option value="ตีโอนชำระหนี้">ตีโอนชำระหนี้</option>
                                    <option value="NPA ที่มีหลักประกันจำนองคงเหลือ">NPA ที่มีหลักประกันจำนองคงเหลือ</option>
                                    <option value="อื่นๆ">อื่นๆ</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-6">
                                <Textbox title={'อื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                                  handleChange={(val) => handleChangeCollateral('source_of_wealth_other', val)} 
                                  value={collateralDetail?.source_of_wealth_other}
                                  disabled={collateralDetail?.source_of_wealth != 'อื่นๆ' || isView}
                                />
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-12">
                                <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                  handleChange={(val) => handleChangeCollateral('remark', val)} 
                                  value={collateralDetail?.remark} disabled={isView}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียดสารบัญจดทะเบียน */}
  

                    {/* start card รายละเอียด บ้าน */}
                    <h3 className="text-center">บ้าน</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">ตำแหน่งที่ดิน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'สิ่งปลูกสร้างเลขที่'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('house_no', val)} 
                                      value={collateralDetail?.house_no} disabled={isView}
                                    />
                                    <div className="input-group mb-3">
                                      <span className="input-group-text" id="Search_id_card">สิ่งปลูกสร้างเลขที่</span>
                                      <input className="form-control" type="text" disabled={isView} aria-label="รายละเอียดน บ้าน" />
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-floating form-floating-advance-select mb-3">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.house_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('house_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'อำเภอ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('house_district', val)} 
                                      value={collateralDetail?.house_district} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ตำบล'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('house_sub_district', val)} 
                                      value={collateralDetail?.house_sub_district} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ตั้งอยู่บนที่ดินเลขที่'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('house_parcel_no', val)} 
                                      value={collateralDetail?.house_parcel_no} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textbox title={'ลักษณะสิ่งปลูกสร้าง'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('house_type', val)} 
                                      value={collateralDetail?.house_type} disabled={isView}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียด บ้าน */}


                    {/* start card รายละเอียด สังหาริมทรัพย์ */}
                    <h3 className="text-center">สังหาริมทรัพย์</h3>
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">รายการจดทะเบียน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'วันที่จดทะเบียน'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('chattel_registration_date', val)} 
                                      value={collateralDetail?.chattel_registration_date} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ยี่ห้อ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('chattel_brand', val)} 
                                      value={collateralDetail?.chattel_brand} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ประเภท'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('chattel_type', val)} 
                                      value={collateralDetail?.chattel_type} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เลขทะเบียน'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('chattel_registration_no', val)} 
                                      value={collateralDetail?.chattel_registration_no} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ลักษณะ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('chattel_style', val)} 
                                      value={collateralDetail?.chattel_style} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เลขตัวรถ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('chattel_vehicle_no', val)} 
                                      value={collateralDetail?.chattel_vehicle_no} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เลขเครื่องยนต์'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('chattel_engine_no', val)} 
                                      value={collateralDetail?.chattel_engine_no} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'สี'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('chattel_color', val)} 
                                      value={collateralDetail?.chattel_color} disabled={isView}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textarea title={'ชื่อผู้ถือกรรมสิทธิ์'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('name_legal_owner', val)} 
                                      value={collateralDetail?.name_legal_owner} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textarea title={'ชื่อผู้ครอบครอง'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('name_occupier', val)} 
                                      value={collateralDetail?.name_occupier} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('remark', val)} 
                                      value={collateralDetail?.remark} disabled={isView}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียด สังหาริมทรัพย์ */}


                    {/* start card รายละเอียด หุ้น */}
                    <div className="card shadow-none border my-2" data-component-card="data-component-card">
                      <div className="card-body p-0">
                        <div className="p-3 code-to-copy">
                          <h3 className="text-center">หุ้น</h3><br />
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียด หุ้น */}
        
              

                    {/* start card รายละเอียด อื่นๆ */}
                    <h3 className="text-center">อื่นๆ</h3>
                    <div className="col-sm-12 col-md-12 col-lg-12 g-3">
                      <Textbox title={'หลักประกันอื่นๆโปรดระบุ'} containerClassname={'mb-3'} 
                        handleChange={(val) => handleChangeCollateral('assetType_other', val)} 
                        value={collateralDetail?.assetType_other} disabled={isView}
                      />
                    </div>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="mb-1">
                          <div className="card shadow-none border my-4" data-component-card="data-component-card">
                            <div className="card-body p-0">
                              <div className="p-4 code-to-copy">
                                <h4 className="text-center">เลขที่</h4><br />
                                <div className="row g-3">
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'เล่ม'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('otheR_volume', val)} 
                                      value={collateralDetail?.otheR_volume} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'หน้า'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('otheR_page', val)} 
                                      value={collateralDetail?.otheR_page} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-floating form-floating-advance-select mb-3">
                                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                                      <select className="form-select" disabled={isView} value={collateralDetail?.otheR_province ?? provinces[0]} onChange={(e) => handleChangeCollateral('otheR_province', e.target?.value)}>
                                        {provinces && (
                                          provinces.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'อำเภอ'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('otheR_district', val)} 
                                      value={collateralDetail?.otheR_district} disabled={isView}
                                    />
                                  </div>
                                  <div className="col-sm-12 col-md-12 col-lg-6">
                                    <Textbox title={'ตำบล'} containerClassname={'mb-3'} 
                                      handleChange={(val) => handleChangeCollateral('otheR_sub_district', val)} 
                                      value={collateralDetail?.otheR_sub_district} disabled={isView}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียด อื่นๆ */}
                    {/* start card รายละเอียดสารบัญจดทะเบียน */}                      
                    <div className="mb-1">
                      <div className="card shadow-none border my-4" data-component-card="data-component-card">
                        <div className="card-body p-0">
                          <div className="p-4 code-to-copy">
                            <h4 className="text-center">สารบัญจดทะเบียน</h4><br />
                            <div className="row g-3">
                              <div className="col-sm-12 col-md-12 col-lg-6">
                                <Textarea title={'ผู้ให้สัญญา'} containerClassname={'mb-3'} 
                                  handleChange={(val) => handleChangeCollateral('promisor', val)} 
                                  value={collateralDetail?.promisor} disabled={isView}
                                />
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-6">
                                <Textarea title={'ผู้รับสัญญา'} containerClassname={'mb-3'} 
                                  handleChange={(val) => handleChangeCollateral('contract_recipient', val)} 
                                  value={collateralDetail?.contract_recipient} disabled={isView}
                                />
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-12">
                                <AreaTextbox title={'เนื้อที่ตามสัญญา'} containerClassname={'mb-3'}
                                  handleChangeRai={(val) => handleChangeCollateral('contract_area_rai', val)} 
                                  rai={collateralDetail?.contract_area_rai}
                                  handleChangeNgan={(val) => handleChangeCollateral('contract_area_ngan', val)} 
                                  ngan={collateralDetail?.contract_area_ngan}
                                  handleChangeWa={(val) => handleChangeCollateral('contract_area_sqaure_wa', val)} 
                                  wa={collateralDetail?.contract_area_sqaure_wa} disabled={isView}
                                />
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-12">
                                <AreaTextbox title={'เนื้อทีดินที่โอน(จำนองเฉพาะส่วน)'} containerClassname={'mb-3'}
                                  handleChangeRai={(val) => handleChangeCollateral('area_transfer_rai', val)} 
                                  rai={collateralDetail?.area_transfer_rai}
                                  handleChangeNgan={(val) => handleChangeCollateral('area_transfer_ngan', val)} 
                                  ngan={collateralDetail?.area_transfer_ngan}
                                  handleChangeWa={(val) => handleChangeCollateral('area_transfer_sqaure_wa', val)} 
                                  wa={collateralDetail?.area_transfer_sqaure_wa} disabled={isView}
                                />
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-12">
                                <Textarea title={'หมายเหตุ'} containerClassname={'mb-3'} 
                                  handleChange={(val) => handleChangeCollateral('remark', val)} 
                                  value={collateralDetail?.remark} disabled={isView}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card รายละเอียดสารบัญจดทะเบียน */}

                <br />
                <div className={`d-flex justify-content-center ${isView ? 'd-none' : ''}`}>
                  <button className="btn btn-success me-2" type="button" onClick={() => saveCollateral()}>บันทึก</button>
                  {/* {isOpenCollateralAdd ? (
                    <button className="btn btn-secondary" type="button" onClick={() => setOpenCollateralEdit(false)}>ยกเลิก</button>
                  ) : ( */}
                    <button className="btn btn-danger" type="button" onClick={() => removeCollateral(collateralDetail)}>ลบหลักทรัพย์</button>
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end card รายละเอียดหลักทรัพย์ */}
      </>
  );
};
export default Asset;