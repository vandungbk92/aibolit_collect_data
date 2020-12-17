import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchBenh, fetchTrieuChung, fetchTinhThanh } from "./actions";
import { selectBenh, selectTrieuChung, selectTinhThanh } from "./selectors";

export function useDanhMuc() {
  useInjectReducer({ key: "danhmuc", reducer });
  useInjectSaga({ key: "danhmuc", saga });

  const benh = useSelector(selectBenh);
  const trieuchung = useSelector(selectTrieuChung);
  const tinhthanh = useSelector(selectTinhThanh);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!benh || !benh.length) {
      dispatch(fetchBenh());
    }
  }, []);

  React.useEffect(() => {
    if (!trieuchung || !trieuchung.length) {
      dispatch(fetchTrieuChung());
    }
  }, []);

  React.useEffect(() => {
    if (!tinhthanh || !tinhthanh.length) {
      dispatch(fetchTinhThanh());
    }
  }, []);

  return { benh, trieuchung, tinhthanh };
}

export function withDanhMuc(WrappedComponent) {
  return function(props) {
    const { benh, trieuchung, tinhthanh } = useDanhMuc();
    
    return (
      <WrappedComponent
        {...props}
        benh={benh}
        trieuchung={trieuchung}
        tinhthanh={tinhthanh}
      />
    );
  };
}
