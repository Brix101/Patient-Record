import { LoginUserInput } from "@/schema/auth.schema";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { RoleCheck } from "@components/RoleCheck";
import { trpc } from "@utils/trpc";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { useForm } from "react-hook-form";

const SignInPage: NextPage = () => {
  const [show, setShow] = useState<boolean>(false);
  const { handleSubmit, register } = useForm<LoginUserInput>();

  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["auth.login-user"],
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

  function onSubmit(values: LoginUserInput) {
    mutate(values);
  }
  return (
    <>
      <Head>
        <title>Sign In</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <RoleCheck>
        <main className="h-screen w-full bg-green-50 flex justify-center ">
          <div className="container grid grid-cols-2">
            <div className="flex flex-col justify-center">
              <Link href="/">
                <div className="flex flex-row px-10 gap-5 self-center items-center text-center cursor-pointer select-none hover:bg-green-50 hover:text-green-900 max-w-fit p-2 rounded-full">
                  <Image
                    width={96}
                    height={96}
                    className="mr-5"
                    src="/logo.svg"
                    alt="logo"
                  />
                  <div className="flex flex-col  ">
                    <h1 className="text-2xl">Medidas Medical Center</h1>
                    <h3 className="text-lg">Valencia City, Bukidnon</h3>
                  </div>
                </div>
              </Link>
              <>
                <h1 className="text-4xl font-bold text-center">
                  Sign in your Account
                </h1>
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
                        className="block w-full h-12 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm focus:outline-green-500"
                        {...register("email")}
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
                        className="block w-full h-12 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm focus:outline-green-500"
                        {...register("password")}
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
                  <div className="flex justify-end">
                    <Link href="/register">
                      <a className="block py-2 pr-4 pl-3 text-gray-700 hover:text-green-700 hover:underline">
                        Register patient account?
                      </a>
                    </Link>
                  </div>
                </form>
              </>
            </div>
            <div className="flex justify-center items-center">
              <Image
                width={600}
                height={600}
                src={"/medical_care.svg"}
                alt="Medical care"
              />
            </div>
          </div>
        </main>
      </RoleCheck>
    </>
  );
};

export default SignInPage;
