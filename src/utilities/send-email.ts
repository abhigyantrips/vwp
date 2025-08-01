import nodemailer from 'nodemailer';

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export const sendEmail = async ({ to, subject, html, text }: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@nssmhe.edu',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

export const generateOnboardingEmail = (
  userName: string,
  onboardingToken: string,
  unitName: string
) => {
  const onboardingUrl = `${process.env.NEXT_PUBLIC_URL}/onboarding/${onboardingToken}`;

  return {
    subject: `Welcome to NSS MAHE - Complete Your Profile`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to NSS MAHE!</h2>

        <p>Hello ${userName},</p>

        <p>You have been invited to join the NSS MAHE Volunteer Web Portal for <strong>${unitName}</strong>.</p>

        <p>To complete your registration, please click the button below:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${onboardingUrl}"
             style="background-color: #2563eb; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Complete Your Profile
          </a>
        </div>

        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${onboardingUrl}</p>

        <p><strong>This link will expire in 5 days.</strong></p>

        <p>If you have any questions, please contact your unit administrator.</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          National Service Scheme<br>
          Manipal Academy of Higher Education
        </p>
      </div>
    `,
  };
};
