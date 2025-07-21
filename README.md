# express-ts-antistress

[![NPM Version](https://img.shields.io/npm/v/generator-express-ts-antistress.svg)](https://www.npmjs.com/package/generator-express-ts-antistress)
[![License](https://img.shields.io/npm/l/generator-express-ts-antistress.svg)](https://opensource.org/licenses/MIT)

Sebuah generator CLI untuk menghilangkan stres saat memulai proyek REST API baru. Hasilkan boilerplate lengkap dengan TypeScript dan Express.js dari satu file skema JSON.

---

## Daftar Isi
- [Fitur Utama](#fitur-utama)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Cara Penggunaan](#cara-penggunaan)
- [Struktur Skema JSON](#struktur-skema-json)
  - [Struktur Model](#struktur-model)
  - [Properti Field](#properti-field)
  - [Properti Relation](#properti-relation)
  - [Contoh Lengkap](#contoh-lengkap)
- [Struktur Proyek yang Dihasilkan](#struktur-proyek-yang-dihasilkan)
- [Perintah yang Tersedia](#perintah-yang-tersedia)
- [Lisensi](#lisensi)

---

## Fitur Utama
- 🚀 **Cepat & Produktif:** Hemat waktu setup proyek dan langsung fokus pada logika bisnis.
- 🏗️ **Multi-Arsitektur:** Pilih antara arsitektur MVC atau Layered yang bersih dan terstruktur.
- ✍️ **Generasi CRUD Otomatis:** Endpoint CRUD lengkap dengan validasi dasar dibuat secara otomatis dari skema Anda.
- ✅ **Siap Uji:** Kerangka Unit Test dengan Jest ikut dihasilkan untuk setiap endpoint.
- 📦 **TypeScript Ready:** Proyek modern dengan type-safety penuh untuk pengembangan yang lebih aman.

---

## Prasyarat
Pastikan perangkat Anda telah terinstal:
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih tinggi)
- [Yeoman](https://yeoman.io/): `npm install -g yo`

---

## Instalasi
```bash
npm install -g express-ts-antistress
````

-----

## Cara Penggunaan

1.  Buat sebuah file skema, misalnya `schema.json`, yang mendefinisikan model data Anda.
2.  Buka terminal di direktori pilihan Anda, lalu jalankan generator dengan perintah:
   
    ```bash
    yo express-ts-antistress
    ```
3.  Jawab pertanyaan yang muncul di terminal:
      - **Nama proyek?** (contoh: `my-awesome-api`)
      - **Pilih arsitektur (MVC/Layered)?**
      - **Pilih database?** (MySQL/PostgreSQL/MongoDB/SQLite)
      - **Masukkan path file skema JSON:** (contoh: `schema.json`)

Generator akan membuat direktori proyek baru dan menghasilkan semua file yang diperlukan.

-----

## Struktur Skema JSON

Skema JSON adalah jantung dari generator ini. Ini adalah file di mana Anda mendefinisikan semua model, field, dan relasi untuk aplikasi Anda.

### Struktur Model

File skema harus memiliki properti root `models` yang berisi sebuah array dari objek model. Setiap objek model harus menggunakan **PascalCase** untuk namanya dan memiliki properti berikut:

| Properti | Tipe | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| `name` | `string` | ✅ | Nama model (e.g., "User", "ProductCategory"). |
| `fields` | `object` | ✅ | Objek yang berisi definisi semua field untuk model ini. |
| `relations`| `object` | | Objek yang berisi definisi relasi ke model lain. |

### Properti Field

Properti `fields` berisi key-value pair, di mana *key* adalah nama field dan *value* adalah objek konfigurasinya.

| Properti | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `type` | `string` | **Wajib.** Tipe data untuk field. Lihat daftar tipe yang didukung di bawah. |
| `primaryKey`| `boolean`| Menandakan sebagai primary key. |
| `autoIncrement`|`boolean`| Mengaktifkan auto-increment (biasanya untuk primary key). |
| `required` | `boolean`| Field ini tidak boleh kosong. |
| `unique` | `boolean`| Nilai field ini harus unik di dalam tabel. |
| `default` | `any` | Nilai default jika tidak ada nilai yang diberikan. |
| `enum` | `array` | Daftar nilai yang diizinkan untuk field bertipe string/enum. |
| `foreignKey`| `boolean`| Menandakan field ini sebagai foreign key. **Wajib ada** pada field yang menjadi dasar relasi `belongsTo`. |
| `references`| `string` | Nama model dan field yang direferensikan (format: `"Model.field"`). |
| `onDelete` | `string` | Aksi saat data di tabel referensi dihapus (e.g., "CASCADE", "SET NULL"). |
| `onUpdate` | `string` | Aksi saat data di tabel referensi di-update (e.g., "CASCADE"). |

**Tipe Data yang Diizinkan 
`type`:**
`string`, `text`, `integer`, `float`, `double`, `decimal`, `bigint`, `boolean`, `date`, `datetime`, `timestamp`, `time`, `uuid`, `varchar`, `char`, `smallint`, `mediumint`, `tinyint`, `json`, `jsonb`, `object`, `array`, `blob`, `binary`, `enum`, `objectId`.

### Properti Relation

Properti `relations` mendefinisikan hubungan antar model.

| Properti | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `type` | `string` | **Wajib.** Tipe relasi: `hasMany`, `hasOne`, `belongsTo`, `manyToMany`. |
| `model`| `string` | **Wajib.** Nama model target yang berelasi (harus PascalCase). |
| `through`| `string` | **Wajib untuk `manyToMany`**. Nama model junction/pivot table. |
| `cascadeDelete`|`boolean`| Jika `true`, menghapus data induk akan menghapus data anak yang berelasi. |

### Contoh Lengkap

contoh schema.json

```json
{
  "models": [
    {
      "name": "User",
      "fields": {
        "id": { "type": "integer", "primaryKey": true, "autoIncrement": true },
        "name": { "type": "string", "required": true },
        "email": { "type": "string", "required": true, "unique": true },
        "password": { "type": "string", "required": true },
        "role": { "type": "string", "enum": ["admin", "editor", "user"], "default": "user" }
      },
      "relations": {
        "posts": { "type": "hasMany", "model": "Post" }
      }
    },
    {
      "name": "Post",
      "fields": {
        "id": { "type": "integer", "primaryKey": true, "autoIncrement": true },
        "title": { "type": "string", "required": true },
        "content": { "type": "text" },
        "userId": {
          "type": "integer",
          "foreignKey": true,
          "references": "User.id",
          "onDelete": "CASCADE"
        }
      },
      "relations": {
        "user": { "type": "belongsTo", "model": "User" },
        "tags": { "type": "manyToMany", "model": "Tag", "through": "PostTag" }
      }
    },
    {
      "name": "Tag",
      "fields": {
        "id": { "type": "integer", "primaryKey": true, "autoIncrement": true },
        "name": { "type": "string", "required": true, "unique": true }
      },
      "relations": {
        "posts": { "type": "manyToMany", "model": "Post", "through": "PostTag" }
      }
    },
    {
      "name": "PostTag",
      "fields": {
        "id": { "type": "integer", "primaryKey": true, "autoIncrement": true },
        "postId": { "type": "integer", "foreignKey": true, "references": "Post.id" },
        "tagId": { "type": "integer", "foreignKey": true, "references": "Tag.id" }
      },
      "relations": {
        "post": { "type": "belongsTo", "model": "Post" },
        "tag": { "type": "belongsTo", "model": "Tag" }
      }
    }
  ]
}
```

-----

## Struktur Proyek yang Dihasilkan

Struktur folder yang dihasilkan akan terlihat seperti ini.

1. contoh untuk arsitektur **MVC**:
```
my-app/
├── node_modules/         # Direktori dependensi 
├── src/                  # Kode sumber utama aplikasi
│   ├── config/           # Konfigurasi aplikasi (database, environment, dsb)
│   ├── controllers/      # Logic controller untuk menangani request dan response
│   ├── middlewares/      # Middleware untuk validasi
│   ├── models/           # Definisi model dan skema database (ORM/ODM)
│   ├── routes/           # Routing endpoint aplikasi
│   ├── utils/            # Fungsi utilitas dan helper umum
│   └── views/            # Masih belum diimplementasikan
├── test/                 # Kode pengujian aplikasi
│   ├── controllers/      # Test unit/integrasi untuk controller
│   └── helpers/          # Fungsi pendukung untuk testing (setup, mock, dll)
├── .eslintrc.js          # Konfigurasi ESLint untuk menjaga konsistensi kode
├── .prettierrc           # Konfigurasi Prettier untuk format otomatis kode
├── jest.config.js        # Konfigurasi untuk framework testing Jest
├── nodemon.json          # Konfigurasi untuk tool hot-reload Nodemon
├── package.json          # Informasi proyek dan daftar dependensi
├── package-lock.json     # Lockfile untuk menjaga konsistensi versi dependensi
└── tsconfig.json         # Konfigurasi TypeScript

```

2. contoh untuk arsitektur **Layered**:
```
my-app2/
├── node_modules/           # Direktori dependensi dari npm
├── src/                    # Kode sumber utama aplikasi
│   ├── config/             # Konfigurasi aplikasi (database, environment, dll)
│   ├── controllers/        # Menangani request dan response HTTP
│   ├── middlewares/        # Middleware untuk validasi
│   ├── models/             # Definisi skema data / ORM (Sequelize/Mongoose)
│   ├── repositories/       # Akses data ke database (lapisan repository)
│   ├── routes/             # Definisi rute endpoint aplikasi
│   ├── services/           # Business logic, memproses data antara controller dan repository
│   ├── utils/              # Fungsi utilitas dan helper
│   ├── views/              # Masih belum diimplementasikan
│   ├── app.ts              # Inisialisasi aplikasi Express, middleware, dll
│   └── server.ts           # Entry point server (menjalankan aplikasi di port tertentu)
├── test/                   # Kode pengujian aplikasi
│   ├── controllers/        # Pengujian unit/integrasi untuk controller
│   └── helpers/            # Utilitas dan konfigurasi testing (setup database, mock data)
├── .env                    # File environment variable
├── .eslintrc.js            # Konfigurasi ESLint untuk linting kode
├── .prettierrc             # Konfigurasi Prettier untuk format kode otomatis
├── jest.config.js          # Konfigurasi testing dengan Jest
├── nodemon.json            # Konfigurasi Nodemon untuk hot reload saat development
├── package.json            # Metadata proyek dan daftar dependensi npm
├── package-lock.json       # Lock file dependensi npm untuk konsistensi versi
└── tsconfig.json           # Konfigurasi TypeScript


```

-----

## Perintah yang Tersedia

Setelah proyek dibuat, masuk ke direktori proyek dan jalankan:

  - **Instalasi dependensi:**
    ```bash
    npm install
    ```
  - **Menjalankan server pengembangan (dengan auto-reload):**
    ```bash
    npm run dev
    ```
  - **Menjalankan server produksi:**
    ```bash
    npm start
    ```
  - **Menjalankan pengujian:**
    ```bash
    npm test
    ```

-----

## Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

```
```