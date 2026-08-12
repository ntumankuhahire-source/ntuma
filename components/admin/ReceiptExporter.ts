import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function downloadReceiptPDF(elementId: string, receiptNo: string): Promise<boolean> {
  const element = document.getElementById(elementId)
  if (!element) return false

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth() // 210mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`Ntuma_Receipt_${receiptNo || 'Document'}.pdf`)
    return true
  } catch (err) {
    console.error('Failed to generate PDF:', err)
    return false
  }
}
