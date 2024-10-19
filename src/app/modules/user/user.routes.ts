import express from "express";

import validateRequest from "../../middleware/validateRequest";
import { createUserSchema } from "./user.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.get(
  "/get-me",
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getMe
);

router.post(
  "/create-user",
  validateRequest(createUserSchema),
  UserControllers.createUserFromDB
);

router.get("/get-single-user/:id", UserControllers.getSingleUserFromDB);
router.get("/", auth(USER_ROLE.admin), UserControllers.getAllUserFromDB);
router.put("/update-user/:id", UserControllers.updateUserFromDB);
router.put(
  "/toggle-follow/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.toggleFollowFromDB
);
router.put(
  "/manage-status/:id/status",
  auth(USER_ROLE.admin),
  UserControllers.userManageStatusFromDB
);
router.get(
  "/followers-following",
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getUserFollowersAndFollowingFRomDb
);
router.delete("/delete-user/:id", UserControllers.deleteUserFromDB);

export const UserRoutes = router;
