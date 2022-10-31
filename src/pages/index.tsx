import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/logo.svg" />
      </Head>

      <nav className="sticky z-50 w-full bg-green-50 backdrop-blur-sm border-b border-green-200 px-2 sm:px-4 py-2.5 rounded dark:bg-green-900">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <Link href="/">
            <div className="flex gap-5 cursor-pointer rounded-full select-none hover:bg-gray-50 hover:text-green-800 px-5 py-1">
              <Image
                width={70}
                height={70}
                className="mr-5"
                src="/logo.svg"
                alt="logo"
              />
              <div className="flex flex-col self-center text-center ">
                <h1 className="text-lg">Medidas Medical Center</h1>
                <h3 className="text-xs">Valencia City, Bukidnon</h3>
              </div>
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
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="flex flex-col p-4 mt-4 rounded-lg border border-green-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 items-center">
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
              <li className="bg-green-300 p-2 rounded-full hover:bg-green-200">
                <Link href="/signin">
                  <a className="block py-2 pr-4 pl-3 text-grey-700 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-green-400 md:dark:hover:text-white dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent">
                    Sign In
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="h-auto flex flex-col scroll-auto">
        <div className="relative w-full h-screen bg-gray-300 flex justify-center items-center">
          <Image
            width="100%"
            height="100%"
            className="mr-5"
            src="/medidas.jpg"
            alt="logo"
            objectFit="fill"
            layout="fill"
          />
          <div className="absolute w-full h-screen bg-black/[.25] z-10 flex justify-start items-center">
            <div className="flex flex-col items-start text-gray-900 select-none bg-green-500/.5 backdrop-blur-sm h-full w-full">
              <div className="mt-10">
                <Image
                  width="100%"
                  height="80%"
                  className="m-10"
                  src="/medical_research.svg"
                  alt="logo"
                  objectFit="scale-down"
                  layout="fill"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-auto bg-gray-300 flex justify-center items-center"></div>
      </main>
    </>
  );
};

export default Home;
