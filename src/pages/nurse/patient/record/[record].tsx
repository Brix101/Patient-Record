import Main from "@/components/Layout/Main";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Patient: NextPage = () => {
  const router = useRouter();
  const { record } = router.query;
  const { data, isLoading } = trpc.useQuery(
    [
      "medicalRecord.get-record",
      {
        id: parseInt(record as unknown as string),
      },
    ],
    {
      onSuccess(res) {
        if (res) {
        }
      },
    }
  );

  if (data) {
    console.log(data);
  }
  return (
    <>
      <Head>
        <title>Nurse - Record Page</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <div className="flex-1">
          patient Record
          <button type="button" onClick={() => router.back()}>
            Go Back
          </button>
        </div>
      </Main>
    </>
  );
};

export default Patient;
