// src/constants/gameData.js

export const GAMES_INFO = Object.freeze([
  {
    id: 'shapes',
    title: 'Cocokkan Bentuk & Ruang',
    subtitleAge4: 'Tarik & pasang bentuk dasar ke bayangannya!',
    subtitleAge7: 'Analisis geometri bangun datar, ruang, dan jumlah sisi!',
    icon: '🔷',
    badge: 'Geometri',
    color: '#3B82F6'
  },
  {
    id: 'sizes',
    title: 'Urutan & Seriasi Logis',
    subtitleAge4: 'Urutkan benda dari yang paling kecil ke paling besar!',
    subtitleAge7: 'Urutkan beban berat, satuan waktu, dan nilai kuantitas!',
    icon: '🧩',
    badge: 'Seriasi',
    color: '#10B981'
  },
  {
    id: 'patterns',
    title: 'Tebak Pola & Deret',
    subtitleAge4: 'Lengkapi pola warna & benda berulang yang hilang!',
    subtitleAge7: 'Pecahkan deret bilangan loncat, pola bertingkat & rotasi!',
    icon: '🔶',
    badge: 'Pola Bilangan',
    color: '#8B5CF6'
  },
  {
    id: 'odd-one',
    title: 'Klasifikasi & Eliminasi',
    subtitleAge4: 'Mana hewan atau benda yang berbeda kelompok?',
    subtitleAge7: 'Analisis taksonomi: wujud zat, rantai makanan & konduktor!',
    icon: '🔍',
    badge: 'Klasifikasi',
    color: '#F59E0B'
  },
  {
    id: 'animal-habitats',
    title: 'Sebab-Akibat & Sains Alam',
    subtitleAge4: 'Bantu hewan menemukan tempat tinggal & makanannya!',
    subtitleAge7: 'Hubungan rantai makanan, fotosintesis & siklus ekosistem!',
    icon: '🌿',
    badge: 'Sains Logika',
    color: '#EC4899'
  },
  {
    id: 'counting',
    title: 'Penalaran Matematika Cilik',
    subtitleAge4: 'Berapa banyak buah dan teman yang ada di sini?',
    subtitleAge7: 'Pecahkan teka-teki aljabar visual, perkalian & bagi rata!',
    icon: '🍎',
    badge: 'Matematika',
    color: '#06B6D4'
  }
]);

// ==========================================
// 1. SHAPES (Bentuk & Geometri)
// ==========================================
export const SHAPE_LEVELS_AGE_4 = Object.freeze([
  {
    prompt: 'Pasangkan bentuk ke bayangan yang sama!',
    items: [
      { id: 'circle', name: 'Lingkaran Merah', shape: 'circle', color: '#EF4444', emoji: '🔴' },
      { id: 'square', name: 'Persegi Biru', shape: 'square', color: '#3B82F6', emoji: '🟦' },
      { id: 'triangle', name: 'Segitiga Hijau', shape: 'triangle', color: '#10B981', emoji: '🔺' }
    ]
  },
  {
    prompt: 'Pasangkan bintang, hati, dan lingkaran pada bayangannya!',
    items: [
      { id: 'star', name: 'Bintang Kuning', shape: 'star', color: '#F59E0B', emoji: '⭐' },
      { id: 'heart', name: 'Hati Pink', shape: 'heart', color: '#EC4899', emoji: '💖' },
      { id: 'circle-orange', name: 'Lingkaran Oranye', shape: 'circle', color: '#F97316', emoji: '🟠' }
    ]
  },
  {
    prompt: 'Tarik bentuk geometri ke bayangan yang cocok!',
    items: [
      { id: 'diamond', name: 'Wajik Ungu', shape: 'diamond', color: '#8B5CF6', emoji: '💎' },
      { id: 'triangle-yellow', name: 'Segitiga Kuning', shape: 'triangle', color: '#FBBF24', emoji: '📐' },
      { id: 'square-green', name: 'Persegi Hijau', shape: 'square', color: '#22C55E', emoji: '🟩' },
      { id: 'star-blue', name: 'Bintang Biru', shape: 'star', color: '#0EA5E9', emoji: '🌟' }
    ]
  },
  {
    prompt: 'Sekarang cocokkan empat bentuk baru dengan bayangannya!',
    items: [
      { id: 'oval-purple', name: 'Oval Ungu', shape: 'oval', color: '#A78BFA' },
      { id: 'rectangle-orange', name: 'Persegi Panjang Oranye', shape: 'rectangle', color: '#FB923C' },
      { id: 'hexagon-green', name: 'Segienam Hijau', shape: 'hexagon', color: '#4ADE80' },
      { id: 'heart-red', name: 'Hati Merah', shape: 'heart', color: '#FB7185' }
    ]
  },
  {
    prompt: 'Cari bayangan yang tepat meski warna bentuknya berbeda!',
    items: [
      { id: 'circle-yellow', name: 'Lingkaran Kuning', shape: 'circle', color: '#FACC15' },
      { id: 'triangle-purple', name: 'Segitiga Ungu', shape: 'triangle', color: '#A78BFA' },
      { id: 'square-orange', name: 'Persegi Oranye', shape: 'square', color: '#FB923C' },
      { id: 'star-green', name: 'Bintang Hijau', shape: 'star', color: '#4ADE80' }
    ]
  },
  {
    prompt: 'Tantangan akhir: cocokkan empat bentuk berbeda tanpa tertukar!',
    items: [
      { id: 'diamond-blue', name: 'Belah Ketupat Biru', shape: 'diamond', color: '#60A5FA' },
      { id: 'oval-pink', name: 'Oval Merah Muda', shape: 'oval', color: '#F9A8D4' },
      { id: 'hexagon-yellow', name: 'Segienam Kuning', shape: 'hexagon', color: '#FACC15' },
      { id: 'rectangle-green', name: 'Persegi Panjang Hijau', shape: 'rectangle', color: '#4ADE80' }
    ]
  }
]);

