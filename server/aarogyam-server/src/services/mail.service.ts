import { SendSmtpEmail, TransactionalEmailsApi } from "@getbrevo/brevo";
import env from "../configs/env";

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(0, env.BREVO_API_KEY);

interface IRecipient {
  email: string;
  name?: string;
}

interface IParams {
  [key: string]: string | number;
}

interface ISendEmailPayload {
  recipients: IRecipient[];
  params: IParams;
  templateId: number;
}

/**
 * Sends an email using the Brevo transactional email service.
 *
 * @param args - The payload containing email details.
 * @param args.recipients - The list of recipients for the email.
 * @param args.params - The parameters to be used in the email template.
 * @param args.templateId - The ID of the email template to be used.
 * @returns A promise that resolves to true if the email is sent successfully, or false if an error occurs.
 */
export const sendEmail = async (
  args: ISendEmailPayload
): Promise<boolean | void> => {
  const { recipients, params, templateId } = args;
  const sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.templateId = templateId;
  sendSmtpEmail.to = recipients;
  sendSmtpEmail.params = params;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (err) {
    return false;
  }
};
