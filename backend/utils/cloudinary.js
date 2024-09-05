import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    cloud_name: 'dj4pncrmw',
    api_key:'476739548919744',
    api_secret: 'D4MelFaEuEuv4f2liPKHdQxHbuM'
});
export default cloudinary;