const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");

// controllers
const adminController = require("./../controllers/adminController");
const adminDashboardController = require("./../controllers/adminDashboardController");
const authController = require("./../controllers/authController");
const storageController = require("../controllers/storageController");
const adminPriorityController = require("../controllers/adminPriorityController");

// validation files
const {
  dashboardCountQuerySchema,
  dashYearlyReportQuerySchema,
} = require("../validators/admin-dashboard.schema");
const { Query } = require("pg");

const {
  getOrganisationByIdParamsSchema,
} = require("../validators/organisation.schema");
const { Params } = require("pg");

// Routes

router.route("/recentlyCreated").get(
  //authController.protect,
  //authController.restrictTo("Manager/Admin", "System Admin"),
  adminDashboardController.getRecentCreatedList,
);

router.route("/dashboard-counts").get(
  //authController.protect,
  //authController.restrictTo("Manager/Admin", "System Admin"),
  validate(dashboardCountQuerySchema, "query"),
  adminDashboardController.dashboardCounts,
);

router.route("/dashboard-valid-year").get(
  //authController.protect,
  //authController.restrictTo("Manager/Admin", "System Admin"),
  adminDashboardController.getValidYears,
);

router.route("/dashboard-yearly-report").get(
  //authController.protect,
  //authController.restrictTo("Manager/Admin", "System Admin"),
  validate(dashYearlyReportQuerySchema, "query"),
  adminDashboardController.getYearlyReport,
);

router
  .route("/trashList")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getTrashList,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteTrash,
  )
  .put(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.restoreTrash,
  );

router
  .route("/trashList/:id")
  .put(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.restoreTrash,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteTrash,
  );

router
  .route("/workflowRole")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getWorkflowRoles,
  )
  .post(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.createWorkflowRole,
  );
router
  .route("/workflowRole/:id")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getWorkflowRole,
  )
  .put(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.updateWorkflowRole,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.deleteWorkflowRole,
  );

router
  .route("/workflowAction")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getWorkflowActions,
  )
  .post(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.createWorkflowActions,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.deleteWorkflowActions,
  );
router
  .route("/workflowAction/:id")
  .put(
    //authController.protect,
    //.restrictTo("System Admin"),
    adminController.updateWorkflowActions,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.deleteWorkflowActions,
  );

router.route("/globalRolesList").get(
  //authController.protect,
  //authController.restrictTo("Manager/Admin", "System Admin"),
  adminController.globalRolesList,
);

router.route("/menuList").get(
  //authController.protect,
  //authController.restrictTo("Manager/Admin", "System Admin"),
  adminController.menuList,
);

router
  .route("/userRolePermission")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.userRolePermissionList,
  )
  .put(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.updateUserRolePermission,
  );

router
  .route("/workflowMaster")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getWorkflowMaster,
  )

  .post(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.createWorkflowMaster,
  )

  .delete(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.deleteWorkflowMaster,
  );

router
  .route("/workflowMaster/:id")
  .put(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.updateWorkflowMaster,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.deleteWorkflowMaster,
  )
  .get(
    //authController.protect,
    //.restrictTo("System Admin"),
    adminController.getWorkflowView,
  );

router.route("/workflowState").get(
  //authController.protect,
  //authController.restrictTo("Manager/Admin", "System Admin"),
  adminController.getWorkflowState,
);

router.route("/workflowTransition").get(
  //authController.protect,
  //authController.restrictTo("Manager/Admin", "System Admin"),
  adminController.getWorkflowTransition,
);

router
  .route("/contentType")
  .get(
    // authController.protect,
    // authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getContentTypeList,
  )
  .post(
    // authController.protect,
    // authController.restrictTo("System Admin"),
    adminController.createContentTypeMaster,
  );

router
  .route("/contentType/:id")
  .put(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.updateContentTypeMaster,
  )

  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteContentTypeMaster,
  );

