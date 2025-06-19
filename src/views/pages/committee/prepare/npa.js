import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import { 
  cleanData
} from "@services/api";

const user = getUserData();
const NPA = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="content">
        <h4 className="mb-3">จัดทำรายชื่อเสนอคณะกรรมการจัดการหนี้ NPA</h4>
        <div className="mt-4">
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'-'}
                  className={"my-4"}
                  children={(
                    <>
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
export default NPA;