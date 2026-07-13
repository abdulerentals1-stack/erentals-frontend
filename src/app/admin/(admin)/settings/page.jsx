"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  KeyRound, 
  RotateCw, 
  User, 
  Calendar, 
  ShieldAlert,
  Loader2,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminSettingsPage() {
  const [masterOtp, setMasterOtp] = useState("");
  const [newOtp, setNewOtp] = useState("");
  const [updatedBy, setUpdatedBy] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  // Fetch the configuration on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/system-config/master-otp");
      if (res.data?.success && res.data.data) {
        setMasterOtp(res.data.data.value);
        setUpdatedBy(res.data.data.updatedBy);
        setUpdatedAt(res.data.data.updatedAt);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      toast.error(err.response?.data?.message || "Failed to load system settings");
    } finally {
      setLoading(false);
    }
  };

  const handleRotate = async (e) => {
    e.preventDefault();

    if (!newOtp) {
      toast.error("Please enter or generate a new bypass OTP code");
      return;
    }

    if (!/^\d{6}$/.test(newOtp)) {
      toast.error("Bypass OTP must be a 6-digit numeric string");
      return;
    }

    try {
      setUpdating(true);
      const res = await api.post("/system-config/master-otp", { value: newOtp });
      if (res.data?.success && res.data.data) {
        toast.success(res.data.message || "Master bypass OTP rotated successfully!");
        setMasterOtp(res.data.data.value);
        setUpdatedBy(res.data.data.updatedBy);
        setUpdatedAt(res.data.data.updatedAt);
        setNewOtp("");
      }
    } catch (err) {
      console.error("Failed to rotate settings:", err);
      toast.error(err.response?.data?.message || "Failed to rotate master OTP");
    } finally {
      setUpdating(false);
    }
  };

  // Helper to generate a random secure 6 digit numeric code
  const handleGenerateRandom = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setNewOtp(randomCode);
    toast.info(`Generated temporary code: ${randomCode}. Click save to apply.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="text-gray-600 text-sm font-medium">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configurations</h1>
          <p className="text-sm text-gray-500">Manage developer tools, test overrides, and global security features</p>
        </div>
      </div>

      {/* Main Configurations Card */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Bypass OTP settings card */}
        <div className="md:col-span-2 bg-white rounded-xl border shadow-sm p-6 space-y-6">
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Master OTP Bypass Config</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Bypasses SMS dispatch gates and lets developers log into or sign up any account by entering this master code.
              </p>
            </div>
          </div>

          {/* Current setting display */}
          <div className="bg-slate-50 border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Master OTP</span>
              <button 
                type="button" 
                onClick={() => setShowOtp(!showOtp)} 
                className="text-gray-500 hover:text-indigo-600 transition"
              >
                {showOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="text-2xl font-bold tracking-widest text-slate-800 font-mono select-all">
                {showOtp ? masterOtp : "••••••"}
              </span>
            </div>
          </div>

          {/* Rotate/Update form */}
          <form onSubmit={handleRotate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newOtp" className="text-gray-700 font-medium">Rotate Bypass OTP Code</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="newOtp"
                    type="text"
                    maxLength={6}
                    value={newOtp}
                    onChange={(e) => setNewOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter new 6-digit code"
                    className="pl-3 font-mono tracking-wider text-sm h-10"
                    disabled={updating}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGenerateRandom}
                  className="h-10 text-xs px-3 hover:bg-slate-50 transition"
                  disabled={updating}
                >
                  <RotateCw className="w-3.5 h-3.5 mr-1" />
                  Generate Random
                </Button>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Provide any secure 6-digit number (e.g. `982761`). Be sure to rotate this setting regularly.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition"
              disabled={updating}
            >
              {updating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Saving Changes...
                </>
              ) : (
                "Save & Apply Rotation"
              )}
            </Button>
          </form>
        </div>

        {/* Audit & security checklist card */}
        <div className="bg-slate-50 rounded-xl border p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm border-b pb-2 mb-3">Audit Details</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-2.5 text-gray-600">
                <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Last Modified By</p>
                  <p className="mt-0.5">{updatedBy?.name || "System"}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{updatedBy?.email || "system@e-rentals.in"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-gray-600 border-t pt-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Rotation Timestamp</p>
                  <p className="mt-0.5">
                    {updatedAt ? new Date(updatedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }) : "Never"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Security Warning</span>
            </div>
            <p className="text-[10px] text-amber-700 leading-relaxed">
              Anyone with access to the master bypass OTP can log into any customer or administrator account without a phone verification check. Expose this code only to trusted developers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
