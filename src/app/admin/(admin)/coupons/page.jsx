'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
} from '@/services/couponService';

// ✅ Zod Schema
const schema = z.object({
  code: z.string().min(1, 'Code is required'),
  discountType: z.enum(['flat', 'percent'], { required_error: 'Discount type is required' }),
  discountValue: z.coerce.number().positive('Discount value must be positive'),
  maxDiscount: z.coerce.number().nonnegative('Max discount must be 0 or more'),
  minOrderAmount: z.coerce.number().nonnegative('Min order amount must be 0 or more'),
  usageLimit: z.coerce.number().int().positive('Usage limit must be positive'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  isActive: z.boolean().default(true),
});

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      discountType: 'flat',
      discountValue: 0,
      maxDiscount: 0,
      minOrderAmount: 0,
      usageLimit: 1,
      expiryDate: '',
      isActive: true,
    },
  });

  // 🔁 Load All Coupons
  const loadCoupons = async () => {
    const res = await getAllCoupons();
    setCoupons(res.data.coupons || []);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // ✅ Form Submit Handler
  const onSubmit = async (data) => {
    const payload = { ...data, code: data.code.toUpperCase() };
    try {
      if (editId) {
        await updateCoupon(editId, payload);
        toast.success('Coupon updated');
      } else {
        await createCoupon(payload);
        toast.success('Coupon created');
      }

      await loadCoupons();
      reset({
  code: '',
  discountType: 'flat',
  discountValue: 0,
  maxDiscount: 0,
  minOrderAmount: 0,
  usageLimit: 1,
  expiryDate: '',
  isActive: true,
});
      setEditId(null);
    } catch (err) {
      toast.error('Something went wrong');
      console.error(err);
    }
  };

  // ✏️ Edit Handler
  const handleEdit = (c) => {
    reset({
      ...c,
      expiryDate: c.expiryDate?.slice(0, 10),
    });
    setEditId(c._id);
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    await deleteCoupon(id);
    toast.success('Deleted');
    loadCoupons();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded shadow"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Code</Label>
            <Input {...register('code')} />
            {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
          </div>
          <div>
            <Label>Discount Type</Label>
            <select {...register('discountType')} className="w-full border p-2 rounded">
              <option value="flat">Flat</option>
              <option value="percent">Percent</option>
            </select>
            {errors.discountType && <p className="text-red-500 text-sm">{errors.discountType.message}</p>}
          </div>
          <div>
            <Label>Discount Value</Label>
            <Input type="number" {...register('discountValue')} />
            {errors.discountValue && <p className="text-red-500 text-sm">{errors.discountValue.message}</p>}
          </div>
          <div>
            <Label>Max Discount</Label>
            <Input type="number" {...register('maxDiscount')} />
            {errors.maxDiscount && <p className="text-red-500 text-sm">{errors.maxDiscount.message}</p>}
          </div>
          <div>
            <Label>Min Order Amount</Label>
            <Input type="number" {...register('minOrderAmount')} />
            {errors.minOrderAmount && <p className="text-red-500 text-sm">{errors.minOrderAmount.message}</p>}
          </div>
          <div>
            <Label>Usage Limit</Label>
            <Input type="number" {...register('usageLimit')} />
            {errors.usageLimit && <p className="text-red-500 text-sm">{errors.usageLimit.message}</p>}
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Input type="date" {...register('expiryDate')} />
            {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
          </div>
          <div className="flex items-center space-x-2 mt-2">
           <Controller
  control={control}
  name="isActive"
  render={({ field }) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="isActive"
        checked={field.value}
        onCheckedChange={(val) => field.onChange(!!val)}
      />
      <Label htmlFor="isActive">Active</Label>
    </div>
  )}
/>
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit">{editId ? 'Update' : 'Create'} Coupon</Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset();
              setEditId(null);
            }}
          >
            Clear
          </Button>
        </div>
      </form>

      {/* Table */}
     <div className="bg-white dark:bg-zinc-900 rounded shadow p-6 space-y-4">
  <h2 className="text-lg font-bold mb-4">All Coupons</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {coupons.map((c) => (
      <div
        key={c._id}
        className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800 shadow-sm space-y-2"
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold text-zinc-800 dark:text-white text-sm">
            {c.code}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            {c.discountType === 'flat'
              ? `₹${c.discountValue}`
              : `${c.discountValue}%`}
          </span>
        </div>

        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          <p>Min Order: ₹{c.minOrderAmount}</p>
          <p>Usage Limit: {c.usageLimit}</p>
          <p>Expiry: {c.expiryDate?.slice(0, 10)}</p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-medium">
            {c.isActive ? '✅ Active' : '❌ Inactive'}
          </span>
          <div className="flex gap-2">
            <Pencil
              className="cursor-pointer text-blue-600 hover:text-blue-800"
              onClick={() => handleEdit(c)}
              size={18}
            />
            <Trash2
              className="cursor-pointer text-red-600 hover:text-red-800"
              onClick={() => handleDelete(c._id)}
              size={18}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
