/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoardTile, QuizQuestion, PhysicsMaterial, PhysicsChallenge } from '../types/game';

export const BOARD_TILES: BoardTile[] = [
  {
    index: 0,
    type: 'start',
    title: 'START & FINISH',
    subtitle: 'Laboratorium Optika',
    topic: 'Titik Awal & Akhir',
    icon: 'Flag',
    color: 'from-rose-500 to-red-600',
    contentId: 'start_0',
  },
  {
    index: 1,
    type: 'material',
    title: 'Sifat Cahaya',
    subtitle: 'Merambat Lurus & Gelombang',
    topic: 'Sifat Dasar Cahaya',
    icon: 'SunMedium',
    color: 'from-sky-500 to-blue-600',
    contentId: 'mat_1',
  },
  {
    index: 2,
    type: 'quiz',
    title: 'Kuis Sifat Cahaya',
    subtitle: 'Uji Berkas & Medium',
    topic: 'Perambatan Cahaya',
    icon: 'HelpCircle',
    color: 'from-amber-500 to-orange-600',
    contentId: 'quiz_1',
  },
  {
    index: 3,
    type: 'challenge',
    title: 'Misi Umbra & Penumbra',
    subtitle: 'Eksperimen Bayangan Gelap',
    topic: 'Bayangan Inti & Kabur',
    icon: 'Zap',
    color: 'from-indigo-500 to-violet-600',
    contentId: 'chal_1',
  },
  {
    index: 4,
    type: 'material',
    title: 'Hukum Pemantulan',
    subtitle: 'Hukum Snellius Pemantulan',
    topic: 'Pemantulan Datar',
    icon: 'Sparkles',
    color: 'from-sky-500 to-blue-600',
    contentId: 'mat_2',
  },
  {
    index: 5,
    type: 'quiz',
    title: 'Kuis Sudut Pantul',
    subtitle: 'Sudut Datang = Sudut Pantul',
    topic: 'Hukum Pemantulan',
    icon: 'HelpCircle',
    color: 'from-amber-500 to-orange-600',
    contentId: 'quiz_2',
  },
  {
    index: 6,
    type: 'bonus',
    title: 'BONUS FOTON OPTIK',
    subtitle: '+20 Poin Langsung!',
    topic: 'Foton Berenergi Tinggi',
    icon: 'Award',
    color: 'from-emerald-500 to-teal-600',
    contentId: 'bonus_1',
  },
  {
    index: 7,
    type: 'material',
    title: 'Cermin Datar',
    subtitle: 'Sifat Bayangan & Sudut',
    topic: 'Cermin Datar Bersudut',
    icon: 'Maximize2',
    color: 'from-sky-500 to-blue-600',
    contentId: 'mat_3',
  },
  {
    index: 8,
    type: 'quiz',
    title: 'Kuis Cermin Bersudut',
    subtitle: 'Rumus n = (360°/α) - 1',
    topic: 'Perbanyakan Bayangan',
    icon: 'HelpCircle',
    color: 'from-amber-500 to-orange-600',
    contentId: 'quiz_3',
  },
  {
    index: 9,
    type: 'challenge',
    title: 'Misi Fokus Cekung',
    subtitle: 'Titik Api Cermin Konkaf',
    topic: 'Cermin Lengkung',
    icon: 'Compass',
    color: 'from-indigo-500 to-violet-600',
    contentId: 'chal_2',
  },
  {
    index: 10,
    type: 'material',
    title: 'Cermin Lengkung',
    subtitle: 'Cekung (+) & Cembung (-)',
    topic: 'Sinar Istimewa Cermin',
    icon: 'Layers',
    color: 'from-sky-500 to-blue-600',
    contentId: 'mat_4',
  },
  {
    index: 11,
    type: 'quiz',
    title: 'Kuis Ruang Bayangan',
    subtitle: 'Ruang Benda + Bayangan = 5',
    topic: 'Pembentukan Bayangan',
    icon: 'HelpCircle',
    color: 'from-amber-500 to-orange-600',
    contentId: 'quiz_4',
  },
  {
    index: 12,
    type: 'challenge',
    title: 'Misi Cermin Tikungan',
    subtitle: 'Aplikasi Cermin Cembung',
    topic: 'Medan Pandang Luas',
    icon: 'Crosshair',
    color: 'from-indigo-500 to-violet-600',
    contentId: 'chal_3',
  },
  {
    index: 13,
    type: 'material',
    title: 'Pembiasan Cahaya',
    subtitle: 'Hukum Snellius & Indeks Bias',
    topic: 'Refraksi dalam Medium',
    icon: 'Divide',
    color: 'from-sky-500 to-blue-600',
    contentId: 'mat_5',
  },
  {
    index: 14,
    type: 'quiz',
    title: 'Kuis Arah Pembiasan',
    subtitle: 'Mendekati / Menjauhi Normal',
    topic: 'Indeks Bias Medium',
    icon: 'HelpCircle',
    color: 'from-amber-500 to-orange-600',
    contentId: 'quiz_5',
  },
  {
    index: 15,
    type: 'challenge',
    title: 'Misi Sudut Kritis',
    subtitle: 'Pemantulan Total & Serat Optik',
    topic: 'Fatamorgana & Fiber Optik',
    icon: 'Radio',
    color: 'from-indigo-500 to-violet-600',
    contentId: 'chal_4',
  },
  {
    index: 16,
    type: 'material',
    title: 'Lensa Tipis',
    subtitle: 'Lensa Cembung & Cekung',
    topic: 'Kekuatan Lensa (P = 100/f)',
    icon: 'Aperture',
    color: 'from-sky-500 to-blue-600',
    contentId: 'mat_6',
  },
  {
    index: 17,
    type: 'quiz',
    title: 'Kuis Kuat Lensa',
    subtitle: 'Satuan Dioptri (D)',
    topic: 'Perhitungan Lensa',
    icon: 'HelpCircle',
    color: 'from-amber-500 to-orange-600',
    contentId: 'quiz_6',
  },
  {
    index: 18,
    type: 'challenge',
    title: 'Misi Prisma Dispersi',
    subtitle: 'Penguraian Warna Spektrum Me-Ji-Ku-Hi-Bi-Ni-U',
    topic: 'Dispersi Cahaya Polikromatik',
    icon: 'Rainbow',
    color: 'from-indigo-500 to-violet-600',
    contentId: 'chal_5',
  },
  {
    index: 19,
    type: 'material',
    title: 'Indra Penglihatan',
    subtitle: 'Anatomi Mata & Akomodasi',
    topic: 'Mata sebagai Alat Optik Alami',
    icon: 'Eye',
    color: 'from-sky-500 to-blue-600',
    contentId: 'mat_7',
  },
  {
    index: 20,
    type: 'quiz',
    title: 'Kuis Cacat Mata',
    subtitle: 'Miopi vs Hipermetropi',
    topic: 'Lensa Kacamata Koreksi',
    icon: 'HelpCircle',
    color: 'from-amber-500 to-orange-600',
    contentId: 'quiz_7',
  },
  {
    index: 21,
    type: 'challenge',
    title: 'Misi Desain Periskop',
    subtitle: 'Penyusunan Cermin Kapal Selam',
    topic: 'Prinsip Sudut 45° Cermin',
    icon: 'Shield',
    color: 'from-indigo-500 to-violet-600',
    contentId: 'chal_6',
  },
  {
    index: 22,
    type: 'material',
    title: 'Alat Optik Buatan',
    subtitle: 'Mikroskop, Lup & Teropong',
    topic: 'Lensa Obyektif & Okuler',
    icon: 'Search',
    color: 'from-sky-500 to-blue-600',
    contentId: 'mat_8',
  },
  {
    index: 23,
    type: 'quiz',
    title: 'Kuis Mikroskop & Lup',
    subtitle: 'Perbesaran Bayangan Total',
    topic: 'Alat Bantu Penglihatan',
    icon: 'HelpCircle',
    color: 'from-amber-500 to-orange-600',
    contentId: 'quiz_8',
  },
];