export const SHAPE_LEVELS_AGE_7 = Object.freeze([
  {
    prompt: 'Pasangkan bangun datar ke bayangannya yang cocok!',
    items: [
      { id: 'hexagon', name: 'Segienam', emoji: '🛑' },
      { id: 'rectangle', name: 'Persegi Panjang', emoji: '📱' },
      { id: 'rhombus', name: 'Belah Ketupat', emoji: '🔷' }
    ]
  },
  {
    prompt: 'Pasangkan bentuk bangun ruang ke bayangan yang sesuai!',
    items: [
      { id: 'cube', name: 'Kubus', emoji: '🧊' },
      { id: 'cylinder', name: 'Tabung', emoji: '🥫' },
      { id: 'cone', name: 'Kerucut', emoji: '🍦' }
    ]
  },
  {
    prompt: 'Cocokkan bangun ke bentuk bayangannya!',
    items: [
      { id: 'side-3', name: 'Segitiga', emoji: '🔺' },
      { id: 'side-4', name: 'Persegi', emoji: '⏹️' },
      { id: 'side-5', name: 'Segilima', emoji: '⬟' },
      { id: 'side-6', name: 'Segienam', emoji: '🛑' }
    ]
  },
  {
    prompt: 'Baca nama empat bangun datar yang lebih rumit, lalu pasangkan gambarnya!',
    items: [
      { id: 'flat-pentagon', name: 'Segilima', shape: 'pentagon', color: '#A78BFA' },
      { id: 'flat-hexagon', name: 'Segienam', shape: 'hexagon', color: '#4ADE80' },
      { id: 'flat-trapezoid', name: 'Trapesium', shape: 'trapezoid', color: '#FB923C' },
      { id: 'flat-parallelogram', name: 'Jajar Genjang', shape: 'parallelogram', color: '#60A5FA' }
    ]
  },
  {
    prompt: 'Pasangkan nama bangun ruang dengan gambar yang sesuai!',
    items: [
      { id: 'solid-sphere', name: 'Bola', shape: 'sphere', color: '#FB923C' },
      { id: 'solid-cube', name: 'Kubus', shape: 'cube', color: '#60A5FA' },
      { id: 'solid-cylinder', name: 'Tabung', shape: 'cylinder', color: '#A78BFA' },
      { id: 'solid-cone', name: 'Kerucut', shape: 'cone', color: '#4ADE80' }
    ]
  },
  {
    prompt: 'Tantangan campuran: bedakan bangun datar dan bangun ruang!',
    items: [
      { id: 'mixed-rhombus', name: 'Belah Ketupat', shape: 'rhombus', color: '#A78BFA' },
      { id: 'mixed-rectangle', name: 'Persegi Panjang', shape: 'rectangle', color: '#FB923C' },
      { id: 'mixed-cube', name: 'Kubus', shape: 'cube', color: '#60A5FA' },
      { id: 'mixed-cone', name: 'Kerucut', shape: 'cone', color: '#4ADE80' }
    ]
  }
]);

// ==========================================
// 2. SIZES & SERIATION (Urutan & Seriasi)
// ==========================================
export const SIZE_LEVELS_AGE_4 = Object.freeze([
  {
    prompt: 'Urutkan beruang dari yang PALING KECIL ke PALING BESAR!',
    type: 'ascending',
    items: [
      { id: 'bear-m', label: '', sizeRank: 2, scale: 0.8, emoji: 'animal:bear' },
      { id: 'bear-s', label: '', sizeRank: 1, scale: 0.55, emoji: 'animal:bear' },
      { id: 'bear-l', label: '', sizeRank: 3, scale: 1.1, emoji: 'animal:bear' }
    ]
  },
  {
    prompt: 'Urutkan apel manis dari PALING KECIL ke PALING BESAR!',
    type: 'ascending',
    items: [
      { id: 'apple-l', label: '', sizeRank: 3, scale: 1.1, emoji: '🍎' },
      { id: 'apple-s', label: '', sizeRank: 1, scale: 0.55, emoji: '🍎' },
      { id: 'apple-m', label: '', sizeRank: 2, scale: 0.8, emoji: '🍎' }
    ]
  },
  {
    prompt: 'Urutkan 4 bintang ini dari KECIL ke BESAR!',
    type: 'ascending',
    items: [
      { id: 'star-4', label: '', sizeRank: 4, scale: 1.25, emoji: '⭐' },
      { id: 'star-1', label: '', sizeRank: 1, scale: 0.5, emoji: '⭐' },
      { id: 'star-3', label: '', sizeRank: 3, scale: 1.0, emoji: '⭐' },
      { id: 'star-2', label: '', sizeRank: 2, scale: 0.75, emoji: '⭐' }
    ]
  },
  {
    prompt: 'Urutkan empat bunga dari yang PALING KECIL ke PALING BESAR!',
    items: [
      { id: 'flower-3', label: '', sizeRank: 3, scale: 1.0, emoji: '🌼' },
      { id: 'flower-1', label: '', sizeRank: 1, scale: 0.5, emoji: '🌼' },
      { id: 'flower-4', label: '', sizeRank: 4, scale: 1.25, emoji: '🌼' },
      { id: 'flower-2', label: '', sizeRank: 2, scale: 0.75, emoji: '🌼' }
    ]
  },
  {
    prompt: 'Sekarang balik urutannya: susun tiga apel dari BESAR ke KECIL!',
    type: 'descending',
    items: [
      { id: 'reverse-apple-2', label: '', sizeRank: 2, scale: 0.8, emoji: '🍎' },
      { id: 'reverse-apple-3', label: '', sizeRank: 3, scale: 0.55, emoji: '🍎' },
      { id: 'reverse-apple-1', label: '', sizeRank: 1, scale: 1.1, emoji: '🍎' }
    ]
  },
  {
    prompt: 'Tantangan akhir: urutkan empat bintang dari BESAR ke KECIL!',
    type: 'descending',
    items: [
      { id: 'reverse-star-4', label: '', sizeRank: 4, scale: 0.5, emoji: '⭐' },
      { id: 'reverse-star-1', label: '', sizeRank: 1, scale: 1.25, emoji: '⭐' },
      { id: 'reverse-star-3', label: '', sizeRank: 3, scale: 0.75, emoji: '⭐' },
      { id: 'reverse-star-2', label: '', sizeRank: 2, scale: 1.0, emoji: '⭐' }
    ]
  }
]);

