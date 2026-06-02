import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.SMTP_HOST) {
    console.log(`[EMAIL_SERVICE_MOCK] Sending to: ${to}`);
    console.log(`[EMAIL_SERVICE_MOCK] Subject: ${subject}`);
    return { success: true, mock: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'UniExo <noreply@uniexo.in>',
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (err: any) {
    console.error('[EMAIL_SERVICE] Error:', err.message);
    return { success: false, error: err.message };
  }
}

export const emailService = {
  sendEmail: async (to: string, subject: string, content: string) => 
    sendEmail({ to, subject, html: content }),

  /**
   * Template for Booking Confirmation
   */
  async sendBookingConfirmation(to: string, details: { bookingId: string, amount: number, service: string }) {
    const html = `
      <h1>Booking Confirmed!</h1>
      <p>Your booking for ${details.service} has been confirmed.</p>
      <p>Booking ID: ${details.bookingId}</p>
      <p>Amount Paid: ₹${details.amount}</p>
      <p>Thank you for choosing UniExo.</p>
    `;
    return this.sendEmail(to, 'Booking Confirmation - UniExo', html);
  },

  /**
   * Template for Vendor Notification
   */
  async sendVendorNewOrder(to: string, details: { bookingId: string, customer: string }) {
    const html = `
      <h1>New Booking Request!</h1>
      <p>You have a new booking request from ${details.customer}.</p>
      <p>Booking ID: ${details.bookingId}</p>
      <p>Please log in to your dashboard to manage this request.</p>
    `;
    return this.sendEmail(to, 'New Booking Request - UniExo', html);
  },

  /**
   * Template for Rent Alerts (To Tenant)
   */
  async sendRentAlertToTenant(to: string, details: { roomName: string, status: 'overdue' | 'due_soon', days: number, amount: number }) {
    const isOverdue = details.status === 'overdue';
    const title = isOverdue ? 'Urgent: Rent Overdue' : 'Reminder: Rent Due Soon';
    const message = isOverdue 
      ? `This is a reminder that the rent for <strong>${details.roomName}</strong> is overdue by ${details.days} days.`
      : `This is a reminder that the rent for <strong>${details.roomName}</strong> is due in ${details.days} days.`;
      
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: ${isOverdue ? '#e11d48' : '#2563eb'};">${title}</h2>
        <p>${message}</p>
        <p><strong>Amount Due:</strong> ₹${details.amount}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">This is an automated alert from your landlord via UniExo.</p>
      </div>
    `;
    
    return this.sendEmail(to, `${title} - UniExo`, html);
  },

  /**
   * Template for Rent Alerts (To Vendor)
   */
  async sendRentAlertToVendor(to: string, details: { roomName: string, tenantName: string, status: 'overdue' | 'due_soon', days: number, amount: number }) {
    const isOverdue = details.status === 'overdue';
    const title = isOverdue ? 'Urgent: Tenant Rent Overdue' : 'Reminder: Tenant Rent Due Soon';
    const message = isOverdue 
      ? `Your tenant <strong>${details.tenantName}</strong> in <strong>${details.roomName}</strong> needs to pay the rent. It is currently overdue by ${details.days} days.`
      : `Your tenant <strong>${details.tenantName}</strong> in <strong>${details.roomName}</strong> needs to pay the rent in ${details.days} days.`;
      
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: ${isOverdue ? '#e11d48' : '#2563eb'};">${title}</h2>
        <p>${message}</p>
        <p><strong>Amount:</strong> ₹${details.amount}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">This is an automated alert from your Room Management Dashboard on UniExo.</p>
      </div>
    `;
    
    return this.sendEmail(to, `${title} - UniExo`, html);
  }
};
