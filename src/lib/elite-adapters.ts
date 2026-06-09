'use client';

// ─── Elite Dashboard Data Adapters ────────────────────────────────────
// Maps backend hook data → vendorelite UI component types

// ─── Types (from vendorelite-dashboard) ───────────────────────────────

export type SidebarTab =
  | "analytics" | "revenue" | "ledger" | "fleet" | "houses"
  | "grid" | "bookings" | "intelligence" | "payments" | "profile"
  | "laundry-settings" | "laundry-pipeline" | "vehicles" | "rooms"
  | "offers" | "overview";

export interface VendorEliteProfile {
  legalName: string;
  primaryContact: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  status: "Approved" | "Pending" | "Suspended";
  yearsActive: number;
  rating: number;
  completionRate: number;
}

export interface LedgerTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status: "completed" | "pending";
}

export interface FleetVehicle {
  id: string;
  name: string;
  type: string;
  status: "Active" | "Transit" | "Maintenance" | "Idle";
  driver: string;
  destination: string;
  progress: number;
  speed: string;
}

export interface HouseProperty {
  id: string;
  name: string;
  type: string;
  location: string;
  rooms: number;
  occupiedRooms: number;
  monthlyIncome: number;
  status: "Full" | "Available" | "Maintenance";
}

export interface BookingRequest {
  id: string;
  client: string;
  initials: string;
  service: string;
  date: string;
  time: string;
  amount: number;
  status: "Pending" | "Approved" | "Declined";
}

export interface SurgeRule {
  id: string;
  zone: string;
  baseRate: number;
  multiplier: number;
  demand: "Low" | "Medium" | "High" | "Extreme";
  active: boolean;
}

export interface PaymentInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
}

// ─── Adapter Functions ────────────────────────────────────────────────

export function adaptVendorProfile(
  vendorProfile: any,
  user: any
): VendorEliteProfile {
  return {
    legalName: vendorProfile?.businessName || 'Premium Vendor LLC',
    primaryContact: user?.name || 'Vendor',
    email: user?.email || '',
    phone: vendorProfile?.businessPhone || '',
    address: vendorProfile?.businessAddress || '',
    categories: vendorProfile?.serviceType ? [vendorProfile.serviceType] : [],
    status: vendorProfile?.approvalStatus === 'approved' ? 'Approved'
      : vendorProfile?.approvalStatus === 'suspended' ? 'Suspended'
      : 'Pending',
    yearsActive: 1,
    rating: 4.9,
    completionRate: 98.5,
  };
}

export function adaptLedgerTransactions(
  entries: any[]
): LedgerTransaction[] {
  if (!Array.isArray(entries)) return [];
  return entries.map((e: any) => ({
    id: e.id || e._id || '',
    date: e.bookingDate ? new Date(e.bookingDate).toISOString().split('T')[0] : '',
    description: e.serviceName || e.customerName || 'Transaction',
    category: e.serviceType || 'General',
    amount: e.totalAmount || e.netEarned || 0,
    type: (e.paymentStatus === 'completed' || e.paymentStatus === 'confirmed') ? 'income' as const : 'expense' as const,
    status: e.paymentStatus === 'completed' ? 'completed' as const : 'pending' as const,
  }));
}

export function adaptFleetVehicles(fleet: any[]): FleetVehicle[] {
  if (!Array.isArray(fleet)) return [];
  return fleet.map((v: any) => {
    let status: FleetVehicle['status'] = 'Idle';
    const cs = v.currentStatus?.toLowerCase();
    if (cs === 'dispatched') status = 'Transit';
    else if (cs === 'available') status = 'Active';
    else if (cs === 'maintenance') status = 'Maintenance';

    const driver = v.currentBooking?.userId?.name || v.driver || '—';
    const progress = cs === 'dispatched' ? 45 : cs === 'available' ? 100 : 0;

    return {
      id: v._id || v.id || '',
      name: v.name || v.make + ' ' + v.model || 'Vehicle',
      type: v.type || v.vehicleType || 'Sedan',
      status,
      driver,
      destination: v.currentBooking?.destination || '—',
      progress,
      speed: cs === 'dispatched' ? '45 km/h' : '—',
    };
  });
}

export function adaptHouseProperties(houses: any[]): HouseProperty[] {
  if (!Array.isArray(houses)) return [];
  return houses.map((h: any) => {
    const totalRooms = h.totalRooms || h.rooms || h.bedrooms || 1;
    const occupied = h.occupiedRooms || 0;
    let status: HouseProperty['status'] = 'Available';
    if (occupied >= totalRooms) status = 'Full';
    if (h.isAvailable === false) status = 'Maintenance';

    return {
      id: h._id || h.id || '',
      name: h.title || h.name || 'Property',
      type: h.propertyType || h.property_type || h.houseType || 'House',
      location: h.address || h.location || '',
      rooms: totalRooms,
      occupiedRooms: occupied,
      monthlyIncome: h.pricePerMonth || h.price_per_month || h.pricePerDay * 30 || 0,
      status,
    };
  });
}

export function adaptBookingRequests(bookings: any[]): BookingRequest[] {
  if (!Array.isArray(bookings)) return [];
  return bookings.map((b: any) => {
    const clientName = b.userId?.name || b.customerName || 'Client';
    const initials = clientName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

    let status: BookingRequest['status'] = 'Pending';
    const bs = b.status?.toLowerCase();
    if (bs === 'confirmed' || bs === 'approved' || bs === 'completed') status = 'Approved';
    else if (bs === 'cancelled' || bs === 'declined') status = 'Declined';

    const startDate = b.startDate ? new Date(b.startDate) : new Date();

    return {
      id: b._id || b.id || '',
      client: clientName,
      initials,
      service: b.serviceType || b.itemType || 'Service',
      date: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      amount: b.totalAmount || b.amount || 0,
      status,
    };
  });
}

export function adaptPaymentInvoices(payments: any[]): PaymentInvoice[] {
  if (!Array.isArray(payments)) return [];
  return payments.map((p: any, i: number) => {
    let status: PaymentInvoice['status'] = 'Unpaid';
    const ps = (p.status || p.paymentStatus || '').toLowerCase();
    if (ps === 'completed' || ps === 'paid') status = 'Paid';
    else if (ps === 'overdue') status = 'Overdue';

    const issueDate = p.createdAt ? new Date(p.createdAt) : new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 14);

    return {
      id: p._id || p.id || `PAY-${i}`,
      invoiceNumber: `VL-26-${(4890 + i).toString()}`,
      clientName: p.booking?.userId?.name || p.customerName || 'Client',
      amount: p.amount || p.totalAmount || 0,
      issueDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status,
    };
  });
}
