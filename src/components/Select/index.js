import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import classes from "./index.module.css";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    position: "relative",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontSize: "1.7rem",
    width: "100%",
    padding: `${1.5 - 0.09}rem 2rem`,
    borderRadius: "2px",
    backgroundColor: "var(--color-white)",
    border: "none",
    display: "block",
    borderBottom: "3px solid var(--accent-color)",
    boxSizing: "border-box",
    letterSpacing: ".5px",
  },
}));

const BasicSelect = forwardRef((props, ref) => {
  const [selectedOption, setSelectedOption] = useState(0); // Initial selected value

  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus();
  };
  useImperativeHandle(ref, () => {
    return {
      focus: activate,
      value: props.options[selectedOption].name,
      id: props.options[selectedOption].id,
    };
  });

  return (
    <div className={classes["form-group"]}>
      <Select
        required
        value={selectedOption}
        input={<BootstrapInput />}
        defaultValue="select"
        sx={{
          fontSize: "1.6rem",
          color: "var(--color-black)",
          textTransform: "capitalize",
        }}
        onChange={(event) => {
          setSelectedOption(event.target.value); // Update selected value on change
        }}
        id="select-input"
        name={props.name}
      >
        {props.options.map((option, index) => (
          <MenuItem
            ref={inputRef}
            key={option.id}
            value={index}
            sx={{
              fontSize: "1.5rem",
              paddingLeft: "2rem",
              textTransform: "capitalize",
              color:
                option.id == "status_1"
                  ? "green"
                  : option.id == "status_2"
                  ? "#cc0000"
                  : "currentcolor",
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
});
export default BasicSelect;