export const SIZE_LEVELS_AGE_7 = Object.freeze([
  {
    prompt: 'Urutkan makhluk hidup ini dari bobot PALING RINGAN ke PALING BERAT!',
    items: [
      { id: 'w-cat', label: 'Kucing', sizeRank: 2, scale: 0.75, emoji: 'animal:cat' },
      { id: 'w-ant', label: 'Semut', sizeRank: 1, scale: 0.5, emoji: 'animal:ant' },
      { id: 'w-elephant', label: 'Gajah', sizeRank: 4, scale: 1.25, emoji: 'animal:elephant' },
      { id: 'w-horse', label: 'Kuda', sizeRank: 3, scale: 1.0, emoji: 'animal:horse' }
    ]
  },
  {
    prompt: 'Urutkan bilangan ini dari TERKECIL ke TERBESAR!',
    items: [
      { id: 'num-65', label: '65', sizeRank: 3, scale: 0.95, emoji: '6️⃣5️⃣' },
      { id: 'num-18', label: '18', sizeRank: 1, scale: 0.65, emoji: '1️⃣8️⃣' },
      { id: 'num-94', label: '94', sizeRank: 4, scale: 1.15, emoji: '9️⃣4️⃣' },
      { id: 'num-42', label: '42', sizeRank: 2, scale: 0.8, emoji: '4️⃣2️⃣' }
    ]
  },
  {
    prompt: 'Urutkan satuan waktu dari yang PALING SINGKAT ke PALING PANJANG!',
    items: [
      { id: 't-hour', label: '1 Jam', sizeRank: 3, scale: 0.95, emoji: '⏰' },
      { id: 't-sec', label: '1 Detik', sizeRank: 1, scale: 0.55, emoji: '⏱️' },
      { id: 't-day', label: '1 Hari', sizeRank: 4, scale: 1.2, emoji: '📅' },
      { id: 't-min', label: '1 Menit', sizeRank: 2, scale: 0.75, emoji: '⏳' }
    ]
  },
  {
    prompt: 'Bandingkan panjangnya: urutkan 50 cm, 1 m, 150 cm, dan 2 m!',
    items: [
      { id: 'length-150', label: '150 cm', sizeRank: 3, scale: 1.0, emoji: '📏' },
      { id: 'length-50', label: '50 cm', sizeRank: 1, scale: 0.65, emoji: '📏' },
      { id: 'length-200', label: '2 m', sizeRank: 4, scale: 1.15, emoji: '📏' },
      { id: 'length-100', label: '1 m', sizeRank: 2, scale: 0.8, emoji: '📏' }
    ]
  },
  {
    prompt: 'Urutkan nilai uang dari yang TERKECIL ke TERBESAR!',
    items: [
      { id: 'money-5', label: 'Rp5.000', sizeRank: 3, scale: 1.0, emoji: '💰' },
      { id: 'money-1', label: 'Rp1.000', sizeRank: 1, scale: 0.65, emoji: '💰' },
      { id: 'money-10', label: 'Rp10.000', sizeRank: 4, scale: 1.15, emoji: '💰' },
      { id: 'money-2', label: 'Rp2.000', sizeRank: 2, scale: 0.8, emoji: '💰' }
    ]
  },
  {
    prompt: 'Tantangan akhir: urutkan bilangan dari TERBESAR ke TERKECIL!',
    type: 'descending',
    items: [
      { id: 'reverse-num-34', label: '34', sizeRank: 3, scale: 0.75, emoji: '🔢' },
      { id: 'reverse-num-83', label: '83', sizeRank: 1, scale: 1.2, emoji: '🔢' },
      { id: 'reverse-num-12', label: '12', sizeRank: 4, scale: 0.6, emoji: '🔢' },
      { id: 'reverse-num-57', label: '57', sizeRank: 2, scale: 0.95, emoji: '🔢' }
    ]
  }
]);

