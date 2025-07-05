'use client';

import ProductCarousel from './ProductCarousel';
import ProductInputs from './ProductInputs';
import PriceBox from './PriceBox';
import ServiceToggle from './ServiceToggle';
import ProductActionButtons from './ProductActionButtons';
import { useState, useEffect } from 'react';
import { calculatePrice } from '@/services/productService';

export default function ProductInfoSection({ product }) {
  const [inputs, setInputs] = useState({
    days: 1,
    quantity: 1,
    length: 1,
    width: 1,
    withService: false,
  });

  const unit = product?.thresholds?.[0]?.unit || '';


  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const payload = {
          productId: product._id,
          days: inputs.days,
          includeServiceCharge: inputs.withService,
        };

        if (product.pricingType === 'quantity') {
          payload.quantity = inputs.quantity;
        } else if (product.pricingType === 'length_width') {
          payload.length = inputs.length;
        } else if (product.pricingType === 'area') {
          payload.length = inputs.length;
          payload.width = inputs.width;
        }

        const { data } = await calculatePrice(payload);
        setPriceData(data);
      } catch (err) {
        setPriceData(null);
      }
    };

    fetchPrice();
  }, [inputs]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ProductCarousel images={product.images} />

      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <ProductInputs
            pricingType={product.pricingType}
            formData={inputs}
            setFormData={setInputs}  
            unitinfo={unit}
            />
        <ServiceToggle formData={inputs} setFormData={setInputs} />

        <PriceBox product={product} formData={inputs} priceData={priceData} />
        <ProductActionButtons product={product} formData={inputs} />
      </div>
    </div>
  );
}
