import express from "express";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register, getAllUsers, editUser, deleteUser } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

// New routes
router.route('/users').get(isAuthenticated, getAllUsers); // Get all users
router.route('/user/:id').put(isAuthenticated, editUser);  // Edit user details
router.route('/user/:id').delete(isAuthenticated, deleteUser); // Delete user

export default router;
