import { useAppSelector } from "@app/hook";
import { RoleCheck } from "@components/RoleCheck";
import { signinState } from "@features/signin/signinSlice";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const ConfirmOtpForm = dynamic(() => import("@features/signin/ConfirmOtpForm"));
const SignInForm = dynamic(() => import("@features/signin/SignInForm"));

const SignInPage: NextPage = () => {
  const { confirm } = useAppSelector(signinState);

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <RoleCheck>
        <main className="min-h-screen w-full bg-green-100">
          <div className="flex min-h-full justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full min-w-fit h-fit space-y-5 max-w-xl bg-white flex flex-col justify-center pb-10 pt-5 rounded-xl drop-shadow-2xl">
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
              {confirm ? <ConfirmOtpForm /> : <SignInForm />}
            </div>
          </div>
        </main>
      </RoleCheck>
    </>
  );
};

export default SignInPage;
