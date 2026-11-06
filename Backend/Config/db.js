import mysql from "mysql2/promise"

const db = mysql.createPool({
    database:process.env.db_name,
    password:process.env.db_password,
    user:process.env.db_user,
    host:process.env.db_host,
    port:Number(process.env.db_port),
    connectionLimit:20,
    
    ssl: {
        ca: process.env.db_ssl_ca
    }
}) 

try {
    await db.getConnection()
 console.log("Database connected successfully");
    connection.release();
} catch (error) {
    console.error("Database connection failed:", error.message);

}

export default db