export interface SafeQuiz {
  id: string;
  tileIndex: number;
  title: string;
  topic: string;
  question: string;
  options: string[];
  points: number;
}

export interface QuizWithAnswer extends QuizQuestion {
  correctIndex: number;
}

// Master quizzes with answers (used by backend validation)
export const MASTER_QUIZZES: Record<string, QuizWithAnswer> = {
  quiz_1: {
    id: 'quiz_1',
    tileIndex: 2,
    title: 'Kuis: Sifat Perambatan Cahaya',
    topic: 'Sifat Dasar Cahaya',
    question: 'Di dalam ruang gelap, tiga karton berlubang diletakkan sejajar di depan sebatang lilin yang menyala. Cahaya lilin hanya dapat terlihat dari balik lubang karton terakhir apabila ketiga lubang berada pada satu garis lurus. Peristiwa ini membuktikan bahwa...',
    options: [
      'A. Cahaya mengalami pembiasan ketika melewati celah',
      'B. Cahaya merambat lurus dalam medium homogen',
      'C. Cahaya memerlukan medium zat padat untuk merambat',
      'D. Cahaya mengalami pemantulan sempurna pada kertas'
    ],
    correctIndex: 1,
    explanation: 'Cahaya merambat lurus pada medium seragam (homogen). Ketika ketiga lubang segaris lurus, berkas cahaya dapat lolos langsung ke mata pengamat.',
    points: 10,
  },
  quiz_2: {
    id: 'quiz_2',
    tileIndex: 5,
    title: 'Kuis: Hukum Pemantulan Cahaya',
    topic: 'Hukum Pemantulan Snellius',
    question: 'Sinar laser diarahkan ke cermin datar dengan sudut datang sebesar 35° terhadap garis normal. Berapakah besar sudut pantul yang dibentuk oleh sinar pantul terhadap bidang permukaan cermin?',
    options: [
      'A. 35°',
      'B. 55°',
      'C. 70°',
      'D. 90°'
    ],
    correctIndex: 1,
    explanation: 'Menurut Hukum Pemantulan, sudut pantul (r) = sudut datang (i) = 35° terhadap garis normal. Maka sudut terhadap bidang cermin = 90° - 35° = 55°.',
    points: 10,
  },
  quiz_3: {
    id: 'quiz_3',
    tileIndex: 8,
    title: 'Kuis: Cermin Datar Bersudut',
    topic: 'Perbanyakan Jumlah Bayangan',
    question: 'Dua cermin datar disusun saling berhadapan membentuk sudut apit 60°. Sebuah kelereng diletakkan di antara kedua cermin tersebut. Berapakah jumlah bayangan kelereng yang terbentuk?',
    options: [
      'A. 4 bayangan',
      'B. 5 bayangan',
      'C. 6 bayangan',
      'D. 7 bayangan'
    ],
    correctIndex: 1,
    explanation: 'Rumus jumlah bayangan dua cermin bersudut: n = (360° / α) - 1. Untuk α = 60°: n = (360° / 60°) - 1 = 6 - 1 = 5 bayangan.',
    points: 10,
  },
  quiz_4: {
    id: 'quiz_4',
    tileIndex: 11,
    title: 'Kuis: Pembentukan Bayangan Cermin Cekung',
    topic: 'Aturan Nomor Ruang Benda & Bayangan',
    question: 'Sebuah lilin diletakkan di depan cermin cekung pada jarak yang lebih besar dari titik pusat kelengkungan cermin (R atau 2F), yaitu di Ruang III. Sifat bayangan yang akan terbentuk adalah...',
    options: [
      'A. Nyata, terbalik, dan diperkecil',
      'B. Nyata, tegak, dan diperbesar',
      'C. Maya, tegak, dan diperbesar',
      'D. Maya, terbalik, dan sama besar'
    ],
    correctIndex: 0,
    explanation: 'Benda di Ruang III (s > 2F) akan menghasilkan bayangan di Ruang II (antara F dan 2F) karena Ruang Benda + Ruang Bayangan = 5 (3 + 2 = 5). Bayangan bersifat nyata, terbalik, dan diperkecil.',
    points: 10,
  },
  quiz_5: {
    id: 'quiz_5',
    tileIndex: 14,
    title: 'Kuis: Arah Pembiasan Cahaya',
    topic: 'Refraksi Medium',
    question: 'Berkas cahaya merambat miring dari medium udara (indeks bias n1 = 1,00) masuk ke dalam air (indeks bias n2 = 1,33). Yang terjadi pada arah perambatan berkas cahaya dan kecepatannya adalah...',
    options: [
      'A. Dibiaskan menjauhi garis normal dan kecepatannya bertambah',
      'B. Dibiaskan mendekati garis normal dan kecepatannya berkurang',
      'C. Diteruskan lurus tanpa pembelokan dan kecepatannya tetap',
      'D. Mengalami pemantulan baur ke segala arah'
    ],
    correctIndex: 1,
    explanation: 'Cahaya merambat dari medium kurang rapat (indeks bias kecil) ke medium lebih rapat (indeks bias besar), maka kecepatan cahaya melambat dan arah berkas dibiaskan mendekati garis normal.',
    points: 10,
  },
  quiz_6: {
    id: 'quiz_6',
    tileIndex: 17,
    title: 'Kuis: Kekuatan Lensa Kacamata',
    topic: 'Perhitungan Kuat Lensa (Dioptri)',
    question: 'Seorang pasien memeriksakan matanya ke dokter mata dan didiagnosis membutuhkan lensa kacamata dengan jarak fokus +50 cm (+0,5 m). Berapakah kekuatan lensa (P) kacamata yang harus digunakan?',
    options: [
      'A. +1,0 Dioptri',
      'B. +2,0 Dioptri',
      'C. +0,5 Dioptri',
      'D. -2,0 Dioptri'
    ],
    correctIndex: 1,
    explanation: 'Rumus kekuatan lensa: P = 100 / f (dalam cm) atau P = 1 / f (dalam meter). P = 100 / 50 = +2,0 Dioptri (lensa cembung/positif untuk rabun dekat).',
    points: 10,
  },
  quiz_7: {
    id: 'quiz_7',
    tileIndex: 20,
    title: 'Kuis: Cacat Mata & Lensa Koreksi',
    topic: 'Mata Manusia & Gangguan Refraksi',
    question: 'Seorang siswa tidak dapat melihat tulisan di papan tulis kelas dengan jelas, namun dapat membaca buku pada jarak normal. Bayangan benda jatuh di depan retina. Gangguan mata yang dialami siswa dan lensa kacamata yang tepat untuk membantunya adalah...',
    options: [
      'A. Hipermetropi, dibantu lensa cembung (positif)',
      'B. Presbiopi, dibantu kacamata bifokal',
      'C. Miopi (rabun jauh), dibantu lensa cekung (negatif)',
      'D. Astigmatisme, dibantu lensa silindris'
    ],
    correctIndex: 2,
    explanation: 'Miopi (rabun jauh) terjadi karena bola mata terlalu lonjong sehingga bayangan jatuh di depan retina. Lensa cekung (divergen/negatif) membiaskan berkas agar bayangan jatuh tepat di retina.',
    points: 10,
  },
  quiz_8: {
    id: 'quiz_8',
    tileIndex: 23,
    title: 'Kuis: Mikroskop & Lup',
    topic: 'Alat Optik Pembesar',
    question: 'Sebuah mikroskop menggunakan dua lensa positif: lensa obyektif (dekat objek) dan lensa okuler (dekat mata). Bayangan akhir yang dilihat oleh mata pengamat melalui mikroskop memiliki sifat...',
    options: [
      'A. Nyata, tegak, dan diperbesar',
      'B. Maya, terbalik terhadap benda asli, dan diperbesar',
      'C. Nyata, terbalik terhadap benda asli, dan sama besar',
      'D. Maya, tegak, dan diperkecil'
    ],
    correctIndex: 1,
    explanation: 'Lensa objektif membentuk bayangan nyata, terbalik, diperbesar. Bayangan ini menjadi benda bagi lensa okuler yang bertindak seperti lup sehingga menghasilkan bayangan akhir: maya, terbalik (terhadap benda mula-mula), dan sangat diperbesar.',
    points: 10,
  },
};

