"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImageUploader from "./ImageUploader";
import {
  createProduct,
  updateProduct,
  getProductBySlug,
  getAllProducts,
} from "@/services/productService";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import { getAllCategories } from "@/services/category";
import { getAllTags } from "@/services/tag";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import RichTextEditor from "@/lib/RichTextEditor";
import AIPromptModal from "@/utils/AIPromptModal";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  productCode: z.string().min(1, "Required"),
  pricingType: z.enum(["quantity", "length_width", "area"]),
  basePrice: z.number().positive(),
  discountPrice: z.number().positive(),
  stock: z.number().int().positive(),
  averageRating: z.number().min(1).max(5).default(3),
  serviceChargePercent: z.number().nonnegative({ message: "Required" }),
  dayWiseVariationPercent: z.number().nonnegative({ message: "Required" }),
  description: z.string().min(1),
  termsAndConditions: z.string().min(1),
  deliveryAndPickup: z.string().min(1),
  faq: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  metaKeywords: z.string(),
  location: z.object({
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
  }),
  thresholds: z
    .array(
      z.object({
        value: z.number().positive(),
        unit: z.string().optional(),
        price: z.number().min(0, "Required"),
      })
    )
    .min(1),
  isHotDeal: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isTopRental: z.boolean().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  suggestedProducts: z
    .array(z.string())
    .min(1, "Select at least one suggested product"),
  isCanonical: z.boolean().optional(),
  isNewRental: z.boolean().optional(),
});

