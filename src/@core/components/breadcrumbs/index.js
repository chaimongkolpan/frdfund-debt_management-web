// ** React Imports
import { Fragment } from "react";
import { Link } from "react-router-dom";

// ** Third Party Components
import Proptypes from "prop-types";
import classnames from "classnames";
// import { Grid, CheckSquare, MessageSquare, Mail, Calendar } from 'react-feather'

// ** Reactstrap Imports
import {
  Breadcrumb,
  // DropdownMenu,
  // DropdownItem,
  BreadcrumbItem,
  // DropdownToggle,
  // UncontrolledButtonDropdown
} from "reactstrap";
import { ArrowLeft } from "react-feather";

const BreadCrumbs = (props) => {
  // ** Props
  const { data, title, previousPage } = props;

  const renderBreadCrumbs = () => {
    return data.map((item, index) => {
      const Wrapper = item.link ? Link : Fragment;
      const isLastItem = data.length - 1 === index;
      return (
        <Fragment key={index}>
          <BreadcrumbItem
            tag="li"
            active={isLastItem}
            className={classnames({
              "text-primary": !isLastItem,
              "text-muted": isLastItem,
            })}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: "400",
            }}
          >
            <Wrapper {...(item.link ? { to: item.link } : {})}>
              <span
                style={{
                  color: isLastItem ? "#F6F7F9" : "#98A2B3", // ตัวสุดท้ายเป็นสีขาว
                  fontSize: "13px",
                  verticalAlign: "middle",
                }}
              >
                {item.title}
              </span>
            </Wrapper>
          </BreadcrumbItem>
          {!isLastItem && index !== data.length - 2 && (
            <span
              style={{
                margin: "0 8px",
                color: isLastItem ? "#F6F7F9" : "#98A2B3", // '>' ตัวสุดท้ายเป็นสีขาว
                fontSize: "13px",
                verticalAlign: "middle",
              }}
            >
              &gt;
            </span>
          )}
        </Fragment>
      );
    });
  };
  

  return (
    <div className="content-header row">
      <div className="content-header-left col-md-12 col-12 mb-2">
        <div className="row breadcrumbs-top">
          <div className="col-12">
            {title ? (
              <h2
                className="float-start mb-0"
                style={{
                  borderRight: "none",
                  color: "white",
                  fontSize: "28px",
                  fontWeight: "600",
                }}
              >
                {title}
              </h2>
            ) : (
              ""
            )}
          </div>

          {data && (
            <div className="col-12">
              <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb>
                  <BreadcrumbItem tag="li" className="text-muted">
                    <Link to="/shops" className="breadcrumb-text-firstpage">
                      หน้าแรก
                    </Link>
                  </BreadcrumbItem>
                  {renderBreadCrumbs()}
                </Breadcrumb>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbs;



// ** PropTypes
BreadCrumbs.propTypes = {
  title: Proptypes.string.isRequired,
  data: Proptypes.arrayOf(
    Proptypes.shape({
      link: Proptypes.string,
      title: Proptypes.string.isRequired,
    })
  ),
};
