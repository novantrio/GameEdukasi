// src/services/PrintReportService.js

export class PrintReportService {
  static print(report) {
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert('Mohon izinkan pop-up di browser untuk mencetak atau menyimpan PDF.');
      return;
    }

    const htmlContent = this.generateDocumentHTML(report);
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Allow resources to render then trigger native print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 250);
    };
  }

  static downloadHTML(report) {
    const htmlContent = this.generateDocumentHTML(report);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rapor-Logika-${(report.studentName || 'Ananda').replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static generateDocumentHTML(report) {
    const domainCardsHtml = Object.values(report.domains).map(dom => {
      const color = dom.score >= 85 ? '#059669' : dom.score >= 70 ? '#2563eb' : dom.score >= 50 ? '#d97706' : '#dc2626';
      const bgColor = dom.score >= 85 ? '#ecfdf5' : dom.score >= 70 ? '#eff6ff' : dom.score >= 50 ? '#fffbeb' : '#fef2f2';

      const mistakeList = dom.mistakes && dom.mistakes.length > 0
        ? `<div style="margin-top: 8px; padding: 8px 12px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; font-size: 11px; color: #9f1239;">
             <strong>⚠️ Catatan Kesalahan Saat Pengujian:</strong>
             <ul style="margin: 4px 0 0 16px; padding: 0;">
               ${dom.mistakes.map(m => `<li>${m}</li>`).join('')}
             </ul>
           </div>`
        : '';

      return `
        <div class="domain-card">
          <div class="domain-header">
            <div>
              <div class="domain-title">${dom.name}</div>
              <div class="domain-desc">${dom.description}</div>
            </div>
            <div class="domain-badge" style="background: ${bgColor}; color: ${color}; border: 1px solid ${color};">
              <span style="font-size: 16px; font-weight: 800;">${dom.tested ? `${dom.score}%` : '-'}</span>
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${dom.status}</span>
            </div>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" style="width: ${dom.tested ? dom.score : 0}%; background: ${color};"></div>
          </div>

          <div class="indicator-box">
            <strong>${report.isAge7 ? 'Indikator Capaian Fase A SD:' : 'Indikator STPPA Usia 4-5 Th:'}</strong> ${dom.activeMilestone}
          </div>

          ${dom.tested ? `
            <div class="metrics-row">
              <span class="metric-item">🎯 Akurasi: <strong>${dom.correctCount} Benar / ${dom.totalQuestions} Soal</strong></span>
              <span class="metric-item">❌ Salah: <strong>${dom.wrongCount} Soal</strong></span>
              <span class="metric-item">⏱️ Kecepatan: <strong>${dom.avgSpeedSec} detik/soal</strong></span>
            </div>
            ${mistakeList}
            <div class="teacher-notes">
              <strong>📝 Observasi & Catatan Guru:</strong> ${dom.notes}
            </div>
          ` : `
            <div style="font-size: 11px; color: #94a3b8; font-style: italic; padding: 6px 0;">
              Aspek ini belum diobservasi. Belum ada soal yang dikerjakan pada aspek ini.
            </div>
          `}
        </div>
      `;
    }).join('');

    const recsHtml = report.recommendations.map(r => `
      <div class="rec-card">
        <span class="rec-badge">${r.area}</span>
        <div class="rec-activity">${r.activity}</div>
        <div class="rec-target"><strong>Fokus:</strong> ${r.target}</div>
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Rapor Logika - ${report.studentName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 14mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-size: 12px;
      line-height: 1.45;
    }

    /* Print toolbar at top of preview screen */
    .screen-toolbar {
      background: #4f46e5;
      color: white;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .screen-toolbar button {
      background: white;
      color: #4f46e5;
      border: none;
      font-weight: 800;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    @media print {
      .screen-toolbar {
        display: none !important;
      }
    }

    .report-wrap {
      max-width: 800px;
      margin: 0 auto;
      padding: 16px 20px;
    }

    .official-header {
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .title-main {
      font-size: 18px;
      font-weight: 900;
      color: #1e1b4b;
      letter-spacing: -0.3px;
      margin-bottom: 2px;
    }
    .title-sub {
      font-size: 12px;
      color: #475569;
      font-weight: 600;
    }
    .meta-table {
      font-size: 11px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 12px;
      line-height: 1.4;
    }

    /* Overall Summary */
    .summary-box {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 16px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .score-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: #ffffff;
      border: 4px solid #4f46e5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .score-val {
      font-size: 20px;
      font-weight: 900;
      color: #4f46e5;
      line-height: 1;
    }
    .score-lbl {
      font-size: 9px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
    }
    .pred-title {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .exec-summary {
      font-size: 11.5px;
      color: #334155;
      line-height: 1.4;
    }

    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      border-left: 4px solid #4f46e5;
      padding-left: 8px;
      margin: 16px 0 10px 0;
      page-break-after: avoid;
      break-after: avoid;
    }

    /* Domain Grid */
    .domain-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 10px;
      background: #ffffff;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .domain-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    .domain-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
    }
    .domain-desc {
      font-size: 10.5px;
      color: #64748b;
    }
    .domain-badge {
      padding: 3px 10px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .progress-bar {
      height: 6px;
      background: #f1f5f9;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .progress-fill {
      height: 100%;
      border-radius: 3px;
    }

    .indicator-box {
      font-size: 10.5px;
      color: #334155;
      background: #f8fafc;
      padding: 5px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
    }

    .metrics-row {
      display: flex;
      gap: 8px;
      font-size: 10.5px;
      margin-bottom: 6px;
    }
    .metric-item {
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 4px;
      color: #334155;
    }

    .teacher-notes {
      font-size: 11px;
      color: #1e293b;
      background: #faf5ff;
      border-left: 3px solid #8b5cf6;
      padding: 6px 10px;
      border-radius: 0 4px 4px 0;
    }

    /* Rec Grid */
    .rec-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .rec-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      background: #ffffff;
    }
    .rec-badge {
      font-size: 9px;
      font-weight: 800;
      background: #ede9fe;
      color: #6d28d9;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 4px;
    }
    .rec-activity {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .rec-target {
      font-size: 10px;
      color: #64748b;
    }

    /* Signature Box */
    .sig-area {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding: 0 30px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .sig-block {
      text-align: center;
      font-size: 11px;
    }
    .sig-line {
      margin-top: 50px;
      width: 160px;
      border-bottom: 1px solid #0f172a;
    }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <span>🖨️ Pratinjau Cetak / Simpan PDF Rapor Logika</span>
    <button onclick="window.print()">Cetak / Simpan PDF Sekarang</button>
  </div>

  <div class="report-wrap">
    <div class="official-header">
      <div>
        <div class="title-main">${report.isAge7 ? 'LAPORAN EVALUASI LOGIKA, NUMERASI & SAINS ANAK' : 'LAPORAN EVALUASI KECERDASAN LOGIKA ANAK'}</div>
        <div class="title-sub">${report.standardLabel}</div>
      </div>
      <div class="meta-table">
        <div><strong>Nama Peserta:</strong> ${report.studentName} (${report.ageLabel})</div>
        <div><strong>Tanggal Asesmen:</strong> ${report.dateGenerated}</div>
        <div><strong>Metode:</strong> Asesmen Terstruktur (Submit-Based)</div>
      </div>
    </div>

    <div class="summary-box">
      <div class="score-circle">
        <div class="score-val">${report.overallScore}%</div>
        <div class="score-lbl">Indeks</div>
      </div>
      <div>
        <div class="pred-title">${report.overallPredicate}</div>
        <div class="exec-summary">${report.executiveSummary}</div>
      </div>
    </div>

    <div class="section-title">📊 Matriks Evaluasi 6 Domain Logika Kognitif</div>
    <div>${domainCardsHtml}</div>

    <div class="section-title">🌱 Rencana Tindak Lanjut Stimulasi Guru di Kelas / Rumah</div>
    <div class="rec-grid">${recsHtml}</div>

    <div class="sig-area">
      <div class="sig-block">
        <div>Mengetahui,</div>
        <div style="font-weight: 800; margin-top: 2px;">Kepala Sekolah ${report.isAge7 ? 'Dasar (SD)' : 'PAUD / TK'}</div>
        <div class="sig-line"></div>
      </div>
      <div class="sig-block">
        <div>${report.dateGenerated}</div>
        <div style="font-weight: 800; margin-top: 2px;">${report.isAge7 ? 'Guru Kelas / Wali Kelas' : 'Guru Kelas / Evaluator'}</div>
        <div class="sig-line"></div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }
}
