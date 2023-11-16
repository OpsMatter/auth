import nodemailer from 'nodemailer';

interface Payload {
  email: string;
  verificationCode: string;
}

export const send = async ({ email, verificationCode }: Payload) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });

  const info = await transporter.sendMail({
    from: '"OpsMatter" <info@opsmatter.com>',
    to: email,
    subject: 'OpsMatter Verification',
    html: `<a href="http://localhost:8000/api/auth/complete?email=${email}&verificationCode=${verificationCode}">Complete login</a>`,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
