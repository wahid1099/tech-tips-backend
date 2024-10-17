"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post("/sign-in", (0, validateRequest_1.default)(user_validation_1.loginValidationSchema), auth_controller_1.AuthController.createLoginUserIntoDB);
router.post("/change-password", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), auth_controller_1.AuthController.createChangePasswordIntoDB);
router.post("/refresh-token", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(user_validation_1.refreshTokenValidationSchema), auth_controller_1.AuthController.refreshToken);
router.post("/forget-password", auth_controller_1.AuthController.forgetPasswordFromDB);
router.put("/toggole-user-role/:userId", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), auth_controller_1.AuthController.toggoleUserRoleFromDB);
exports.AuthRoutes = router;
