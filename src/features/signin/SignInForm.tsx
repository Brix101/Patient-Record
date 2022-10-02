import GenericInput from "@/components/inputs/GenericInput";
import { useAppDispatch } from "@app/hook";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { confirmMode } from "@features/signin/signinSlice";
import { RequestOtpInput } from "@schema/user.schema";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";

function SignInForm() {
  const dispatch = useAppDispatch();
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
        <GenericInput
          label="Email"
          type="email"
          placeHolder="name@example.com"
          required
          register={register("email")}
        />
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
        <div className="bg-green-50 py-2 px-5 rounded-md text-center">
          <span className=" text-gray-700 text-md">
            We’ll email you a magic code for a
          </span>
          <br />
          <span className=" text-gray-700 text-md ">
            password-free sign in.
          </span>
        </div>
      </form>
    </>
  );
}

export default SignInForm;
