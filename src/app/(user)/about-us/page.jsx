import { Card, CardContent } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <Card className="shadow-md border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-[#144169]">
                About Erentals Hnd Private Limited
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Erentals Hnd Private Limited is a cutting-edge online rental
                marketplace designed to seamlessly connect vendors with customers
                across the globe. Whether for weddings, exhibitions, corporate
                events, concerts, conferences, private parties, or personal
                needs—Erentals is your one-stop solution to access thousands of
                rental products with ease.
              </p>
            </div>

            {/* Revolutionizing Section */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                🌍 Revolutionizing the Global Rental Ecosystem
              </h2>
              <p>
                Our platform empowers rental vendors to list their products, set
                pricing, and receive inquiries—all in one place. Customers can
                compare multiple vendor quotations, ensuring transparency and
                competitive pricing. Unlike traditional rental businesses,
                Erentals does not handle logistics, deliveries, or product
                quality—vendors are fully responsible for their offerings,
                creating an open and decentralized rental ecosystem.
              </p>
            </div>

            {/* Why Choose Erentals */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                🚀 Why Choose Erentals?
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Endless Rental Possibilities –</strong> From event décor
                  and furniture to photography gear, electronics, and costumes.
                </li>
                <li>
                  <strong>Vendor-Centric Platform –</strong> List products, manage
                  leads, and generate invoices effortlessly.
                </li>
                <li>
                  <strong>Transparent Pricing –</strong> Compare multiple vendors
                  and choose the best option.
                </li>
                <li>
                  <strong>Global Reach –</strong> Find rental services across
                  different cities and regions worldwide.
                </li>
                <li>
                  <strong>One-Click Quotations & Invoices –</strong> Streamline the
                  rental process with instant document generation.
                </li>
              </ul>
            </div>

            {/* How Erentals Empowers Vendors */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                📈 How Erentals Empowers Vendors
              </h2>
              <p>
                Running a rental business has never been easier. Our
                technology-driven approach enables vendors to scale their
                business effortlessly:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>✅ Verified Customer Leads –</strong> Connect with
                  customers actively searching for rentals.
                </li>
                <li>
                  <strong>✅ Automated Quotation System –</strong> Create and share
                  quotes instantly.
                </li>
                <li>
                  <strong>✅ Smart Invoicing & Order Management –</strong> Generate
                  professional invoices and notify customers automatically.
                </li>
                <li>
                  <strong>✅ Comprehensive Vendor Profiles –</strong> Showcase
                  listings, reviews, and success stories.
                </li>
              </ul>
            </div>

            {/* Vision & Mission */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                ✨ Our Vision & Mission
              </h2>
              <p>
                At Erentals Hnd Private Limited, we believe in creating a world
                where renting is as simple as one click. Our mission is to
                empower rental vendors while providing customers with a
                transparent, effortless, and worry-free experience—be it setting
                up an event, furnishing office space, or renting specialized
                equipment.
              </p>
            </div>

            {/* Future of Renting */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                💡 The Future of Renting Starts Here
              </h2>
              <p>
                Renting should be easy, flexible, and accessible to everyone.
                With Erentals, you no longer need to waste time searching for
                the right provider. Our platform ensures both vendors and
                customers enjoy a seamless, efficient, and rewarding rental
                journey.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
