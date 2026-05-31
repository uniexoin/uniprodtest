import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Digital Laundry Booking & Pick-up",
  description: "Schedule professional wash, fold, and dry laundry pick-up and delivery services right to your college campus with UniExo.",
  alternates: {
    canonical: "/laundry",
  },
};

export default function LaundryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
