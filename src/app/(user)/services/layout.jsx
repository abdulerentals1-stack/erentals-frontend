export const metadata = {
  title: "Our Event Services & Custom Setups | e-Rentals",
  description: "Explore our premium event rental services and customized structural setups in Mumbai. From stage fabrication to complete event management.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://e-rentals.in'}/services`,
  }
};

export default function ServicesLayout({ children }) {
  return <>{children}</>;
}
