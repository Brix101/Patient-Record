import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { RoleCheck } from "../../components/RoleCheck";
import { useRoleContext } from "../../context/role.context";
import { confirmOtpInput } from "../../schema/user.schema";
import { trpc } from "../../utils/trpc";

const ConfirmOtpPage: NextPage = () => {
  const role = useRoleContext();
  const router = useRouter();
  const { handleSubmit, register } = useForm<confirmOtpInput>();
  const { mutate, error, isLoading } = trpc.useMutation(["users.confirm-otp"], {
    onSuccess: ({ email, role }) => {
      signIn("credentials", {
        email,
        expires: Date,
        callbackUrl: `${window.location.origin}/${role}`,
      });
    },
  });

  const query = router.query;

  function onSubmit(values: confirmOtpInput) {
    if (query.email && query.hash) {
      const email = query.email as string;
      const hash = query.hash as string;

      mutate({ ...values, email, hash });
    }
  }

  return (
    <>
      <Head>
        <title>Confirm OTP</title>
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
              <h1 className="text-4xl font-bold text-center">Confirm Otp</h1>
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

                <div className="bg-cyan-50 py-2 px-5 rounded-md text-center">
                  <span className=" text-gray-700 text-md">
                    We email <strong>{query.email}</strong>
                  </span>
                  <br />
                  <span className=" text-gray-700 text-md ">a magic code.</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-grey-700">
                    OTP
                  </label>
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
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-lg font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {isLoading ? (
                      <svg
                        aria-hidden="true"
                        className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    ) : (
                      <>Continue</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </RoleCheck>
    </>
  );
};

export default ConfirmOtpPage;