import mysql from "mysql2/promise"

const db = mysql.createPool({
    database:process.env.db_name,
    password:process.env.db_password,
    user:process.env.db_user,
    host:process.env.db_host,
    port:process.env.db_port,
    connectionLimit:20
}) 

try {
    await db.getConnection()
    // console.log("db connected");

} catch (error) {
    console.log(error);

}

export default db