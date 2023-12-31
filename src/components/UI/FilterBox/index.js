import React from "react";
import classes from "./index.module.css";
function FilterBox() {
  return (
    <div className={classes["filter-box"]}>
      <div className={classes["filter-box--selector"]}>
        <input
          type="text"
          readOnly
          placeholder="Sort By"
          className={classes["input-filter"]}
        />
        <img src="down-arr.png" alt="" />
      </div>
      <div className={classes["filter-box--value"]}>
        <li>price High to Low</li>
        <li>price Low to High</li>
        <li>Letest</li>
        <li>Oldest</li>
      </div>
    </div>
  );
}

export default FilterBox;
