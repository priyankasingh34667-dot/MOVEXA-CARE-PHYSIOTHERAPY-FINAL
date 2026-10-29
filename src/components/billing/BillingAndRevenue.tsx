import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, TariffItem } from '../../types';
import {
  ReceiptIndianRupee,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  CreditCard,
  Building,
  TrendingUp,
  Percent,
  X,
  FileText,
} from 'lucide-react';

export const BillingAndRevenue: React.FC = () => {
  const {
    patients,
    invoices,
    tariffs,
    createInvoice,
    recordPayment,
    currentStaff,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('UPI');

  // New Invoice Form state
  const [newPatientId, setNewPatientId] = useState(patients[0]?.id || '');
  const [selectedTariffCode, setSelectedTariffCode] = useState(tariffs[0]?.code || 'CONS-INIT');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);

  // Financial calculations
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const outstandingBalance = totalBilled - totalCollected;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const averagePerPatient =
    patients.length > 0 ? Math.round(totalCollected / patients.length) : 0;

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.uhid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newPatientId);
    const tar = tariffs.find((t) => t.code === selectedTariffCode);
    if (!pat || !tar) return;

    const unitPrice = tar.rate;
    const itemAmount = unitPrice * quantity;
    const subtotal = itemAmount;
    const finalAmount = Math.max(0, subtotal - discount);

    createInvoice({
      patientId: pat.id,
      patientName: pat.fullName,
      uhid: pat.uhid,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: [
        {
          tariffCode: tar.code,
          description: tar.name,
          quantity,
          unitPrice,
          amount: itemAmount,
        },
      ],
      subtotal,
      discount,
      tax: 0,
      totalAmount: finalAmount,
      paidAmount: 0,
      paymentStatus: 'pending',
      notes: `Standard clinical tariff billed under ${tar.category} category.`,
    });

    setShowNewInvoiceModal(false);
    setDiscount(0);
    setQuantity(1);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || paymentAmount <= 0) return;
    recordPayment(paymentModalInvoice.id, paymentAmount, paymentMethod);
    setPaymentModalInvoice(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-0.5">
            <ReceiptIndianRupee className="w-4 h-4 text-[#2D6A4F]" />
            <span>Clinic Financial Operations</span>
            <span>·</span>
            <span>Tariffs & Revenue Generation</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            MOVEXA Care Billing & Revenue Management
          </h1>
          <p className="text-xs text-[#6B7280]">
            Track clinical consultation fees, therapy session billing, package receipts, and payment reconciliations.
          </p>
        </div>

        <button
          onClick={() => setShowNewInvoiceModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-1">
          <span className="text-xs text-[#6B7280] font-medium">Revenue Collected</span>
          <div className="text-2xl font-extrabold text-[#1B4332] tabular-nums">
            ₹{totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>{collectionRate}% collection efficiency</span>
          </div>
        </div>

        {/* Total Billed */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-1">
          <span className="text-xs text-[#6B7280] font-medium">Total Billed Charges</span>
          <div className="text-2xl font-extrabold text-[#111827] tabular-nums">
            ₹{totalBilled.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#6B7280]">
            Across {invoices.length} clinical invoices
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-1">
          <span className="text-xs text-[#6B7280] font-medium">Outstanding Balance</span>
          <div className="text-2xl font-extrabold text-amber-700 tabular-nums">
            ₹{outstandingBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#4B5563]">
            {invoices.filter((i) => i.paymentStatus !== 'paid').length} invoices with balance
          </div>
        </div>

        {/* Average Revenue Per Patient */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-1">
          <span className="text-xs text-[#6B7280] font-medium">Avg Revenue / Patient</span>
          <div className="text-2xl font-extrabold text-[#2D6A4F] tabular-nums">
            ₹{averagePerPatient.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#6B7280]">
            Active rehab cohort yield
          </div>
        </div>
      </div>

      {/* Standard Tariff Master Schedule Grid */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
            Standard Clinical Tariff Schedule (MOVEXA Physiotherapy)
          </h2>
          <span className="text-[11px] text-[#6B7280]">
            Regulated by Clinic Director Dr. Priyanka Singh
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tariffs.map((tar) => (
            <div
              key={tar.id}
              className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex flex-col justify-between gap-1 text-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#6B7280] font-semibold">{tar.code}</span>
                  <span className="text-[10px] uppercase font-semibold text-[#1B4332] bg-[#E8F3EE] px-1.5 py-0.5 rounded">
                    {tar.category}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#111827] mt-1 line-clamp-1">{tar.name}</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5 line-clamp-2">{tar.description}</p>
              </div>
              <div className="pt-2 border-t border-[#E5E5DF] flex items-center justify-between mt-1">
                <span className="text-[11px] text-[#4B5563]">Clinical Fee:</span>
                <span className="font-extrabold text-[#1B4332] text-sm tabular-nums">
                  ₹{tar.rate.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-white rounded-xl border border-[#E5E5DF] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              Billing & Invoices Ledger ({filteredInvoices.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search invoice, patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-1.5 text-xs border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-[#4B5563]"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="border border-[#E5E5DF] rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#FAF9F5] text-[#6B7280] border-b border-[#E5E5DF]">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Date</th>
                <th className="p-3">Patient & UHID</th>
                <th className="p-3">Service Breakdown</th>
                <th className="p-3 text-right">Total Fee</th>
                <th className="p-3 text-right">Paid</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F0]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#1B4332]">{inv.invoiceNumber}</td>
                  <td className="p-3 text-[#6B7280]">{inv.date}</td>
                  <td className="p-3">
                    <span className="font-bold text-[#111827] block">{inv.patientName}</span>
                    <span className="text-[10px] font-mono text-[#6B7280]">{inv.uhid}</span>
                  </td>
                  <td className="p-3 text-[#4B5563] text-[11px] max-w-xs truncate">
                    {inv.items.map((i) => i.description).join(', ')}
                  </td>
                  <td className="p-3 text-right font-bold text-[#111827] tabular-nums">
                    ₹{inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-emerald-800">
                    ₹{inv.paidAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        inv.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : inv.paymentStatus === 'partial'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => {
                            setPaymentModalInvoice(inv);
                            setPaymentAmount(inv.totalAmount - inv.paidAmount);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded transition-colors"
                        >
                          Collect
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="p-1 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F0] rounded"
                        title="Print Official Medical Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Generate New Invoice */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#E5E5DF] shadow-xl max-w-lg w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DF]">
              <h3 className="text-sm font-bold text-[#1B4332]">Generate Clinical Invoice</h3>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Select Patient
                </label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.uhid})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Clinical Tariff Service
                </label>
                <select
                  value={selectedTariffCode}
                  onChange={(e) => setSelectedTariffCode(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium"
                >
                  {tariffs.map((t) => (
                    <option key={t.id} value={t.code}>
                      {t.name} (₹{t.rate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Quantity / Sessions</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] font-mono"
                  />
                </div>
              </div>

              {/* Total Summary */}
              {(() => {
                const tar = tariffs.find((t) => t.code === selectedTariffCode);
                const sub = (tar?.rate || 0) * quantity;
                const total = Math.max(0, sub - discount);
                return (
                  <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E5DF] space-y-1">
                    <div className="flex justify-between text-xs text-[#6B7280]">
                      <span>Subtotal:</span>
                      <span className="font-mono tabular-nums">₹{sub.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-xs text-amber-700">
                        <span>Discount:</span>
                        <span className="font-mono tabular-nums">-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-[#1B4332] pt-1 border-t border-[#E5E5DF]">
                      <span>Total Invoice Due:</span>
                      <span className="font-mono tabular-nums">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 border border-[#E5E5DF] text-[#4B5563] hover:bg-[#FAF9F5] rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg shadow-xs"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Collect / Record Payment */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#E5E5DF] shadow-xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DF]">
              <div>
                <h3 className="text-sm font-bold text-[#1B4332]">Record Clinical Payment</h3>
                <span className="text-[11px] text-[#6B7280]">
                  Invoice: {paymentModalInvoice.invoiceNumber} · {paymentModalInvoice.patientName}
                </span>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max={paymentModalInvoice.totalAmount - paymentModalInvoice.paidAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] font-mono text-base font-bold text-[#1B4332]"
                />
                <span className="text-[10px] text-[#6B7280]">
                  Remaining balance due: ₹
                  {(paymentModalInvoice.totalAmount - paymentModalInvoice.paidAmount).toLocaleString()}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-semibold text-[#111827]"
                >
                  <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                  <option value="Card">Credit / Debit POS Card Swipe</option>
                  <option value="Cash">Cash at Reception Desk</option>
                  <option value="NetBanking">NetBanking / NEFT / IMPS</option>
                  <option value="Insurance">Insurance / Corporate TPA Claim</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 border border-[#E5E5DF] text-[#4B5563] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg shadow-xs"
                >
                  Confirm & Update Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Printable Receipt */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#E5E5DF] shadow-2xl max-w-lg w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between no-print">
              <span className="text-xs font-semibold text-[#6B7280]">Official Medical Receipt</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B4332] rounded-lg hover:bg-[#2D6A4F] flex items-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="p-1 text-[#6B7280] hover:text-[#111827]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper */}
            <div className="p-6 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl space-y-4 text-xs font-sans">
              <div className="text-center border-b border-[#E5E5DF] pb-3">
                <h2 className="text-base font-extrabold text-[#1B4332]">MOVEXA Physiotherapy</h2>
                <p className="text-[10px] text-[#4B5563]">
                  Clinical Intelligence · Personalised Rehabilitation · Measurable Recovery
                </p>
                <p className="text-[10px] text-[#6B7280]">
                  Clinic Director: Dr. Priyanka Singh, MPT (MSK & Sports) · Reg #MPT-28492
                </p>
              </div>

              <div className="flex justify-between text-xs">
                <div>
                  <span className="text-[#6B7280] block text-[10px]">Patient Name</span>
                  <span className="font-bold text-[#111827]">{selectedInvoiceForPrint.patientName}</span>
                  <span className="text-[10px] text-[#6B7280] block">UHID: {selectedInvoiceForPrint.uhid}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#6B7280] block text-[10px]">Receipt Number</span>
                  <span className="font-mono font-bold text-[#1B4332]">{selectedInvoiceForPrint.invoiceNumber}</span>
                  <span className="text-[10px] text-[#6B7280] block">Date: {selectedInvoiceForPrint.date}</span>
                </div>
              </div>

              <div className="border-t border-b border-[#E5E5DF] py-2 space-y-1">
                {selectedInvoiceForPrint.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {it.description} ({it.quantity}x)
                    </span>
                    <span className="font-mono tabular-nums font-semibold">
                      ₹{it.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right">
                <div className="flex justify-between font-bold text-sm text-[#1B4332] pt-1">
                  <span>Total Amount:</span>
                  <span className="font-mono tabular-nums">
                    ₹{selectedInvoiceForPrint.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-emerald-800">
                  <span>Amount Paid:</span>
                  <span className="font-mono tabular-nums font-bold">
                    ₹{selectedInvoiceForPrint.paidAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>Payment Method:</span>
                  <span>{selectedInvoiceForPrint.paymentMethod || 'UPI / Card'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E5DF] text-center text-[10px] text-[#6B7280]">
                Thank you for choosing MOVEXA Care for your rehabilitation.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
