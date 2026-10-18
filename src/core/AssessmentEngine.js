// src/core/AssessmentEngine.js
import { StorageService } from '../services/StorageService.js';

export const COGNITIVE_DOMAINS = Object.freeze({
  shapes: {
    id: 'shapes',
    name: 'Visual-Spasial & Geometri',
    description: 'Kemampuan mengenali bentuk geometris, orientasi ruang, karakteristik sisi & sudut.',
    milestoneAge4: 'Mengenal bentuk geometri dasar (lingkaran, segitiga, persegi) dan mencocokkan bentuk dengan bayangannya.',
    milestoneAge7: 'Menganalisis bangun datar tingkat lanjut (segienam, jajar genjang), bangun ruang (kubus, tabung, bola), dan menghitung simetri/sisi.'
  },
  sizes: {
    id: 'sizes',
    name: 'Seriasi & Relasi Kuantitatif',
    description: 'Kemampuan menata urutan benda berdasarkan hierarki bobot, satuan waktu, dan nilai kuantitas.',
    milestoneAge4: 'Mengurutkan 3-4 benda dari ukuran paling kecil ke paling besar secara berurutan.',
    milestoneAge7: 'Mengurutkan bobot komparatif makhluk hidup, konversi satuan waktu (detik, menit, jam, hari), dan nilai bilangan puluhan.'
  },
  patterns: {
    id: 'patterns',
    name: 'Penalaran Pola & Logika Induktif',
    description: 'Kemampuan mendeteksi keteraturan pola berulang, barisan bilangan loncat, dan deret aritmatika.',
    milestoneAge4: 'Meniru dan melanjutkan pola urutan warna atau gambar sederhana yang berulang.',
    milestoneAge7: 'Memecahkan deret bilangan loncat (+2, +5), pola pengurangan mundur berurutan, dan deret pertambahan bertingkat.'
  },
  'odd-one': {
    id: 'odd-one',
    name: 'Klasifikasi Ilmiah & Taksonomi',
    description: 'Kemampuan mengelompokkan kategori biologis, wujud zat materi, dan sifat fisika isolator/konduktor.',
    milestoneAge4: 'Mengelompokkan benda berdasarkan kategori (hewan/buah/alat transportasi) dan menemukan yang berbeda.',
    milestoneAge7: 'Mengidentifikasi rantai taksonomi (karnivora vs herbivora, mamalia vs ovipar), wujud materi (cair vs padat), dan isolator panas.'
  },
  'animal-habitats': {
    id: 'animal-habitats',
    name: 'Sains Alam & Rantai Ekosistem',
    description: 'Kemampuan menganalisis hubungan lingkungan alami, rantai makanan, fotosintesis, dan siklus air.',
    milestoneAge4: 'Memahami hubungan sebab-akibat sederhana di lingkungan sekitar (tempat tinggal dan makanan hewan).',
    milestoneAge7: 'Menjelaskan interaksi trofik rantai makanan, peran sinar matahari pada fotosintesis daun, siklus kondensasi awan, dan adaptasi iklim kutub.'
  },
  counting: {
    id: 'counting',
    name: 'Penalaran Matematika & Pra-Aljabar',
    description: 'Kemampuan memecahkan aljabar visual simbolik, perkalian sebagai penjumlahan berulang, dan pembagian adil.',
    milestoneAge4: 'Membilang secara berurutan dan menghubungkan jumlah benda 1-5 dengan simbol angka.',
    milestoneAge7: 'Memecahkan persamaan aljabar visual satu variabel (x + x = 8), logika perkalian kaki hewan, dan pembagian distributif rata.'
  }
});

export class AssessmentEngine {
  constructor() {}

  getStorageKey(age = StorageService.getAgeGroup()) {
    return `kid_logic_telemetry_v2_${age}`;
  }

  loadTelemetry(age = StorageService.getAgeGroup()) {
    try {
      const raw = localStorage.getItem(this.getStorageKey(age));
      return raw ? JSON.parse(raw) : { sessions: [], metrics: {} };
    } catch {
      return { sessions: [], metrics: {} };
    }
  }

