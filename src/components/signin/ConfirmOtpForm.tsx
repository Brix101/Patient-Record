import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { ConfirmOtpInput } from "../../schema/user.schema";
import { trpc } from "../../utils/trpc";
import PrimaryLoaderButton from "../buttons/PrimaryLoaderButton";

function ConfirmOtpForm({ email, hash }: { email?: string; hash?: string }) {
  const { handleSubmit, register } = useForm<ConfirmOtpInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["users.confirm-otp"],
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
        <div>
          <label className="block text-sm font-medium text-grey-700">OTP</label>
          <div className="relative mt-1 rounded-md shadow-sm ">
            <input
              type="text"
              className="block w-full h-10 rounded-md border  border-green-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
              placeholder="OTP"
              required
              {...register("otp")}
            />
          </div>
        </div>
        <div>
          <PrimaryLoaderButton
            className="w-full"
            type="submit"
            isLoading={isLoading}
            isSuccess={isSuccess}
          >
            Continue
          </PrimaryLoaderButton>
        </div>
      </form>
    </>
  );
}

export default ConfirmOtpForm;
