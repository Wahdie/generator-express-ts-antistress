import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USERNAME!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: process.env.DB_DIALECT as 'mysql' | 'postgres' | 'sqlite',
    logging: false
  }
);


// Test connection to the database
export async function connectToDB(): Promise<void> {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({force: true}); // Uncomment this line to force sync the database (drop and recreate tables)
    await sequelize.sync(); // Uncomment this line to sync the database (create tables if not exist)
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export default sequelize;