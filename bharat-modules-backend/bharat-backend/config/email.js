const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'no-reply@bharatmodules.com';
const teamEmail = process.env.TEAM_EMAIL || 'team@bharatmodules.com';

async function sendOtpEmail(toEmail, otp) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Your Login Code',
      html: `<p>Your verification code is: <strong>${otp}</strong></p>`
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}

async function sendManufacturerApproved(toEmail, companyName) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Account Approved',
      html: `<p>Hello ${companyName}, your manufacturer account has been approved.</p>`
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
}

async function sendManufacturerRejected(toEmail, companyName, reason) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Account Update',
      html: `<p>Hello ${companyName}, your account application was rejected. Reason: ${reason}</p>`
    });
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }
}

async function sendProductApproved(toEmail, productName) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Product Approved',
      html: `<p>Your product "${productName}" has been approved and is now live.</p>`
    });
  } catch (error) {
    console.error('Error sending product approval:', error);
  }
}

async function sendRfqConfirmation(buyer, rfq, items) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: buyer.email,
      subject: `RFQ Received - ${rfq.rfq_number}`,
      html: `<p>We have received your RFQ ${rfq.rfq_number} for ${items.length} items.</p>`
    });
  } catch (error) {
    console.error('Error sending RFQ confirmation:', error);
  }
}

async function notifyTeamRfq(buyer, rfq, items) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: teamEmail,
      subject: `New RFQ: ${rfq.rfq_number}`,
      html: `<p>New RFQ from ${buyer.name} (${buyer.email}) for ${items.length} items.</p>`
    });
  } catch (error) {
    console.error('Error notifying team of RFQ:', error);
  }
}

async function notifyTeamContact(submission) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: teamEmail,
      subject: `New Contact Submission from ${submission.name}`,
      html: `<p>Name: ${submission.name}<br>Email: ${submission.email}<br>Message: ${submission.message}</p>`
    });
  } catch (error) {
    console.error('Error notifying team of contact:', error);
  }
}

module.exports = {
  sendOtpEmail,
  sendManufacturerApproved,
  sendManufacturerRejected,
  sendProductApproved,
  sendRfqConfirmation,
  notifyTeamRfq,
  notifyTeamContact
};