// ==========================================
// 3. PATTERNS (Pola & Deret)
// ==========================================
export const PATTERN_LEVELS_AGE_4 = Object.freeze([
  {
    prompt: 'Lihat polanya: Apel, Pisang, Apel, Pisang... Apa berikutnya?',
    sequence: ['🍎', '🍌', '🍎', '🍌', '?'],
    options: ['🍌', '🍎', '🍇'],
    answer: '🍎',
    reason: 'Pola berulang: Apel lalu Pisang!'
  },
  {
    prompt: 'Lihat polanya: Merah, Biru, Merah, Biru... Lingkaran warna apa setelahnya?',
    sequence: ['🔴', '🔵', '🔴', '🔵', '?'],
    options: ['🔵', '🟡', '🔴'],
    answer: '🔴',
    reason: 'Pola selang-seling: Merah lalu Biru!'
  },
  {
    prompt: 'Kucing, Ikan, Kucing, Ikan... Siapa teman selanjutnya?',
    sequence: ['animal:cat', 'animal:fish', 'animal:cat', 'animal:fish', '?'],
    options: ['animal:dog', 'animal:fish', 'animal:cat'],
    answer: 'animal:cat',
    reason: 'Setelah Ikan, kembali ke Kucing!'
  },
  {
    prompt: 'Bintang, Bintang, Hati, Bintang, Bintang... Apa yang tepat?',
    sequence: ['⭐', '⭐', '💖', '⭐', '⭐', '?'],
    options: ['⭐', '💖', '🌙'],
    answer: '💖',
    reason: 'Dua bintang lalu satu hati!'
  },
  {
    prompt: 'Lihat polanya: Bulan, Bintang, Bintang, Bulan, Bintang, Bintang... Apa berikutnya?',
    sequence: ['🌙', '⭐', '⭐', '🌙', '⭐', '⭐', '?'],
    options: ['⭐', '🌙', '☀️'],
    answer: '🌙',
    reason: 'Satu bulan diikuti dua bintang, lalu diulang!'
  },
  {
    prompt: 'Merah, Biru, Kuning, Merah, Biru, Kuning... Warna apa berikutnya?',
    sequence: ['🔴', '🔵', '🟡', '🔴', '🔵', '🟡', '?'],
    options: ['🟡', '🔵', '🔴'],
    answer: '🔴',
    reason: 'Pola tiga warna berulang dari merah, biru, lalu kuning!'
  }
]);

export const PATTERN_LEVELS_AGE_7 = Object.freeze([
  {
    prompt: 'Perhatikan deret bilangan berikut: 2, 4, 6, 8, ... Berapakah angka selanjutnya?',
    sequence: ['2', '4', '6', '8', '?'],
    options: ['9', '10', '12'],
    answer: '10',
    reason: 'Pola selalu bertambah 2 di setiap langkah (2, 4, 6, 8, 10)!'
  },
  {
    prompt: 'Perhatikan deret bilangan berikut: 5, 10, 15, 20, ... Berapakah angka selanjutnya?',
    sequence: ['5', '10', '15', '20', '?'],
    options: ['22', '25', '30'],
    answer: '25',
    reason: 'Pola bertambah 5 di setiap langkah (kelipatan lima: 5, 10, 15, 20, 25)!'
  },
  {
    prompt: 'Perhatikan pola bilangan berikut: 30, 25, 20, 15, ... Angka berapa selanjutnya?',
    sequence: ['30', '25', '20', '15', '?'],
    options: ['12', '10', '5'],
    answer: '10',
    reason: 'Pola berkurang 5 setiap langkah (30 - 5 = 25 - 5 = 20 - 5 = 15 - 5 = 10)!'
  },
  {
    prompt: 'Perhatikan pola bilangan berikut: 1, 3, 6, 10, ... Angka berapakah yang mengisi tanda tanya?',
    sequence: ['1', '3', '6', '10', '?'],
    options: ['14', '15', '18'],
    answer: '15',
    reason: 'Pertambahan bertambah satu: +2, +3, +4, maka langkah berikutnya 10 + 5 = 15!'
  },
  {
    prompt: 'Perhatikan pola bilangan: 1, 2, 4, 8, ... Berapakah angka selanjutnya?',
    sequence: ['1', '2', '4', '8', '?'],
    options: ['10', '12', '16'],
    answer: '16',
    reason: 'Setiap bilangan menjadi dua kali bilangan sebelumnya!'
  },
  {
    prompt: 'Tantangan akhir: 2, 5, 9, 14, ... Berapakah angka selanjutnya?',
    sequence: ['2', '5', '9', '14', '?'],
    options: ['18', '20', '21'],
    answer: '20',
    reason: 'Selisihnya bertambah satu: +3, +4, +5, lalu +6. Jadi 14 + 6 = 20!'
  }
]);

