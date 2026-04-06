import pool from "./config/db.js";

async function testDB(){
    try {
        const res = await pool.query(`
                SELECT table_name from information_schema.tables
                WHERE table_schema = 'public'
            `);
        console.log("DB Connected  ✅");
        console.log(res.rows);
    } catch (error) {
        console.error("DB Connection failed ❌");
        console.error(error);
    }
    finally{
        pool.end();
    }
}

testDB();