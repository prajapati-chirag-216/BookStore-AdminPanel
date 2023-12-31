import React from "react";
import classes from "./index.module.css";

function Grid(props) {
  return (
    <div className={classes["grid"]}>
      {props.items.map((item) => (
        <div className={classes["grid-item"]} key={item.id}>
          <img className={classes["item-img"]} src={item.img} alt="img" />
          <h1 className={classes["item-name"]}>{item.name}</h1>
        </div>
      ))}
    </div>
  );
}

export default Grid;