  saveTelemetry(data, age = StorageService.getAgeGroup()) {
    try {
      localStorage.setItem(this.getStorageKey(age), JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save assessment telemetry:', e);
    }
  }

  recordTrial({ gameId, levelIndex, timeSpentMs, isSuccess, scorePercent, mistakeDetail }) {
    const age = StorageService.getAgeGroup();
    const telemetry = this.loadTelemetry(age);

    if (!telemetry.metrics[gameId]) {
      telemetry.metrics[gameId] = [];
    }

    const trialRecord = {
      timestamp: Date.now(),
      levelIndex,
      timeSpentMs: Math.max(500, timeSpentMs || 1000),
      isSuccess: Boolean(isSuccess),
      scorePercent: typeof scorePercent === 'number' ? Math.round(scorePercent) : (isSuccess ? 100 : 0),
      mistakeDetail: mistakeDetail || null
    };

    telemetry.metrics[gameId].push(trialRecord);
    this.saveTelemetry(telemetry, age);
  }

  generateTeacherReport(studentName = StorageService.getStudentName(), ageGroup = StorageService.getAgeGroup()) {
    const isAge7 = ageGroup === '7';
    const telemetry = this.loadTelemetry(ageGroup);
    const domainReports = {};
    let totalScoreSum = 0;
    let evaluatedDomainCount = 0;
    let totalCorrectOverall = 0;
    let totalQuestionsOverall = 0;

    Object.keys(COGNITIVE_DOMAINS).forEach(domainKey => {
      const domainInfo = COGNITIVE_DOMAINS[domainKey];
      const records = telemetry.metrics[domainKey] || [];
      const milestone = isAge7 ? domainInfo.milestoneAge7 : domainInfo.milestoneAge4;

      if (records.length === 0) {
        domainReports[domainKey] = {
          ...domainInfo,
          activeMilestone: milestone,
          tested: false,
          score: 0,
          status: 'Belum Diobservasi',
          statusBadge: 'badge-gray',
          correctCount: 0,
          wrongCount: 0,
          totalQuestions: 0,
          avgSpeedSec: 0,
          mistakes: [],
          notes: 'Belum ada soal yang dikerjakan dan disubmit pada aspek ini.'
        };
        return;
      }

      evaluatedDomainCount += 1;

      const totalTrials = records.length;
      const correctTrials = records.filter(r => r.isSuccess).length;
      const wrongTrials = totalTrials - correctTrials;
      totalCorrectOverall += correctTrials;
      totalQuestionsOverall += totalTrials;

      const totalScorePercent = records.reduce((sum, r) => sum + r.scorePercent, 0);
      const calculatedScore = Math.round(totalScorePercent / totalTrials);

      totalScoreSum += calculatedScore;

      const totalTime = records.reduce((sum, r) => sum + r.timeSpentMs, 0);
      const avgSpeedSec = (totalTime / totalTrials / 1000).toFixed(1);

      const mistakes = records.filter(r => r.mistakeDetail).map(r => r.mistakeDetail);

      let status = '';
      let statusBadge = '';
      let pedagogicalObservation = '';

      if (isAge7) {
        // SD Kelas 1-2 Fase A Rubric
        if (calculatedScore >= 85) {
          status = 'Sangat Mahir (Fase A Tuntas Mandiri)';
          statusBadge = 'badge-emerald';
          pedagogicalObservation = `Ananda menunjukkan penguasaan penalaran analitis yang sangat matang (${correctTrials}/${totalTrials} benar, ${calculatedScore}%). Kecepatan eksekusi konsisten (${avgSpeedSec} detik/soal).`;
        } else if (calculatedScore >= 70) {
          status = 'Mahir (Mencapai Capaian Pembelajaran)';
          statusBadge = 'badge-blue';
          pedagogicalObservation = `Ananda memenuhi indikator capaian fase A dengan baik (${correctTrials}/${totalTrials} benar). Mampu menghubungkan premis logika secara mandiri.`;
        } else if (calculatedScore >= 50) {
          status = 'Cukup (Perlu Pemantapan Konsep)';
          statusBadge = 'badge-yellow';
          pedagogicalObservation = `Ananda mulai mengerti konsep dasar namun terdapat ${wrongTrials} kekeliruan analisis. Perlu penguatan pemodelan logika sebelum verifikasi jawaban.`;
        } else {
          status = 'Perlu Bimbingan (Intervensi Khusus)';
          statusBadge = 'badge-orange';
          pedagogicalObservation = `Ananda memerlukan bimbingan intensif dan alat peraga konkret untuk memahami aspek logika ini (${correctTrials}/${totalTrials} benar).`;
        }
      } else {
        // PAUD / TK-A STPPA Rubric
        if (calculatedScore >= 85) {
          status = 'BSB (Berkembang Sangat Baik)';
          statusBadge = 'badge-emerald';
          pedagogicalObservation = `Ananda menguasai konsep secara mandiri dan akurat (${correctTrials}/${totalTrials} benar, ${calculatedScore}%). Kecepatan penalaran sangat optimal (${avgSpeedSec} detik/soal).`;
        } else if (calculatedScore >= 70) {
          status = 'BSH (Berkembang Sesuai Harapan)';
          statusBadge = 'badge-blue';
          pedagogicalObservation = `Ananda mencapai indikator perkembangan usia 4 tahun dengan baik (${correctTrials}/${totalTrials} benar). Konsentrasi terarah dan mampu menganalisis soal.`;
        } else if (calculatedScore >= 50) {
          status = 'MB (Mulai Berkembang)';
          statusBadge = 'badge-yellow';
          pedagogicalObservation = `Ananda mulai memahami konsep namun masih terdapat kekeliruan (${wrongTrials} salah dari ${totalTrials} soal). Perlu bimbingan untuk mempertajam pemahaman atribut pembeda.`;
        } else {
          status = 'BB (Belum Berkembang)';
          statusBadge = 'badge-orange';
          pedagogicalObservation = `Ananda belum menguasai indikator ini secara konsisten (${correctTrials}/${totalTrials} benar). Memerlukan stimulasi menggunakan benda manipulatif konkret secara bertahap.`;
        }
      }

      domainReports[domainKey] = {
        ...domainInfo,
        activeMilestone: milestone,
        tested: true,
        score: calculatedScore,
        status,
        statusBadge,
        correctCount: correctTrials,
        wrongCount: wrongTrials,
        totalQuestions: totalTrials,
        avgSpeedSec,
        mistakes,
        notes: pedagogicalObservation
      };
    });

    const overallScore = evaluatedDomainCount > 0 ? Math.round(totalScoreSum / evaluatedDomainCount) : 0;

    let overallPredicate = 'Belum Ada Evaluasi';
    if (evaluatedDomainCount > 0) {
      if (isAge7) {
        if (overallScore >= 85) overallPredicate = 'Penalaran & Logika Sains Sangat Mahir (Tuntas Mandiri)';
        else if (overallScore >= 70) overallPredicate = 'Penalaran & Logika Sains Mahir (Sesuai Fase A SD)';
        else if (overallScore >= 50) overallPredicate = 'Penalaran Logika Cukup - Perlu Latihan Pemodelan';
        else overallPredicate = 'Perlu Pendampingan Khusus & Penguatan Konsep Dasar';
      } else {
        if (overallScore >= 85) overallPredicate = 'Kecerdasan Logika Berkembang Sangat Optimal (BSB)';
        else if (overallScore >= 70) overallPredicate = 'Kecerdasan Logika Berkembang Sesuai Harapan (BSH)';
        else if (overallScore >= 50) overallPredicate = 'Kecerdasan Logika Mulai Berkembang (MB)';
        else overallPredicate = 'Kecerdasan Logika Belum Berkembang (BB) - Perlu Stimulasi Intensif';
      }
    }

    return {
      studentName,
      ageGroup,
      isAge7,
      ageLabel: isAge7 ? '7 Tahun (SD Kelas 1-2)' : '4 Tahun (PAUD / TK-A)',
      standardLabel: isAge7 ? 'Capaian Pembelajaran Fase A SD (Logika, Numerasi & Sains)' : 'Standar Tingkat Pencapaian Perkembangan Anak (STPPA) Usia 4-5 Th',
      dateGenerated: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      evaluatedDomainCount,
      totalCorrectOverall,
      totalQuestionsOverall,
      overallScore,
      overallPredicate,
      domains: domainReports,
      executiveSummary: this.buildExecutiveSummary(domainReports, overallScore, totalCorrectOverall, totalQuestionsOverall, isAge7),
      recommendations: this.buildCurricularRecommendations(domainReports, isAge7)
    };
  }

  buildExecutiveSummary(domains, overallScore, totalCorrect, totalQuestions, isAge7) {
    const testedDomains = Object.values(domains).filter(d => d.tested);
    if (testedDomains.length === 0) {
      return 'Belum ada data evaluasi. Silakan ajak Ananda memilih jawaban dan menekan tombol "Periksa Jawaban" pada permainan.';
    }

    const topStrengths = [...testedDomains].sort((a, b) => b.score - a.score);
    const needAttention = [...testedDomains].sort((a, b) => a.score - b.score);

    const highest = topStrengths[0];
    const lowest = needAttention[0];

    const accuracyNote = `Total skor akurasi murni: ${overallScore}% (${totalCorrect} soal dijawab benar dari total ${totalQuestions} soal).`;

    if (lowest.score < 70) {
      return `${accuracyNote} Aspek terkuat Ananda berada pada ${highest.name} (${highest.score}%, ${highest.status}). Namun, pada aspek ${lowest.name} (${lowest.score}%, ${lowest.status}), Ananda mengalami beberapa kekeliruan saat konfirmasi jawaban dan memerlukan stimulasi bertahap.`;
    }

    return `${accuracyNote} Profil penalaran logika Ananda berada pada kategori ${highest.status} dengan pemahaman menyeluruh terhadap konsep ${isAge7 ? 'geometri ruang, deret loncat, taksonomi materi, ekosistem dan aljabar visual' : 'bentuk, ukuran, pola, dan klasifikasi konkret'}.`;
  }

  buildCurricularRecommendations(domains, isAge7) {
    const recs = [];

    if (isAge7) {
      // Age 7 Recommendations
      if (domains.shapes?.tested && domains.shapes.score < 70) {
        recs.push({
          area: 'Geometri & Bangun Ruang',
          activity: 'Membongkar Jaring-Jaring Kubus & Menghitung Titik Sudut/Rusuk',
          target: 'Membedakan bangun datar vs bangun ruang tiga dimensi secara manipulatif.'
        });
      }

      if (domains.sizes?.tested && domains.sizes.score < 70) {
        recs.push({
          area: 'Seriasi & Besaran Satuan',
          activity: 'Latihan Membaca Jam Analog & Mengurutkan Satuan Waktu (Detik-Hari)',
          target: 'Menguasai hierarki satuan waktu dan perbandingan bobot benda nyata.'
        });
      }

      if (domains.patterns?.tested && domains.patterns.score < 70) {
        recs.push({
          area: 'Deret Bilangan Loncat',
          activity: 'Melengkapi Barisan Angka Loncat (+2, +5, dan Deret Berkurang) di Garis Bilangan',
          target: 'Memperkuat penalaran induktif dan kepekaan aritmatika kelipatan.'
        });
      }

      if (domains['odd-one']?.tested && domains['odd-one'].score < 70) {
        recs.push({
          area: 'Taksonomi Sains & Fisika',
          activity: 'Eksperimen Sederhana Benda Padat vs Cair & Penguji Hantaran Panas Sendok Logam',
          target: 'Memperdalam klasifikasi ilmiah wujud materi dan sifat benda.'
        });
      }

      if (domains['animal-habitats']?.tested && domains['animal-habitats'].score < 70) {
        recs.push({
          area: 'Ekosistem & Rantai Makanan',
          activity: 'Membuat Kartu Rantai Makanan Sawah (Padi → Belalang → Katak → Ular)',
          target: 'Memahami interaksi trofik dan siklus daur air bumi.'
        });
      }

      if (domains.counting?.tested && domains.counting.score < 70) {
        recs.push({
          area: 'Aljabar Visual & Logika Hitung',
          activity: 'Teka-Teki Simbol Neraca Seimbang (Apel + Apel = 8) & Pembagian Permen Rata',
          target: 'Menjembatani transisi penalaran aritmatika menuju pra-aljabar formal.'
        });
      }

      if (recs.length === 0) {
        recs.push({
          area: 'Pengayaan Logika Fase A',
          activity: 'Sudoku Gambar 4x4, Coding Grid Sederhana & Teka-Teki Logika Silang',
          target: 'Memperluas kapasitas problem-solving deduktif tingkat lanjut.'
        });
      }
    } else {
      // Age 4 Recommendations
      if (domains.shapes?.tested && domains.shapes.score < 70) {
        recs.push({
          area: 'Visual-Spasial',
          activity: 'Aktivitas Tangram Kayu & Menjiplak Bayangan Senter',
          target: 'Memperkuat diskriminasi sudut dan tepi bentuk geometri datar.'
        });
      }

      if (domains.sizes?.tested && domains.sizes.score < 70) {
        recs.push({
          area: 'Seriasi & Ukuran',
          activity: 'Menyusun Gelas Bersarang (Nesting Cups) atau Balok dari Terkecil',
          target: 'Menginternalisasi konsep komparatif hierarkis (lebih kecil/lebih besar).'
        });
      }

      if (domains.patterns?.tested && domains.patterns.score < 70) {
        recs.push({
          area: 'Pola Berulang',
          activity: 'Meronce Manik-manik Pola AB-AB (Merah-Kuning-Merah-Kuning)',
          target: 'Memperkuat working memory dan prediksi deret visual berulang.'
        });
      }

      if (domains['odd-one']?.tested && domains['odd-one'].score < 70) {
        recs.push({
          area: 'Klasifikasi Logis',
          activity: 'Permainan Memilah Mainan Darat vs Udara vs Air',
          target: 'Mempertajam kriteria klasifikasi dan konsep eliminasi anomali.'
        });
      }

      if (domains['animal-habitats']?.tested && domains['animal-habitats'].score < 70) {
        recs.push({
          area: 'Sebab-Akibat',
          activity: 'Buku Cerita Bergambar Ekosistem Hewan & Makanannya',
          target: 'Memperkaya skema pengetahuan umum tentang lingkungan hidup alami.'
        });
      }

      if (domains.counting?.tested && domains.counting.score < 70) {
        recs.push({
          area: 'Kuantitas & Berhitung',
          activity: 'Menghitung Benda Nyata (Kelereng / Buah) dengan Sentuhan Jari 1-5',
          target: 'Memantapkan korespondensi satu-ke-satu antara ucapan dan jumlah fisik.'
        });
      }

      if (recs.length === 0) {
        recs.push({
          area: 'Pengayaan Logika',
          activity: 'Teka-teki Labirin Sederhana & Permainan Balok Konstruksi Bebas',
          target: 'Mempertahankan daya nalar kritis dan kreativitas pemecahan masalah tingkat lanjut.'
        });
      }
    }

    return recs;
  }

  resetAllData(age = StorageService.getAgeGroup()) {
    StorageService.resetCompletedGames(age);
    try {
      localStorage.removeItem(this.getStorageKey(age));
    } catch (e) {
      console.warn('Failed to clear assessment telemetry:', e);
    }
  }
}

export const assessmentEngine = new AssessmentEngine();
