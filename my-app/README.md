# My App – REST API with Express.js & TypeScript

Boilerplate hasil generate dari [`generator-express-ts-antistress`](https://www.npmjs.com/package/generator-express-ts-antistress). Proyek ini sudah siap digunakan untuk membangun REST API menggunakan **Express.js** dan **TypeScript**, dilengkapi dengan konfigurasi testing, linter, dan logger.

---


## 🧰 Penggunaan

Sebelum menjalankan aplikasi, pastikan:

1. Buka file `.env` dan pastikan konfigurasi database sudah benar (DB\_HOST, DB\_NAME, DB\_USER, dsb).
2. Buat database secara manual sesuai konfigurasi di `.env` (menggunakan MySQL / phpMyAdmin / CLI).
3. Jalankan XAMPP/Laragon atau service MySQL Anda.
4. Jalankan perintah yang tersedia seperti `npm run dev` untuk mulai pengembangan.
5. Jika ingin menjalankan testing, pastikan Anda menjalankan `npm run build` terlebih dahulu agar table database terbuat.
---



## 🚀 Perintah yang Tersedia

Setelah menjalankan `npm install`, berikut perintah-perintah yang bisa digunakan:

### 🔧 Pengembangan

```bash
npm run dev
```

> Menjalankan server menggunakan `nodemon` untuk auto-reload saat ada perubahan di `src/`.

### 🏗️ Build untuk Produksi

```bash
npm run build
```

> Mengompilasi TypeScript ke JavaScript di folder `dist/`.

### 🚀 Menjalankan Produksi

```bash
npm start
```

> Menjalankan file hasil build: `dist/server.js`.

---

## ✅ Testing

Framework testing yang digunakan:

* [Jest](https://jestjs.io/)
* [Supertest](https://github.com/ladjs/supertest) (untuk HTTP testing)

### Menjalankan test:

```bash
npm test
```

---

## 🩹 Format & Linting

### Format semua file TypeScript:

```bash
npm run prettier
```

### Jalankan lint:

```bash
npm run lint
```

### Format + Lint sekaligus:

```bash
npm run format
```

---

## ⚙️ Konfigurasi Penting

* `.env` berisi konfigurasi environment (DB, PORT, dsb)
* `logger` menggunakan [winston](https://github.com/winstonjs/winston)
* ORM: [Sequelize](https://sequelize.org/) (dengan `mysql2`)

---



## 🧪 Lisensi

[ISC](https://opensource.org/licenses/ISC)

---

> Generator by [express-ts-antistress](https://www.npmjs.com/package/generator-express-ts-antistress) – hilangkan stres saat memulai proyek backend! 🎉
