import { resend } from "../config/mail.config";

export const mail = async (
  from: string,
  to: string,
  subject: string,
  body: string,
) => {
  const reciver = Array.isArray(to) ? to : to.split(",");

  const res = await resend.emails.send({
    from: from,
    to: reciver,
    subject: subject,
    html: body,
  });

  return res;
};