export default function AddProductForm() {
  const [images, setImages] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const [productId, setProductId] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pricingType: "quantity",
      location: { city: "", state: "", pincode: "" },
      thresholds: [{ value: 1, price: 0 }],
      categories: [],
      tags: [],
      suggestedProducts: [],
      averageRating: 3,
      isCanonical: false,
      isNewRental: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "thresholds",
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        basePrice: Number(values.basePrice),
        discountPrice: Number(values.discountPrice),
        stock: Number(values.stock),
        images,
        metaKeywords: values.metaKeywords.split(",").map((s) => s.trim()),
        averageRating: values.averageRating || 3,
        isCanonical: values.isCanonical || false,
        isNewRental: values.isNewRental || false,
      };

      if (slug) {
        await updateProduct(productId, payload);
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully");
      }

      router.push("/admin/products");
    } catch (err) {
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        err.response.data.errors.forEach((message) => {
          toast.error(message);
        });
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, tagRes, prodRes] = await Promise.all([
        getAllCategories(),
        getAllTags(),
        getAllProducts(),
      ]);
      setAllCategories(catRes.data.categories);
      setAllTags(tagRes.data.tags);
      setAllProducts(prodRes.data.products);

      if (slug) {
        try {
          const productRes = await getProductBySlug(slug);
          const product = productRes?.product;
          setProductId(product._id);
          setImages(product.images);

          setTimeout(() => {
            reset({
              ...product,
              metaKeywords: product.metaKeywords.join(", "),
              categories: product.categories.map((c) =>
                typeof c === "string" ? c : c._id
              ),
              suggestedProducts: product.suggestedProducts.map((p) =>
                typeof p === "string" ? p : p._id
              ),
              isHotDeal: !!product.isHotDeal,
              isFeatured: !!product.isFeatured,
              isTopRental: !!product.isTopRental,
              isCanonical: !!product.isCanonical,
              isNewRental: !!product.isNewRental,
              averageRating: product.averageRating || 3,
            });
          }, 0);
        } catch (err) {
          console.error("Failed to fetch product:", err);
        }
      }
    };
    fetchData();
  }, [slug, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-5xl mx-auto"
    >
      {/* Basic Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <div>
          <Label>Product Name</Label>
          <Input {...register("name")} />
        </div>
        <div>
          <Label>Product Code</Label>
          <Input {...register("productCode")} />
        </div>
        <div>
          <Label>Product Type</Label>
          <select
            {...register("pricingType")}
            className="w-full border rounded-md p-2"
          >
            <option value="quantity">Quantity Based (pcs)</option>
            <option value="length_width">Length Based (Linear ft/m)</option>
            <option value="area">Area Based (Length × Width)</option>
          </select>
        </div>
        <div>
          <Label>Base Price</Label>
          <Input type="number" {...register("basePrice", { valueAsNumber: true })} />
        </div>
        <div className="flex flex-col">
          <Label className="flex items-center gap-1.5 mb-1.5">
            Discount Price
          </Label>
          <Input type="number" {...register("discountPrice", { valueAsNumber: true })} />
        </div>
        <div>
          <Label>Stock</Label>
          <Input type="number" {...register("stock", { valueAsNumber: true })} />
        </div>
        <div>
          <Label>Service Charge (%)</Label>
          <Input type="number" {...register("serviceChargePercent", { valueAsNumber: true })} />
        </div>
        <div>
          <Label>Day-wise Variation (%)</Label>
          <Input type="number" {...register("dayWiseVariationPercent", { valueAsNumber: true })} />
        </div>
        <div>
          <Label>City</Label>
          <Input {...register("location.city")} />
        </div>
        <div>
          <Label>State</Label>
          <Input {...register("location.state")} />
        </div>
        <div>
          <Label>Pincode</Label>
          <Input {...register("location.pincode")} />
        </div>
        <div>
          <Label>Average Rating</Label>
          <Input type="number" step="0.1" min="1" max="5" {...register("averageRating", { valueAsNumber: true })} />
        </div>
      </div>

      {/* Thresholds */}
      <div>
        <Label>Thresholds</Label>
        <p className="text-xs text-zinc-500 mb-3">
          Range-based pricing: If you define thresholds (e.g. 25 at ₹18, 50 at ₹15, 100 at ₹10) and Discount Price (₹9), the price will be: ₹18 for 1-24 qty, ₹15 for 25-49 qty, ₹10 for 50-99 qty, and ₹9 (Discount Price) for 100+ qty.
        </p>
        {fields.length > 0 && (
          <div className="flex gap-4 mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <div className="flex-1">Value / Qty Threshold</div>
            <div className="flex-1">Threshold Price</div>
            <div className="w-20"></div>
          </div>
        )}
        {fields.map((field, index) => {
          const pricingType = watch("pricingType");
          const valueUnit = pricingType === "area" ? "sq.ft" : pricingType === "length_width" ? "ft" : "pcs";
          const priceUnit = pricingType === "area" ? "/ sq.ft" : pricingType === "length_width" ? "/ ft" : "/ pc";
          
          return (
            <div key={field.id} className="flex gap-4 mb-3 items-center w-full">
              <div className="flex-1">
                <div className="flex h-9 w-full rounded-md border border-input bg-background shadow-xs focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring">
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    className="flex-1 bg-transparent px-3 py-1 text-sm outline-none w-full text-foreground"
                    {...register(`thresholds.${index}.value`, { valueAsNumber: true })}
                  />
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-l border-input px-3 flex items-center text-sm font-medium rounded-r-md select-none">
                    {valueUnit}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex h-9 w-full rounded-md border border-input bg-background shadow-xs focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring">
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-r border-input px-3 flex items-center text-sm font-medium rounded-l-md select-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    className="flex-1 bg-transparent px-3 py-1 text-sm outline-none w-full text-foreground"
                    {...register(`thresholds.${index}.price`, { valueAsNumber: true })}
                  />
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-l border-input px-3 flex items-center text-xs font-medium rounded-r-md select-none">
                    {priceUnit}
                  </span>
                </div>
              </div>

              <Button type="button" variant="destructive" className="h-9 w-20 flex-shrink-0 px-0" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          );
        })}
        <Button type="button" onClick={() => append({ value: 1, price: 0 })}>
          + Add Threshold
        </Button>
      </div>

      {/* Rich Text Editors */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Description <AIPromptModal /></Label>
            <RichTextEditor {...field} onChange={(val) => field.onChange(val)} />
          </div>
        )}
      />

      <Controller
        name="termsAndConditions"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Terms and Conditions <AIPromptModal /></Label>
            <RichTextEditor {...field} onChange={(val) => field.onChange(val)} />
          </div>
        )}
      />

      <Controller
        name="deliveryAndPickup"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Delivery and Pickup <AIPromptModal /></Label>
            <RichTextEditor {...field} onChange={(val) => field.onChange(val)} />
          </div>
        )}
      />

      <Controller
        name="faq"
        control={control}
        render={({ field }) => (
          <div>
            <Label>FAQs <AIPromptModal /></Label>
            <RichTextEditor {...field} onChange={(val) => field.onChange(val)} />
          </div>
        )}
      />



      {/* Meta */}
      <div>
        <Label>Meta Title <AIPromptModal /></Label>
        <Input {...register("metaTitle")} />
      </div>
      <div>
        <Label>Meta Description <AIPromptModal /></Label>
        <Textarea rows={3} {...register("metaDescription")} />
      </div>
      <div>
        <Label>Meta Keywords (comma-separated) <AIPromptModal /></Label>
        <Input {...register("metaKeywords")} />
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-6">
        {["isHotDeal", "isFeatured", "isTopRental", "isNewRental", "isCanonical"].map((flag) => (
          <Controller
            key={flag}
            name={flag}
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox checked={field.value || false} onCheckedChange={field.onChange} id={flag} />
                <Label htmlFor={flag}>{flag.replace(/([A-Z])/g, ' $1').trim()}</Label>
              </div>
            )}
          />
        ))}
      </div>

      {/* MultiSelects */}
      <div>
        <Label>Categories</Label>
        <MultiSelect
          options={allCategories.map((c) => ({ label: c.name, value: c._id }))}
          value={watch("categories")}
          onChange={(val) => setValue("categories", val)}
        />
      </div>
      <div>
        <Label>Tags</Label>
        <MultiSelect
          options={allTags.map((t) => ({ label: t.name, value: t._id }))}
          value={watch("tags")}
          onChange={(val) => setValue("tags", val)}
        />
      </div>
      <div>
        <Label>Suggested Products</Label>
        <MultiSelect
          options={allProducts.map((p) => ({ label: p.name, value: p._id }))}
          value={watch("suggestedProducts")}
          onChange={(val) => setValue("suggestedProducts", val)}
        />
      </div>

      <ImageUploader images={images} setImages={setImages} />

      <pre className="text-red-500 text-xs">
        {JSON.stringify(
          errors,
          (key, value) => (key === "ref" ? undefined : value),
          2
        )}
      </pre>

      <Button type="submit" className="w-full md:w-auto">
        {slug ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
