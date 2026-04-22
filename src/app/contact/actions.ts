"use server";

export type ContactFormState = {
  ok?: boolean;
  error?: string;
};

function field(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
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

  if (!name) {
    return { error: "Please enter your name." };
  }
  if (!email) {
    return { error: "Please enter your email address." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!phone) {
    return { error: "Please enter your phone number." };
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 8) {
    return { error: "Please enter a valid phone number." };
  }
  if (!message) {
    return { error: "Please enter a message." };
  }
  if (message.length < 10) {
    return { error: "Please add a bit more detail (at least 10 characters)." };
  }

  // Wire to email (Resend, etc.) or a CRM when ready — validated payload is ready here.
  console.info("[contact form]", {
    name,
    email,
    phone,
    company: company || undefined,
    messageLength: message.length,
  });

  return { ok: true };
}
