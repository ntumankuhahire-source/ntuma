import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import type { Order, OrderItem } from '@/lib/sheetsApi';
import { CATEGORIES, QUICK_LIST_CATEGORY } from '@/lib/categories';

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

function formatQty(item: OrderItem): string {
  const isQuickList = item.isCustom || item.category === QUICK_LIST_CATEGORY || item.category === 'Quick List';
  const unit = (item.unit || '').trim();

  if (isQuickList) {
    if (unit && unit !== '—' && unit !== '-') {
      return unit;
    }
    return `${item.qty || 1}`;
  }

  if (!unit || unit === '—' || unit === '-') {
    return `${item.qty}`;
  }

  if (/^\d/.test(unit) && item.qty === 1) {
    return unit;
  }

  return `${item.qty} ${unit}`;
}

/**
 * Generate and download a single-sheet Excel invoice (.xlsx) for an order.
 */
export function downloadOrderInvoiceExcel(order: Order): void {
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-RW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pMode = order.modeOfPayment || 'Cash';

  const rows: (string | number)[][] = [
    ['NTUMA PREMIUM COURIER SERVICE'],
    ['Owner Contact: +250 787 800 703', '', 'Email: info@ntumankuhahire.com', '', 'Kigali, Rwanda'],
    [],
    ['INVOICE SUMMARY'],
    ['Invoice Number:', order.id],
    ['Date:', dateStr],
    [],
    ['BILLED TO'],
    ['Customer Name:', order.customerName],
    ['Phone Number:', order.customerPhone],
    ['Delivery Location:', order.location],
    ['Mode of Payment:', pMode],
    ['Status:', order.status],
    [],
    ['ITEMS ORDERED'],
    ['Category', 'Product / Description', 'Quantity', 'Unit Price (RWF)', 'Subtotal (RWF)'],
  ];

  order.items.forEach((item) => {
    const isQuickList = item.isCustom || item.category === QUICK_LIST_CATEGORY || item.category === 'Quick List';
    const catName = isQuickList ? 'Quick List' : (CATEGORIES.find((c) => c.id === item.category)?.name ?? item.category);
    const qtyText = formatQty(item);

    if (isQuickList) {
      rows.push([catName, item.productName, qtyText, 'Ask price', '—']);
    } else {
      rows.push([catName, item.productName, qtyText, item.price, item.subtotal]);
    }
  });

  rows.push([]);
  rows.push(['', '', '', 'Subtotal:', `${order.total.toLocaleString()} RWF`]);
  rows.push(['', '', '', 'Delivery Fee:', 'To be confirmed']);
  rows.push(['', '', '', 'GRAND TOTAL:', `${order.total.toLocaleString()} RWF`]);

  if (order.budget > 0) {
    rows.push(['', '', '', 'Customer Budget:', `${order.budget.toLocaleString()} RWF`]);
  }

  rows.push([]);
  rows.push(['Thank you for choosing Ntuma! Final amounts will be confirmed by your runner on WhatsApp.']);

  // Create single worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 22 },
    { wch: 36 },
    { wch: 18 },
    { wch: 20 },
    { wch: 22 },
  ];

  // Create single workbook & append sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice');

  // Download .xlsx
  XLSX.writeFile(wb, `Ntuma_Order_${order.id}.xlsx`);
}

/**
 * Generate and download a branded PDF invoice for an admin order.
 * Supports multi-page pagination when orders have many items.
 */