// Physics Materials
export const PHYSICS_MATERIALS: Record<string, PhysicsMaterial> = {
  mat_1: {
    id: 'mat_1',
    tileIndex: 1,
    title: 'Sifat-Sifat Dasar Cahaya',
    topic: 'Cahaya sebagai Gelombang Elektromagnetik',
    summary: 'Cahaya adalah gelombang elektromagnetik yang dapat merambat tanpa memerlukan medium perantara (dapat menembus ruang hampa udara) dengan kelajuan konstan c ≈ 3 × 10⁸ m/s.',
    keyPoints: [
      '1. Merambat Lurus: Berkas cahaya selalu merambat lurus dalam medium homogen atau seragam.',
      '2. Dapat Dipantulkan (Refleksi): Memantul ketika mengenai permukaan pembatas dua medium.',
      '3. Dapat Dibiaskan (Refraksi): Membelok saat melintasi dua medium dengan kerapatan optik berbeda.',
      '4. Dapat Mengalami Dispersi: Penguraian cahaya putih (polikromatik) menjadi warna spektrum (monokromatik).',
      '5. Menembus Benda Bening: Cahaya dapat menerobos kaca, air, atau udara bening.'
    ],
    formula: 'Kelajuan Cahaya: c = λ × f ≈ 300.000 km/s',
    funFact: 'Cahaya dari Matahari membutuhkan waktu sekitar 8 menit 20 detik untuk sampai ke permukaan Bumi!',
    application: 'Pembuatan lampu senter dengan reflektor parabola, proyektor, dan laser penunjuk.',
  },
  mat_2: {
    id: 'mat_2',
    tileIndex: 4,
    title: 'Hukum Pemantulan Cahaya',
    topic: 'Hukum Snellius Pemantulan',
    summary: 'Ketika seberkas cahaya mengenai permukaan datar atau mengkilap, berkas cahaya akan dipantulkan mengikuti dua kaidah utama hukum pemantulan.',
    keyPoints: [
      '1. Sinar datang, sinar pantul, dan garis normal terletak pada satu bidang datar yang sama.',
      '2. Sudut datang (i) besarnya selalu SAMA DENGAN sudut pantul (r): i = r.',
      '3. Garis Normal: Garis khayal yang tegak lurus (90°) terhadap bidang pantul di titik jatuhnya sinar.',
      '4. Pemantulan Teratur: Terjadi pada permukaan halus/rata (cermin), berkas pantul sejajar.',
      '5. Pemantulan Baur (Difus): Terjadi pada permukaan kasar/tidak rata, berkas pantul terpantul ke segala arah sehingga benda terlihat dari berbagai sudut.'
    ],
    formula: 'Sudut Datang = Sudut Pantul (∠i = ∠r)',
    funFact: 'Jika permukaan meja tidak memantulkan cahaya secara baur, kamu hanya bisa melihat pantulan meja dari satu sudut tertentu seperti cermin!',
    application: 'Cermin rias, cermin periskop kapal selam, dan pemantul lampu depan sepeda motor.',
  },
  mat_3: {
    id: 'mat_3',
    tileIndex: 7,
    title: 'Cermin Datar & Perbanyakan Bayangan',
    topic: 'Sifat Bayangan pada Cermin Datar',
    summary: 'Cermin datar adalah cermin dengan permukaan pantul berupa bidang datar sempurna. Bayangan yang terbentuk selalu memiliki jarak yang sama dengan jarak benda ke cermin.',
    keyPoints: [
      '1. Sifat Bayangan: Maya (semu), tegak, dan sama besar (perbesaran M = 1).',
      '2. Jarak benda ke cermin (s) sama dengan jarak bayangan ke cermin (s\'): s = s\'.',
      '3. Terbalik Sisi (Lateral Inversion): Kanan benda menjadi kiri bayangan.',
      '4. Cermin Bersudut: Jika dua cermin datar membentuk sudut α, jumlah bayangan dihitung dengan rumus n = (360°/α) - 1.'
    ],
    formula: 'n = (360° / α) - 1',
    funFact: 'Tulisan "AMBULANCE" di bagian depan mobil ambulans sengaja dicetak terbalik agar pengendara di depannya membacanya tegak lurus lewat kaca spion cermin datar!',
    application: 'Cermin rias, cermin lemari pakaian, dan kaleidoskop mainan berputar.',
  },
  mat_4: {
    id: 'mat_4',
    tileIndex: 10,
    title: 'Cermin Lengkung (Cekung & Cembung)',
    topic: 'Sinar-Sinar Istimewa Cermin Lengkung',
    summary: 'Cermin lengkung dibedakan menjadi Cermin Cekung (konkaf/konvergen) yang mengumpulkan sinar dan Cermin Cembung (konveks/divergen) yang menyebarkan berkas sinar.',
    keyPoints: [
      '1. Hubungan Jari-Jari (R) & Fokus (f): f = 1/2 R.',
      '2. Cermin Cekung (f bertanda +): Bersifat konvergen (mengumpulkan cahaya). Bayangannya bisa nyata/maya tergantung posisi benda.',
      '3. Cermin Cembung (f bertanda -): Bersifat divergen (menyebarkan cahaya). Bayangannya selalu MAYA, TEGAK, DIPERKECIL.',
      '4. Aturan Ruang Esbach: Ruang Benda + Ruang Bayangan = 5. Jika Ruang Bayangan > Ruang Benda maka diperbesar.'
    ],
    formula: '1/f = 1/s + 1/s\'  dan  M = |s\' / s| = |h\' / h|',
    funFact: 'Sendok stainless steel bersih memiliki dua sisi: sisi cekung membalik wajahmu, sedangkan sisi cembung membuat wajahmu tegak tapi mengecil!',
    application: 'Senter dokter gigi (cekung), reflektor lampu mobil (cekung), dan cermin pengawas toko / tikungan (cembung).',
  },
  mat_5: {
    id: 'mat_5',
    tileIndex: 13,
    title: 'Pembiasan Cahaya (Refraksi)',
    topic: 'Hukum Snellius Pembiasan & Indeks Bias',
    summary: 'Pembiasan adalah peristiwa pembelokan arah rambat cahaya ketika memasuki medium lain yang kerapatan optiknya berbeda akibat perubahan kelajuan gelombang cahaya.',
    keyPoints: [
      '1. Rapat ke Renggang: Berkas dibiaskan MENJAUHI garis normal (contoh: dari air ke udara).',
      '2. Renggang ke Rapat: Berkas dibiaskan MENDEKATI garis normal (contoh: dari udara ke kaca).',
      '3. Sinar tegak lurus bidang batas (sudut datang 0°): Diteruskan tanpa pembelokan.',
      '4. Indeks Bias Mutlak (n): n = c / v (perbandingan kecepatan cahaya di ruang hampa terhadap kelajuan di medium).'
    ],
    formula: 'Hukum Snellius: n1 × sin(i) = n2 × sin(r)',
    funFact: 'Pensil yang dimasukkan miring ke dalam gelas berisi air tampak seperti patah akibat pembiasan cahaya dari air menuju udara!',
    application: 'Kacamata renang, lensa kamera, prisma optik, dan sedotan dalam gelas air.',
  },
  mat_6: {
    id: 'mat_6',
    tileIndex: 16,
    title: 'Lensa Tipis & Kekuatan Lensa',
    topic: 'Lensa Cembung (Positif) dan Lensa Cekung (Negatif)',
    summary: 'Lensa adalah benda tembus cahaya bening yang dibatasi oleh dua bidang lengkung atau satu bidang datar dan satu bidang lengkung.',
    keyPoints: [
      '1. Lensa Cembung (Bikonveks / Positif): Bagian tengah lebih tebal, mengumpulkan berkas sinar (konvergen). Titik fokus bernilai positif (+).',
      '2. Lensa Cekung (Bikonkaf / Negatif): Bagian tengah lebih tipis, menyebarkan berkas sinar (divergen). Titik fokus bernilai negatif (-).',
      '3. Kuat Lensa (P): Kemampuan lensa membiaskan sinar, diukur dalam satuan Dioptri (D).'
    ],
    formula: 'P = 1 / f (f dalam meter) atau P = 100 / f (f dalam cm)',
    funFact: 'Lensa cembung dapat membakar secarik daun kering dengan memfokuskan cahaya matahari ke satu titik api kecil!',
    application: 'Kacamata baca, kaca pembesar (lup), proyektor bioskop, dan lensa kamera smartphone.',
  },
  mat_7: {
    id: 'mat_7',
    tileIndex: 19,
    title: 'Mata Manusia sebagai Alat Optik Alami',
    topic: 'Anatomi Mata, Daya Akomodasi & Cacat Mata',
    summary: 'Mata manusia adalah organ optik tercanggih yang dilengkapi kornea, pupil, iris, lensa kristalin fleksibel, dan retina sebagai penangkap bayangan nyata, terbalik, diperkecil.',
    keyPoints: [
      '1. Daya Akomodasi: Kemampuan otot siliaris menebalkan atau memipihkan lensa mata agar bayangan selalu tepat di retina.',
      '2. Titik Dekat (Punctum Proximum / PP): Jarak terdekat mata dapat melihat jelas berakomodasi maksimum (normal ≈ 25 cm).',
      '3. Titik Jauh (Punctum Remotum / PR): Jarak terjauh mata dapat melihat jelas tanpa akomodasi (mata normal = tak terhingga / ∞).',
      '4. Miopi (Rabun Jauh): Bayangan di depan retina, dibantu kacamata lensa cekung (P = -100/PR).',
      '5. Hipermetropi (Rabun Dekat): Bayangan di belakang retina, dibantu kacamata lensa cembung (P = 100/sn - 100/PP).'
    ],
    formula: 'Miopi: P = -100 / PR (cm) | Hipermetropi: P = 4 - (100 / PP cm)',
    funFact: 'Meskipun bayangan yang terbentuk di retina mata sebenarnya terbalik, otak kita secara otomatis memprosesnya sehingga kita melihat benda tegak!',
    application: 'Kacamata minus untuk pelajar, operasi LASIK mata, dan kacamata plus untuk membaca.',
  },
  mat_8: {
    id: 'mat_8',
    tileIndex: 22,
    title: 'Alat-Alat Optik Buatan',
    topic: 'Lup, Mikroskop, Teleskop & Kamera',
    summary: 'Alat optik buatan dirancang oleh manusia untuk membantu daya penglihatan mata melampaui batas kemampuannya melihat objek yang sangat kecil atau sangat jauh.',
    keyPoints: [
      '1. Lup (Kaca Pembesar): Terdiri dari satu lensa cembung. Objek diletakkan di antara lensa dan fokus (s < f). Bayangan: Maya, tegak, diperbesar.',
      '2. Mikroskop: Memiliki dua lensa cembung: Lensa Obyektif (fob < fok) dan Lensa Okuler. Memperbesar mikroorganisme ribuan kali lipat.',
      '3. Teleskop / Teropong: Mengamati benda langit yang sangat jauh. Lensa obyektif berfokus besar (fob > fok).',
      '4. Kamera: Memiliki diafragma (seperti iris) dan sensor digital / film (seperti retina).'
    ],
    formula: 'Perbesaran Total Mikroskop: M_total = M_obj × M_ok = |s\'_ob / s_ob| × (sn / f_ok + 1)',
    funFact: 'Antonie van Leeuwenhoek pertama kali melihat bakteri dan sel darah merah hidup menggunakan mikroskop sederhana buatannya sendiri pada tahun 1674!',
    application: 'Laboratorium biologi, observatorium astronomi, perbaikan jam tangan, dan fotografi.',
  },
};

