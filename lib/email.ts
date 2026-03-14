import nodemailer from 'nodemailer';

// These should be set in your .env file
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || ''; // Your email
const SMTP_PASS = process.env.SMTP_PASS || ''; // Your app password
const FROM_EMAIL = process.env.FROM_EMAIL || '"PCHR&R Team" <support@possiblecentre.com>';

// WhatsApp Links
const WHATSAPP_CHANNEL = process.env.WHATSAPP_CHANNEL || 'https://whatsapp.com/channel/example';
const WHATSAPP_COMMUNITY = process.env.WHATSAPP_COMMUNITY || 'https://chat.whatsapp.com/example';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendEventRegistrationEmail = async (
  to: string,
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string
) => {
  const mailOptions = {
    from: FROM_EMAIL,
    to,
    subject: `Registration Confirmed: ${eventTitle} - PCHR&R`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">PCHR&R</h1>
          <p style="margin: 5px 0 0;">Possible Centre for Human Rights & Responsibilities</p>
        </div>
        <div style="padding: 30px;">
          <h2>Hello ${userName},</h2>
          <p>Thank you for registering to volunteer for our upcoming event! We are excited to have you with us.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">Event Details:</h3>
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
          </div>

          <h3>Stay Connected:</h3>
          <p>To receive real-time updates about the event and our other initiatives, please join our official WhatsApp channels:</p>
          
          <div style="margin: 20px 0;">
            <a href="${WHATSAPP_CHANNEL}" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">Join WhatsApp Channel</a>
            <a href="${WHATSAPP_COMMUNITY}" style="display: inline-block; background-color: #128C7E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Join Community Broadcast</a>
          </div>

          <p>If you have any questions, feel free to reply to this email or contact us through our website.</p>
          
          <p>Best regards,<br><strong>Team PCHR&R</strong></p>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          &copy; ${new Date().getFullYear()} PCHR&R. All rights reserved.
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendVolunteerWelcomeEmail = async (to: string, userName: string, program: string) => {
  const mailOptions = {
    from: FROM_EMAIL,
    to,
    subject: `Welcome to the PCHR&R Volunteer Force!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">PCHR&R</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Welcome, ${userName}!</h2>
          <p>Thank you for applying to be a part of our ${program} program. Your commitment to human rights and responsibilities is highly appreciated.</p>
          
          <p>Our team will review your application and get in touch with you shortly to discuss the next steps.</p>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <strong>Important:</strong> Join our WhatsApp groups to stay updated with our latest news and volunteering opportunities.
          </div>

          <div style="margin: 20px 0;">
            <a href="${WHATSAPP_CHANNEL}" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-bottom: 10px; margin-right: 10px;">Official Channel</a>
            <a href="${WHATSAPP_COMMUNITY}" style="display: inline-block; background-color: #128C7E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Community Broadcast</a>
          </div>

          <p>Together, let's make a difference!</p>
          
          <p>Warm regards,<br><strong>Team PCHR&R</strong></p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
