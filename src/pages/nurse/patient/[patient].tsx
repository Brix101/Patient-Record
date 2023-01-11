import { useAppDispatch } from "@/app/hook";
import Main from "@/components/Layout/Main";
import SuspenseComponent from "@/components/SuspenseComponent";
import { setPatientData } from "@/features/patients/patientsSlice";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
const PatientData = dynamic(() => import("@/features/patients/PatientData"), {
  ssr: false,
});

const Patient: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { patient } = router.query;
  const { isLoading } = trpc.useQuery(
    [
      "patient.get-patient",
      {
        id: parseInt(patient as unknown as string),
      },
    ],
    {
      onSuccess(res) {
        if (res) {
          dispatch(setPatientData(res));
        }
      },
    }
  );

  return (
    <Main>
      <Head>
        <title>Nurse - Patient Page</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <SuspenseComponent isLoading={isLoading}>
        <div className="flex-1">
          <PatientData />
        </div>
      </SuspenseComponent>
    </Main>
  );
};

export default Patient;
