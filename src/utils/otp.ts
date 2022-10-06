import OtpGenerator from "otp-generator";

export const generateOtp = () => {
  const now = new Date();
  const otp = OtpGenerator.generate(10, {
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  //   10 minutes
  // const expiration_time = new Date(now.getTime() + 10 * 60000);

  console.log({ otp });
  return { otp };
};
