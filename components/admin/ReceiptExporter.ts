import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function downloadReceiptPDF(elementId: string, receiptNo: string): Promise<boolean> {
  const element = document.getElementById(elementId)
  if (!element) return false

  try {
    // Save original styles
    const originalStyle = element.getAttribute('style') || ''

    // Force a fixed, full-width render so mobile doesn't clip
    element.style.setProperty('max-width', '600px', 'important')
    element.style.setProperty('width', '600px', 'important')
    element.style.setProperty('margin', '0', 'important')
    element.style.setProperty('box-shadow', 'none', 'important')
    element.style.setProperty('border-radius', '0', 'important')

    // Short delay to allow layout to settle
    await new Promise((r) => setTimeout(r, 120))

    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      // Use the element's actual scrollWidth so nothing is clipped
      windowWidth: element.scrollWidth + 60,
      width: element.scrollWidth,
    })

    // Restore original styles
    element.setAttribute('style', originalStyle)

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const pdfWidth = pdf.internal.pageSize.getWidth()   // 210mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`Ntuma_Receipt_${receiptNo || 'Document'}.pdf`)
    return true
  } catch (err) {
    console.error('Failed to generate PDF:', err)
    return false
  }
}
