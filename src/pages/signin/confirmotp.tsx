import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { RoleCheck } from "../../components/RoleCheck";

const ConfirmOtp = dynamic(() => import("../../components/signin/ConfirmOtp"), {
  ssr: false,
});

const ConfirmOtpPage: NextPage = () => {
  return (
    <RoleCheck>
      <ConfirmOtp />
    </RoleCheck>
  );
};

export default ConfirmOtpPage;
