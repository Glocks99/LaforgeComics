const welcomeTemplate = 
`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to LaForge Comics!</title>
  </head>
  <body style="font-family: Arial, sans-serif; background: #f4f4f8; margin: 0; padding: 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0" width="600" style="background: #ffffff; margin-top: 40px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <tr>
              <td style="background: #1a202c; padding: 20px; text-align: center;">
                <h1 style="color: #f7fafc; margin: 0;">🎉 Welcome to LaForge Comics!</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">
                  Hello <strong>{{firstName}}</strong>,
                </p>
                <p style="font-size: 16px; color: #333;">
                  Thank you for registering at <strong>LaForge Comics</strong> — your new home for thrilling comics, captivating manga, and webtoons from talented creators around the world!
                </p>
                <p style="font-size: 16px; color: #333;">
                  We’re excited to have you join our community. Start exploring amazing stories, follow your favorite artists, and stay updated with the latest releases.
                </p>
                <p style="font-size: 16px; color: #333;">
                  If you have any questions or need help, feel free to reach out to our support team.
                </p>
                <p style="font-size: 16px; color: #333;">
                  Happy reading!
                </p>
                <p style="font-size: 16px; color: #333;">
                  – The LaForge Comics Team
                </p>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://your-site.com" style="background: #3182ce; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
                    Visit LaForge Comics
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background: #e2e8f0; text-align: center; padding: 16px; font-size: 12px; color: #4a5568;">
                © {{currentYear}} LaForge Comics. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const verifyOtpTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>{{subject}} | LaForge Comics</title>
  </head>
  <body style="font-family: Arial, sans-serif; background: #f4f4f8; margin: 0; padding: 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0" width="600" style="background: #ffffff; margin-top: 40px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <tr>
              <td style="background: #1a202c; padding: 20px; text-align: center;">
                <h1 style="color: #f7fafc; margin: 0;">🔑 {{title}}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">
                  Hi <strong>{{firstName}}</strong>,
                </p>
                <p style="font-size: 16px; color: #333;">
                  Thanks for signing up at <strong>LaForge Comics</strong>! Use the verification code below to confirm your email address:
                </p>
                <div style="text-align: center; margin: 40px 0;">
                  <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #3182ce; letter-spacing: 8px; padding: 16px 32px; border: 2px dashed #3182ce; border-radius: 8px; background: #f0f8ff;">
                    {{otpCode}}
                  </span>
                </div>
                <p style="font-size: 14px; color: #666; text-align: center;">
                  This code will expire in 2 hours. Please do not share it with anyone.
                </p>
                <p style="font-size: 16px; color: #333;">
                  If you didn’t request this code, please ignore this email or contact our support team.
                </p>
                <p style="font-size: 16px; color: #333;">
                  – The LaForge Comics Team
                </p>
              </td>
            </tr>
            <tr>
              <td style="background: #e2e8f0; text-align: center; padding: 16px; font-size: 12px; color: #4a5568;">
                © {{currentYear}} LaForge Comics. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;


module.exports = {welcomeTemplate, verifyOtpTemplate}