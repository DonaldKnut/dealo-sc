import { BulkHiringRequest } from "@/lib/bulk-hiring-utils";

// Email templates for bulk hiring
export const bulkHiringEmailTemplates = {
  // Email to client after submission
  clientConfirmation: (request: BulkHiringRequest) => ({
    subject: "Your Bulk Hiring Request Has Been Received - Dealo",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; width: 150px; color: #6b7280; }
            .detail-value { flex: 1; color: #1f2937; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Request Received!</h1>
              <p>Thank you for choosing Dealo for your bulk hiring needs</p>
            </div>
            <div class="content">
              <h2>Hello ${request.contactName},</h2>
              <p>We've successfully received your bulk hiring request. Our team is reviewing your requirements and will get back to you within 24 hours.</p>
              
              <div class="details">
                <h3>Request Summary</h3>
                <div class="detail-row">
                  <span class="detail-label">Company:</span>
                  <span class="detail-value">${request.companyName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Team Size:</span>
                  <span class="detail-value">${request.teamSize}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Hiring Type:</span>
                  <span class="detail-value">${request.hiringType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Industry:</span>
                  <span class="detail-value">${request.industry}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Timeline:</span>
                  <span class="detail-value">${request.timeline}</span>
                </div>
                ${
                  request.budget
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Budget:</span>
                  <span class="detail-value">${request.budget}</span>
                </div>
                `
                    : ""
                }
              </div>

              <h3>What Happens Next?</h3>
              <ol>
                <li>Our talent acquisition team reviews your requirements</li>
                <li>We'll schedule a discovery call to understand your needs better</li>
                <li>You'll receive a customized proposal with candidate profiles</li>
                <li>Once approved, we begin the hiring process immediately</li>
              </ol>

              <p style="text-align: center;">
                <a href="https://dealo.africa/employment/bulk-hiring" class="button">View Your Request</a>
              </p>

              <p>If you have any immediate questions, please don't hesitate to reach out to us at <a href="mailto:hello@dealo.africa">hello@dealo.africa</a> or call us at +234 XXX XXX XXXX.</p>
              
              <p>Best regards,<br>The Dealo Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Dealo Africa. All rights reserved.</p>
              <p>Building Africa's largest talent marketplace</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${request.contactName},

Thank you for your bulk hiring request at Dealo!

REQUEST SUMMARY:
Company: ${request.companyName}
Team Size: ${request.teamSize}
Hiring Type: ${request.hiringType}
Industry: ${request.industry}
Timeline: ${request.timeline}
${request.budget ? `Budget: ${request.budget}` : ""}

WHAT HAPPENS NEXT:
1. Our talent acquisition team reviews your requirements
2. We'll schedule a discovery call to understand your needs better
3. You'll receive a customized proposal with candidate profiles
4. Once approved, we begin the hiring process immediately

Our team will contact you within 24 hours.

Best regards,
The Dealo Team
hello@dealo.africa
    `,
  }),

  // Email to admin about new request
  adminNotification: (request: BulkHiringRequest) => ({
    subject: `🚨 New Bulk Hiring Request: ${request.companyName} (${request.teamSize})`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .urgent { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .label { font-weight: bold; color: #6b7280; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .button-danger { background: #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 New Bulk Hiring Request</h1>
              <p>Action Required: Review and Respond</p>
            </div>
            <div class="content">
              ${
                request.timeline === "urgent"
                  ? `
              <div class="urgent">
                <strong>⚠️ URGENT REQUEST:</strong> Client needs team within 1-2 weeks!
              </div>
              `
                  : ""
              }

              <div class="details">
                <h2>Company Information</h2>
                <div class="detail-row">
                  <span class="label">Company Name:</span> ${
                    request.companyName
                  }
                </div>
                <div class="detail-row">
                  <span class="label">Contact Person:</span> ${
                    request.contactName
                  }
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span> <a href="mailto:${
                    request.email
                  }">${request.email}</a>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span> <a href="tel:${
                    request.phone
                  }">${request.phone}</a>
                </div>
                <div class="detail-row">
                  <span class="label">Industry:</span> ${request.industry}
                </div>
              </div>

              <div class="details">
                <h2>Hiring Requirements</h2>
                <div class="detail-row">
                  <span class="label">Team Size:</span> ${request.teamSize}
                </div>
                <div class="detail-row">
                  <span class="label">Hiring Type:</span> ${request.hiringType}
                </div>
                <div class="detail-row">
                  <span class="label">Timeline:</span> ${request.timeline}
                </div>
                ${
                  request.budget
                    ? `
                <div class="detail-row">
                  <span class="label">Budget:</span> ${request.budget}
                </div>
                `
                    : ""
                }
                <div class="detail-row">
                  <span class="label">Required Skills:</span> ${request.skills}
                </div>
              </div>

              <div class="details">
                <h2>Project Description</h2>
                <p>${request.description}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://dealo.africa/admin/bulk-hiring" class="button">Review in Admin Panel</a>
                <a href="mailto:${
                  request.email
                }" class="button">Email Client</a>
                <a href="tel:${request.phone}" class="button">Call Client</a>
              </div>

              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Review the request in the admin panel</li>
                <li>Contact the client within 24 hours</li>
                <li>Schedule a discovery call</li>
                <li>Prepare a customized proposal</li>
              </ol>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
🚨 NEW BULK HIRING REQUEST

COMPANY: ${request.companyName}
CONTACT: ${request.contactName}
EMAIL: ${request.email}
PHONE: ${request.phone}
INDUSTRY: ${request.industry}

REQUIREMENTS:
Team Size: ${request.teamSize}
Hiring Type: ${request.hiringType}
Timeline: ${request.timeline}
${request.budget ? `Budget: ${request.budget}` : ""}
Skills: ${request.skills}

PROJECT DESCRIPTION:
${request.description}

ACTION REQUIRED:
1. Review in admin panel: https://dealo.africa/admin/bulk-hiring
2. Contact client within 24 hours
3. Schedule discovery call
4. Prepare proposal
    `,
  }),

  // Status update email
  statusUpdate: (
    request: BulkHiringRequest,
    newStatus: string,
    notes?: string
  ) => ({
    subject: `Update on Your Bulk Hiring Request - ${newStatus.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { display: inline-block; padding: 10px 20px; border-radius: 20px; font-weight: bold; margin: 20px 0; }
            .status-approved { background: #d1fae5; color: #065f46; }
            .status-reviewing { background: #dbeafe; color: #1e40af; }
            .status-rejected { background: #fee2e2; color: #991b1b; }
            .notes { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Request Status Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${request.contactName},</h2>
              <p>We have an update regarding your bulk hiring request for ${
                request.companyName
              }.</p>
              
              <div style="text-align: center;">
                <div class="status-badge status-${newStatus}">
                  Status: ${newStatus.toUpperCase()}
                </div>
              </div>

              ${
                notes
                  ? `
              <div class="notes">
                <h3>Update Details:</h3>
                <p>${notes}</p>
              </div>
              `
                  : ""
              }

              ${
                newStatus === "approved"
                  ? `
                <h3>🎉 Great News!</h3>
                <p>Your request has been approved! Our team will be reaching out to you shortly to:</p>
                <ul>
                  <li>Schedule a detailed discovery call</li>
                  <li>Share candidate profiles</li>
                  <li>Discuss timelines and next steps</li>
                  <li>Finalize the agreement</li>
                </ul>
              `
                  : ""
              }

              ${
                newStatus === "reviewing"
                  ? `
                <h3>📝 Under Review</h3>
                <p>Our team is currently reviewing your request and matching candidates from our talent pool. We'll update you soon with:</p>
                <ul>
                  <li>Recommended team structure</li>
                  <li>Timeline estimation</li>
                  <li>Detailed proposal</li>
                </ul>
              `
                  : ""
              }

              ${
                newStatus === "rejected"
                  ? `
                <h3>Alternative Solutions</h3>
                <p>While we couldn't fulfill this specific request, we'd love to discuss alternative solutions that might work better for your needs. Please reach out to us.</p>
              `
                  : ""
              }

              <p style="text-align: center;">
                <a href="mailto:hello@dealo.africa" class="button">Contact Us</a>
              </p>

              <p>Best regards,<br>The Dealo Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${request.contactName},

UPDATE ON YOUR BULK HIRING REQUEST

Status: ${newStatus.toUpperCase()}

${notes ? `Details: ${notes}` : ""}

${
  newStatus === "approved"
    ? `
Great news! Your request has been approved. Our team will contact you shortly.
`
    : ""
}

${
  newStatus === "reviewing"
    ? `
Your request is currently under review. We'll update you soon with a detailed proposal.
`
    : ""
}

Contact us: hello@dealo.africa

Best regards,
The Dealo Team
    `,
  }),
};

// Send email function
export async function sendBulkHiringEmail(
  to: string | string[],
  template: { subject: string; html: string; text: string }
) {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending bulk hiring email:", error);
    return { success: false, error };
  }
}












