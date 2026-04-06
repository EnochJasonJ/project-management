// import pkg from "pg";

// const {Pool} = pkg;

// const pool = new Pool({
//     user: "postgres.ryjsvtgsktzurehnkkcw",
//     host: "aws-1-ap-south-1.pooler.supabase.com",
//     database: "postgres",
//     password: "ProductTenant123$",
//     port: 5432,
//     // pool_mode: session,
//     ssl: {
//         rejectUnauthorized: false
//     },
// });

// export default pool;

// PMproductProjectManagement13254#

import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

try {
    console.log(`Supabase URL: ${supabaseUrl}`)
    console.log(`Supabase Key: ${supabaseKey}`)
} catch (error) {
    console.error("URL Doesn not exist");
}

export const supabase = createClient(supabaseUrl,supabaseKey)


