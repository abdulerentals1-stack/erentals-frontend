"use client";

import { useEffect, useState, useRef } from "react";
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
  EyeOff,
  Building2,
  FileText,
  Trash2,
  Plus,
  Settings,
  CreditCard,
  Layout,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin
} from "lucide-react";

export default function AdminSettingsPage() {
  // Tabs Navigation State
  const [activeTab, setActiveTab] = useState("company");

  const [masterOtp, setMasterOtp] = useState("");
  const [newOtp, setNewOtp] = useState("");
  const [updatedBy, setUpdatedBy] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  // Corporate configurations state
  const [companyConfigs, setCompanyConfigs] = useState({});
  const [updatingCompany, setUpdatingCompany] = useState(false);

  // Interactive Lists State
  const [phoneList, setPhoneList] = useState([]);
  const [bankAccountsList, setBankAccountsList] = useState([]);
  const [invoiceTermsList, setInvoiceTermsList] = useState([]);
  const [quotationTermsList, setQuotationTermsList] = useState([]);
  const [personsList, setPersonsList] = useState([]);

  // Scroll Refs for UX enhancements
  const invoiceScrollRef = useRef(null);
  const quotationScrollRef = useRef(null);
  const personnelScrollRef = useRef(null);

  // Fetch the configuration on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/system-config/admin");
      if (res.data?.success && res.data.data) {
        const configList = res.data.data;
        
        // Find bypass OTP
        const otpObj = configList.find(c => c.key === "MASTER_BYPASS_OTP");
        if (otpObj) {
          setMasterOtp(otpObj.value);
          setUpdatedBy(otpObj.updatedBy);
          setUpdatedAt(otpObj.updatedAt);
        }

        // Map other config key-values to companyConfigs map
        const mapped = {};
        configList.forEach(item => {
          if (item.key !== "MASTER_BYPASS_OTP") {
            mapped[item.key] = item.value;
          }
        });
        setCompanyConfigs(mapped);

        // Load interactive phone list inputs
        const phoneObj = configList.find(c => c.key === "COMPANY_PHONE");
        if (phoneObj && phoneObj.value) {
          setPhoneList(phoneObj.value.split(" / "));
        } else {
          setPhoneList([""]);
        }

        // Load interactive bank accounts list
        const bankAccountsObj = configList.find(c => c.key === "BANK_ACCOUNTS");
        if (bankAccountsObj && bankAccountsObj.value) {
          try {
            setBankAccountsList(JSON.parse(bankAccountsObj.value));
          } catch (e) {
            setBankAccountsList([]);
          }
        } else {
          // Map legacy single account
          setBankAccountsList([{
            bankName: mapped.BANK_NAME || "",
            accountName: mapped.BANK_ACCOUNT_NAME || "",
            accountType: mapped.BANK_ACCOUNT_TYPE || "",
            branchName: mapped.BANK_BRANCH || "",
            ifscCode: mapped.BANK_IFSC || "",
            accountNumber: mapped.BANK_ACCOUNT_NO || "",
            upiId: mapped.BANK_UPI || ""
          }]);
        }

        // Load interactive terms lists
        const invoiceTermsObj = configList.find(c => c.key === "INVOICE_TERMS_AND_CONDITIONS");
        if (invoiceTermsObj) {
          try {
            setInvoiceTermsList(JSON.parse(invoiceTermsObj.value));
          } catch (e) {
            setInvoiceTermsList([]);
          }
        } else {
          const termsObj = configList.find(c => c.key === "TERMS_AND_CONDITIONS");
          if (termsObj) {
            try {
              setInvoiceTermsList(JSON.parse(termsObj.value));
            } catch (e) {
              setInvoiceTermsList([]);
            }
          }
        }

        const quotationTermsObj = configList.find(c => c.key === "QUOTATION_TERMS_AND_CONDITIONS");
        if (quotationTermsObj) {
          try {
            setQuotationTermsList(JSON.parse(quotationTermsObj.value));
          } catch (e) {
            setQuotationTermsList([]);
          }
        } else {
          const termsObj = configList.find(c => c.key === "TERMS_AND_CONDITIONS");
          if (termsObj) {
            try {
              setQuotationTermsList(JSON.parse(termsObj.value));
            } catch (e) {
              setQuotationTermsList([]);
            }
          }
        }

        const personsObj = configList.find(c => c.key === "DEFAULT_PERSONS");
        if (personsObj) {
          try {
            setPersonsList(JSON.parse(personsObj.value));
          } catch (e) {
            setPersonsList([]);
          }
        }
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

  const handleConfigChange = (key, val) => {
    setCompanyConfigs(prev => ({
      ...prev,
      [key]: val
    }));
  };

  // Bank Accounts List Modifiers
  const handleAddBankAccount = () => {
    setBankAccountsList(prev => [...prev, {
      bankName: "",
      accountName: "",
      accountType: "CURRENT",
      branchName: "",
      ifscCode: "",
      accountNumber: "",
      upiId: ""
    }]);
  };

  const handleUpdateBankAccount = (index, field, value) => {
    setBankAccountsList(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleDeleteBankAccount = (index) => {
    setBankAccountsList(prev => prev.filter((_, i) => i !== index));
  };

  // Terms & Conditions List Modifiers
  const handleAddInvoiceTerm = () => {
    setInvoiceTermsList(prev => [...prev, ""]);
    setTimeout(() => {
      if (invoiceScrollRef.current) {
        invoiceScrollRef.current.scrollTo({
          top: invoiceScrollRef.current.scrollHeight,
          behavior: "smooth"
        });
        const items = invoiceScrollRef.current.querySelectorAll("textarea, input");
        if (items.length > 0) {
          items[items.length - 1].focus();
        }
      }
    }, 80);
  };

  const handleUpdateInvoiceTerm = (index, value) => {
    setInvoiceTermsList(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleDeleteInvoiceTerm = (index) => {
    setInvoiceTermsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddQuotationTerm = () => {
    setQuotationTermsList(prev => [...prev, ""]);
    setTimeout(() => {
      if (quotationScrollRef.current) {
        quotationScrollRef.current.scrollTo({
          top: quotationScrollRef.current.scrollHeight,
          behavior: "smooth"
        });
        const items = quotationScrollRef.current.querySelectorAll("textarea, input");
        if (items.length > 0) {
          items[items.length - 1].focus();
        }
      }
    }, 80);
  };

  const handleUpdateQuotationTerm = (index, value) => {
    setQuotationTermsList(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleDeleteQuotationTerm = (index) => {
    setQuotationTermsList(prev => prev.filter((_, i) => i !== index));
  };

  // Personnel List Modifiers
  const handleAddPerson = () => {
    setPersonsList(prev => [...prev, { name: "", role: "" }]);
    setTimeout(() => {
      if (personnelScrollRef.current) {
        personnelScrollRef.current.scrollTo({
          top: personnelScrollRef.current.scrollHeight,
          behavior: "smooth"
        });
        const items = personnelScrollRef.current.querySelectorAll("input");
        if (items.length > 0) {
          // Focus the Name field of the new personnel row
          items[items.length - 2].focus();
        }
      }
    }, 80);
  };

  const handleUpdatePerson = (index, field, value) => {
    setPersonsList(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleDeletePerson = (index) => {
    setPersonsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveCompanySettings = async (e) => {
    e.preventDefault();

    // Filter empty values
    const filteredInvoiceTerms = invoiceTermsList.filter(t => t.trim() !== "");
    const filteredQuotationTerms = quotationTermsList.filter(t => t.trim() !== "");
    const filteredPersons = personsList.filter(p => p.name.trim() !== "" || p.role.trim() !== "");
    const filteredPhones = phoneList.filter(p => p.trim() !== "");
    const filteredBankAccounts = bankAccountsList.filter(a => a.bankName.trim() !== "" || a.accountNumber.trim() !== "");

    // Copy first account values to legacy flat fields for safety (backward compatibility)
    const firstAcc = filteredBankAccounts[0] || {};

    const updatedConfigs = {
      ...companyConfigs,
      COMPANY_PHONE: filteredPhones.join(" / "),
      BANK_NAME: firstAcc.bankName || "",
      BANK_ACCOUNT_NAME: firstAcc.accountName || "",
      BANK_ACCOUNT_TYPE: firstAcc.accountType || "",
      BANK_BRANCH: firstAcc.branchName || "",
      BANK_IFSC: firstAcc.ifscCode || "",
      BANK_ACCOUNT_NO: firstAcc.accountNumber || "",
      BANK_UPI: firstAcc.upiId || "",
      BANK_ACCOUNTS: JSON.stringify(filteredBankAccounts),
      INVOICE_TERMS_AND_CONDITIONS: JSON.stringify(filteredInvoiceTerms),
      QUOTATION_TERMS_AND_CONDITIONS: JSON.stringify(filteredQuotationTerms),
      TERMS_AND_CONDITIONS: JSON.stringify(filteredInvoiceTerms),
      DEFAULT_PERSONS: JSON.stringify(filteredPersons)
    };

    try {
      setUpdatingCompany(true);
      const res = await api.post("/system-config/admin", { configs: updatedConfigs });
      if (res.data?.success) {
        toast.success("Corporate & billing configurations updated successfully!");
        fetchSettings(); // reload list
      }
    } catch (err) {
      console.error("Failed to save company settings:", err);
      toast.error(err.response?.data?.message || "Failed to update corporate settings");
    } finally {
      setUpdatingCompany(false);
    }
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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configurations</h1>
          <p className="text-sm text-gray-500">Manage developer tools, corporate billing profiles, and global security features</p>
        </div>
      </div>

      {/* Tabs Navigation Layout */}
      <div className="flex flex-wrap gap-2 border-b pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "company"
              ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100"
              : "text-gray-500 hover:text-gray-900 hover:bg-slate-50 border border-transparent"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Company Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bank")}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "bank"
              ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100"
              : "text-gray-500 hover:text-gray-900 hover:bg-slate-50 border border-transparent"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Bank Accounts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "documents"
              ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100"
              : "text-gray-500 hover:text-gray-900 hover:bg-slate-50 border border-transparent"
          }`}
        >
          <FileText className="w-4 h-4" />
          Document Templates
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("footer")}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "footer"
              ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100"
              : "text-gray-500 hover:text-gray-900 hover:bg-slate-50 border border-transparent"
          }`}
        >
          <Layout className="w-4 h-4" />
          Footer Layout
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "system"
              ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100"
              : "text-gray-500 hover:text-gray-900 hover:bg-slate-50 border border-transparent"
          }`}
        >
          <Settings className="w-4 h-4" />
          Developer & Security
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {/* Tab 1: Company Profile */}
        {activeTab === "company" && (
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Corporate Identity & Contact Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update registered company profile, contact numbers, and HSN/SAC parameters displayed on customer invoices.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCompanySettings} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Side: General Profile & Identifiers */}
                <div className="grid grid-cols-2 gap-4 content-start">
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor="COMPANY_NAME" className="text-xs font-semibold text-gray-700">Company Name</Label>
                    <Input
                      id="COMPANY_NAME"
                      type="text"
                      value={companyConfigs.COMPANY_NAME || ""}
                      onChange={(e) => handleConfigChange("COMPANY_NAME", e.target.value)}
                      placeholder="Enter legal entity name"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="COMPANY_EMAIL" className="text-xs font-semibold text-gray-700">Official Email</Label>
                    <Input
                      id="COMPANY_EMAIL"
                      type="email"
                      value={companyConfigs.COMPANY_EMAIL || ""}
                      onChange={(e) => handleConfigChange("COMPANY_EMAIL", e.target.value)}
                      placeholder="e.g. admin@e-rentals.in"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="COMPANY_WEBSITE" className="text-xs font-semibold text-gray-700">Website URL</Label>
                    <Input
                      id="COMPANY_WEBSITE"
                      type="text"
                      value={companyConfigs.COMPANY_WEBSITE || ""}
                      onChange={(e) => handleConfigChange("COMPANY_WEBSITE", e.target.value)}
                      placeholder="e.g. www.e-rentals.in"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="COMPANY_GSTN" className="text-xs font-semibold text-gray-700">GSTIN / Tax ID</Label>
                    <Input
                      id="COMPANY_GSTN"
                      type="text"
                      value={companyConfigs.COMPANY_GSTN || ""}
                      onChange={(e) => handleConfigChange("COMPANY_GSTN", e.target.value)}
                      placeholder="e.g. 27AAGCE8977P1ZJ"
                      className="text-xs h-9 bg-white uppercase"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="COMPANY_UDYAM" className="text-xs font-semibold text-gray-700">Udyam Registration No.</Label>
                    <Input
                      id="COMPANY_UDYAM"
                      type="text"
                      value={companyConfigs.COMPANY_UDYAM || ""}
                      onChange={(e) => handleConfigChange("COMPANY_UDYAM", e.target.value)}
                      placeholder="e.g. UDYAM-MH-19-0133725"
                      className="text-xs h-9 bg-white uppercase"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="COMPANY_SAC" className="text-xs font-semibold text-gray-700">HSN/SAC Code</Label>
                    <Input
                      id="COMPANY_SAC"
                      type="text"
                      value={companyConfigs.COMPANY_SAC || ""}
                      onChange={(e) => handleConfigChange("COMPANY_SAC", e.target.value)}
                      placeholder="e.g. 998596"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="GST_RATE" className="text-xs font-semibold text-gray-700">Standard GST Rate (%)</Label>
                    <Input
                      id="GST_RATE"
                      type="number"
                      value={companyConfigs.GST_RATE || ""}
                      onChange={(e) => handleConfigChange("GST_RATE", e.target.value)}
                      placeholder="e.g. 18"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                </div>

                {/* Right Side: Address & Contact Numbers */}
                <div className="flex flex-col gap-4 content-start">
                  <div className="space-y-1">
                    <Label htmlFor="COMPANY_ADDRESS" className="text-xs font-semibold text-gray-700">Business Address</Label>
                    <textarea
                      id="COMPANY_ADDRESS"
                      rows={3}
                      value={companyConfigs.COMPANY_ADDRESS || ""}
                      onChange={(e) => handleConfigChange("COMPANY_ADDRESS", e.target.value)}
                      placeholder="Full physical address for invoicing"
                      className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[90px] resize-none"
                      disabled={updatingCompany}
                    />
                  </div>


                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-gray-700">Contact Phone(s)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPhoneList(prev => [...prev, ""])}
                        className="h-6 text-[10px] px-2 font-medium border border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 bg-white"
                        disabled={updatingCompany}
                      >
                        <Plus className="w-3.5 h-3.5 mr-0.5" /> Add Phone
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {phoneList.map((phone, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            type="text"
                            value={phone}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPhoneList(prev => {
                                const updated = [...prev];
                                updated[idx] = val;
                                return updated;
                              });
                            }}
                            placeholder={`Phone number #${idx + 1}`}
                            className="text-xs h-8 flex-1 bg-white"
                            disabled={updatingCompany}
                          />
                          {phoneList.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setPhoneList(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t mt-4">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-6 h-9 transition"
                  disabled={updatingCompany}
                >
                  {updatingCompany ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Saving Company Profile...
                    </>
                  ) : (
                    "Save Company Profile"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Bank Accounts List Editor */}
        {activeTab === "bank" && (
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Official Bank Accounts</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure multiple bank accounts and optional UPI IDs printed dynamically on invoice slips.
                  </p>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBankAccount}
                className="text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Bank Account
              </Button>
            </div>

            <form onSubmit={handleSaveCompanySettings} className="space-y-6">
              <div className="space-y-6">
                {bankAccountsList.map((acc, idx) => (
                  <div key={idx} className="bg-slate-50 border rounded-xl p-5 space-y-4 relative">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Bank Account {bankAccountsList.length > 1 ? `#${idx + 1}` : ""}
                      </span>
                      {bankAccountsList.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBankAccount(idx)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600">Bank Name</Label>
                        <Input
                          type="text"
                          value={acc.bankName || ""}
                          onChange={(e) => handleUpdateBankAccount(idx, "bankName", e.target.value)}
                          placeholder="e.g. IndusInd Bank"
                          className="text-xs h-9 bg-white"
                          disabled={updatingCompany}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600">Account Beneficiary Name</Label>
                        <Input
                          type="text"
                          value={acc.accountName || ""}
                          onChange={(e) => handleUpdateBankAccount(idx, "accountName", e.target.value)}
                          placeholder="e.g. Erentals HND Pvt Ltd"
                          className="text-xs h-9 bg-white"
                          disabled={updatingCompany}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600">Account Type</Label>
                        <Input
                          type="text"
                          value={acc.accountType || ""}
                          onChange={(e) => handleUpdateBankAccount(idx, "accountType", e.target.value)}
                          placeholder="e.g. CURRENT or SAVINGS"
                          className="text-xs h-9 bg-white"
                          disabled={updatingCompany}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600">Branch Location</Label>
                        <Input
                          type="text"
                          value={acc.branchName || ""}
                          onChange={(e) => handleUpdateBankAccount(idx, "branchName", e.target.value)}
                          placeholder="e.g. Saki Naka Branch"
                          className="text-xs h-9 bg-white"
                          disabled={updatingCompany}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600">IFSC Code</Label>
                        <Input
                          type="text"
                          value={acc.ifscCode || ""}
                          onChange={(e) => handleUpdateBankAccount(idx, "ifscCode", e.target.value)}
                          placeholder="e.g. INDB0001075"
                          className="text-xs h-9 bg-white uppercase"
                          disabled={updatingCompany}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600">Account Number</Label>
                        <Input
                          type="text"
                          value={acc.accountNumber || ""}
                          onChange={(e) => handleUpdateBankAccount(idx, "accountNumber", e.target.value)}
                          placeholder="e.g. 259867348165"
                          className="text-xs h-9 bg-white"
                          disabled={updatingCompany}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <Label className="text-xs font-medium text-gray-600">UPI ID (Optional)</Label>
                        <Input
                          type="text"
                          value={acc.upiId || ""}
                          onChange={(e) => handleUpdateBankAccount(idx, "upiId", e.target.value)}
                          placeholder="e.g. erentals@okaxis"
                          className="text-xs h-9 bg-white"
                          disabled={updatingCompany}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t mt-4">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-6 h-9 transition"
                  disabled={updatingCompany}
                >
                  {updatingCompany ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Saving Bank Details...
                    </>
                  ) : (
                    "Save Bank Details"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Document Templates */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">PDF Terms & Personnel</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage terms lists and authorized team roles printed dynamically on Quotation and Invoice PDF documents.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveCompanySettings} className="space-y-6">
                <div className="space-y-6">
                  {/* Card 1: Invoice Terms */}
                  <div className="bg-slate-50 border rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <Label className="text-sm font-semibold text-gray-800">Invoice Terms & Conditions</Label>
                        <p className="text-[10px] text-gray-400">Added items will render as list clauses on Invoice PDFs</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddInvoiceTerm}
                        className="h-8 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Clause
                      </Button>
                    </div>
                    
                    <div ref={invoiceScrollRef} className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {invoiceTermsList.map((term, index) => (
                        <div key={index} className="flex gap-2 items-start bg-white p-2.5 rounded-lg border shadow-sm">
                          <span className="text-xs font-mono font-bold text-gray-400 mt-2 w-5 text-right">{index + 1}.</span>
                          <textarea
                            rows={1}
                            ref={(el) => {
                              if (el) {
                                el.style.height = "auto";
                                el.style.height = el.scrollHeight + "px";
                              }
                            }}
                            value={term}
                            onChange={(e) => {
                              handleUpdateInvoiceTerm(index, e.target.value);
                              e.target.style.height = "auto";
                              e.target.style.height = e.target.scrollHeight + "px";
                            }}
                            placeholder={`Enter clause detail #${index + 1}`}
                            className="flex-1 text-xs resize-none bg-transparent outline-none py-0.5 text-gray-700 font-sans w-full"
                            disabled={updatingCompany}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvoiceTerm(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                      
                      {invoiceTermsList.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-8">
                          No clauses defined. Click "Add Clause" to add invoice terms.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card 2: Quotation Terms */}
                  <div className="bg-slate-50 border rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <Label className="text-sm font-semibold text-gray-800">Quotation Terms & Conditions</Label>
                        <p className="text-[10px] text-gray-400">Added items will render as list clauses on Quotation PDFs</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddQuotationTerm}
                        className="h-8 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Clause
                      </Button>
                    </div>
                    
                    <div ref={quotationScrollRef} className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {quotationTermsList.map((term, index) => (
                        <div key={index} className="flex gap-2 items-start bg-white p-2.5 rounded-lg border shadow-sm">
                          <span className="text-xs font-mono font-bold text-gray-400 mt-2 w-5 text-right">{index + 1}.</span>
                          <textarea
                            rows={1}
                            ref={(el) => {
                              if (el) {
                                el.style.height = "auto";
                                el.style.height = el.scrollHeight + "px";
                              }
                            }}
                            value={term}
                            onChange={(e) => {
                              handleUpdateQuotationTerm(index, e.target.value);
                              e.target.style.height = "auto";
                              e.target.style.height = e.target.scrollHeight + "px";
                            }}
                            placeholder={`Enter clause detail #${index + 1}`}
                            className="flex-1 text-xs resize-none bg-transparent outline-none py-0.5 text-gray-700 font-sans w-full"
                            disabled={updatingCompany}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuotationTerm(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                      
                      {quotationTermsList.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-8">
                          No clauses defined. Click "Add Clause" to add quotation terms.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card 3: Authorized Personnel */}
                  <div className="bg-slate-50 border rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <Label className="text-sm font-semibold text-gray-800">Authorized Personnel</Label>
                        <p className="text-[10px] text-gray-400">Signers and handlers shown on invoices</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddPerson}
                        className="h-8 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Person
                      </Button>
                    </div>
                    
                    <div ref={personnelScrollRef} className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {personsList.map((person, index) => (
                        <div key={index} className="flex gap-2 items-center bg-white p-2.5 rounded-lg border shadow-sm">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                              value={person.name || ""}
                              onChange={(e) => handleUpdatePerson(index, "name", e.target.value)}
                              placeholder="Name (e.g. Fatima Khatoon)"
                              className="text-xs h-8 bg-white"
                              disabled={updatingCompany}
                            />
                            <Input
                              value={person.role || ""}
                              onChange={(e) => handleUpdatePerson(index, "role", e.target.value)}
                              placeholder="Role (e.g. Manager)"
                              className="text-xs h-8 bg-white"
                              disabled={updatingCompany}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePerson(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                      
                      {personsList.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-8">
                          No personnel configured. Click "Add Person" to begin.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t mt-4">
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-6 h-9 transition"
                    disabled={updatingCompany}
                  >
                    {updatingCompany ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        Saving Document Configurations...
                      </>
                    ) : (
                      "Save Document Settings"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Developer & Security */}
        {activeTab === "system" && (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Bypass OTP settings card */}
            <div className="md:col-span-2 bg-white rounded-xl border shadow-sm p-6 space-y-6">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="p-3 bg-red-50 rounded-lg text-red-600">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Master OTP Bypass Override</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Developer override to bypass standard SMS verification gates for test accounts and developer simulation.
                  </p>
                </div>
              </div>

              {/* Current display */}
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
                  <Label htmlFor="newOtp" className="text-gray-700 font-medium text-xs">Rotate Bypass OTP Code</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="newOtp"
                        type="text"
                        maxLength={6}
                        value={newOtp}
                        onChange={(e) => setNewOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter new 6-digit code"
                        className="pl-3 font-mono tracking-wider text-xs h-9"
                        disabled={updating}
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGenerateRandom}
                      className="h-9 text-xs px-3 hover:bg-slate-50 transition"
                      disabled={updating}
                    >
                      <RotateCw className="w-3.5 h-3.5 mr-1" />
                      Generate Random
                    </Button>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Provide any secure 6-digit number. Be sure to rotate this setting regularly.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-9 bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition"
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

            {/* Audit details card */}
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
        )}

        {/* Tab 5: Footer Management */}
        {activeTab === "footer" && (
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Footer Management & Social Links</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure the contact details and social media profile links displayed in the website footer.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCompanySettings} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Side: Footer Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-indigo-600 border-b pb-1">📞 Footer Contact Details</h3>
                  <div className="space-y-1">
                    <Label htmlFor="FOOTER_EMAIL" className="text-xs font-semibold text-gray-700">Footer Email</Label>
                    <Input
                      id="FOOTER_EMAIL"
                      type="email"
                      value={companyConfigs.FOOTER_EMAIL || ""}
                      onChange={(e) => handleConfigChange("FOOTER_EMAIL", e.target.value)}
                      placeholder="e.g. sales@e-rentals.in"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="FOOTER_PHONE" className="text-xs font-semibold text-gray-700">Footer Phone</Label>
                    <Input
                      id="FOOTER_PHONE"
                      type="text"
                      value={companyConfigs.FOOTER_PHONE || ""}
                      onChange={(e) => handleConfigChange("FOOTER_PHONE", e.target.value)}
                      placeholder="e.g. +91 9867348165"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="FOOTER_LOCATION" className="text-xs font-semibold text-gray-700">Footer Location</Label>
                    <Input
                      id="FOOTER_LOCATION"
                      type="text"
                      value={companyConfigs.FOOTER_LOCATION || ""}
                      onChange={(e) => handleConfigChange("FOOTER_LOCATION", e.target.value)}
                      placeholder="e.g. Vikhroli, Mumbai, India"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                </div>

                {/* Right Side: Social Media Links */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-indigo-600 border-b pb-1">🌐 Social Profile Links</h3>
                  <div className="space-y-1">
                    <Label htmlFor="SOCIAL_FACEBOOK" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-[#1877F2]" /> Facebook URL
                    </Label>
                    <Input
                      id="SOCIAL_FACEBOOK"
                      type="text"
                      value={companyConfigs.SOCIAL_FACEBOOK || ""}
                      onChange={(e) => handleConfigChange("SOCIAL_FACEBOOK", e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="SOCIAL_INSTAGRAM" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-[#E4405F]" /> Instagram URL
                    </Label>
                    <Input
                      id="SOCIAL_INSTAGRAM"
                      type="text"
                      value={companyConfigs.SOCIAL_INSTAGRAM || ""}
                      onChange={(e) => handleConfigChange("SOCIAL_INSTAGRAM", e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="SOCIAL_TWITTER" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" /> Twitter / X URL
                    </Label>
                    <Input
                      id="SOCIAL_TWITTER"
                      type="text"
                      value={companyConfigs.SOCIAL_TWITTER || ""}
                      onChange={(e) => handleConfigChange("SOCIAL_TWITTER", e.target.value)}
                      placeholder="https://twitter.com/yourhandle"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="SOCIAL_YOUTUBE" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-[#FF0000]" /> YouTube Channel URL
                    </Label>
                    <Input
                      id="SOCIAL_YOUTUBE"
                      type="text"
                      value={companyConfigs.SOCIAL_YOUTUBE || ""}
                      onChange={(e) => handleConfigChange("SOCIAL_YOUTUBE", e.target.value)}
                      placeholder="https://youtube.com/c/yourchannel"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="SOCIAL_LINKEDIN" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" /> LinkedIn Page URL
                    </Label>
                    <Input
                      id="SOCIAL_LINKEDIN"
                      type="text"
                      value={companyConfigs.SOCIAL_LINKEDIN || ""}
                      onChange={(e) => handleConfigChange("SOCIAL_LINKEDIN", e.target.value)}
                      placeholder="https://linkedin.com/company/yourpage"
                      className="text-xs h-9 bg-white"
                      disabled={updatingCompany}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t pt-4">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 px-4 rounded-md"
                  disabled={updatingCompany}
                >
                  {updatingCompany ? "Saving Changes..." : "Save Footer Layout"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
