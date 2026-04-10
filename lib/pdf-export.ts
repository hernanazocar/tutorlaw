import { jsPDF } from 'jspdf';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function exportToPDF(messages: Message[], mode: string, title: string) {
  const doc = new jsPDF();

  // Configuración
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('TutorLaw', margin, yPosition);

  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Modo: ${mode}`, margin, yPosition);

  yPosition += 7;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`${new Date().toLocaleDateString('es-CL')} - ${new Date().toLocaleTimeString('es-CL')}`, margin, yPosition);

  yPosition += 5;
  doc.setDrawColor(200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 10;

  // Título de la conversación
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 7 + 5;

  // Mensajes
  doc.setFontSize(10);

  messages.forEach((message, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - margin - 20) {
      doc.addPage();
      yPosition = margin;
    }

    // Role label
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 255);
    const roleLabel = message.role === 'user' ? 'Tú' : mode;
    doc.text(roleLabel, margin, yPosition);
    yPosition += 7;

    // Message content
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);

    // Split text to fit width
    const lines = doc.splitTextToSize(message.content, maxWidth);

    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 5; // Space between messages

    // Separator line
    if (index < messages.length - 1) {
      doc.setDrawColor(230);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
    }
  });

  // Footer on last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${totalPages} - TutorLaw`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `tutorlaw-${mode}-${timestamp}.pdf`;

  // Download
  doc.save(filename);
}