// ==========================================
// 4. ODD ONE OUT (Klasifikasi)
// ==========================================
export const ODD_ONE_LEVELS_AGE_4 = Object.freeze([
  {
    prompt: 'Pilih satu yang BUKAN hewan darat / berbeda kelompok!',
    items: [
      { id: 'dog', emoji: 'animal:dog', name: 'Anjing', isOdd: false, reason: 'Hewan berkaki empat di darat' },
      { id: 'cat', emoji: 'animal:cat', name: 'Kucing', isOdd: false, reason: 'Hewan berkaki empat di darat' },
      { id: 'fish', emoji: 'animal:fish', name: 'Ikan', isOdd: true, reason: 'Ikan hidup dan berenang di dalam air!' },
      { id: 'cow', emoji: 'animal:cow', name: 'Sapi', isOdd: false, reason: 'Hewan berkaki empat di darat' }
    ]
  },
  {
    prompt: 'Pilih satu benda yang BUKAN buah lezat!',
    items: [
      { id: 'apple', emoji: '🍎', name: 'Apel', isOdd: false, reason: 'Buah untuk dimakan' },
      { id: 'banana', emoji: '🍌', name: 'Pisang', isOdd: false, reason: 'Buah untuk dimakan' },
      { id: 'car', emoji: '🚗', name: 'Mobil', isOdd: true, reason: 'Mobil adalah kendaraan, bukan makanan!' },
      { id: 'grape', emoji: '🍇', name: 'Anggur', isOdd: false, reason: 'Buah untuk dimakan' }
    ]
  },
  {
    prompt: 'Pilih kendaraan yang terbang di langit, bukan berjalan di jalan!',
    items: [
      { id: 'bus', emoji: '🚌', name: 'Bus', isOdd: false, reason: 'Kendaraan darat' },
      { id: 'truck', emoji: '🚚', name: 'Truk', isOdd: false, reason: 'Kendaraan darat' },
      { id: 'bicycle', emoji: '🚲', name: 'Sepeda', isOdd: false, reason: 'Kendaraan darat' },
      { id: 'airplane', emoji: '✈️', name: 'Pesawat', isOdd: true, reason: 'Pesawat terbang tinggi di langit!' }
    ]
  },
  {
    prompt: 'Mana yang warnanya BUKAN kuning cerah?',
    items: [
      { id: 'sun', emoji: '☀️', name: 'Matahari', isOdd: false, reason: 'Berwarna kuning' },
      { id: 'banana-color', emoji: '🍌', name: 'Pisang', isOdd: false, reason: 'Berwarna kuning' },
      { id: 'strawberry', emoji: '🍓', name: 'Stroberi', isOdd: true, reason: 'Stroberi warnanya merah manis!' },
      { id: 'chick', emoji: 'animal:chick', name: 'Anak Ayam', isOdd: false, reason: 'Berwarna kuning' }
    ]
  },
  {
    prompt: 'Pilih satu yang BUKAN alat untuk menulis atau mewarnai!',
    items: [
      { id: 'pencil', emoji: '✏️', name: 'Pensil', isOdd: false, reason: 'Dipakai untuk menulis' },
      { id: 'pen', emoji: '🖊️', name: 'Pena', isOdd: false, reason: 'Dipakai untuk menulis' },
      { id: 'crayon', emoji: '🖍️', name: 'Krayon', isOdd: false, reason: 'Dipakai untuk mewarnai' },
      { id: 'spoon', emoji: '🥄', name: 'Sendok', isOdd: true, reason: 'Sendok dipakai untuk makan, bukan menulis!' }
    ]
  },
  {
    prompt: 'Tantangan akhir: mana yang bentuknya BUKAN lingkaran?',
    items: [
      { id: 'red-circle', emoji: '🔴', name: 'Lingkaran Merah', isOdd: false, reason: 'Bentuknya lingkaran' },
      { id: 'blue-circle', emoji: '🔵', name: 'Lingkaran Biru', isOdd: false, reason: 'Bentuknya lingkaran' },
      { id: 'green-square', emoji: '🟩', name: 'Persegi Hijau', isOdd: true, reason: 'Persegi memiliki empat sisi lurus, bukan berbentuk lingkaran!' },
      { id: 'yellow-circle', emoji: '🟡', name: 'Lingkaran Kuning', isOdd: false, reason: 'Bentuknya lingkaran' }
    ]
  }
]);

export const ODD_ONE_LEVELS_AGE_7 = Object.freeze([
  {
    prompt: 'Pilih hewan KARNIVORA (pemakan daging), di antara hewan-hewan pemakan rumput!',
    items: [
      { id: 'cow', emoji: 'animal:cow', name: 'Sapi', isOdd: false, reason: 'Sapi memakan rumput dan tumbuhan' },
      { id: 'rabbit', emoji: 'animal:rabbit', name: 'Kelinci', isOdd: false, reason: 'Kelinci memakan sayur dan wortel' },
      { id: 'tiger', emoji: 'animal:tiger', name: 'Harimau', isOdd: true, reason: 'Harimau adalah karnivora pemburu daging, bukan herbivora!' },
      { id: 'goat', emoji: 'animal:goat', name: 'Kambing', isOdd: false, reason: 'Kambing memakan dedaunan rumput' }
    ]
  },
  {
    prompt: 'Pilih benda yang berwujud CAIR di antara benda-benda padat!',
    items: [
      { id: 'chair', emoji: '🪑', name: 'Kursi Kayu', isOdd: false, reason: 'Benda padat' },
      { id: 'water', emoji: '💧', name: 'Air Minum', isOdd: true, reason: 'Air adalah benda cair yang mengalir dan berubah bentuk sesuai wadah!' },
      { id: 'stone', emoji: '🪨', name: 'Batu Keras', isOdd: false, reason: 'Benda padat' },
      { id: 'book', emoji: '📖', name: 'Buku Tulis', isOdd: false, reason: 'Benda padat' }
    ]
  },
  {
    prompt: 'Pilih satu hewan MAMALIA (melahirkan & menyusui) di antara hewan yang bertelur!',
    items: [
      { id: 'chicken', emoji: 'animal:chicken', name: 'Ayam', isOdd: false, reason: 'Ayam berkembang biak dengan bertelur' },
      { id: 'duck', emoji: 'animal:duck', name: 'Bebek', isOdd: false, reason: 'Bebek berkembang biak dengan bertelur' },
      { id: 'cat-mam', emoji: 'animal:cat', name: 'Kucing', isOdd: true, reason: 'Kucing adalah mamalia yang melahirkan anak dan menyusuinya!' },
      { id: 'turtle', emoji: 'animal:turtle', name: 'Penyu', isOdd: false, reason: 'Penyu berkembang biak dengan bertelur di pasir' }
    ]
  },
  {
    prompt: 'Pilih benda ISOLATOR (bukan penghantar panas) di antara logam konduktor!',
    items: [
      { id: 'spoon', emoji: '🥄', name: 'Sendok Logam', isOdd: false, reason: 'Menghantarkan panas cepat' },
      { id: 'nail', emoji: '🔩', name: 'Paku Besi', isOdd: false, reason: 'Menghantarkan panas cepat' },
      { id: 'wood', emoji: '🪵', name: 'Kayu Kering', isOdd: true, reason: 'Kayu kering lebih sulit menghantarkan panas daripada logam!' },
      { id: 'key', emoji: '🗝️', name: 'Kunci Tembaga', isOdd: false, reason: 'Menghantarkan panas cepat' }
    ]
  },
  {
    prompt: 'Alat mana yang dipakai untuk mengukur suhu?',
    items: [
      { id: 'ruler', emoji: '📏', name: 'Penggaris', isOdd: false, reason: 'Mengukur panjang' },
      { id: 'clock', emoji: '⏰', name: 'Jam', isOdd: false, reason: 'Mengukur waktu' },
      { id: 'thermometer', emoji: '🌡️', name: 'Termometer', isOdd: true, reason: 'Termometer dipakai untuk mengukur suhu!' },
      { id: 'scale', emoji: '⚖️', name: 'Timbangan', isOdd: false, reason: 'Mengukur massa' }
    ]
  },
  {
    prompt: 'Tantangan akhir: pilih bangun DATAR di antara tiga bangun ruang!',
    items: [
      { id: 'cube', emoji: '🧊', name: 'Kubus', isOdd: false, reason: 'Bangun ruang' },
      { id: 'ball', emoji: '⚽', name: 'Bola', isOdd: false, reason: 'Bangun ruang' },
      { id: 'square', emoji: '🟦', name: 'Persegi', isOdd: true, reason: 'Persegi adalah bangun datar yang memiliki panjang dan lebar!' },
      { id: 'can', emoji: '🥫', name: 'Tabung', isOdd: false, reason: 'Bangun ruang' }
    ]
  }
]);

