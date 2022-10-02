import { trpc } from "@utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Doctor Page</title>
      </Head>
      <main>
        <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
          {hello.data ? <p>{hello.data.greeting} Doctor</p> : <p>Loading..</p>}
        </div>
      </main>
    </>
  );
};

export default Home;
