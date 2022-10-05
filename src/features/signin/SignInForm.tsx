import { useAppDispatch } from "@app/hook";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { confirmMode } from "@features/signin/signinSlice";
import { RequestOtpInput } from "@schema/auth.schema";
import { trpc } from "@utils/trpc";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { useForm } from "react-hook-form";

function SignInForm() {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState<boolean>(false);
  const { handleSubmit, register } = useForm<RequestOtpInput>();

  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["auth.request-otp"],
    {
      onSuccess: ({ hash, email }) => {
        if (email && hash) {
          dispatch(confirmMode({ confirm: true, email: email, hash: hash }));
        }
      },
    }
  );

  function onSubmit(values: RequestOtpInput) {
    mutate(values);
  }
  return (
    <>
      <h1 className="text-4xl font-bold text-center">Sign in your Account</h1>
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
          <label className="block text-sm font-medium text-grey-700">
            Email
          </label>
          <div className="relative mt-1 rounded-md shadow-sm ">
            <input
              type={"email"}
              className="block w-full h-12 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-grey-700">
            Password
          </label>
          <div className="relative flex items-center mt-1 rounded-md shadow-sm ">
            <input
              type={show ? "text" : "password"}
              className="block w-full h-12 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
            />
            <div
              onClick={() => setShow(!show)}
              className="absolute right-5  text-slate-500 cursor-pointer"
            >
              {show ? <EyeOff size={24} /> : <Eye size={24} />}
            </div>
          </div>
        </div>
        <div>
          <PrimaryButton
            className="w-full"
            type="submit"
            isLoading={isLoading}
            isSuccess={isSuccess}
          >
            Sign In
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}

export default SignInForm;
