import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead, type ServiceContent } from "@/lib/service-page";

const content: ServiceContent = {
  slug: "booking-systems",
  title: "Online Booking System Development | Zalaltor",
  h1: "Booking Systems",
  serviceType: "Online Booking and Appointment System Development",
  intro:
    "Elegant online booking systems for salons, clinics, studios and service businesses — 24/7 self-serve appointments that fill your calendar automatically.",
  description:
    "Custom online booking and appointment systems by Zalaltor. Calendars, reminders, payments and staff management in one clean, mobile-friendly experience.",
  features: [
    { title: "Real-time availability", desc: "Live calendars per service and staff member — no double bookings, no back-and-forth." },
    { title: "Payments & deposits", desc: "Take deposits or full payments at booking to reduce no-shows and lock in revenue." },
    { title: "Automated reminders", desc: "Email and SMS reminders to cut no-shows and keep customers informed." },
    { title: "Staff & service management", desc: "Set schedules, services, durations and prices from a clean admin dashboard." },
    { title: "Mobile-first booking flow", desc: "Fast, thumb-friendly booking that converts on any phone in a few taps." },
    { title: "Integrations", desc: "Google Calendar, Stripe, Twilio, WhatsApp and CRMs — plugged in where you need them." },
  ],
  outcomes: [
    "More bookings without more admin time",
    "Fewer no-shows thanks to deposits and reminders",
    "Happier customers who can book at 2am",
    "One dashboard for your whole team",
  ],
  faq: [
    { q: "Does it work for multi-location businesses?", a: "Yes — services, staff and availability can be split by location with separate booking pages." },
    { q: "Can customers pay when they book?", a: "Yes, we integrate Stripe or your preferred processor for deposits or full payment at checkout." },
    { q: "Will it sync with Google Calendar?", a: "Yes. Two-way sync keeps staff calendars accurate across the booking system and Google Calendar." },
  ],
};

export const Route = createFileRoute("/services/booking-systems")({
  head: () => serviceHead(content),
  component: () => <ServicePage content={content} />,
});
