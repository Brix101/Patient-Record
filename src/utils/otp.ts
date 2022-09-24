import OtpGenerator from "otp-generator";

export const generateOtp = () => {
  const now = new Date();
  const otp = OtpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  //   10 minutes
  const expiration_time = new Date(now.getTime() + 10 * 60000);

  console.log({ otp, expiration_time });
  return { otp, expiration_time };
};
