import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

function Gender({ register }: { register: UseFormRegisterReturn<any> }) {
  const [gender, setGender] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setGender(event.target.value);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
        Gender
      </label>
      <FormControl sx={{ width: "100%", maxHeight: "40px" }}>
        <Select
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={{
            maxHeight: "40px",
            "&:before": {
              borderColor: "red",
            },
          }}
          {...register}
          placeholder="Gender"
          required
        >
          <MenuItem value={"MALE"}>Male</MenuItem>
          <MenuItem value={"FEMALE"}>Female</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default Gender;
