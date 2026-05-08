import HomePage from "@/components/layouts/Home";

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

export const metadata = {
  alternates: {
    canonical: siteDomain + "/",
  },
};

export default function Home() {
  return (
   <>
     <HomePage />
   </>
  );
}

