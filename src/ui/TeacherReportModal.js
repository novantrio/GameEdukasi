// src/ui/TeacherReportModal.js
import { assessmentEngine } from '../core/AssessmentEngine.js';
import { eventBus } from '../core/EventBus.js';
import { PrintReportService } from '../services/PrintReportService.js';

export class TeacherReportModal {
  constructor() {
    this.dialog = document.getElementById('teacher-report-dialog');
    if (!this.dialog) {
      this.dialog = document.createElement('dialog');
      this.dialog.id = 'teacher-report-dialog';
      this.dialog.className = 'teacher-report-modal';
      document.body.appendChild(this.dialog);
    }
    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('report:open', () => {
      try {
        this.renderReport();
        if (typeof this.dialog.showModal === 'function') {
          if (!this.dialog.open) {
            this.dialog.showModal();
          }
        } else {
          this.dialog.setAttribute('open', '');
        }
      } catch (err) {
        console.error('Error opening teacher report modal:', err);
      }
    });

    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog) {
        this.dialog.close();
      }
    });
  }

  renderReport() {
    const report = assessmentEngine.generateTeacherReport();

    const domainsHtml = Object.values(report.domains).map(dom => {
      const barColor = dom.score >= 85 ? '#10b981' : dom.score >= 70 ? '#3b82f6' : dom.score >= 50 ? '#f59e0b' : '#ef4444';

      const mistakeListHtml = dom.mistakes && dom.mistakes.length > 0
        ? `<div class="mistake-log-box">
             <strong>⚠️ Catatan Kekeliruan Jawaban:</strong>
             <ul>${dom.mistakes.map(m => `<li>${m}</li>`).join('')}</ul>
           </div>`
        : '';

      return `
        <div class="report-domain-card">
          <div class="domain-header">
            <div>
              <h4 class="domain-title">${dom.name}</h4>
              <p class="domain-desc">${dom.description}</p>
            </div>
            <div class="domain-score-box">
              <span class="domain-score" style="color: ${barColor}">${dom.tested ? `${dom.score}%` : '-'}</span>
              <span class="domain-status-pill ${dom.statusBadge}">${dom.status}</span>
            </div>
          </div>

          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${dom.tested ? dom.score : 0}%; background-color: ${barColor}"></div>
          </div>

          <div class="domain-meta-row">
            <span><strong>${report.isAge7 ? 'Indikator Capaian Fase A SD:' : 'Indikator STPPA Usia 4 Th:'}</strong> ${dom.activeMilestone}</span>
          </div>

          ${dom.tested ? `
            <div class="domain-metrics-row">
              <span class="metric-pill">🎯 Akurasi Murni: <strong>${dom.correctCount} Benar / ${dom.totalQuestions} Soal</strong></span>
              <span class="metric-pill">❌ Jawaban Keliru: <strong>${dom.wrongCount} Soal</strong></span>
              <span class="metric-pill">⏱️ Rata-rata Kecepatan: <strong>${dom.avgSpeedSec} detik/soal</strong></span>
            </div>
            ${mistakeListHtml}
            <div class="pedagogical-notes">
              <span class="notes-icon">📝</span>
              <p><strong>Analisis Guru:</strong> ${dom.notes}</p>
            </div>
          ` : `
            <div class="pedagogical-notes empty">
              <p><em>Aspek ini belum diobservasi. Mainkan modul ${dom.name} dan tekan "Periksa Jawaban" untuk merekam hasil.</em></p>
            </div>
          `}
        </div>
      `;
    }).join('');

    const recommendationsHtml = report.recommendations.map(rec => `
      <div class="rec-card">
        <div class="rec-badge">${rec.area}</div>
        <h5 class="rec-activity">${rec.activity}</h5>
        <p class="rec-target"><strong>Fokus Stimulasi:</strong> ${rec.target}</p>
      </div>
    `).join('');

    this.dialog.innerHTML = `
      <div class="report-container">
        <!-- Report Header Bar -->
        <div class="report-top-bar no-print">
          <div class="top-tag">
            <span>📑 ${report.isAge7 ? 'DOKUMEN ASESMEN LOGIKA & SAINS FASE A (SD KELAS 1-2)' : 'DOKUMEN ASESMEN PERKEMBANGAN KOGNITIF & LOGIKA (PAUD / TK-A)'}</span>
          </div>
          <button id="btn-close-report" class="btn-close-modal" title="Tutup Rapor" aria-label="Tutup">✖</button>
        </div>

        <div class="printable-report-area">
          <div class="report-official-header">
            <div class="official-title-group">
              <h2 class="report-main-title">${report.isAge7 ? 'LAPORAN EVALUASI LOGIKA, NUMERASI & SAINS ANAK' : 'LAPORAN EVALUASI KECERDASAN LOGIKA ANAK'}</h2>
              <p class="report-sub-title">${report.standardLabel}</p>
            </div>
            <div class="official-meta-box">
              <div><strong>Subjek Observasi:</strong> ${report.studentName} (${report.ageLabel})</div>
              <div><strong>Tanggal Asesmen:</strong> ${report.dateGenerated}</div>
              <div><strong>Metode Pengujian:</strong> Asesmen Terstruktur (Submit-Based Evaluation)</div>
            </div>
          </div>

          <!-- Overall Score Summary Box -->
          <div class="overall-summary-card">
            <div class="overall-score-circle">
              <span class="overall-number">${report.overallScore}%</span>
              <span class="overall-label">Indeks Nilai</span>
            </div>
            <div class="overall-info">
              <span class="overall-tag">${report.isAge7 ? 'Predikat Capaian Fase A:' : 'Predikat Capaian STPPA:'}</span>
              <h3 class="overall-predicate">${report.overallPredicate}</h3>
              <p class="overall-summary-text">${report.executiveSummary}</p>
            </div>
          </div>

          <!-- Domain Matrix Breakdown -->
          <h3 class="section-heading">📊 Hasil Observasi 6 Aspek Logika Kognitif</h3>
          <div class="domains-matrix-grid">
            ${domainsHtml}
          </div>

          <!-- Curricular Action Plan for Teachers -->
          <h3 class="section-heading">🌱 Rekomendasi Program Stimulasi Pedagogis untuk Guru / Pendidik</h3>
          <div class="recommendations-grid">
            ${recommendationsHtml}
          </div>
        </div>

        <!-- Footer Control Buttons -->
        <div class="report-footer-actions no-print">
          <button id="btn-print-report" class="kid-btn btn-primary" title="Cetak atau Simpan PDF Resmi (A4)">
            🖨️ Cetak / Simpan PDF
          </button>
          <button id="btn-download-report" class="kid-btn" style="background: #0284c7; color: white;" title="Unduh File Dokumen Rapor">
            📥 Unduh File Dokumen
          </button>
          <button id="btn-reset-report" class="kid-btn btn-secondary" title="Reset data untuk siswa baru">
            🔄 Reset Siswa Baru
          </button>
          <button id="btn-back-report" class="kid-btn" style="background: #64748b; color: white;">
            Tutup
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-close-report').addEventListener('click', () => {
      eventBus.emit('sound:pop');
      this.dialog.close();
    });

    document.getElementById('btn-back-report').addEventListener('click', () => {
      eventBus.emit('sound:pop');
      this.dialog.close();
    });

    document.getElementById('btn-print-report').addEventListener('click', () => {
      eventBus.emit('sound:pop');
      PrintReportService.print(report);
    });

    document.getElementById('btn-download-report').addEventListener('click', () => {
      eventBus.emit('sound:pop');
      PrintReportService.downloadHTML(report);
    });

    document.getElementById('btn-reset-report').addEventListener('click', () => {
      if (confirm(`Apakah Ibu/Bapak Guru yakin ingin mereset seluruh data asesmen ${report.ageLabel} untuk siswa baru?`)) {
        assessmentEngine.resetAllData(report.ageGroup);
        eventBus.emit('sound:pop');
        this.renderReport();
      }
    });
  }
}
