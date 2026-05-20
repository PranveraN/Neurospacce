import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EJS_SERVICE
const TEMPLATE_ID = import.meta.env.VITE_EJS_TEMPLATE
const PUBLIC_KEY  = import.meta.env.VITE_EJS_KEY

const CONTACT_TEMPLATE = import.meta.env.VITE_EJS_CONTACT_TEMPLATE
const EXPERT_TEMPLATE   = import.meta.env.VITE_EJS_EXPERT_TEMPLATE

function ready() {
  return SERVICE_ID && PUBLIC_KEY
}

// ── Booking confirmation → dërgohet te useri ─────────────────────────────────
export async function sendBookingConfirmation({
  toName,
  toEmail,
  psychologistName,
  appointmentDate,
  appointmentTime,
}) {
  if (!ready() || !TEMPLATE_ID) return

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name:           toName,
        to_email:          toEmail,
        psychologist_name: psychologistName,
        appointment_date:  appointmentDate,
        appointment_time:  appointmentTime,
      },
      { publicKey: PUBLIC_KEY },
    )
  } catch (err) {
    console.warn('[email] booking confirmation failed:', err?.text ?? err)
  }
}

// ── Contact form → dërgohet te info@myneurosphera.com ────────────────────────
export async function sendContactForm({ fromName, fromEmail, subject, message }) {
  if (!ready()) {
    // Fallback: hap klientin e emailit
    const body = encodeURIComponent(`Emri: ${fromName}\nEmail: ${fromEmail}\n\n${message}`)
    window.location.href = `mailto:info@myneurosphera.com?subject=${encodeURIComponent(subject)}&body=${body}`
    return { success: true, fallback: true }
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      CONTACT_TEMPLATE || TEMPLATE_ID,
      {
        from_name:  fromName,
        from_email: fromEmail,
        subject,
        message,
        to_email:   'info@myneurosphera.com',
      },
      { publicKey: PUBLIC_KEY },
    )
    return { success: true }
  } catch (err) {
    console.warn('[email] contact form failed:', err?.text ?? err)
    return { success: false, error: err?.text ?? 'Gabim gjatë dërgimit' }
  }
}

// ── Expert contact → dërgohet te info@myneurosphera.com ──────────────────────
export async function sendExpertContact({ fromName, fromEmail, expertName, message }) {
  if (!ready()) return { success: false }

  try {
    await emailjs.send(
      SERVICE_ID,
      EXPERT_TEMPLATE || CONTACT_TEMPLATE || TEMPLATE_ID,
      {
        from_name:   fromName,
        from_email:  fromEmail,
        expert_name: expertName,
        message,
        to_email:    'info@myneurosphera.com',
      },
      { publicKey: PUBLIC_KEY },
    )
    return { success: true }
  } catch (err) {
    console.warn('[email] expert contact failed:', err?.text ?? err)
    return { success: false, error: err?.text ?? 'Gabim gjatë dërgimit' }
  }
}
