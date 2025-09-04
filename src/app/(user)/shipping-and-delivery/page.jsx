"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ShippingAndDeliveryPage() {
  return (
    <section className="bg-gray-50 pt-8 pb-16">
      {/* Page Heading */}
     
      {/* Content */}
      <div className="max-w-4xl mx-auto md:px-4">
        <Card className="shadow-md">
          <CardContent className="space-y-8 p-6 md:p-10 text-gray-700 leading-relaxed">
             <h1 className="text-3xl font-bold text-center mb-8 text-[#144169]">
                    Shipping And Delivery
            </h1>

            <p>
              Welcome to <strong>eRentals</strong>! This policy outlines the
              shipping and delivery procedures for our paid services. Please
              read this policy carefully to understand how we handle shipping
              and delivery of products and services rented through our platform.
            </p>

            {/* Section */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Service Types
              </h2>
              <p>
                We offer a range of services available for rent on our platform,
                including but not limited to [list of services]. Each service
                may have specific shipping and delivery options, which will be
                clearly indicated on the service listing.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Shipping and Delivery Partners
              </h2>
              <p>
                We collaborate with reputable shipping and delivery partners to
                ensure that your rented services are delivered safely and on
                time. Our partners are selected based on their track record of
                reliable and efficient service.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Shipping Locations
              </h2>
              <p>
                We currently offer shipping and delivery within [specific
                geographical regions or countries]. If your desired delivery
                location is not within our current service area, we apologize
                for any inconvenience and encourage you to check back later for
                updates on expanded delivery locations.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Shipping Costs
              </h2>
              <p>
                Shipping and delivery costs vary based on the specific service,
                delivery location, and delivery speed. These costs will be
                clearly displayed during the checkout process. Please review the
                cost breakdown before confirming your order.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Delivery Times
              </h2>
              <p>
                Delivery times depend on the selected service, the availability
                of the product, and the delivery location. Estimated delivery
                times will be provided during the checkout process. While we
                make every effort to meet these estimates, please note that
                delays can occasionally occur due to unforeseen circumstances.
                We recommend placing your order well in advance to account for
                any potential delays.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Tracking and Notifications
              </h2>
              <p>
                Once your order is confirmed and shipped, you will receive a
                confirmation email containing tracking information. This allows
                you to monitor the progress of your delivery. Additionally, you
                may receive notifications via email or SMS regarding the status
                of your delivery.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Delivery Process
              </h2>
              <p>
                Upon delivery, it is important to inspect the rented service for
                any damage or discrepancies. If you notice any issues, please
                contact our customer support team within [number of days, e.g.,
                24 hours] of receiving the service. We may require photographic
                evidence to assess the situation and provide a suitable
                solution.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Missed Deliveries
              </h2>
              <p>
                If you miss a delivery attempt, our delivery partner will leave
                a notice with instructions on how to reschedule or retrieve your
                service. It's essential to follow the provided instructions to
                ensure a successful delivery.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Returns and Pickups
              </h2>
              <p>
                For services that require return or pickup, please follow the
                specified return instructions provided with the service. It's
                important to return the service on the agreed-upon date to avoid
                any additional charges or penalties.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Customer Support
              </h2>
              <p>
                If you have any questions, concerns, or require assistance
                related to shipping, delivery, or any other aspect of our
                platform, our customer support team is available to assist you.
                You can reach out to us via [contact information].
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Changes to the Shipping and Delivery Policy
              </h2>
              <p>
                We reserve the right to update or modify this policy at any
                time. Any changes will be effective immediately upon posting on
                our platform. It is recommended to review this policy
                periodically to stay informed about any updates.
              </p>
            </div>

            <p className="border-t pt-6">
              Thank you for choosing <strong>eRentals</strong>! We strive to
              provide you with a seamless and enjoyable experience throughout
              your rental journey. If you have any further questions, feel free
              to contact our customer support team.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
