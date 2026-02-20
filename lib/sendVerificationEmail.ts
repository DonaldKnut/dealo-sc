import { sendVerificationEmail as sendVerificationEmailFromEmail } from "./email";

export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  lastName: string,
  verificationCode: string
) => {
  // The email.ts function expects (email, firstName, lastName, verificationCode)
  return await sendVerificationEmailFromEmail(
    email,
    firstName,
    lastName,
    verificationCode
  );
};
