import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import PhysicianInput from "@/components/inputs/PhysicianInput";
import { UpdateUserInput } from "@/schema/user.schema";
import { trpc } from "@/utils/trpc";
import { setUsersMode, usersState } from "@features/users/usersSlice";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Physician, Role } from "@prisma/client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { XSquare } from "react-feather";
import { useForm } from "react-hook-form";

function EditUser() {
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState<Date>();
  const [gender, setGender] = React.useState("");
  const [role, setRole] = React.useState<Role>("NURSE");
  const { user } = useAppSelector(usersState);
  const { handleSubmit, register, reset } = useForm<UpdateUserInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["users.update-user"],
    {
      onSuccess: () => {
        // reset();
        console.log("success");
      },
    }
  );

  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        email: user.email as string,
        mobile: user.mobile as string,
        address: user.address as string,
        licenseNumber: user?.Physician?.licenseNumber,
        expertise: user?.Physician?.expertise,
      });
      const gen = user.gender as string;
      const bday = user.birthday as Date;
      setGender(gen);
      setStartDate(bday);
      setRole(user.role);
    }
  }, [user]);

  const userRoles = (Object.keys(Role) as (keyof typeof Role)[]).map(
    (enumKey) => {
      return (
        <MenuItem key={enumKey} value={Role[enumKey]}>
          {Role[enumKey]}
        </MenuItem>
      );
    }
  );

  const handleRoleChange = (e: SelectChangeEvent) => {
    const value = e.target.value;
    setRole(value as Role);
  };

  function onSubmit(values: UpdateUserInput) {
    const physician = role !== "PHYSICIAN" && {
      physicianId: 0,
      expertise: "",
      licenseNumber: "",
    };

    mutate({
      ...values,
      id: user?.id as number,
      image: user?.image as string,
      birthday: startDate as Date,
      role: role,
      gender: gender,
      ...physician,
    });
  }

  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className=" w-full h-full">
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          </div>
          <OutlinedButton
            onClick={() => dispatch(setUsersMode({ mode: "View" }))}
          >
            <XSquare size={24} />
          </OutlinedButton>
        </div>
        {error && (
          <div
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            <span className="font-medium">Error alert!</span>
            {error.message}
          </div>
        )}
        {isSuccess && (
          <div
            className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
            role="alert"
          >
            <span className="font-medium">Success alert!</span> User Updated
          </div>
        )}
        {user && (
          <form
            className="md:grid md:grid-cols-2 md:gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-span-1 space-y-3">
              <div className="grid grid-cols-2 gap-2 items-end">
                <GenericInput
                  label="First Name"
                  type="text"
                  placeHolder="First Name"
                  required
                  register={register("firstName")}
                />
                <GenericInput
                  label="Last Name"
                  type="text"
                  placeHolder="Last Name"
                  required
                  register={register("lastName")}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 items-end">
                <GenericInput
                  label="Email"
                  type="email"
                  placeHolder="name@example.com"
                  required
                  register={register("email")}
                />
                <GenericInput
                  label="Mobile Number"
                  type="text"
                  placeHolder="Mobile"
                  required
                  register={register("mobile")}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Gender
                  </label>
                  <FormControl sx={{ width: "100%", maxHeight: "40px" }}>
                    <Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      sx={{
                        maxHeight: "40px",
                        "&:before": {
                          borderColor: "red",
                        },
                      }}
                      required
                    >
                      <MenuItem value={"MALE"}>Male</MenuItem>
                      <MenuItem value={"FEMALE"}>Female</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Birthdate
                  </label>
                  <DatePicker
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                  />
                </div>
              </div>
              <GenericInput
                label="Address"
                type="text"
                placeHolder="Address"
                required
                register={register("address")}
              />
            </div>
            <div className="col-span-1 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  User Role
                </label>
                <FormControl sx={{ width: "100%", maxHeight: "40px" }}>
                  <Select
                    value={role}
                    onChange={handleRoleChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      maxHeight: "40px",
                      "&:before": {
                        borderColor: "red",
                      },
                    }}
                    required
                  >
                    {userRoles}
                  </Select>
                </FormControl>
              </div>

              <PhysicianInput
                enable={role === "PHYSICIAN"}
                placeHolder="License Number"
                label="License Number"
                register={register("licenseNumber")}
              />
              <PhysicianInput
                enable={role === "PHYSICIAN"}
                placeHolder="Expertise"
                label="Expertise"
                register={register("expertise")}
              />

              <div className="py-3 text-right">
                <PrimaryButton
                  className="w-1/2"
                  isLoading={isLoading}
                  type="submit"
                >
                  Update
                </PrimaryButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditUser;
