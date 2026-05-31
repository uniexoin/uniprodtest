import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Elite Vehicles & Fleet Rentals",
  description: "List and rent premium verified campus vehicles, cars, and bikes instantly at the lowest student-friendly rates with UniExo.",
  alternates: {
    canonical: "/vehicles",
  },
};

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
