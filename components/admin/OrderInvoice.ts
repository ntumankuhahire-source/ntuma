import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';
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
 * Generate and download a beautifully styled single-sheet Excel invoice (.xlsx) with Ntuma branding and logo.
 */
export async function downloadOrderInvoiceExcel(order: Order): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Ntuma Courier Service';
  workbook.lastModifiedBy = 'Ntuma Admin';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Invoice', {
    views: [{ showGridLines: true }]
  });

  // Define Column widths
  worksheet.columns = [
    { key: 'category', width: 24 },
    { key: 'product', width: 38 },
    { key: 'quantity', width: 18 },
    { key: 'price', width: 22 },
    { key: 'subtotal', width: 24 },
  ];

  // Row Heights for Header
  worksheet.getRow(1).height = 24;
  worksheet.getRow(2).height = 24;
  worksheet.getRow(3).height = 24;

  // Embed Logo Image if available
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
      console.error('Error adding logo image to Excel workbook:', e);
    }
  }

  // Header Title & Contact (Col B & C)
  const titleCell = worksheet.getCell('B1');
  titleCell.value = 'NTUMA';
  titleCell.font = { name: 'Segoe UI', size: 20, bold: true, color: { argb: 'FF047857' } };

  const subtitleCell = worksheet.getCell('B2');
  subtitleCell.value = 'PREMIUM COURIER SERVICE';
  subtitleCell.font = { name: 'Segoe UI', size: 8.5, bold: true, color: { argb: 'FF64748B' } };

  const contactCell = worksheet.getCell('B3');
  contactCell.value = 'Owner Contact: +250 787 800 703  |  info@ntumankuhahire.com  |  Kigali, Rwanda';
  contactCell.font = { name: 'Segoe UI', size: 8.5, color: { argb: 'FF64748B' } };

  // Invoice Number & Date (Right aligned on Col E)
  const invoiceLabelCell = worksheet.getCell('E1');
  invoiceLabelCell.value = 'INVOICE';
  invoiceLabelCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFD97706' } };
  invoiceLabelCell.alignment = { horizontal: 'right' };

  const invoiceIdCell = worksheet.getCell('E2');
  invoiceIdCell.value = order.id;
  invoiceIdCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF047857' } };
  invoiceIdCell.alignment = { horizontal: 'right' };

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-RW', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const dateCell = worksheet.getCell('E3');
  dateCell.value = dateStr;
  dateCell.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF64748B' } };
  dateCell.alignment = { horizontal: 'right' };

  // Row 4: Emerald Accent Divider
  worksheet.getRow(4).height = 6;
  for (let col = 1; col <= 5; col++) {
    const cell = worksheet.getCell(4, col);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } };
  }

  // Row 5: Spacing
  worksheet.getRow(5).height = 10;

  // Row 6-10: Billed To Block
  worksheet.getRow(6).height = 20;
  worksheet.mergeCells('A6:E6');
  const billedToHeader = worksheet.getCell('A6');
  billedToHeader.value = 'BILLED TO';
  billedToHeader.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF047857' } };
  billedToHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEFCE8' } };
  billedToHeader.alignment = { vertical: 'middle', indent: 1 };

  worksheet.getRow(7).height = 24;
  worksheet.getCell('A7').value = order.customerName;
  worksheet.getCell('A7').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF0F172A' } };

  worksheet.getRow(8).height = 18;
  worksheet.getCell('A8').value = `Location: ${order.location}`;
  worksheet.getCell('A8').font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF475569' } };

  worksheet.getRow(9).height = 18;
  worksheet.getCell('A9').value = `Phone: ${order.customerPhone}`;
  worksheet.getCell('A9').font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF475569' } };

  worksheet.getRow(10).height = 20;
  const pMode = order.modeOfPayment || 'Cash';
  worksheet.getCell('A10').value = `Payment Mode: ${pMode}  •  Status: ${order.status.toUpperCase()}`;
  worksheet.getCell('A10').font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF047857' } };

  // Row 11: Spacing
  worksheet.getRow(11).height = 12;

  // Row 12: Table Header
  worksheet.getRow(12).height = 26;
  const headers = ['CATEGORY', 'PRODUCT / DESCRIPTION', 'QUANTITY', 'UNIT PRICE', 'SUBTOTAL'];
  headers.forEach((h, idx) => {
    const cell = worksheet.getCell(12, idx + 1);
    cell.value = h;
    cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } };
    cell.alignment = {
      vertical: 'middle',
      horizontal: idx === 2 ? 'center' : idx >= 3 ? 'right' : 'left',
    };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF047857' } },
      bottom: { style: 'medium', color: { argb: 'FF047857' } },
    };
  });

  // Table rows
  let currRow = 13;
  order.items.forEach((item, idx) => {
    worksheet.getRow(currRow).height = 22;
    const isQuickList = item.isCustom || item.category === QUICK_LIST_CATEGORY || item.category === 'Quick List';
    const catName = isQuickList ? 'Quick List' : (CATEGORIES.find((c) => c.id === item.category)?.name ?? item.category);
    const qtyText = formatQty(item);

    const isEven = idx % 2 === 0;
    const bgFill = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

    const cellCat = worksheet.getCell(currRow, 1);
    cellCat.value = catName;
    cellCat.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF334155' } };

    const cellProd = worksheet.getCell(currRow, 2);
    cellProd.value = item.productName;
    cellProd.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };

    const cellQty = worksheet.getCell(currRow, 3);
    cellQty.value = qtyText;
    cellQty.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF334155' } };
    cellQty.alignment = { horizontal: 'center' };

    const cellPrice = worksheet.getCell(currRow, 4);
    const cellSubtotal = worksheet.getCell(currRow, 5);

    if (isQuickList) {
      cellPrice.value = 'Ask price';
      cellPrice.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF64748B' } };
      cellSubtotal.value = '—';
      cellSubtotal.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF64748B' } };
    } else {
      cellPrice.value = `${item.price.toLocaleString()} RWF`;
      cellPrice.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF475569' } };
      cellSubtotal.value = `${item.subtotal.toLocaleString()} RWF`;
      cellSubtotal.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    }

    cellPrice.alignment = { horizontal: 'right' };
    cellSubtotal.alignment = { horizontal: 'right' };

    for (let col = 1; col <= 5; col++) {
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

  // Totals Section
  currRow += 1;
  worksheet.getRow(currRow).height = 20;
  worksheet.getCell(currRow, 4).value = 'Subtotal';
  worksheet.getCell(currRow, 4).font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF64748B' } };
  worksheet.getCell(currRow, 5).value = `${order.total.toLocaleString()} RWF`;
  worksheet.getCell(currRow, 5).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  worksheet.getCell(currRow, 5).alignment = { horizontal: 'right' };

  currRow++;
  worksheet.getRow(currRow).height = 20;
  worksheet.getCell(currRow, 4).value = 'Delivery Fee';
  worksheet.getCell(currRow, 4).font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF64748B' } };
  worksheet.getCell(currRow, 5).value = 'To be confirmed';
  worksheet.getCell(currRow, 5).font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF64748B' } };
  worksheet.getCell(currRow, 5).alignment = { horizontal: 'right' };

  // Grand Total Box
  currRow++;
  worksheet.getRow(currRow).height = 28;
  const grandTotalLabel = worksheet.getCell(currRow, 4);
  grandTotalLabel.value = 'TOTAL';
  grandTotalLabel.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF0F172A' } };
  grandTotalLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFACC15' } };
  grandTotalLabel.alignment = { vertical: 'middle', indent: 1 };

  const grandTotalVal = worksheet.getCell(currRow, 5);
  grandTotalVal.value = `${order.total.toLocaleString()} RWF`;
  grandTotalVal.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF047857' } };
  grandTotalVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFACC15' } };
  grandTotalVal.alignment = { vertical: 'middle', horizontal: 'right' };

  if (order.budget > 0) {
    currRow++;
    worksheet.getRow(currRow).height = 20;
    worksheet.getCell(currRow, 1).value = `Customer Budget: ${order.budget.toLocaleString()} RWF`;
    worksheet.getCell(currRow, 1).font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF64748B' } };
  }

  // Footer Message
  currRow += 2;
  worksheet.getRow(currRow).height = 22;
  worksheet.mergeCells(`A${currRow}:E${currRow}`);
  const footer1 = worksheet.getCell(`A${currRow}`);
  footer1.value = 'Thank you for choosing Ntuma!';
  footer1.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF047857' } };
  footer1.alignment = { horizontal: 'center' };

  currRow++;
  worksheet.getRow(currRow).height = 18;
  worksheet.mergeCells(`A${currRow}:E${currRow}`);
  const footer2 = worksheet.getCell(`A${currRow}`);
  footer2.value = 'Final amounts will be confirmed by your runner on WhatsApp.';
  footer2.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF64748B' } };
  footer2.alignment = { horizontal: 'center' };

  // Write Excel file buffer to browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ntuma_Order_${order.id}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
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
