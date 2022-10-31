import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import { ChangePasswordInput } from "@/schema/user.schema";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import React from "react";
import { useForm } from "react-hook-form";

const PasswordForm: NextPage = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isDirty },
  } = useForm<ChangePasswordInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["users.change-password"],
    {
      onSuccess: () => {
        reset();
      },
    }
  );
  function onSubmit(values: ChangePasswordInput) {
    mutate({ ...values });
  }
  return (
    <div className="relative mx-5 p-5 h-full">
      {error && (
        <div
          className="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium">Error alert!</span>{" "}
          {error && error.message}
        </div>
      )}
      {isSuccess && (
        <div
          className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> Password Updated
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-full flex flex-col justify-between"
      >
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div className="col-span-1 space-y-3">
            <GenericInput
              label="Old Password"
              type="password"
              placeHolder="Old Password"
              required
              register={register("oldPassword")}
            />
            <GenericInput
              label="New Password"
              type="password"
              placeHolder="New Password"
              required
              register={register("newPassword")}
            />
            <GenericInput
              label="Confirm Password"
              type="password"
              placeHolder="Confirm Password"
              required
              register={register("confirmPassword")}
            />
          </div>
          <div className="col-span-1 space-y-3"></div>
        </div>
        <div className="w-full">
          <div className="text-right pb-3">
            <PrimaryButton
              className="w-1/4"
              type="submit"
              isLoading={isLoading}
              disabled={!isDirty}
            >
              Update
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
