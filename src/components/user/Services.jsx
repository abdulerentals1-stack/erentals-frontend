import { Truck, Headset, ShoppingCart, RefreshCw } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Truck className="w-8 h-8 text-[#003459]" />,
      title: "Fast & Free Shipping",
      description: "Get your rentals delivered quickly with our free shipping service. No hidden charges."
    },
    {
      icon: <Headset className="w-8 h-8 text-[#003459]" />,
      title: "24/7 Support",
      description: "Our customer support team is available round the clock to assist you with any queries."
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-[#003459]" />,
      title: "Easy to Rent",
      description: "Simple rental process with flexible duration options to suit your needs."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#003459]" />,
      title: "Hassle-Free Pickup",
      description: "Easy return process with no complicated paperwork or unnecessary delays."
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary-50 rounded-full text-primary-600">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#003459] mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}