"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("./user.constant");
const router = express_1.default.Router();
router.get("/get-me", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), user_controller_1.UserControllers.getMe);
router.post("/create-user", (0, validateRequest_1.default)(user_validation_1.createUserSchema), user_controller_1.UserControllers.createUserFromDB);
router.get("/get-single-user/:id", user_controller_1.UserControllers.getSingleUserFromDB);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.getAllUserFromDB);
router.put("/update-user/:id", user_controller_1.UserControllers.updateUserFromDB);
router.put("/toggle-follow/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.toggleFollowFromDB);
router.put("/manage-status/:id/status", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.userManageStatusFromDB);
router.get("/followers-following", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.getUserFollowersAndFollowingFRomDb);
router.delete("/delete-user/:id", user_controller_1.UserControllers.deleteUserFromDB);
exports.UserRoutes = router;
