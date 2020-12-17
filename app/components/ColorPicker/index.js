import React from "react";
import RcColorPicker from "rc-color-picker";

import "rc-color-picker/assets/index.css";

export default function ColorPicker(props) {
  const { value, onChange, ...restProps } = props;

  const onValueChange = ({ color }) => {
    onChange(color);
  };

  return <RcColorPicker {...restProps} color={value} onChange={onValueChange} />;
}
