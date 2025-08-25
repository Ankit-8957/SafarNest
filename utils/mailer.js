const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async ({ name, email, message }) => {
    await transport.sendMail({
        from: `"Wanderlust Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "New Contact Form Submission",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ccc;">
                <h2 style="color: #333;">New Contact Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 10px; border-radius: 5px;">${message}</p>
                <hr>
                <p style="font-size: 0.9em; color: #888;">This message was sent via your Wanderlust website contact form.</p>
            </div>
        `,
        replyTo: email,
    });

     // Confirmation email to USER
    await transport.sendMail({
        from: "Wanderlust Team",
        to: email,
        subject: "✅ We've received your message!",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 10px;">
                <h2 style="color: #007BFF;">Thank you, ${name}!</h2>
                <p>We've received your message and will get back to you as soon as possible.</p>
                <p><strong>Your message:</strong></p>
                <blockquote style="background-color: #f1f1f1; padding: 10px; border-left: 5px solid #007BFF;">
                    ${message}
                </blockquote>
                <p>In the meantime, feel free to explore more on <a href="https://yourwanderlustsite.com">our website</a>.</p>
                <hr>
                <p style="font-size: 0.85em; color: #888;">This is an automated confirmation email. No need to reply.</p>
            </div>
        `,
    });
};
module.exports = sendMail;