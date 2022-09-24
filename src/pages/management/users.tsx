import type { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import ManagementView from "../../components/management/ManagementView";
import { CreateUserInput } from "../../schema/user.schema";
import { trpc } from "../../utils/trpc";

const UsersPage: NextPage = () => {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const { mutate, error, isLoading } = trpc.useMutation(
    ["users.register-user"],
    {
      onSuccess: () => {
        console.log("register");
      },
    }
  );
  if (error) {
    console.log(error);
  }

  if (isLoading) {
    console.log("Loading ...............");
  }

  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }

  return (
    <>
      <Head>
        <title>Management - Users</title>
      </Head>
      <ManagementView>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Register an account
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div
                  className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                  role="alert"
                >
                  <span className="font-medium">{error.message}</span>
                </div>
              )}
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    className="relative block w-full my-2 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Name"
                    {...register("name")}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full my-2 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="john.doe@example.com"
                    {...register("email")}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    autoComplete="role"
                    required
                    className="relative block w-full my-2 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Role"
                    {...register("role")}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    autoComplete="image"
                    required
                    className="relative block w-full my-2 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Image"
                    {...register("image")}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 "
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
                    <>Register</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ManagementView>
    </>
  );
};

export default UsersPage;