// Physics Challenges
export const PHYSICS_CHALLENGES: Record<string, PhysicsChallenge> = {
  chal_1: {
    id: 'chal_1',
    tileIndex: 3,
    title: 'Tantangan Fisika: Zona Umbra & Penumbra',
    topic: 'Gerhana & Bayangan Gelap',
    description: 'Sebuah sumber cahaya berukuran besar menyinari bola pejal opaque (tidak tembus cahaya) ke layar di belakangnya. Terbentuk dua daerah bayangan: daerah tengah yang sangat gelap dan daerah pinggir yang remang-remang.',
    task: 'Pilihlah kesimpulan fisika yang benar mengenai fenomena bayangan tersebut:',
    hints: [
      'Umbra berasal dari bahasa Latin yang berarti bayangan inti / mutlak.',
      'Penumbra menerima sebagian cahaya dari sumber cahaya yang lebar.'
    ],
    options: [
      'A. Daerah gelap gulita disebut Umbra, dan daerah samar/remang disebut Penumbra',
      'B. Daerah gelap gulita disebut Penumbra karena tidak ada cahaya sama sekali',
      'C. Bayangan remang terbentuk karena cahaya mengalami dispersi warna',
      'D. Bayangan gelap selalu berukuran lebih kecil dari bendanya di mana pun layarnya'
    ],
    correctOptionIndex: 0,
    explanation: 'Tepat sekali! Umbra adalah daerah bayangan inti yang sama sekali tidak menerima cahaya, sedangkan Penumbra adalah daerah bayangan kabur/samar yang masih menerima sebagian sinar.',
    rewardPoints: 10,
  },
  chal_2: {
    id: 'chal_2',
    tileIndex: 9,
    title: 'Tantangan Fisika: Menghitung Jarak Fokus Cekung',
    topic: 'Laboratorium Cermin Cekung',
    description: 'Sebuah lilin diletakkan 30 cm di depan cermin cekung. Bayangan nyata lilin tertangkap jelas pada selembar kertas putih pada jarak 60 cm di depan cermin.',
    task: 'Hitunglah panjang jarak fokus (f) cermin cekung tersebut dengan persamaan 1/f = 1/s + 1/s\':',
    hints: [
      '1/f = 1/30 + 1/60',
      'Samakan penyebut menjadi 60: 2/60 + 1/60 = 3/60',
      'f = 60 / 3'
    ],
    options: [
      'A. f = 10 cm',
      'B. f = 20 cm',
      'C. f = 45 cm',
      'D. f = 90 cm'
    ],
    correctOptionIndex: 1,
    explanation: 'Hebat! 1/f = 1/30 + 1/60 = 2/60 + 1/60 = 3/60. Maka f = 60 / 3 = 20 cm. Jarak fokus bernilai positif (+20 cm).',
    rewardPoints: 10,
  },
  chal_3: {
    id: 'chal_3',
    tileIndex: 12,
    title: 'Tantangan Fisika: Rekayasa Cermin Tikungan Jalan',
    topic: 'Penerapan Cermin Cembung',
    description: 'Dinas Perhubungan ingin memasang cermin di persimpangan jalan atau tikungan tajam pegunungan yang rawan kecelakaan (blind spot).',
    task: 'Mengapa cermin cembung selalu dipilih untuk keselamatan jalan raya dibandingkan cermin datar atau cermin cekung?',
    hints: [
      'Perhatikan luas sudut pandang (area jangkauan) yang dapat dipantulkan.',
      'Perhatikan juga sifat tegak atau terbaliknya bayangan pengendara.'
    ],
    options: [
      'A. Karena cermin cembung menghasilkan bayangan nyata yang terbalik sehingga menarik perhatian',
      'B. Karena cermin cembung mengumpulkan berkas sinar matahari sehingga menghangatkan jalan',
      'C. Karena cermin cembung selalu menghasilkan bayangan tegak diperkecil dan memiliki bidang pandang (medan penglihatan) yang jauh lebih luas',
      'D. Karena cermin cembung membiaskan cahaya ke udara'
    ],
    correctOptionIndex: 2,
    explanation: 'Luar biasa! Cermin cembung memiliki bidang pandang yang sangat luas dan sifat bayangannya selalu tegak serta diperkecil, sehingga pengemudi dapat melihat kendaraan lain yang terhalang tikungan.',
    rewardPoints: 10,
  },
  chal_4: {
    id: 'chal_4',
    tileIndex: 15,
    title: 'Tantangan Fisika: Rahasia Serat Optik & Fatamorgana',
    topic: 'Pemantulan Sempurna (Total Internal Reflection)',
    description: 'Kabel internet modern menggunakan serat optik (fiber optic) yang mampu mentransmisikan data berkecepatan cahaya melintasi samudra tanpa kehilangan sinyal.',
    task: 'Syarat mutlak agar terjadi peristiwa pemantulan sempurna pada serat optik adalah:',
    hints: [
      'Cahaya harus datang dari medium yang lebih padat ke medium yang kurang padat.',
      'Sudut datang harus melebihi batas sudut tertentu (sudut kritis).'
    ],
    options: [
      'A. Cahaya merambat dari medium optik rapat ke kurang rapat dengan sudut datang > sudut kritis',
      'B. Cahaya merambat dari medium optik renggang ke medium padat dengan sudut datang = 0°',
      'C. Cahaya harus berupa sinar ultraviolet berkekuatan tinggi',
      'D. Cahaya harus melewati cermin cekung di dalam tabung hampa'
    ],
    correctOptionIndex: 0,
    explanation: 'Tepat sekali! Pemantulan internal total terjadi jika: 1) Cahaya merambat dari medium lebih rapat ke kurang rapat, dan 2) Sudut datang sinar lebih besar daripada sudut kritis (i > θc), sehingga tidak ada sinar yang dibiaskan ke luar kabel.',
    rewardPoints: 10,
  },
  chal_5: {
    id: 'chal_5',
    tileIndex: 18,
    title: 'Tantangan Fisika: Spektrum Prisma & Pelangi',
    topic: 'Dispersi Gelombang Cahaya',
    description: 'Sir Isaac Newton membuktikan bahwa cahaya matahari (putih) dapat diuraikan oleh prisma kaca menjadi spektrum warna pelangi: Merah, Jingga, Kuning, Hijau, Biru, Nila, Ungu.',
    task: 'Warna manakah dalam spektrum pelangi yang mengalami pembelokan/deviasi PALING BESAR saat melintasi prisma dan mengapa?',
    hints: [
      'Panjang gelombang terpanjang (merah) paling sedikit dibelokkan.',
      'Frekuensi tertinggi dan panjang gelombang terpendek mengalami indeks bias terbesar.'
    ],
    options: [
      'A. Merah, karena memiliki panjang gelombang paling panjang',
      'B. Kuning, karena berada tepat di tengah spektrum kasat mata',
      'C. Ungu, karena memiliki frekuensi tertinggi dan panjang gelombang terpendek sehingga paling kuat dibiaskan',
      'D. Hijau, karena paling ramah bagi retina mata'
    ],
    correctOptionIndex: 2,
    explanation: 'Hebat! Sinar ungu memiliki panjang gelombang terpendek (~400 nm) dan frekuensi tertinggi, sehingga mengalami perlambatan paling besar dan dibiaskan dengan sudut deviasi paling besar oleh prisma kaca.',
    rewardPoints: 10,
  },
  chal_6: {
    id: 'chal_6',
    tileIndex: 21,
    title: 'Tantangan Fisika: Rancang Bangun Periskop Kapal Selam',
    topic: 'Penerapan Cermin Datar Kembar',
    description: 'Awak kapal selam yang berada di bawah permukaan laut ingin mengamati kapal musuh di atas permukaan air menggunakan tabung periskop sederhana.',
    task: 'Bagaimanakah konfigurasi dua buah cermin datar di dalam tabung periskop yang benar agar bayangan kapal terlihat tegak oleh mata pengamat?',
    hints: [
      'Kedua cermin harus sejajar satu sama lain.',
      'Sudut kemiringan cermin terhadap dinding tabung tegak lurus adalah 45°.'
    ],
    options: [
      'A. Dua cermin diletakkan sejajar menghadap saling berlawanan pada sudut 90°',
      'B. Dua cermin diletakkan sejajar saling berhadapan miring 45° terhadap arah vertikal tabung',
      'C. Menggunakan satu cermin cembung dan satu lensa cekung di tengah tabung',
      'D. Dua cermin ditempatkan bersilangan membentuk sudut 30°'
    ],
    correctOptionIndex: 1,
    explanation: 'Sempurna! Periskop sederhana memakai 2 cermin datar yang disusun sejajar dengan sudut kemiringan 45°. Sinar dari atas dibelokkan 90° oleh cermin atas menuju cermin bawah, lalu dibelokkan 90° lagi menuju mata pengamat dengan posisi bayangan tetap tegak!',
    rewardPoints: 10,
  },
};

