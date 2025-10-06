import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, loginUser, logOutUser, refreshAccessToken, registerUser, updateUserAccountDetail } from "../controllers/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/register").post(
    upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
    registerUser
);

router.route("/login").post(loginUser);

// secured routess
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);

// update user routes
router.route("/update-account").patch(verifyJWT, updateUserAccountDetail);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAccountDetail);
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserAccountDetail);

// user channel routes
router.route(`/channel/:userName`).get(verifyJWT, getUserChannelProfile);
router.route("/get-watch-history").get(verifyJWT, getUserWatchHistory);


export default router;  