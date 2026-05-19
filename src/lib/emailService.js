import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EJS_SERVICE
const TEMPLATE_ID = import.meta.env.VITE_EJS_TEMPLATE
const PUBLIC_KEY  = import.meta.env.VITE_EJS_KEY

/**
 * Sends a booking-confirmation email via EmailJS.
 * Fire-and-forget: never throws — logs on failure instead.
 *
 * Required EmailJS template variables:
 *   {{to_name}}            – recipient's display name
 *   {{to_email}}           – recipient's email address
 *   {{psychologist_name}}  – expert's full name
 *   {{appointment_date}}   – e.g. "E hënë, 2 Qershor 2026"
 *   {{appointment_time}}   – e.g. "10:00 – 10:50"
 *
 * @param {{
 *   toName: string,
 *   toEmail: string,
 *   psychologistName: string,
 *   appointmentDate: string,
 *   appointmentTime: string,
 * }} params
 */
export async function sendBookingConfirmation({
  toName,
  toEmail,
  psychologistName,
  appointmentDate,
  appointmentTime,
}) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return

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
    console.warn('[email] confirmation failed:', err?.text ?? err)
  }
}