// ==========================================
// 5. ANIMAL HABITATS & SCIENCE (Sains & Sebab-Akibat)
// ==========================================
export const HABITAT_LEVELS_AGE_4 = Object.freeze([
  {
    prompt: 'Ke mana Monyet suka pergi dan apa makanan kesukaannya?',
    subject: { name: 'Monyet Cerdik', emoji: 'animal:monkey', text: 'Monyet suka makan apa ya?' },
    options: [
      { id: 'banana', emoji: '🍌', name: 'Pisang', isCorrect: true, cheer: 'Hore! Monyet suka sekali makan pisang!' },
      { id: 'meat', emoji: '🍖', name: 'Daging', isCorrect: false, cheer: 'Kurang pas, monyet lebih suka buah segar.' },
      { id: 'bone', emoji: '🦴', name: 'Tulang', isCorrect: false, cheer: 'Tulang adalah kesukaan anak anjing!' }
    ]
  },
  {
    prompt: 'Di mana ikan kecil tinggal?',
    subject: { name: 'Ikan Biru', emoji: 'animal:fish', text: 'Di mana rumah alami Ikan?' },
    options: [
      { id: 'ocean', emoji: '🌊', name: 'Laut / Air', isCorrect: true, cheer: 'Hebat! Ikan bernapas dan berenang di air!' },
      { id: 'tree', emoji: '🌳', name: 'Pohon Tinggi', isCorrect: false, cheer: 'Pohon adalah tempat burung bersarang.' },
      { id: 'house', emoji: '🏠', name: 'Garasi', isCorrect: false, cheer: 'Garasi tempat parkir mobil.' }
    ]
  },
  {
    prompt: 'Siapa yang menghasilkan telur dan berkokok di pagi hari?',
    subject: { name: 'Telur Hangat', emoji: '🥚', text: 'Telur ini berasal dari siapa?' },
    options: [
      { id: 'chicken', emoji: 'animal:chicken', name: 'Ibu Ayam', isCorrect: true, cheer: 'Pintar! Ayam betina yang bertelur!' },
      { id: 'lion', emoji: 'animal:lion', name: 'Singa', isCorrect: false, cheer: 'Singa melahirkan anaknya, bukan bertelur.' },
      { id: 'horse', emoji: 'animal:horse', name: 'Kuda', isCorrect: false, cheer: 'Kuda juga melahirkan anaknya.' }
    ]
  },
  {
    prompt: 'Burung ingin pulang untuk tidur. Di mana sarang burung?',
    subject: { name: 'Burung Kecil', emoji: 'animal:bird', text: 'Di mana sarang burung yang aman?' },
    options: [
      { id: 'tree-nest', emoji: '🌳', name: 'Pohon Rindang', isCorrect: true, cheer: 'Tepat sekali! Burung membuat sarang di dahan pohon!' },
      { id: 'underwater', emoji: '🌊', name: 'Dasar Laut', isCorrect: false, cheer: 'Burung tidak bisa bernapas di dasar laut.' },
      { id: 'cave', emoji: '🕳️', name: 'Lubang Gelap', isCorrect: false, cheer: 'Pohon yang tinggi jauh lebih nyaman untuk burung.' }
    ]
  },
  {
    prompt: 'Tanaman kecil mulai layu. Apa yang perlu kita berikan agar segar lagi?',
    subject: { name: 'Tanaman Kecil', emoji: '🌱', text: 'Apa yang dibutuhkan tanaman?' },
    options: [
      { id: 'water', emoji: '💧', name: 'Air', isCorrect: true, cheer: 'Benar! Air membantu tanaman tetap segar dan tumbuh.' },
      { id: 'stone', emoji: '🪨', name: 'Batu', isCorrect: false, cheer: 'Batu tidak dapat menggantikan air untuk tanaman.' },
      { id: 'toy', emoji: '🪀', name: 'Mainan', isCorrect: false, cheer: 'Mainan tidak membuat tanaman yang layu menjadi segar.' }
    ]
  },
  {
    prompt: 'Baju yang basah dijemur di luar. Apa yang membantu baju menjadi kering?',
    subject: { name: 'Baju Basah', emoji: '👕', text: 'Apa yang membantu mengeringkan baju?' },
    options: [
      { id: 'sun', emoji: '☀️', name: 'Panas Matahari', isCorrect: true, cheer: 'Tepat! Panas matahari membantu air pada baju menguap.' },
      { id: 'rain', emoji: '🌧️', name: 'Hujan', isCorrect: false, cheer: 'Hujan justru membuat baju semakin basah.' },
      { id: 'puddle', emoji: '💦', name: 'Genangan Air', isCorrect: false, cheer: 'Genangan air tidak membantu mengeringkan baju.' }
    ]
  }
]);

