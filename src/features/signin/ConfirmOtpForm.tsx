import GenericInput from "@/components/inputs/GenericInput";
import { useAppSelector } from "@app/hook";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { signinState } from "@features/signin/signinSlice";
import { ConfirmOtpInput } from "@schema/auth.schema";
import { trpc } from "@utils/trpc";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

function ConfirmOtpForm() {
  const { email, hash } = useAppSelector(signinState);
  const { handleSubmit, register } = useForm<ConfirmOtpInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["auth.confirm-otp"],
    {
      onSuccess: ({ email, role }) => {
        signIn("credentials", {
          email,
          expires: Date,
          callbackUrl: `${window.location.origin}/${role.toLowerCase()}`,
        });
      },
    }
  );

  function onSubmit(values: ConfirmOtpInput) {
    if (email && hash) {
      mutate({ ...values, email, hash });
    }
  }
  return (
    <>
      <h1 className="text-4xl font-bold text-center">Confirm Otp</h1>
      <div className="bg-cyan-50 py-2 px-5 rounded-md text-center">
        <span className=" text-gray-700 text-md">
          We email <strong>{email}</strong>
        </span>
        <br />
        <span className=" text-gray-700 text-md ">a magic code.</span>
      </div>
      <form
        className="yt-8 space-y-6 w-96 m-10 self-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && (
          <div
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            <span className="font-medium">{error.message}</span>
          </div>
        )}
        <GenericInput
          label="OTP"
          type="text"
          placeHolder="OTP"
          required
          register={register("otp")}
        />
        <div>
          <PrimaryButton
            className="w-full"
            type="submit"
            isLoading={isLoading}
            isSuccess={isSuccess}
          >
            Continue
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}

export default ConfirmOtpForm;
