import { RoleCheck } from "@components/RoleCheck";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const SignInForm = dynamic(() => import("@features/signin/SignInForm"));

const SignInPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign In</title>
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
              <SignInForm />
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
