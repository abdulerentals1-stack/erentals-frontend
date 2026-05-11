'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { getAllServicesAdmin, toggleServiceStatus, deleteService } from "@/services/serviceService";

export default function AdminServiceTable() {
  const [services, setServices] = useState([]);
  const router = useRouter();

  const fetchServices = async () => {
    try {
      const res = await getAllServicesAdmin();
      setServices(res.data.services || []);
    } catch (err) {
      toast.error("Failed to fetch services.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = () => {
    router.push("/admin/services/add"); // Navigate to add service page
  };

  const handleEdit = (serviceId) => {
    router.push(`/admin/services/add/${serviceId}`);
  };

  const handleToggle = async (serviceItem) => {
    try {
      await toggleServiceStatus(serviceItem._id);
      toast.success(`Service ${serviceItem.isActive ? "deactivated" : "activated"} successfully`);
      fetchServices();
    } catch (err) {
      toast.error("Failed to update service status");
    }
  };

  const handleDelete = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteService(serviceId);
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-8 bg-white dark:bg-zinc-900 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Services</h2>
        <Button onClick={handleAddService}>Add Service</Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-zinc-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-zinc-800">
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Author</th>
              <th className="border p-2 text-left">Active</th>
              <th className="border p-2 text-left">Created At</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((serviceItem) => (
              <tr key={serviceItem._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                <td className="border p-2">{serviceItem.title}</td>
                <td className="border p-2">{serviceItem.authorName}</td>
                <td className="border p-2">
                  <Checkbox
                    checked={serviceItem.isActive}
                    onCheckedChange={() => handleToggle(serviceItem)}
                  />
                </td>
                <td className="border p-2">
                  {new Date(serviceItem.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2 flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(serviceItem._id)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(serviceItem._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