export const HABITAT_LEVELS_AGE_7 = Object.freeze([
  {
    prompt: 'Rantai Makanan Sawah: Padi dimakan belalang, lalu belalang dimakan katak. Siapakah pemangsa alami Katak?',
    subject: { name: 'Katak Sawah', emoji: 'animal:frog', text: 'Siapa predator pemangsa katak di sawah?' },
    options: [
      { id: 'snake', emoji: 'animal:snake', name: 'Ular Sawah', isCorrect: true, cheer: 'Tepat! Ular sawah memangsa katak dalam rantai makanan ekosistem sawah!' },
      { id: 'cow-eat', emoji: 'animal:cow', name: 'Sapi Rumput', isCorrect: false, cheer: 'Sapi hanya makan rumput, tidak memangsa hewan lain.' },
      { id: 'butterfly', emoji: 'animal:butterfly', name: 'Kupu-kupu', isCorrect: false, cheer: 'Kupu-kupu hanya mengisap nektar bunga manis.' }
    ]
  },
  {
    prompt: 'Fotosintesis Tumbuhan: Apa sumber energi utama yang dibutuhkan tumbuhan hijau untuk memasak makanannya?',
    subject: { name: 'Tumbuhan Hijau', emoji: '🌱', text: 'Energi apa yang menggerakkan proses fotosintesis daun?' },
    options: [
      { id: 'sunlight', emoji: '☀️', name: 'Cahaya Matahari', isCorrect: true, cheer: 'Benar sekali! Klorofil daun menangkap sinar matahari untuk fotosintesis menghasilkan oksigen!' },
      { id: 'fire', emoji: '🔥', name: 'Api Kompor', isCorrect: false, cheer: 'Api justru akan membakar dan merusak sel-sel tumbuhan.' },
      { id: 'wind', emoji: '💨', name: 'Angin Dingin', isCorrect: false, cheer: 'Angin membantu penyerbukan, tetapi bukan sumber energi fotosintesis.' }
    ]
  },
  {
    prompt: 'Siklus Air Bumi: Air laut yang dipanaskan matahari akan menguap ke atas dan berkumpul membentuk apa?',
    subject: { name: 'Uap Air Laut', emoji: '🌊', text: 'Uap air yang naik ke atmosfer akan berkondensasi menjadi apa?' },
    options: [
      { id: 'rain-clouds', emoji: '☁️', name: 'Gumpalan Awan Hujan', isCorrect: true, cheer: 'Pintar! Uap air mengembun menjadi awan, lalu turun kembali ke bumi sebagai air hujan!' },
      { id: 'sand', emoji: '🏖️', name: 'Gurun Pasir', isCorrect: false, cheer: 'Uap air berada di udara, tidak berubah menjadi butiran pasir.' },
      { id: 'coral', emoji: '🪸', name: 'Batu Karang', isCorrect: false, cheer: 'Uap air di atmosfer membentuk awan mendung pembawa hujan.' }
    ]
  },
  {
    prompt: 'Adaptasi Suhu Dingin: Hewan mana yang memiliki lapisan lemak tebal di bawah kulit untuk hidup di salju kutub?',
    subject: { name: 'Kutub Es Utara', emoji: '❄️', text: 'Hewan apa yang beradaptasi sempurna di lingkungan es abadi?' },
    options: [
      { id: 'polar-bear', emoji: 'animal:polar-bear', name: 'Beruang Kutub', isCorrect: true, cheer: 'Luar biasa! Beruang kutub memiliki bulu kedap air dan lemak tebal penahan dingin beku!' },
      { id: 'camel', emoji: 'animal:camel', name: 'Unta Gurun', isCorrect: false, cheer: 'Unta beradaptasi untuk gurun pasir yang panas dan gersang.' },
      { id: 'monkey-t', emoji: 'animal:monkey', name: 'Monyet Tropis', isCorrect: false, cheer: 'Monyet hidup di hutan hujan tropis yang hangat.' }
    ]
  },
  {
    prompt: 'Di daerah gurun yang kering, bagian mana dari kaktus yang menyimpan cadangan air?',
    subject: { name: 'Kaktus Gurun', emoji: '🌵', text: 'Cari tempat cadangan air kaktus.' },
    options: [
      { id: 'stem', emoji: '🌵', name: 'Batang Tebal', isCorrect: true, cheer: 'Benar! Batang kaktus yang tebal menyimpan cadangan air.' },
      { id: 'flower', emoji: '🌼', name: 'Bunga', isCorrect: false, cheer: 'Bunga membantu perkembangbiakan, bukan tempat utama menyimpan air.' },
      { id: 'thorn', emoji: '✳️', name: 'Duri', isCorrect: false, cheer: 'Duri membantu mengurangi penguapan, tetapi air disimpan di batang.' }
    ]
  },
  {
    prompt: 'Tantangan akhir: jika banyak pohon di lereng ditebang, apa yang lebih mungkin terjadi saat hujan deras?',
    subject: { name: 'Lereng Gundul', emoji: '⛰️', text: 'Apa akibat hilangnya akar pohon di lereng?' },
    options: [
      { id: 'erosion', emoji: '🌧️', name: 'Tanah Mudah Longsor', isCorrect: true, cheer: 'Tepat! Akar pohon membantu menahan tanah. Tanpa akar, tanah lebih mudah longsor saat hujan.' },
      { id: 'stronger', emoji: '🪨', name: 'Tanah Lebih Kuat', isCorrect: false, cheer: 'Tanpa akar pohon, tanah justru lebih mudah terbawa air.' },
      { id: 'more-shade', emoji: '🌳', name: 'Lereng Makin Teduh', isCorrect: false, cheer: 'Pohon yang ditebang mengurangi tempat berteduh.' }
    ]
  }
]);

