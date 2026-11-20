const express = require("express");
const { getAllUsers, updateUserRole, getUserRoles, searchUserRoles } = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();


router.post("/login", authController.login);
router.get("/logout", authController.protect, authController.logout);

router
  .route("/")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin","System Admin"),
    getAllUsers
  );
router
  .route("/userRoleMapping")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin","System Admin"),
    getUserRoles
  )
  .post(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    updateUserRole
  );

router.get("/userRoleMapping/search", searchUserRoles);
module.exports = router;
