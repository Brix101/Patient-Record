import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { RoleCheck } from "../components/RoleCheck";
import { useRoleContext } from "../context/role.context";
import { Hash } from "../types/next-auth";

const OtpForm = dynamic(() => import("../components/signin/ConfirmOtpForm"));
const SignInForm = dynamic(() => import("../components/signin/SignInForm"));

const SignInPage: NextPage = () => {
  const role = useRoleContext();
  const [confirm, setConfirm] = useState(false);
  const [hash, setHash] = useState<Hash>({
    email: "",
    hash: "",
  });

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <RoleCheck check={role ? true : false}>
        <main className="h-screen w-full bg-green-100">
          <div className="flex min-h-full justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full min-w-fit h-fit space-y-5 max-w-xl bg-white flex flex-col justify-center pb-10 pt-5 rounded-xl drop-shadow-2xl">
              <Link href="/">
                <div className="flex flex-row mx-2 self-center items-center text-center cursor-pointer select-none hover:bg-green-50 hover:text-green-900 max-w-fit p-2 rounded-md">
                  <img className="w-24 mr-5" src="/logo.svg" alt="logo" />
                  <div className="flex flex-col  ">
                    <h1 className="text-2xl">Medidas Medical Center</h1>
                    <h3 className="text-lg">Valencia City, Bukidnon</h3>
                  </div>
                </div>
              </Link>
              {confirm ? (
                <OtpForm email={hash.email} hash={hash.hash} />
              ) : (
                <SignInForm setConfirm={setConfirm} setHash={setHash} />
              )}
            </div>
          </div>
        </main>
      </RoleCheck>
    </>
  );
};

export default SignInPage;