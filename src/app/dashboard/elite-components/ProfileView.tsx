'use client';
import { useState, useEffect } from "react";
import { ShieldCheck, Star, Trophy, Plus } from "lucide-react";
import { useVendorProfile } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/modules/auth/auth.store";
import { adaptVendorProfile } from "@/lib/elite-adapters";
import { toast } from "sonner";

export function ProfileView() {
  const { data: vendorProfileData } = useVendorProfile();
  const { user } = useAuthStore();
  
  const profile = adaptVendorProfile(vendorProfileData, user);

  const [editMode, setEditMode] = useState(false);
  
  // State variables for fields
  const [legalName, setLegalName] = useState(profile.legalName);
  const [primaryContact, setPrimaryContact] = useState(profile.primaryContact);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [newCat, setNewCat] = useState("");
  const [categories, setCategories] = useState<string[]>(profile.categories);

  useEffect(() => {
    setLegalName(profile.legalName);
    setPrimaryContact(profile.primaryContact);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAddress(profile.address);
    setCategories(profile.categories);
  }, [vendorProfileData, user]);

  const handleSave = () => {
    // Ideally this would call a real API:
    // fetch('/api/vendors/profile', { method: 'PUT', body: JSON.stringify({...}) })
    toast.success("Profile changes saved successfully.");
    setEditMode(false);
  };

  const handleAddCategory = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      setCategories([...categories, newCat.trim()]);
      setNewCat("");
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Profile Header Hero Section */}
      <section className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative">
            <img
              alt="Company logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN2IuQcxB9deD0Dum-kgFRz7bJRHxtG3mCIC_GWS63HkCnFKN7EBcw_w8BG3_9KLzgnO656sfWiuSQuY0s8HfP8L3st1j5zL5t-GwVxUiyySbTuD3RIacsmv6Yh3scnzpX_hioAKUVIuEXfUiBBJi_9PMyIpYt94Z9d7PTrszTvN70iZ0sUwdnqmKdw1iI6rtYtFUaBzJR_49FW5sBJJVHM8AXsLvlhBCIbTTy9vtRAyMTmui1JYlG257naErRMJYp6VwQSqKoP-E"
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1.5">
              <h2 className="text-2xl font-bold text-on-surface tracking-tight">Premium Elite Vendor</h2>
              <span className={`px-3 py-1 ${profile.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'} text-xs font-bold rounded-full border flex items-center gap-1`}>
                <ShieldCheck className="w-3.5 h-3.5" /> {profile.status} Partner
              </span>
            </div>
            <p className="text-sm text-secondary font-medium">Providing exceptional executive logistics &amp; management since 2018.</p>
          </div>
        </div>

        <div className="flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-secondary font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs shadow hover:bg-primary transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs shadow hover:bg-primary transition-all cursor-pointer"
            >
              Modify Portfolio Info
            </button>
          )}
        </div>
      </section>

      {/* Grid Layout: Professional details vs Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Professional Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-on-surface mb-6">Professional Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Legal Business Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
                  />
                ) : (
                  <p className="text-sm font-semibold text-on-surface">{legalName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Primary Executive Officer</label>
                {editMode ? (
                  <input
                    type="text"
                    value={primaryContact}
                    onChange={(e) => setPrimaryContact(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
                  />
                ) : (
                  <p className="text-sm font-semibold text-on-surface">{primaryContact}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Communications Address</label>
                {editMode ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
                  />
                ) : (
                  <p className="text-sm font-semibold text-on-surface">{email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Phone Helpline</label>
                {editMode ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
                  />
                ) : (
                  <p className="text-sm font-semibold text-on-surface">{phone}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Registered Main Depot Address</label>
                {editMode ? (
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
                  />
                ) : (
                  <p className="text-sm font-semibold text-on-surface leading-relaxed">{address}</p>
                )}
              </div>
            </div>

            {/* Service categories tags */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-3">Service Categories</label>
              
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-1.5 bg-sky-50 text-sky-850 border border-sky-100 rounded-full text-xs font-bold flex items-center gap-1.5"
                  >
                    {cat}
                    {editMode && (
                      <button
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-sky-500 hover:text-rose-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}

                {editMode && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Helicopter Courier"
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                      className="h-8 px-2.5 bg-gray-50 border border-dashed border-gray-300 rounded-full focus:outline-none text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-2.5 h-8 bg-primary/10 text-primary border border-primary/20 rounded-full text-[11px] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand Stats */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Performance Matrix */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <h3 className="text-md font-bold text-on-surface mb-4">Performance Matrix</h3>
            
            <div className="space-y-4 font-sans">
              <div className="p-3 bg-white/60 border border-gray-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-secondary">Vendor Rating</span>
                <span className="text-lg font-bold text-on-surface flex items-center gap-1 font-mono">
                  <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" /> {profile.rating} <span className="text-[11px] text-secondary font-normal">/5.0</span>
                </span>
              </div>

              <div className="p-3 bg-white/60 border border-gray-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-secondary">Completion Rate</span>
                <span className="text-lg font-bold text-on-surface font-mono">{profile.completionRate}%</span>
              </div>

              <div className="p-3 bg-white/60 border border-gray-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-secondary">Years Active</span>
                <span className="text-lg font-bold text-on-surface font-mono">{profile.yearsActive} Yrs</span>
              </div>
            </div>

            <p className="text-[10px] text-secondary mt-4 text-center font-semibold">Scheduled Audit review cycle: 14 days.</p>
          </div>

          {/* Assistant Concierge card */}
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-white/70 to-primary/5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5 text-on-primary-container" />
              </div>
              <h3 className="text-md font-bold text-on-surface mb-1">Assistance Required?</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Your dedicated elite concierge supervisor is available 24 hours for dynamic operational carriage support.
              </p>
            </div>

            <button
              onClick={() => alert("Connecting to live Executive Concierge chat support...")}
              className="w-full mt-6 py-2.5 bg-primary-container text-white rounded-full font-bold text-xs shadow-lg shadow-primary/20 hover:bg-primary transition-all duration-150 cursor-pointer text-center"
            >
              Secure Hotline Concierge
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
