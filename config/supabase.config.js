// import { createClient } from "@supabase/supabase-js";
const supabaseClientCreator = require("@supabase/supabase-js")
const createClient = supabaseClientCreator.createClient;


const supabaseUrl = "https://ehewdklesmhbmoszddiv.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


async function uploadToSupabase(file,fileName, fileType) {
    return await supabase.storage
        .from("drive-data")
        .upload(`uploads/${fileName}`, file, fileType);
}

module.exports= {uploadToSupabase, supabase} 