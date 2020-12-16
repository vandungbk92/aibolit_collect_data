import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Loader from "../Loader";
import "./Page.scss";

function Page(props) {
  const { className, children, loading = false, inner = false } = props;
  const loadingStyle = {
    height: "calc(100vh - 184px)",
    overflow: "hidden"
  };
  return (
    <div className={classnames(className, { contentInner: inner })} style={loading ? loadingStyle : null}>
      {loading ? <Loader spinning /> : ""}
      {children}
    </div>
  );
}

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
  inner: PropTypes.bool
};

export default Page;
