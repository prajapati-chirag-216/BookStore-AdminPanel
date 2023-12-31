import React, { Fragment } from "react";
import classes from "./index.module.css";
import { motion } from "framer-motion";
function Modal(props) {
  return (
    <Fragment>
      {props.isOpen && (
        <div className={classes["overlay"]} onClick={props.onClose} />
      )}
      <motion.div
        className={classes["modal-container"]}
        variants={{
          hidden: {
            opacity: 0,
            visibility: "hidden",
            transform: "translate(-50%, -50%) scale(.6)",
            transition: {
              opacity: { duration: 0.1 },
              visibility: { delay: 0.1 },
            },
          },
          visible: {
            visibility: "visible",
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1)",
          },
        }}
        initial="hidden"
        animate={props.isOpen ? "visible" : "hidden"}
      >
        <div className={classes["container-heading"]}>
          <h1 className={classes["container-title"]}> {props.text}</h1>
          <span className={classes["container-icon"]} onClick={props.onClose}>
            &#10005;
          </span>{" "}
        </div>
        {props.children}
      </motion.div>
    </Fragment>
  );
}

export default Modal;
