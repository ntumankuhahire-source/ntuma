'use client';

import React from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  priceType: 'fixed' | 'variable' | 'other' | 'custom';
}

interface InvoiceProps {
  orderId: string;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
  };
  items: InvoiceItem[];
  fixedTotal: number;
}

export const generateInvoicePDF = async (elementId: string, orderId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const originalDisplay = element.style.display;
  element.style.display = 'block';

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Ntuma_Invoice_${orderId}.pdf`);
  } finally {
    element.style.display = originalDisplay;
  }
};

export default function InvoiceTemplate({ orderId, customerDetails, items, fixedTotal }: InvoiceProps) {
  const date = new Date().toLocaleDateString('en-RW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      id="invoice-template" 
      className="bg-white p-12 mx-auto" 
      style={{ 
        width: '800px', 
        display: 'none', 
        position: 'absolute', 
        left: '-9999px',
        color: '#0A0A0A',
        fontFamily: 'sans-serif'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start pb-8 mb-8 border-b-[3px] border-emerald-700">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 bg-[#FACC15] flex items-center justify-center rounded-xl p-1 shrink-0 overflow-hidden shadow-sm">
            <img 
              src="/logo.png" 
              alt="Ntuma Logo" 
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-0.5 text-emerald-900">
              NTUMA
            </h1>
            <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">Premium Courier Service</p>
            <div className="text-slate-600 text-xs space-y-0.5 font-medium">
              <p><strong className="text-emerald-900">Owner Contact:</strong> +250 787 800 703</p>
              <p><strong className="text-emerald-900">Email:</strong> info@ntumankuhahire.com</p>
              <p><strong className="text-emerald-900">Address:</strong> Kigali, Rwanda</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#FACC15] mb-2">Invoice</h2>
          <p className="font-mono text-2xl font-black text-emerald-900">{orderId}</p>
          <p className="text-slate-500 text-sm font-medium mt-1">{date}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-12 bg-emerald-50/50 p-6 border-l-4 border-[#FACC15] rounded-r-xl">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">Billed To</h3>
        <p className="font-bold text-xl text-emerald-900 mb-1">{customerDetails.name}</p>
        <p className="text-slate-600 font-medium">{customerDetails.address}</p>
        <p className="text-slate-600 font-medium">{customerDetails.phone}</p>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12 border-collapse">
        <thead>
          <tr className="border-b-2 border-emerald-700">
            <th className="py-4 text-left text-xs font-bold uppercase tracking-widest text-emerald-900">Description</th>
            <th className="py-4 text-center text-xs font-bold uppercase tracking-widest text-emerald-900">Qty</th>
            <th className="py-4 text-right text-xs font-bold uppercase tracking-widest text-emerald-900">Price</th>
            <th className="py-4 text-right text-xs font-bold uppercase tracking-widest text-emerald-900">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-slate-100 last:border-b-0">
              <td className="py-5 text-sm font-bold text-emerald-950">{item.name}</td>
              <td className="py-5 text-sm text-center font-medium text-slate-600">{item.quantity} {item.unit}</td>
              <td className="py-5 text-sm text-right font-medium text-slate-600">
                {item.priceType === 'fixed' ? `${item.price.toLocaleString()} RWF` : 'TBD'}
              </td>
              <td className="py-5 text-sm text-right font-bold text-emerald-950">
                {item.priceType === 'fixed' ? `${(item.price * item.quantity).toLocaleString()} RWF` : 'TBD'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-[300px]">
          <div className="flex justify-between py-3 text-sm font-medium text-slate-600 border-b border-slate-100">
            <span>Subtotal</span>
            <span>{fixedTotal.toLocaleString()} RWF</span>
          </div>
          <div className="flex justify-between py-3 text-sm font-medium text-slate-600 border-b border-slate-100">
            <span>Delivery Fee</span>
            <span>TBD</span>
          </div>
          <div className="flex justify-between py-4 text-xl font-black text-emerald-900 bg-[#FACC15] px-4 mt-4 rounded-xl shadow-sm">
            <span>TOTAL</span>
            <span>{fixedTotal.toLocaleString()} RWF</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-slate-200">
        <p className="font-bold text-sm text-emerald-700">Thank you for choosing Ntuma!</p>
        <p className="text-xs font-medium text-slate-500 mt-1">Final amounts will be confirmed by your runner on WhatsApp.</p>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">
          Ntuma Courier Service • Phone: +250 787 800 703 • Email: info@ntumankuhahire.com
        </p>
      </div>
    </div>
  );
}