// ==========================================
// 6. COUNTING & MATH LOGIC (Matematika & Aljabar Cilik)
// ==========================================
export const COUNTING_LEVELS_AGE_4 = Object.freeze([
  {
    prompt: 'Berapa mobil yang sedang parkir?',
    emoji: '🚗',
    count: 2,
    options: [1, 2, 3],
    speech: 'Pintar sekali! Ada dua mobil parkir!'
  },
  {
    prompt: 'Hitung ada berapa stroberi manis di kebun?',
    emoji: '🍓',
    count: 3,
    options: [2, 3, 4],
    speech: 'Satu, dua, tiga! Ada tiga stroberi manis!'
  },
  {
    prompt: 'Berapa banyak anak bebek kuning yang lucu?',
    emoji: 'animal:duck',
    count: 4,
    options: [3, 4, 5],
    speech: 'Hebat! Ada empat bebek berenang kwek-kwek!'
  },
  {
    prompt: 'Ayo hitung bintang gemerlap di langit!',
    emoji: '⭐',
    count: 5,
    options: [4, 5, 6],
    speech: 'Luar biasa! Ada lima bintang terang!'
  },
  {
    prompt: 'Sekarang hitung enam bunga satu per satu!',
    emoji: '🌼',
    count: 6,
    options: [5, 6, 7],
    speech: 'Bagus! Ada enam bunga yang berhasil kamu hitung!'
  },
  {
    prompt: 'Tiga apel ditambah dua apel. Berapa jumlah semuanya?',
    equationText: '🍎 🍎 🍎 + 🍎 🍎',
    count: 5,
    options: [4, 5, 6],
    speech: 'Tiga ditambah dua sama dengan lima apel!'
  }
]);

export const COUNTING_LEVELS_AGE_7 = Object.freeze([
  {
    prompt: 'Teka-Teki Logika: Berapakah nilai satu buah apel 🍎?',
    equationText: '🍎 + 🍎 = 8',
    count: 4,
    options: [3, 4, 5],
    speech: 'Hebat! Empat ditambah empat sama dengan delapan, jadi nilai apel adalah 4!'
  },
  {
    prompt: 'Jika nilai 🍎 = 4, berapakah nilai satu buah pisang 🍌?',
    equationText: '4 + 🍌 = 9',
    count: 5,
    options: [4, 5, 6],
    speech: 'Tepat sekali! Sembilan dikurangi empat adalah 5, jadi nilai pisang adalah 5!'
  },
  {
    prompt: 'Jika ada sembilan bintang dan empat diambil, berapa yang tersisa?',
    equationText: '9 ⭐ − 4 ⭐ = ?',
    count: 5,
    options: [4, 5, 6],
    speech: 'Benar! Sembilan dikurangi empat sama dengan lima bintang!'
  },
  {
    prompt: 'Ada 3 ekor ayam. Jika setiap ayam memiliki 2 kaki, berapakah jumlah seluruh kaki ayam?',
    equationText: 'animal:chicken animal:chicken animal:chicken',
    count: 6,
    options: [5, 6, 8],
    speech: 'Luar biasa! Tiga dikali dua sama dengan 6 kaki ayam!'
  },
  {
    prompt: 'Ada 10 permen manis dibagikan sama rata untuk 2 orang anak. Berapa permen yang diterima tiap anak?',
    equationText: '10 🍬 ÷ 2 anak',
    count: 5,
    options: [4, 5, 6],
    speech: 'Pintar! Sepuluh dibagi dua sama dengan lima permen untuk masing-masing anak!'
  },
  {
    prompt: 'Tantangan akhir: ada dua kelompok berisi tiga pensil, lalu ditambah empat pensil. Berapa semuanya?',
    equationText: '(2 × 3) + 4 = ?',
    count: 10,
    options: [8, 10, 12],
    speech: 'Hebat! Dua kelompok berisi tiga pensil menjadi enam, lalu ditambah empat menjadi sepuluh!'
  }
]);

// Helper selector functions by age group
export function getGameLevels(gameId, ageGroup = '4') {
  const isAge7 = ageGroup === '7';

  switch (gameId) {
    case 'shapes':
      return isAge7 ? SHAPE_LEVELS_AGE_7 : SHAPE_LEVELS_AGE_4;
    case 'sizes':
      return isAge7 ? SIZE_LEVELS_AGE_7 : SIZE_LEVELS_AGE_4;
    case 'patterns':
      return isAge7 ? PATTERN_LEVELS_AGE_7 : PATTERN_LEVELS_AGE_4;
    case 'odd-one':
      return isAge7 ? ODD_ONE_LEVELS_AGE_7 : ODD_ONE_LEVELS_AGE_4;
    case 'animal-habitats':
      return isAge7 ? HABITAT_LEVELS_AGE_7 : HABITAT_LEVELS_AGE_4;
    case 'counting':
      return isAge7 ? COUNTING_LEVELS_AGE_7 : COUNTING_LEVELS_AGE_4;
    default:
      return [];
  }
}

// Default export aliases
export const SHAPE_LEVELS = SHAPE_LEVELS_AGE_4;
export const SIZE_LEVELS = SIZE_LEVELS_AGE_4;
export const PATTERN_LEVELS = PATTERN_LEVELS_AGE_4;
export const ODD_ONE_LEVELS = ODD_ONE_LEVELS_AGE_4;
export const HABITAT_LEVELS = HABITAT_LEVELS_AGE_4;
export const COUNTING_LEVELS = COUNTING_LEVELS_AGE_4;
