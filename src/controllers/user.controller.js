import { asyncHandler } from "../utils/ayncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email ,password} = req.body;

    if ([userName || fullName || email ].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

   const existingUser = await User.findOne({
        $or: [{ userName }, { email }],
    })

    if(existingUser){
        throw new ApiError(409, "userName or email already exist");
    }

   const avatarLocalPath =  req.files?.avatar[0].path;
//    const coverImageLocalPath =  req?.files?.coverImage[0].path;

let coverImageLocalPath;
if(req?.files && Array.isArray(req?.files?.coverImage) && req?.files?.coverImage?.length > 0){
    coverImageLocalPath = req?.files?.coverImage[0].path;
}

   

   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar Image is required");
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   const user = await User.create({
    userName: userName.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
   });

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" 
);

if(!createdUser){
    throw new ApiError(500, "Something went wrong while regotering the user.");
}

   return res.status(201).json(
    new ApiResponse(200, "User registered successfully", createdUser, true)
   );
})


export { registerUser };