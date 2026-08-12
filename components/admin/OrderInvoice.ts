import { jsPDF } from 'jspdf';
import type { Order } from '@/lib/sheetsApi';
import { CATEGORIES, QUICK_LIST_CATEGORY } from '@/lib/categories';

/**
 * Generate and download a branded PDF invoice for an admin order.
 *
 * Uses jsPDF (already in project deps) with pure programmatic drawing —
 * no html2canvas dependency, works in any environment.
 */
export function downloadOrderInvoice(order: Order): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();   // 210
  const margin = 18;
  const contentW = pageW - margin * 2;

  // ── Color palette ─────────────────────────────────────────────────────────
  const emerald   = [4,  120, 87]  as [number, number, number]; // #047857
  const yellow    = [250, 204, 21] as [number, number, number]; // #FACC15
  const blackText = [10,  10,  10] as [number, number, number]; // #0A0A0A
  const slateText = [100, 116, 139]as [number, number, number]; // slate-500
  const slateRule = [226, 232, 240]as [number, number, number]; // slate-200

  let y = 0;

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

  // ══════════════════════════════════════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════════════════════════════════════
  // Yellow logo block
  doc.setFillColor(...yellow);
  doc.roundedRect(margin, 12, 16, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...emerald);
  txt('N', margin + 8, 23, { align: 'center' });

  // Brand name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  txt('NTUMA', margin + 20, 21);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  txt('Premium Courier Service', margin + 20, 26);
  txt('Kigali, Rwanda  •  +250 788 524 634', margin + 20, 30);

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

  y = 38;
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
  doc.roundedRect(pageW - margin - 30, y + 6, 30, 8, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...fgCol);
  txt(order.status.toUpperCase(), pageW - margin - 15, y + 11.5, { align: 'center' });

  y += 36;

  // ══════════════════════════════════════════════════════════════════════════
  // ITEMS TABLE HEADER
  // ══════════════════════════════════════════════════════════════════════════
  doc.setFillColor(...emerald);
  doc.rect(margin, y, contentW, 8, 'F');

  const colX = {
    cat:     margin + 2,
    product: margin + 38,
    qty:     margin + 105,
    price:   margin + 130,
    subtotal:pageW - margin - 2,
  };

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  txt('CATEGORY',  colX.cat,      y + 5.5);
  txt('PRODUCT',   colX.product,  y + 5.5);
  txt('QTY',       colX.qty,      y + 5.5, { align: 'center' });
  txt('UNIT PRICE',colX.price,    y + 5.5, { align: 'right' });
  txt('SUBTOTAL',  colX.subtotal, y + 5.5, { align: 'right' });

  y += 8;

  // ── Rows ──────────────────────────────────────────────────────────────────
  order.items.forEach((item, idx) => {
    const rowH = 9;
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(margin, y, contentW, rowH, 'F');
    }

    const isQuickList = item.isCustom || item.category === QUICK_LIST_CATEGORY;
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

    // Qty + unit
    txt(`${item.qty} ${item.unit}`, colX.qty, y + 6, { align: 'center' });

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
  // FOOTER
  // ══════════════════════════════════════════════════════════════════════════
  const footerY = doc.internal.pageSize.getHeight() - 20;
  hRule(footerY - 4, slateRule);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  txt('Thank you for choosing Ntuma!', pageW / 2, footerY, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  txt('Final amounts will be confirmed by your runner on WhatsApp.', pageW / 2, footerY + 5, { align: 'center' });

  // Save
  doc.save(`Ntuma_Order_${order.id}.pdf`);
}
