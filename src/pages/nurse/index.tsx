import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";

const NursePage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Nurse Page</title>
      </Head>
      <main>
        <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
          {hello.data ? <p>{hello.data.greeting} Nurse</p> : <p>Loading..</p>}
        </div>
      </main>
    </>
  );
};

export default NursePage;