export async function downloadOrderInvoice(order: Order): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();   // 210
  const pageH = doc.internal.pageSize.getHeight();  // 297
  const margin = 18;
  const contentW = pageW - margin * 2;
  const maxContentY = pageH - 28; // leaves space for footer

  // ── Color palette ─────────────────────────────────────────────────────────
  const emerald   = [4,  120, 87]  as [number, number, number]; // #047857
  const yellow    = [250, 204, 21] as [number, number, number]; // #FACC15
  const blackText = [10,  10,  10] as [number, number, number]; // #0A0A0A
  const slateText = [100, 116, 139]as [number, number, number]; // slate-500
  const slateRule = [226, 232, 240]as [number, number, number]; // slate-200

  // ── Helper: horizontal rule ────────────────────────────────────────────────
  const hRule = (yPos: number, color = slateRule, thickness = 0.3) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(thickness);
    doc.line(margin, yPos, pageW - margin, yPos);
  };

  // ── Helper: safe text ─────────────────────────────────────────────────────
  const txt = (
    text: string,
    x: number,
    yPos: number,
    options?: Parameters<typeof doc.text>[3]
  ) => {
    doc.text(text, x, yPos, options);
  };

  const colX = {
    cat:     margin + 2,
    product: margin + 38,
    qty:     margin + 105,
    price:   margin + 130,
    subtotal:pageW - margin - 2,
  };

  const logoBase64 = await getLogoBase64();

  // Helper to draw items table header
  const drawTableHeader = (startY: number) => {
    doc.setFillColor(...emerald);
    doc.rect(margin, startY, contentW, 8, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    txt('CATEGORY',  colX.cat,      startY + 5.5);
    txt('PRODUCT',   colX.product,  startY + 5.5);
    txt('QTY',       colX.qty,      startY + 5.5, { align: 'center' });
    txt('UNIT PRICE',colX.price,    startY + 5.5, { align: 'right' });
    txt('SUBTOTAL',  colX.subtotal, startY + 5.5, { align: 'right' });
  };

  // Helper to draw continuation header on page 2+
  const drawContinuationHeader = (includeTableHeader = true): number => {
    let topY = 12;

    // Mini brand header
    if (logoBase64) {
      try {
        doc.setFillColor(...yellow);
        doc.roundedRect(margin, topY, 10, 10, 1.5, 1.5, 'F');
        doc.addImage(logoBase64, 'PNG', margin + 0.5, topY + 0.5, 9, 9);
      } catch {
        doc.setFillColor(...yellow);
        doc.roundedRect(margin, topY, 10, 10, 1.5, 1.5, 'F');
      }
    } else {
      doc.setFillColor(...yellow);
      doc.roundedRect(margin, topY, 10, 10, 1.5, 1.5, 'F');
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...emerald);
    txt('NTUMA', margin + 14, topY + 7);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateText);
    txt(`INVOICE: ${order.id} (Continued)`, pageW - margin, topY + 7, { align: 'right' });

    topY += 14;
    hRule(topY, emerald, 0.8);
    topY += 4;

    if (includeTableHeader) {
      drawTableHeader(topY);
      topY += 8;
    }

    return topY;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1: HEADER & BILL TO
  // ══════════════════════════════════════════════════════════════════════════
  if (logoBase64) {
    try {
      doc.setFillColor(...yellow);
      doc.roundedRect(margin, 10, 18, 18, 2, 2, 'F');
      doc.addImage(logoBase64, 'PNG', margin + 1, 11, 16, 16);
    } catch {
      doc.setFillColor(...yellow);
      doc.roundedRect(margin, 10, 18, 18, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...emerald);
      txt('N', margin + 9, 22, { align: 'center' });
    }
  } else {
    doc.setFillColor(...yellow);
    doc.roundedRect(margin, 10, 18, 18, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...emerald);
    txt('N', margin + 9, 22, { align: 'center' });
  }

  // Brand name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  txt('NTUMA', margin + 22, 19);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateText);
  txt('PREMIUM COURIER SERVICE', margin + 22, 23.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  txt('Owner Contact: +250 787 800 703', margin + 22, 27.5);
  txt('Email: info@ntumankuhahire.com  •  Kigali, Rwanda', margin + 22, 31.5);

  // Invoice label (right-aligned)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...yellow);
  txt('INVOICE', pageW - margin, 17, { align: 'right' });

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  txt(order.id, pageW - margin, 25, { align: 'right' });

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-RW', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  txt(dateStr, pageW - margin, 31, { align: 'right' });

  let y = 38;
  // Thick emerald underline
  doc.setDrawColor(...emerald);
  doc.setLineWidth(1.2);
  doc.line(margin, y, pageW - margin, y);

  // ══════════════════════════════════════════════════════════════════════════
  // BILL TO
  // ══════════════════════════════════════════════════════════════════════════
  y += 8;
  // Yellow left-border accent block
  doc.setFillColor(254, 252, 232); // yellow-50
  doc.roundedRect(margin, y, contentW, 28, 2, 2, 'F');
  doc.setFillColor(...yellow);
  doc.rect(margin, y, 3, 28, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  txt('BILLED TO', margin + 6, y + 6);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blackText);
  txt(order.customerName, margin + 6, y + 13);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  txt(order.location, margin + 6, y + 19);
  txt(order.customerPhone, margin + 6, y + 24);

  // Status badge (top-right corner of bill-to block)
  const statusColors: Record<string, [number, number, number][]> = {
    Pending:   [[254, 243, 199], [180, 130, 0]],
    Confirmed: [[219, 234, 254], [29, 78, 216]],
    Delivered: [[209, 250, 229], [4, 120, 87]],
    Cancelled: [[254, 226, 226], [185, 28, 28]],
  };
  const [bgCol, fgCol] = statusColors[order.status] ?? [[226,232,240],[100,116,139]];
  doc.setFillColor(...bgCol);
  doc.roundedRect(pageW - margin - 30, y + 5, 30, 7, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...fgCol);
  txt(order.status.toUpperCase(), pageW - margin - 15, y + 9.8, { align: 'center' });

  // Mode of payment indicator
  const pMode = (order.modeOfPayment || 'Cash').toUpperCase();
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateText);
  txt(`PAYMENT: ${pMode}`, pageW - margin - 3, y + 21, { align: 'right' });

  y += 36;

  // ══════════════════════════════════════════════════════════════════════════
  // ITEMS TABLE
  // ══════════════════════════════════════════════════════════════════════════
  drawTableHeader(y);
  y += 8;

  // ── Rows ──────────────────────────────────────────────────────────────────
  order.items.forEach((item, idx) => {
    const rowH = 9;

    // Check if row would overflow page
    if (y + rowH > maxContentY) {
      doc.addPage();
      y = drawContinuationHeader(true);
    }

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(margin, y, contentW, rowH, 'F');
    }

    const isQuickList = item.isCustom || item.category === QUICK_LIST_CATEGORY || item.category === 'Quick List';
    const catName = isQuickList ? 'Quick List' : (CATEGORIES.find(c => c.id === item.category)?.name ?? item.category);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...blackText);

    // Category — truncate if too long
    const catLabel = catName.length > 15 ? catName.slice(0, 13) + '…' : catName;
    txt(catLabel, colX.cat, y + 6);

    // Product name — truncate
    const productLabel = item.productName.length > 26 ? item.productName.slice(0, 24) + '…' : item.productName;
    txt(productLabel, colX.product, y + 6);

    // Qty + unit formatted properly
    const qtyText = formatQty(item);
    txt(qtyText, colX.qty, y + 6, { align: 'center' });

    if (isQuickList) {
      // Ask price items — show placeholder text
      doc.setTextColor(...slateText);
      txt('Ask price', colX.price, y + 6, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...blackText);
      txt('—', colX.subtotal, y + 6, { align: 'right' });
    } else {
      // Unit price
      doc.setTextColor(...slateText);
      txt(`${item.price.toLocaleString()} RWF`, colX.price, y + 6, { align: 'right' });

      // Subtotal
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...blackText);
      txt(`${item.subtotal.toLocaleString()} RWF`, colX.subtotal, y + 6, { align: 'right' });
    }

    y += rowH;
    hRule(y, slateRule, 0.2);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TOTALS
  // ══════════════════════════════════════════════════════════════════════════
  const totalsNeeded = order.budget > 0 ? 46 : 36;
  if (y + totalsNeeded > maxContentY) {
    doc.addPage();
    y = drawContinuationHeader(false);
  }

  y += 6;
  const totalsX = pageW - margin - 80;
  const totalsW = 80;

  // Subtotal row
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  txt('Subtotal', totalsX, y);
  doc.setTextColor(...blackText);
  txt(`${order.total.toLocaleString()} RWF`, pageW - margin, y, { align: 'right' });
  y += 6;
  hRule(y, slateRule);

  // Delivery fee row
  y += 5;
  doc.setTextColor(...slateText);
  txt('Delivery Fee', totalsX, y);
  txt('To be confirmed', pageW - margin, y, { align: 'right' });
  y += 6;
  hRule(y, slateRule);

  // Grand total — yellow block
  y += 4;
  doc.setFillColor(...yellow);
  doc.roundedRect(totalsX - 4, y - 1, totalsW + 4, 10, 2, 2, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blackText);
  txt('TOTAL', totalsX, y + 6.5);
  txt(`${order.total.toLocaleString()} RWF`, pageW - margin, y + 6.5, { align: 'right' });

  // Budget note
  if (order.budget > 0) {
    y += 16;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...slateText);
    txt(`Customer budget: ${order.budget.toLocaleString()} RWF`, margin, y);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FOOTER (Rendered on all pages)
  // ══════════════════════════════════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const footerY = pageH - 18;
    hRule(footerY - 4, slateRule, 0.3);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...emerald);
    txt('Thank you for choosing Ntuma!', pageW / 2, footerY, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateText);
    txt('Final amounts will be confirmed by your runner on WhatsApp.', pageW / 2, footerY + 4.5, { align: 'center' });
    txt('Owner Contact: +250 787 800 703  |  info@ntumankuhahire.com', pageW / 2, footerY + 8.5, { align: 'center' });

    if (totalPages > 1) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...slateText);
      txt(`Page ${p} of ${totalPages}`, pageW - margin, footerY + 8.5, { align: 'right' });
    }
  }

  // Save PDF
  doc.save(`Ntuma_Order_${order.id}.pdf`);
}
