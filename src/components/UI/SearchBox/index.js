import React from "react";
import classes from "./index.module.css";
function SearchBox(props) {
  return (
    <div className={classes["search-box"]}>
      <img src="search.png" alt="" />
      <input
        type="search"
        className={classes["input-search"]}
        placeholder={props.placeHolder}
      />
    </div>
  );
}

export default SearchBox;
