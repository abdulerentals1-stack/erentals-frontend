'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, CheckCircle2 } from 'lucide-react';

import { deleteAddress } from '@/services/addressService';
import AddressFormDialog from './AddressFormModal';
import { Button } from '@/components/ui/button';

export default function AddressSelector({ addresses = [], selected, onSelect, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      setDeletingId(id);
      await deleteAddress(id);
      toast.success("Address deleted");
      onRefresh?.(); // reload after delete
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="border rounded p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select Address</h2>
        <AddressFormDialog onSaved={onRefresh} />
      </div>

      {addresses.length === 0 && <p className="text-gray-500">No address found. Please add one.</p>}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className={`border p-3 rounded flex justify-between items-start cursor-pointer ${selected === addr._id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
            onClick={() => onSelect(addr._id)}
          >
            <div className="flex-1 text-sm">
              <p className="font-medium">{addr.name}</p>
              <p className="text-muted-foreground">{addr.addressLine || addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-muted-foreground">📞 {addr.phone}</p>
              <p className="text-muted-foreground">✉️ {addr.email}</p>
              {addr.gstin && (
                <p className="text-muted-foreground">🧾 GSTIN: {addr.gstin}</p>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              <AddressFormDialog existing={addr} onSaved={onRefresh} />
              <Button
                variant="ghost"
                size="icon"
                disabled={deletingId === addr._id}
                onClick={(e) => {
                  e.stopPropagation(); // prevent selecting when deleting
                  handleDelete(addr._id);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
              {selected === addr._id && (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
