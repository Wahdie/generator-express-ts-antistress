import app from './app';
import { connectToDB } from './config/database';

const port = process.env.PORT || 3000;


(async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    await connectToDB(); // Koneksi ke database

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
})();