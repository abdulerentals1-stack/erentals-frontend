'use client';

import { useState, useEffect } from "react";
import AddressFormModal from "./AddressFormModal";
import { getUserAddresses, deleteAddress } from "@/services/addressService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AddressList() {
  const [addresses, setAddresses] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const reload = async () => {
    try {
      const { data } = await getUserAddresses();
      setAddresses(data.addresses || []);
    } catch {
      toast.error("Failed to load addresses.");
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      setDeletingId(id);
      await deleteAddress(id);
      toast.success("Address deleted");
      await reload();
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 px-4">
      <div className="flex justify-end mb-2">
        <AddressFormModal onSaved={reload} />
      </div>

      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses found.</p>
      ) : (
        addresses.map((addr) => (
          <div
            key={addr._id}
            className="p-4 border rounded flex justify-between items-start gap-4"
          >
            <div className="text-sm">
              <p className="font-medium text-base">{addr.name}</p>
              <p className="text-muted-foreground">
                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-muted-foreground">📞 {addr.phone}</p>
              <p className="text-muted-foreground">✉️ {addr.email}</p>
              {addr.gstin && (
                <p className="text-muted-foreground">🧾 GSTIN: {addr.gstin}</p>
              )}
            </div>
            <div className="space-x-2 space-y-2">
              <AddressFormModal existing={addr} onSaved={reload} />
              <Button
                variant="destructive"
                disabled={deletingId === addr._id}
                onClick={() => handleDelete(addr._id)}
              >
                {deletingId === addr._id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
