'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { addAddress, updateAddress } from '@/services/addressService';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  addressLine: z.string().min(1, "Address line is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits")
    .regex(/^\d{6}$/, "Invalid pincode"),
  phone: z.string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
});

export default function AddressFormDialog({ existing, onSaved }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing || {}
  });

  useEffect(() => {
    if (existing) {
      reset(existing);
    }
  }, [existing, reset]);

  const onSubmit = async (values) => {
    try {
      if (existing) {
        await updateAddress(existing._id, values);
        toast.success("Address updated");
      } else {
        await addAddress(values);
        toast.success("Address added");
      }

      setOpen(false);
      onSaved?.();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={existing ? "outline" : "default"}>
          {existing ? "Edit" : "Add New Address"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Address" : "New Address"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Full Name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Input placeholder="Address Line" {...register("addressLine")} />
          {errors.addressLine && <p className="text-red-500 text-sm">{errors.addressLine.message}</p>}

          <Input placeholder="City" {...register("city")} />
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}

          <Input placeholder="State" {...register("state")} />
          {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}

          <Input placeholder="Pincode" {...register("pincode")} />
          {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}

          <Input placeholder="Phone" {...register("phone")} />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{existing ? "Update" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
