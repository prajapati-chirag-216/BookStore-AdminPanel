import React, { useEffect, useState } from "react";
import classes from "./index.module.css";
function SearchBox(props) {
  const [searchStr, setSearchStr] = useState("");

  useEffect(() => {
    // this will stop calling unnecessary fetch calles of api
    if (props?.onSearch) {
      props.onSearch(searchStr);
    }
  }, [searchStr]);

  const changeInputHandler = (event) => {
    if (props?.onSearch) {
      const value = event.target.value.trim();
      setSearchStr(value);
    }
  };

  return (
    <div className={classes["search-box"]}>
      <img src="search.png" alt="" />
      <input
        type="search"
        className={classes["input-search"]}
        placeholder={props.placeHolder}
        onChange={changeInputHandler}
      />
    </div>
  );
}

export default SearchBox;
