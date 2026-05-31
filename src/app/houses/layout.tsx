import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Verified Room Stays & PGs",
  description: "Find, tour, and book verified hostels, rooms, PGs, and flats with zero brokerage and total campus safety on UniExo.",
  alternates: {
    canonical: "/houses",
  },
};

export default function HousesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
