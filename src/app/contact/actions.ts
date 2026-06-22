"use server";

import nodemailer from "nodemailer";

export type ContactFormState = {
  ok?: boolean;
  error?: string;
  values?: ContactPayload;
};

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

function field(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function errorState(error: string, values: ContactPayload): ContactFormState {
  return { error, values };
}

function requiredEnv(key: string): string {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing ${key}`);
  }

  return value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendContactEmail({
  name,
  email,
  phone,
  company,
  message,
}: ContactPayload) {
  const smtpHost = requiredEnv("SMTP_HOST");
  const smtpPort = Number(requiredEnv("SMTP_PORT"));
  const smtpUser = requiredEnv("SMTP_USER");
  const smtpPass = requiredEnv("SMTP_PASS");
  const to = requiredEnv("CONTACT_EMAIL_TO");
  const from = process.env.CONTACT_EMAIL_FROM?.trim() || smtpUser;

  if (!Number.isInteger(smtpPort) || smtpPort <= 0) {
    throw new Error("SMTP_PORT must be a valid port number");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subject = `New contact form message from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Company: ${company || "-"}`,
    "",
    message,
  ].join("\n");
  const html = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company || "-")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>
  `;

  await transporter.sendMail({
    from,
    to,
    replyTo: email,
    subject,
    text,
    html,
  });
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = field(formData, "name");
  const email = field(formData, "email");
  const phone = field(formData, "phone");
  const company = field(formData, "company");
  const message = field(formData, "message");
  const values = { name, email, phone, company, message };

  if (!name) {
    return errorState("Please enter your name.", values);
  }
  if (!email) {
    return errorState("Please enter your email address.", values);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorState("Please enter a valid email address.", values);
  }
  if (!phone) {
    return errorState("Please enter your phone number.", values);
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 8) {
    return errorState("Please enter a valid phone number.", values);
  }
  if (!message) {
    return errorState("Please enter a message.", values);
  }
  if (message.length < 10) {
    return errorState("Please add a bit more detail (at least 10 characters).", values);
  }

  try {
    await sendContactEmail({ name, email, phone, company, message });
  } catch (error) {
    console.error("[contact form] failed to send", error);

    return errorState(
      "Sorry, we could not send your message right now. Please email info@telcorepublic.com directly.",
      values,
    );
  }

  return { ok: true };
}
