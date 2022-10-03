import Admin from "@/components/Layout/Admin";
import { trpc } from "@utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";

const PhysicianPage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management - Physician</title>
      </Head>
      <Admin>Physician</Admin>
    </>
  );
};

export default PhysicianPage;
