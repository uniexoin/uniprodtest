'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Search, AlertCircle, CheckCircle2, ShieldOff, ShieldAlert } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  page_taken_down: boolean;
  created_at: string;
}

export default function PageManagement() {
  const [role, setRole] = useState<'user' | 'vendor'>('user');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProfiles = async (selectedRole: string) => {
    setLoading(true);
    setSelectedIds(new Set());
    try {
      const res = await fetch(`/api/admin/page-management?role=${selectedRole}`);
      const data = await res.json();
      if (data.success) {
        setProfiles(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch profiles');
      }
    } catch (err) {
      toast.error('An error occurred while fetching profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(role);
  }, [role]);

  const filteredProfiles = profiles.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  );

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredProfiles.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleUpdateStatus = async (pageTakenDown: boolean) => {
    if (selectedIds.size === 0) return;
    
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/page-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: Array.from(selectedIds),
          pageTakenDown
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(pageTakenDown ? 'Pages taken down successfully' : 'Pages restored successfully');
        // Update local state
        setProfiles(profiles.map(p => 
          selectedIds.has(p.id) ? { ...p, page_taken_down: pageTakenDown } : p
        ));
        setSelectedIds(new Set()); // clear selection
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err) {
      toast.error('An error occurred during update');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-playfair text-foreground tracking-wide">Page Management</h1>
          <p className="text-muted-foreground mt-1">Manage platform access and temporarily disable pages.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as 'user' | 'vendor')}
            className="w-[180px] bg-background border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="user">Users</option>
            <option value="vendor">Vendors</option>
          </select>
        </div>
      </div>

      {/* Action Bar (shows when items are selected) */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                {selectedIds.size} Selected
              </span>
              <span className="text-sm font-medium text-foreground">Apply actions to selected accounts</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="destructive"
                className="flex-1 sm:flex-none gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 shadow-none"
                onClick={() => handleUpdateStatus(true)}
                disabled={updating}
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                Temp Disable
              </Button>
              <Button 
                variant="outline"
                className="flex-1 sm:flex-none gap-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 shadow-none"
                onClick={() => handleUpdateStatus(false)}
                disabled={updating}
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Restore Access
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/50 dark:bg-black/20 border border-border/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 w-[60px]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={filteredProfiles.length > 0 && selectedIds.size === filteredProfiles.length}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground text-sm">Loading accounts...</p>
                  </td>
                </tr>
              ) : filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No accounts found.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedIds.has(p.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => toggleSelect(p.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{p.name || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground font-jetbrains mt-0.5">{p.id.split('-')[0]}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{p.email}</div>
                      <div className="text-muted-foreground text-xs">{p.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {p.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.page_taken_down ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                          <ShieldOff className="w-3 h-3" />
                          Disabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