export const COLOR_OPTIONS = [
  { id: 'ruby', name: 'Merah Laser', bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', ring: 'ring-rose-500', hex: '#f43f5e' },
  { id: 'sapphire', name: 'Biru Spektrum', bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', ring: 'ring-blue-500', hex: '#3b82f6' },
  { id: 'amber', name: 'Kuning Foton', bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', ring: 'ring-amber-500', hex: '#f59e0b' },
  { id: 'emerald', name: 'Hijau Refraksi', bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', ring: 'ring-emerald-500', hex: '#10b981' },
  { id: 'violet', name: 'Ungu Prisma', bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', ring: 'ring-purple-500', hex: '#a855f7' },
  { id: 'cyan', name: 'Cyan Lensa', bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500', ring: 'ring-cyan-500', hex: '#06b6d4' },
];

export const AVATAR_OPTIONS = [
  { id: 'prism', label: 'Prisma Newton', icon: 'Sparkles' },
  { id: 'laser', label: 'Laser Berkas', icon: 'Zap' },
  { id: 'lens', label: 'Lensa Cembung', icon: 'Aperture' },
  { id: 'mirror', label: 'Cermin Cekung', icon: 'Maximize2' },
  { id: 'telescope', label: 'Teleskop Galaksi', icon: 'Search' },
  { id: 'microscope', label: 'Mikroskop Sel', icon: 'Crosshair' },
];
