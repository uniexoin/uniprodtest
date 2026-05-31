import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Peer-to-Peer Student Marketplace",
  description: "Buy and sell used books, electronics, laptops, furniture, and university essentials safely with your campus peers on UniExo.",
  alternates: {
    canonical: "/marketplace",
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
