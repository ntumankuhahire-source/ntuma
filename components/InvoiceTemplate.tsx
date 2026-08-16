'use client';

import React from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';

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
  modeOfPayment?: string;
}

async function getLogoBase64(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(null);
        }
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = '/logo.png';
  });
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
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Ntuma_Invoice_${orderId}.pdf`);
  } finally {
    element.style.display = originalDisplay;
  }
};

export const generateInvoiceExcel = async (
  orderId: string,
  customerDetails: { name: string; phone: string; address: string },
  items: InvoiceItem[],
  fixedTotal: number,
  modeOfPayment?: string
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Ntuma Courier Service';
  workbook.lastModifiedBy = 'Ntuma Customer';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Invoice', {
    views: [{ showGridLines: true }]
  });

  worksheet.columns = [
    { key: 'description', width: 38 },
    { key: 'quantity', width: 18 },
    { key: 'price', width: 22 },
    { key: 'amount', width: 24 },
  ];

  worksheet.getRow(1).height = 24;
  worksheet.getRow(2).height = 24;
  worksheet.getRow(3).height = 24;

  const logoBase64 = await getLogoBase64();
  if (logoBase64) {
    try {
      const imageId = workbook.addImage({
        base64: logoBase64,
        extension: 'png',
      });
      worksheet.addImage(imageId, {
        tl: { col: 0.1, row: 0.1 },
        ext: { width: 56, height: 56 },
      });
    } catch (e) {
      console.error('Error adding logo to Excel workbook:', e);
    }
  }

  const titleCell = worksheet.getCell('B1');
  titleCell.value = 'NTUMA';
  titleCell.font = { name: 'Segoe UI', size: 20, bold: true, color: { argb: 'FF047857' } };

  const subtitleCell = worksheet.getCell('B2');
  subtitleCell.value = 'PREMIUM COURIER SERVICE';
  subtitleCell.font = { name: 'Segoe UI', size: 8.5, bold: true, color: { argb: 'FF64748B' } };

  const contactCell = worksheet.getCell('B3');
  contactCell.value = 'Owner Contact: +250 787 800 703  |  info@ntumankuhahire.com  |  Kigali, Rwanda';
  contactCell.font = { name: 'Segoe UI', size: 8.5, color: { argb: 'FF64748B' } };

  const invoiceLabelCell = worksheet.getCell('D1');
  invoiceLabelCell.value = 'INVOICE';
  invoiceLabelCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFD97706' } };
  invoiceLabelCell.alignment = { horizontal: 'right' };

  const invoiceIdCell = worksheet.getCell('D2');
  invoiceIdCell.value = orderId;
  invoiceIdCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF047857' } };
  invoiceIdCell.alignment = { horizontal: 'right' };

  const dateStr = new Date().toLocaleDateString('en-RW', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const dateCell = worksheet.getCell('D3');
  dateCell.value = dateStr;
  dateCell.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF64748B' } };
  dateCell.alignment = { horizontal: 'right' };

  // Row 4: Divider
  worksheet.getRow(4).height = 6;
  for (let col = 1; col <= 4; col++) {
    const cell = worksheet.getCell(4, col);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } };
  }

  // Row 5: Spacing
  worksheet.getRow(5).height = 10;

  // Billed To Block
  worksheet.getRow(6).height = 20;
  worksheet.mergeCells('A6:D6');
  const billedToHeader = worksheet.getCell('A6');
  billedToHeader.value = 'BILLED TO';
  billedToHeader.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF047857' } };
  billedToHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEFCE8' } };
  billedToHeader.alignment = { vertical: 'middle', indent: 1 };

  worksheet.getRow(7).height = 24;
  worksheet.getCell('A7').value = customerDetails.name;
  worksheet.getCell('A7').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF0F172A' } };

  worksheet.getRow(8).height = 18;
  worksheet.getCell('A8').value = `Location: ${customerDetails.address}`;
  worksheet.getCell('A8').font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF475569' } };

  worksheet.getRow(9).height = 18;
  worksheet.getCell('A9').value = `Phone: ${customerDetails.phone}`;
  worksheet.getCell('A9').font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF475569' } };

  worksheet.getRow(10).height = 20;
  const pMode = modeOfPayment || 'Cash';
  worksheet.getCell('A10').value = `Payment Mode: ${pMode}`;
  worksheet.getCell('A10').font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF047857' } };

  // Row 11: Spacing
  worksheet.getRow(11).height = 12;

  // Table Header
  worksheet.getRow(12).height = 26;
  const headers = ['DESCRIPTION', 'QUANTITY', 'PRICE', 'AMOUNT'];
  headers.forEach((h, idx) => {
    const cell = worksheet.getCell(12, idx + 1);
    cell.value = h;
    cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } };
    cell.alignment = {
      vertical: 'middle',
      horizontal: idx === 1 ? 'center' : idx >= 2 ? 'right' : 'left',
    };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF047857' } },
      bottom: { style: 'medium', color: { argb: 'FF047857' } },
    };
  });

  // Table rows
  let currRow = 13;
  items.forEach((item, idx) => {
    worksheet.getRow(currRow).height = 22;
    const isCustom = item.priceType === 'custom' || (item as any).isCustom;
    const unit = (item.unit || '').trim();
    const qtyText = isCustom
      ? (unit && unit !== '—' && unit !== '-' ? unit : `${item.quantity || 1}`)
      : (unit && unit !== '—' && unit !== '-' ? (/^\d/.test(unit) && item.quantity === 1 ? unit : `${item.quantity} ${unit}`) : `${item.quantity}`);

    const isEven = idx % 2 === 0;
    const bgFill = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

    const cellDesc = worksheet.getCell(currRow, 1);
    cellDesc.value = item.name;
    cellDesc.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };

    const cellQty = worksheet.getCell(currRow, 2);
    cellQty.value = qtyText;
    cellQty.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF334155' } };
    cellQty.alignment = { horizontal: 'center' };

    const cellPrice = worksheet.getCell(currRow, 3);
    const cellAmt = worksheet.getCell(currRow, 4);

    if (item.priceType === 'fixed') {
      cellPrice.value = `${item.price.toLocaleString()} RWF`;
      cellAmt.value = `${(item.price * item.quantity).toLocaleString()} RWF`;
    } else {
      cellPrice.value = 'TBD';
      cellAmt.value = 'TBD';
    }

    cellPrice.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF475569' } };
    cellPrice.alignment = { horizontal: 'right' };

    cellAmt.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    cellAmt.alignment = { horizontal: 'right' };

    for (let col = 1; col <= 4; col++) {
      const c = worksheet.getCell(currRow, col);
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgFill } };
      c.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    }

    currRow++;
  });

  // Totals
  currRow += 1;
  worksheet.getRow(currRow).height = 20;
  worksheet.getCell(currRow, 3).value = 'Subtotal';
  worksheet.getCell(currRow, 3).font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF64748B' } };
  worksheet.getCell(currRow, 4).value = `${fixedTotal.toLocaleString()} RWF`;
  worksheet.getCell(currRow, 4).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  worksheet.getCell(currRow, 4).alignment = { horizontal: 'right' };

  currRow++;
  worksheet.getRow(currRow).height = 20;
  worksheet.getCell(currRow, 3).value = 'Delivery Fee';
  worksheet.getCell(currRow, 3).font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF64748B' } };
  worksheet.getCell(currRow, 4).value = 'TBD';
  worksheet.getCell(currRow, 4).font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF64748B' } };
  worksheet.getCell(currRow, 4).alignment = { horizontal: 'right' };

  currRow++;
  worksheet.getRow(currRow).height = 28;
  const grandTotalLabel = worksheet.getCell(currRow, 3);
  grandTotalLabel.value = 'TOTAL';
  grandTotalLabel.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF0F172A' } };
  grandTotalLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFACC15' } };
  grandTotalLabel.alignment = { vertical: 'middle', indent: 1 };

  const grandTotalVal = worksheet.getCell(currRow, 4);
  grandTotalVal.value = `${fixedTotal.toLocaleString()} RWF`;
  grandTotalVal.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF047857' } };
  grandTotalVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFACC15' } };
  grandTotalVal.alignment = { vertical: 'middle', horizontal: 'right' };

  // Footer Message
  currRow += 2;
  worksheet.getRow(currRow).height = 22;
  worksheet.mergeCells(`A${currRow}:D${currRow}`);
  const footer1 = worksheet.getCell(`A${currRow}`);
  footer1.value = 'Thank you for choosing Ntuma!';
  footer1.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF047857' } };
  footer1.alignment = { horizontal: 'center' };

  currRow++;
  worksheet.getRow(currRow).height = 18;
  worksheet.mergeCells(`A${currRow}:D${currRow}`);
  const footer2 = worksheet.getCell(`A${currRow}`);
  footer2.value = 'Final amounts will be confirmed by your runner on WhatsApp.';
  footer2.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF64748B' } };
  footer2.alignment = { horizontal: 'center' };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ntuma_Invoice_${orderId}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function InvoiceTemplate({ orderId, customerDetails, items, fixedTotal, modeOfPayment }: InvoiceProps) {
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
      <div className="mb-12 bg-emerald-50/50 p-6 border-l-4 border-[#FACC15] rounded-r-xl flex justify-between items-start">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">Billed To</h3>
          <p className="font-bold text-xl text-emerald-900 mb-1">{customerDetails.name}</p>
          <p className="text-slate-600 font-medium">{customerDetails.address}</p>
          <p className="text-slate-600 font-medium">{customerDetails.phone}</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-[#FACC15]/30 text-emerald-900 border border-[#FACC15] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            Payment: {modeOfPayment || 'Cash'}
          </span>
        </div>
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
          {items.map((item, index) => {
            const isCustom = item.priceType === 'custom' || (item as any).isCustom;
            const unit = (item.unit || '').trim();
            const qtyText = isCustom
              ? (unit && unit !== '—' && unit !== '-' ? unit : `${item.quantity || 1}`)
              : (unit && unit !== '—' && unit !== '-' ? (/^\d/.test(unit) && item.quantity === 1 ? unit : `${item.quantity} ${unit}`) : `${item.quantity}`);

            return (
              <tr key={index} className="border-b border-slate-100 last:border-b-0">
                <td className="py-5 text-sm font-bold text-emerald-950">{item.name}</td>
                <td className="py-5 text-sm text-center font-medium text-slate-600">{qtyText}</td>
                <td className="py-5 text-sm text-right font-medium text-slate-600">
                  {item.priceType === 'fixed' ? `${item.price.toLocaleString()} RWF` : 'TBD'}
                </td>
                <td className="py-5 text-sm text-right font-bold text-emerald-950">
                  {item.priceType === 'fixed' ? `${(item.price * item.quantity).toLocaleString()} RWF` : 'TBD'}
                </td>
              </tr>
            );
          })}
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