router
  .route("/contentMetadata")
  .get(
    // authController.protect,
    // authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getContentMetadata,
  )

  .post(
    // authController.protect,
    // authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.createContentMetadata,
  );

router
  .route("/contentMetadata/:id")
  .put(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.updateContentMetadata,
  )

  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteContentMetadata,
  );

router
  .route("/organisationMaster")
  .get(
    // authController.protect,
    // authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getOrganisation,
  )
  .post(
    // authController.protect,
    // authController.restrictTo("System Admin"),
    adminController.createOrganisation,
  );

router
  .route("/organisationMaster/:id")
  .get(
    // authController.protect,
    // authController.restrictTo("Manager/Admin", "System Admin"),
    validate(getOrganisationByIdParamsSchema, "Params"),
    adminController.getOrganisationById,
  )
  .patch(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.patchOrganisation,
  )

  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteOrganisation,
  );

router
  .route("/categoryMaster")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getCategoryMasters,
  )

  .post(
    // authController.protect,
    // authController.restrictTo("System Admin"),
    adminController.createCategoryMaster,
  );

router
  .route("/categoryMaster/:id")
  .get(
    // authController.protect,
    // authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getCategoryById,
  )

  .patch(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.updateCategoryMaster,
  )

  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteCategoryMaster,
  );

router
  .route("/AudienceMaster")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getAudienceList,
  )
  .post(
    // authController.protect,
    // authController.restrictTo("System Admin"),
    adminController.createAudienceMaster,
  );

router
  .route("/AudienceMaster/:id")
  .put(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.updateAudienceMaster,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteAudienceMaster,
  );

router
  .route("/typeMaster")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getTypeList,
  )
  .post(
    // authController.protect,
    // authController.restrictTo("System Admin"),
    adminController.createTypeMaster,
  );

router
  .route("/typeMaster/:id")
  .put(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.updateTypeMaster,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteTypeMaster,
  );

router
  .route("/languageMaster")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getLanguageList,
  )
  .post(
    // authController.protect,
    // authController.restrictTo("System Admin"),
    adminController.createLanguageMaster,
  );

router
  .route("/languageMaster/:id")
  .put(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.updateLanguageMaster,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteLanguageMaster,
  );

router
  .route("/localeLanguageMaster")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getLocaleLanguageList,
  )
  .post(
    // authController.protect,
    // authController.restrictTo("System Admin"),
    adminController.createLocaleLanguageMaster,
  );

router
  .route("/localeLanguageMaster/:id")
  .put(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.updateLocaleLanguageMaster,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteLocaleLanguageMaster,
  );

router
  .route("/localeMsgstr")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getLocaleMsgstrList,
  )
  .post(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.createLocaleMsgstr,
  );

router.route("/localeMsgstr/:id").put(
  //authController.protect,
  //authController.restrictTo("System Admin"),
  adminController.updateLocaleMsgstr,
);

router
  .route("/extensionMaster")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.getExtensionList,
  )
  .post(
    // authController.protect,
    // authController.restrictTo("System Admin"),
    adminController.createExtensionMaster,
  );

router
  .route("/extensionMaster/:id")
  .put(
    //authController.protect,
    //authController.restrictTo("System Admin"),
    adminController.updateExtensionMaster,
  )
  .delete(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminController.deleteExtensionMaster,
  );

router.route("/auditTrail").get(
  //authController.protect,
  //authController.restrictTo("Manager/Admin", "System Admin"),
  adminController.getAuditTrailList,
);


router.route("/Storage").post(
  storageController.createStorage,
);

router.route("/Storage/:id").get(
  storageController.getStorageById,
);

router.route("/Storage/:id").put(
  storageController.updateStorage,
);

router
  .route("/priorityNotice")
  .get(
    //authController.protect,
    //authController.restrictTo("Manager/Admin", "System Admin"),
    adminPriorityController.getAllPriorityList,
  );
module.exports = router;

