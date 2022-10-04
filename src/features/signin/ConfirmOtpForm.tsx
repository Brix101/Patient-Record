import LinearLoading from "@/components/LinearLoading";
import { useAppSelector } from "@app/hook";
import { signinState } from "@features/signin/signinSlice";
import { ConfirmOtpInput } from "@schema/auth.schema";
import { trpc } from "@utils/trpc";
import { signIn } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

let currentOtpIndex = 0;
function ConfirmOtpForm() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);

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

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;
    const newOtp: string[] = [...otp];
    newOtp[currentOtpIndex] = value.substring(value.length - 1);

    if (!value) {
      setActiveOtpIndex(currentOtpIndex - 1);
    } else {
      setActiveOtpIndex(currentOtpIndex + 1);
    }

    setOtp(newOtp);
  };

  const handleOnKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOtpIndex = index;
    if (key === "Backspace") {
      setActiveOtpIndex(currentOtpIndex - 1);
    }
  };

  const handleOnPaste = ({
    clipboardData,
  }: React.ClipboardEvent<HTMLInputElement>) => {
    const value = clipboardData.getData("Text");
    const newOtp: string[] = [...otp];
    for (let i = 0; i < value.length; i++) {
      if (currentOtpIndex <= 5) {
        currentOtpIndex = i;
        setActiveOtpIndex(i);
      }
      newOtp[currentOtpIndex] = value.charAt(i);
    }
    setOtp(newOtp);
  };

  const resetValues = () => {
    setOtp(new Array(6).fill(""));
    setActiveOtpIndex(0);
    currentOtpIndex = 0;
  };
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    const finalValue = otp.join("");
    if (finalValue.length === 6) {
      if (email && hash) {
        mutate({ otp: finalValue, email, hash });
      }
    }
    if (error && finalValue.length === 6) {
      resetValues();
    }
  }, [otp, email, hash, mutate, error]);

  return (
    <>
      <h1 className="text-4xl font-bold text-center">Confirm Otp</h1>

      <form
        className="flex flex-col yt-8 w-96 m-10 self-center gap-10 py-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <div className="bg-cyan-50 py-2 px-5 rounded-md text-center">
            <span className=" text-gray-700 text-md">
              We email <strong>{email}</strong>
            </span>
            <br />
            <span className=" text-gray-700 text-md ">a magic code.</span>
          </div>
          <LinearLoading isLoading={isLoading} />
          <div className="flex justify-center items-center ">
            {otp.map((_, index) => {
              return (
                <React.Fragment key={index}>
                  <input
                    ref={index === activeOtpIndex ? inputRef : null}
                    type="number"
                    className="w-16 h-16 border-2 rounded bg-transparent outline-none text-center font-semibold text-5xl spin-button-none border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                    onChange={handleOnChange}
                    onKeyDown={(e) => handleOnKeyDown(e, index)}
                    value={otp[index]}
                    onPaste={handleOnPaste}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {error && (
            <div
              className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
              role="alert"
            >
              <span className="font-medium">{error.message}</span>
            </div>
          )}
          <div className="bg-sky-50 py-2 rounded-md text-center">
            <span className=" text-gray-700 text-md ">
              Cant find your code? Check your spam folder!
            </span>
          </div>
        </div>
      </form>
    </>
  );
}

export default ConfirmOtpForm;
