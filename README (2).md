# SAKENIFIC — Cara Deploy ke Vercel

## Struktur File
```
sakenific/
├── index.html        ← Halaman utama (UI)
├── vercel.json       ← Konfigurasi Vercel
└── api/
    ├── motion.js     ← Proxy ke Magnific API (generate)
    └── status.js     ← Proxy cek status task
```

## Langkah Deploy

### 1. Buat akun GitHub
- Buka https://github.com
- Daftar gratis

### 2. Buat repository baru
- Klik tombol "+" → "New repository"
- Nama: `sakenific` (atau nama lain)
- Pilih "Public"
- Klik "Create repository"

### 3. Upload semua file
- Klik "uploading an existing file"
- Upload: `index.html`, `vercel.json`, dan folder `api/` beserta isinya
- Klik "Commit changes"

### 4. Deploy ke Vercel
- Buka https://vercel.com
- Daftar pakai akun GitHub
- Klik "Add New Project"
- Pilih repository `sakenific`
- Klik "Deploy"
- Selesai! Dapat URL gratis: `sakenific.vercel.app`

## Cara Pakai Proxy

Frontend (`index.html`) kirim request ke `/api/motion`
→ Vercel serverless function (`api/motion.js`) terima request
→ Teruskan ke Magnific API dengan API key user
→ Kembalikan hasil ke frontend

Ini mencegah CORS error karena browser tidak bisa langsung call Magnific API.

## API Key

User memasukkan API key mereka sendiri di form.
API key TIDAK disimpan di server, hanya di localStorage browser user.

Dapat API key Magnific di: https://www.freepik.com/api
