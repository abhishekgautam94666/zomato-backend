import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "du2qbhmoh",
  api_key: "367483797235912",
  api_secret: "QBHnr-AAJnkCJi5Qpxsrs1Geon8",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error upload image from Cloudinary: ", error);
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resource_type) => {
  try {
    if (!publicId) {
      return null;
    }
    const response = cloudinary.api.delete_resources([publicId], {
      type: "upload",
      invalidate: true,
      resource_type: resource_type,
    });

    console.log("file is delete on cloudinary ");
    return response;
  } catch (error) {
    console.log("Error deleting image from Cloudinary: ", error.message);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
