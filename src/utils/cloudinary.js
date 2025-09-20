import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


const uploadOnClodinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        // upload file to cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        console.log("file uploaded to cloudinary", result, result.url);
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}