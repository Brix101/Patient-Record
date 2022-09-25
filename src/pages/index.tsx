import { Role } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["users.me"]);

  if (data?.role) {
    console.log(Role[data?.role as keyof typeof Role]);
  }
  return (
    <>
      <Head>
        <title>Home</title>
        {/* <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className="h-screen">
        <nav className="bg-white border-b border-green-200 px-2 sm:px-4 py-2.5 rounded dark:bg-green-900">
          <div className="container flex flex-wrap justify-between items-center mx-auto">
            <Link href="/">
              <div className="flex flex-col text-center cursor-pointer select-none">
                <h1 className="text-2xl">Medidas Medical Center</h1>
                <h3 className="text-lg">Valencia City, Bukidnon</h3>
              </div>
            </Link>
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-green-500 rounded-lg md:hidden hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200 dark:text-green-400 dark:hover:bg-green-700 dark:focus:ring-green-600"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="flex flex-col p-4 mt-4 bg-green-50 rounded-lg border border-green-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-green-800 md:dark:bg-green-900 dark:border-green-700">
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-white bg-green-700 rounded md:bg-transparent md:text-green-700 md:p-0 dark:text-white"
                    aria-current="page"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-grey-700 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-green-400 md:dark:hover:text-white dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-grey-700 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-green-400 md:dark:hover:text-white dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-grey-700 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-green-400 md:dark:hover:text-white dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-grey-700 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-green-400 md:dark:hover:text-white dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <Link href="/signin">
                    <a className="bg-transparent hover:bg-green-700 text-grey-700 font-semibold hover:text-white py-2 px-4 border border-green-300 hover:border-transparent rounded-full">
                      Sign In
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </main>
    </>
  );
};

export default Home;
