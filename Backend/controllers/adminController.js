const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeature");
const ContentCatalog = require("./../models/contentCatalog");
const GlobalRoles = require("../models/roleMaster");
const RoleMaster = require("../models/roleMaster");
const MenuMaster = require("../models/menuMaster");
const UserRolePermissionMapping = require("../models/userRolePermission");
const sequelize = require("../utils/database");
const WorkflowAction = require("../models/workflowAction");
const WorkflowRole = require("../models/workflowRole");
const WorkflowMaster = require("../models/workflowMaster");
const workflowState = require("../models/workflowState");
const WorkflowTransition = require("../models/workflowTransition");
const ContentMetadata = require("../models/contentMetadata");
const ContentTypeMaster = require("../models/contentTypeMaster");
const ContentWorkflowMapping = require("../models/contentWorkflowMapping");
const OrganisationMaster = require("../models/organisationMaster");
const CategoryMaster = require("../models/categoryMaster");
const AudienceMaster = require("../models/audienceMaster");
const TypeMaster = require("../models/typeMaster");
const LanguageMaster = require("../models/languageMaster");
const LocaleLanguageMaster = require("../models/localeLanguageMaster");
const LocaleMsgstr = require("../models/localeMsgstr");
const LocaleMsgid = require("../models/localeMsgid");
const MimeTypeMaster = require("../models/mimeTypeMaster");
const AuditTrail = require("../models/auditTrail");
const { Op } = require("sequelize");

/***********************Trashlist***************************/

const getTrashList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  if (!features.query.where) features.query.where = {};
  features.query.where.is_deleted = true;

  const { rows: trashList, count } = await ContentCatalog.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: "Get All Trash List!",
    total: count,
    results: trashList.length,
    data: { trashList },
  });
});

const restoreTrash = catchAsync(async (req, res, next) => {
  // You can pass either a single ID in the URL or an array of IDs in the body
  const ids = req.body?.ids || [req.params.id];

  // Validate input
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({
      status: "error",
      message: `Please provide one or more IDs to delete.`,
    });
  }
  const [updatedCount] = await ContentCatalog.update(
    { is_deleted: false },
    {
      where: {
        id: ids, // Sequelize automatically converts this into `IN ([ids])`
        is_deleted: true,
      },
    },
  );
  if (updatedCount > 0) {
    res.status(200).json({
      status: "success",
      message: `${updatedCount} trash item(s) Restored!`,
    });
  } else {
    res.status(404).json({
      status: "error",
      message: `Invalid ID or item not found in trash!`,
    });
  }
});

const deleteTrash = catchAsync(async (req, res, next) => {
  // You can pass either a single ID in the URL or an array of IDs in the body
  const ids = req.body?.ids || [req.params.id];

  // Validate input
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({
      status: "error",
      message: `Please provide one or more IDs to delete.`,
    });
  }

  const deletedCount = await ContentCatalog.destroy({
    where: {
      is_deleted: true,
      id: ids, // Sequelize automatically converts this into `IN ([ids])`
    },
  });
  if (deletedCount > 0) {
    res.status(200).json({
      status: "success",
      message: `${deletedCount} trash item(s) permanently deleted.`,
    });
  } else {
    res.status(404).json({
      status: "error",
      message: `Invalid ID or item not found in trash!`,
    });
  }
});

/************* Global Roles *********************/

const globalRolesList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  if (!features.query.where) features.query.where = {};
  features.query.where.is_deleted = 0;

  const { rows: roles, count } = await RoleMaster.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: "Get Global Roles!",
    total: count,
    results: roles.length,
    data: { roles },
  });
});

const menuList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  if (!features.query.where) features.query.where = {};
  if (!features.query.where.status) features.query.where.status = true;
  if (!features.query.where.parent_id) features.query.where.parent_id = 0;

  const { rows: menu, count } = await MenuMaster.findAndCountAll({
    ...features.query,
    include: [
      {
        model: MenuMaster,
        as: "children",
      },
    ],
  });

  res.status(200).json({
    status: "success",
    message: "Get Menu Lists!",
    total: count,
    results: menu.length,
    data: { menu },
  });
});

const userRolePermissionList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  if (!features.query.where) features.query.where = {};

  const { rows: userRolePerms, count } =
    await UserRolePermissionMapping.findAndCountAll(features.query);

  res.status(200).json({
    status: "success",
    message: "Get User Role Permission!",
    total: count,
    results: userRolePerms.length,
    data: {
      role_id: userRolePerms[0]?.role_id ?? null,
      modules_list: userRolePerms.map((item) => item.module_id),
    },
  });
});

const buildMappings = (roleId, modules) => {
  const mappings = [];

  for (const parent of modules) {
    // parent entry
    mappings.push({
      role_id: roleId,
      module_id: parent.id,
      parent_id: 0,
    });

    // child entries
    if (Array.isArray(parent.children)) {
      for (const childId of parent.children) {
        mappings.push({
          role_id: roleId,
          module_id: childId,
          parent_id: parent.id,
        });
      }
    }
  }

  return mappings;
};

const updateUserRolePermission = catchAsync(async (req, res) => {
  const { role_id: roleId, modules } = req.body;

  if (!roleId) {
    return res.status(400).json({
      status: "error",
      message: "Please provide role id.",
    });
  }

  if (!Array.isArray(modules) || modules.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Please provide modules to associate.",
    });
  }

  const t = await sequelize.transaction();

  try {
    // delete old mappings (inside transaction)
    await UserRolePermissionMapping.destroy({
      where: { role_id: roleId },
      transaction: t,
    });

    // build hierarchical mappings
    const newMappings = buildMappings(roleId, modules);

    await UserRolePermissionMapping.bulkCreate(newMappings, {
      transaction: t,
    });

    await t.commit();

    const updatedMappings = await UserRolePermissionMapping.findAll({
      where: { role_id: roleId },
    });

    res.status(200).json({
      status: "success",
      message: "User Role Permissions updated successfully!",
      total: updatedMappings.length,
      data: updatedMappings,
    });
  } catch (error) {
    await t.rollback();

    res.status(500).json({
      status: "error",
      message:
        error.message || "An error occurred while updating role permissions.",
    });
  }
});

/***********************Workflow Master***************************/

const getWorkflowMaster = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: 0,
  });

  const { rows: workflowMasterList, count } =
    await WorkflowMaster.findAndCountAll(features.query);

  res.status(200).json({
    status: "success",
    message: workflowMasterList.length
      ? "Workflow master retrieved successfully."
      : "No workflow master found.",
    total: count,
    results: workflowMasterList.length,
    data: workflowMasterList,
  });
});

const createWorkflowMaster = catchAsync(async (req, res, next) => {
  const { workflowMasterBody } = req.body;

  if (!workflowMasterBody || typeof workflowMasterBody !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'workflowMaster' object is required.",
    });
  }

  const createWorkflowMaster = await WorkflowMaster.create(workflowMasterBody);

  res.status(201).json({
    status: "success",
    message: "Workflow Master Created!",
    data: { id: createWorkflowMaster.id },
  });
});

const updateWorkflowMaster = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide ID to update.",
    });
  }

  // Extract fields from body
  const { workflowMasterBody } = req.body;

  if (!workflowMasterBody || typeof workflowMasterBody !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'workflowMasterBody' object is required.",
    });
  }

  // Destructure field properly
  const { workflow_name } = workflowMasterBody;

  // Basic validation
  if (workflow_name !== undefined && workflow_name.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "workflow_name cannot be empty.",
    });
  }

  // Update record in database
  const [updatedCount] = await WorkflowMaster.update(workflowMasterBody, {
    where: { id, is_deleted: 0 },
  });

  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Workflow Master not found or no changes applied.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Workflow Master Updated!",
    data: { id },
  });
});

const deleteWorkflowMaster = catchAsync(async (req, res, next) => {
  // Accept single ID from params or multiple from body
  console.log(ids);

  const ids = req.params ? [req.params.id] : [];
  // console.log(typeof ids);return false;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Please provide one or more IDs to delete.",
    });
  }

  // Step 1: Check if records exist
  const deletedCount = await WorkflowMaster.destroy({
    where: {
      id: ids,
      status: false,
    },
  });

  if (deletedCount > 0) {
    res.status(200).json({
      status: "success",
      message: `${deletedCount} workflow master permanently deleted.`,
    });
  } else {
    res.status(404).json({
      status: "error",
      message:
        "No matching workflow masters found to delete or actions are active.",
    });
  }
});

const getWorkflowView = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Workflow ID is required in params",
    });
  }

  const workFlowView = await WorkflowMaster.findByPk(id, {
    attributes: ["id", "workflow_name", "workflow_description"],
  });

  if (!workFlowView) {
    return res.status(404).json({
      status: "error",
      message: "Workflow Master not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Workflow details fetched successfully",
    data: workFlowView,
  });
});

const getWorkflowState = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: 0,
  });

  const { rows: workflowStates, count } = await workflowState.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: workflowStates.length
      ? "Workflow state retrieved successfully."
      : "No workflow state found.",
    total: count,
    results: workflowStates.length,
    data: workflowStates,
  });
});

const getWorkflowTransition = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: 0,
  });

  const { rows: workflowTransition, count } =
    await WorkflowTransition.findAndCountAll(features.query);

  res.status(200).json({
    status: "success",
    message: workflowTransition.length
      ? "Workflow transition retrieved successfully."
      : "No workflow transition found.",
    total: count,
    results: workflowTransition.length,
    data: getWorkflowTransition,
  });
});

/***********************Workflow Action ***************************/

const getWorkflowActions = catchAsync(async (req, res, next) => {
  // Build query options using custom APIFeatures helper
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  // Ensure 'where' object exists
  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: 0,
  });

  // Execute paginated query
  const { rows: workflowActionList, count } =
    await WorkflowAction.findAndCountAll(features.query);
  // Build response
  res.status(200).json({
    status: "success",
    message: workflowActionList.length
      ? "Workflow actions retrieved successfully."
      : "No workflow action found.",
    total: count,
    results: workflowActionList.length,
    data: workflowActionList,
  });
});

const createWorkflowActions = catchAsync(async (req, res, next) => {
  const { WorkflowAction } = req.body;

  if (!WorkflowAction || typeof WorkflowAction !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'workflowAction' object is required.",
    });
  }

  const createdWorkflowAction = await workflowAction.create(WorkflowAction);

  res.status(201).json({
    status: "success",
    message: "Workflow Action Created!",
    data: { id: createdWorkflowAction.id },
  });
});

const updateWorkflowActions = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide ID to update.",
    });
  }
  // Extract field from body
  const { action_name, status } = req.body;
  // Basic validation
  if (action_name && action_name.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "action_name cannot be empty.",
    });
  }

  // Update record in database
  const [updatedCount] = await WorkflowAction.update(req.body, {
    where: { id, is_deleted: 0 },
  });

  // Check update result
  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Workflow Action not found or no changes applied.",
    });
  }

  // Send success response
  res.status(200).json({
    status: "success",
    message: "Workflow Action Updated!",
    data: { id },
  });
});

const deleteWorkflowActions = catchAsync(async (req, res, next) => {
  // Accept single ID in params or array in body
  const ids = req.body.ids || (req.params.id ? [req.params.id] : []);

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Please provide one or more IDs to delete.",
    });
  }

  // Only delete inactive actions (status = false)
  const deletedCount = await WorkflowAction.destroy({
    where: {
      id: ids,
      status: false, // only delete inactive actions
    },
  });

  if (deletedCount > 0) {
    res.status(200).json({
      status: "success",
      message: `${deletedCount} workflow action(s) permanently deleted.`,
    });
  } else {
    res.status(404).json({
      status: "error",
      message:
        "No matching workflow actions found to delete or actions are active.",
    });
  }
});

/***********************Workflow Role***************************/

const getWorkflowRoles = catchAsync(async (req, res, next) => {
  // Build query options using custom APIFeatures helper
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  // Ensure 'where' object exists
  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: 0,
  });

  // Execute paginated query
  const { rows: workflowRoleList, count } = await WorkflowRole.findAndCountAll(
    features.query,
  );

  // Build response
  res.status(200).json({
    status: "success",
    message: workflowRoleList.length
      ? "Workflow roles retrieved successfully."
      : "No workflow roles found.",
    total: count,
    results: workflowRoleList.length,
    data: workflowRoleList,
  });
});

const createWorkflowRole = catchAsync(async (req, res, next) => {
  const { workflowRole } = req.body;

  if (!workflowRole || typeof workflowRole !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'workflowRole' object is required.",
    });
  }

  const createdWorkflowRole = await WorkflowRole.create(workflowRole);

  res.status(201).json({
    status: "success",
    message: "Workflow Role Created!",
    data: { id: createdWorkflowRole.id },
  });
});

const updateWorkflowRole = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide ID to update.",
    });
  }

  // Optional: Validate fields if role_name or display_name are being updated
  const { role_name, display_name } = req.body;
  if (
    (role_name && role_name.trim() === "") ||
    (display_name && display_name.trim() === "")
  ) {
    return res.status(400).json({
      status: "error",
      message: "role_name and display_name cannot be empty.",
    });
  }

  const [updatedCount] = await WorkflowRole.update(req.body, {
    where: { id },
  });

  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Workflow Role not found or no changes applied.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Workflow Role Updated!",
    data: { id },
  });
});

const deleteWorkflowRole = catchAsync(async (req, res, next) => {
  // Accept single ID in params or array in body
  const ids = req.body.ids || (req.params.id ? [req.params.id] : []);

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Please provide one or more IDs to delete.",
    });
  }

  const deletedCount = await WorkflowRole.destroy({
    where: {
      id: ids,
      status: false, // only delete inactive roles
    },
  });

  if (deletedCount > 0) {
    res.status(200).json({
      status: "success",
      message: `${deletedCount} role(s) permanently deleted.`,
    });
  } else {
    res.status(404).json({
      status: "error",
      message: "No matching roles found to delete or roles are active.",
    });
  }
});

const getWorkflowRole = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide an ID to get Workflow Role.",
    });
  }

  const workflowRoleView = await WorkflowRole.findByPk(id);

  if (!workflowRoleView || workflowRoleView.is_deleted) {
    return res.status(404).json({
      status: "error",
      message: "Workflow Role not found.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Workflow Role retrieved successfully.",
    data: workflowRoleView,
  });
});

/*********************** Content Type ******************************/

const getContentTypeList = catchAsync(async (req, res, next) => {
  // Build query using APIFeatures
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: false,
  });

  // Execute query
  const { rows: contentTypeList, count } =
    await ContentTypeMaster.findAndCountAll(features.query);

  // Response
  res.status(200).json({
    status: "success",
    message: contentTypeList.length
      ? "Content types retrieved successfully."
      : "No content types found.",
    total: count,
    results: contentTypeList.length,
    data: contentTypeList,
  });
});

const createContentTypeMaster = catchAsync(async (req, res, next) => {
  const {
    content_code,
    content_name,
    content_name_hi,
    content_description,
    content_type,
    workflow_id,
    icon,
    status,
  } = req.body;

  const workflowId = Number(workflow_id);
  if (!Number.isInteger(workflowId) || workflowId <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "A valid workflow is required.",
    });
  }

  const newType = await sequelize.transaction(async (transaction) => {
    const createdType = await ContentTypeMaster.create(
      {
        content_code,
        content_name,
        content_name_hi,
        content_description,
        content_type,
        icon,
        status: status ?? true,
        is_deleted: false,
      },
      { transaction },
    );

    await ContentWorkflowMapping.create(
      {
        content_id: createdType.id,
        workflow_id: workflowId,
      },
      { transaction },
    );

    return createdType;
  });

  res.status(201).json({
    status: "success",
    message: "Type created successfully.",
    data: newType,
  });
});

const updateContentTypeMaster = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { workflow_id, ...contentTypeData } = req.body;
  const workflowId =
    workflow_id === undefined ? undefined : Number(workflow_id);

  const type = await ContentTypeMaster.findOne({
    where: { id, is_deleted: false },
  });

  if (!type) {
    return res.status(404).json({
      status: "fail",
      message: "Type not found.",
    });
  }

  if (
    workflowId !== undefined &&
    (!Number.isInteger(workflowId) || workflowId <= 0)
  ) {
    return res.status(400).json({
      status: "fail",
      message: "A valid workflow is required.",
    });
  }

  await sequelize.transaction(async (transaction) => {
    await type.update(contentTypeData, { transaction });

    if (workflowId !== undefined) {
      const workflowMapping = await ContentWorkflowMapping.findOne({
        where: { content_id: id },
        transaction,
      });

      if (workflowMapping) {
        await workflowMapping.update(
          { workflow_id: workflowId },
          { transaction },
        );
      } else {
        await ContentWorkflowMapping.create(
          { content_id: id, workflow_id: workflowId },
          { transaction },
        );
      }
    }
  });

  res.status(200).json({
    status: "success",
    message: "Type updated successfully.",
    data: type,
  });
});

const deleteContentTypeMaster = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const type = await ContentTypeMaster.findOne({
    where: { id, is_deleted: false },
  });

  if (!type) {
    return res.status(404).json({
      status: "fail",
      message: "Type not found.",
    });
  }

  await type.update({ is_deleted: true });

  res.status(200).json({
    status: "success",
    message: "Type deleted successfully.",
  });
});

/*********************** Content Metadata ******************************/

const getContentMetadata = async (req, res) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  if (!features.query.where) features.query.where = {};
  features.query.where.is_deleted = false;

  const { rows: contentMetadataList, count } =
    await ContentMetadata.findAndCountAll(features.query);

  res.status(200).json({
    status: "success",
    message: "Get Content Metadata List!",
    total: count,
    results: contentMetadataList.length,
    data: { contentMetadataList },
  });
};

const createContentMetadata = catchAsync(async (req, res, next) => {
  const { ContentMetadata: metadata } = req.body;

  if (!metadata || typeof metadata !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'ContentMetadata' object is required.",
    });
  }

  const { content_type_id, title, description, type, priority } = metadata;

  if (
    !content_type_id ||
    !title ||
    !description ||
    !type ||
    priority === undefined
  ) {
    return res.status(400).json({
      status: "error",
      message:
        "Required fields missing (content_type_id, title, description, type, priority).",
    });
  }

  const createdMetadata = await ContentMetadata.create({
    ...metadata,
    is_deleted: false,
    created: new Date(),
  });
  res.status(201).json({
    status: "success",
    message: "Content Metadata Created Successfully!",
    data: { id: createdMetadata.id },
  });
});

const updateContentMetadata = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { ContentMetadata: metadata } = req.body;

  if (!metadata || typeof metadata !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'ContentMetadata' object is required.",
    });
  }

  const existingMetadata = await ContentMetadata.findOne({
    where: { id, is_deleted: false },
  });

  if (!existingMetadata) {
    return res.status(404).json({
      status: "error",
      message: "Content Metadata not found.",
    });
  }

  await existingMetadata.update({
    content_type_id: metadata.content_type_id,
    title: metadata.title,
    title_hi: metadata.title_hi,
    description: metadata.description,
    description_hi: metadata.description_hi,
    type: metadata.type,
    max_length: metadata.max_length,
    is_mandatory: metadata.is_mandatory,
    status: metadata.status,
    priority: metadata.priority,
    type_data: metadata.type_data,
    custom_data: metadata.custom_data,
  });

  res.status(200).json({
    status: "success",
    message: "Content Metadata Updated Successfully!",
  });
});

const deleteContentMetadata = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const metadata = await ContentMetadata.findOne({
    where: { id, is_deleted: false },
  });

  if (!metadata) {
    return res.status(404).json({
      status: "error",
      message: "Content Metadata not found.",
    });
  }

  await metadata.update({
    is_deleted: true,
  });

  res.status(200).json({
    status: "success",
    message: "Content Metadata deleted successfully.",
  });
});

/*********************** Metadata module ***************************/

const getOrganisation = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: false,
  });

  const { rows: organisationList, count } =
    await OrganisationMaster.findAndCountAll({
      ...features.query,
      include: [
        {
          model: OrganisationMaster,
          as: "Parent",
        },
      ],
    });

  res.status(200).json({
    status: "success",
    message: organisationList.length
      ? "Organisation list retrieved successfully."
      : "No organisation found.",
    total: count,
    results: organisationList.length,
    data: organisationList,
  });
});

const getOrganisationById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Organisation id is required",
    });
  }

  const organisation = await OrganisationMaster.findOne({
    where: {
      id,
      is_deleted: false,
    },
    include: [
      {
        model: OrganisationMaster,
        as: "Parent",
      },
      {
        model: OrganisationMaster,
        as: "Children",
      },
    ],
  });

  if (!organisation) {
    return res.status(404).json({
      status: "error",
      message: "Organisation not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Organisation fetched successfully",
    data: organisation,
  });
});

const createOrganisation = catchAsync(async (req, res, next) => {
  const { organisationMaster } = req.body;

  if (!organisationMaster || typeof organisationMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'OrganisationMaster' object is required.",
    });
  }

  const createdOrganisation =
    await OrganisationMaster.create(organisationMaster);

  res.status(201).json({
    status: "success",
    message: "Organisation Created!",
    data: {
      id: createdOrganisation.id,
    },
  });
});

const patchOrganisation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { organisationMaster } = req.body;

  if (!organisationMaster || typeof organisationMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'organisationMaster' object is required.",
    });
  }

  const organisation = await OrganisationMaster.findByPk(id);

  if (!organisation) {
    return res.status(404).json({
      status: "error",
      message: "Organisation not found",
    });
  }

  await organisation.update(organisationMaster);

  res.status(200).json({
    status: "success",
    message: "Organisation Updated Successfully!",
  });
});

const deleteOrganisation = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const organisation = await OrganisationMaster.findByPk(id);

  if (!organisation) {
    return res.status(404).json({
      status: "error",
      message: "Organisation not found",
    });
  }

  // already deleted check (optional but recommended)
  if (organisation.is_deleted === true) {
    return res.status(400).json({
      status: "error",
      message: "Organisation already deleted",
    });
  }

  await organisation.update({
    is_deleted: true,
  });

  res.status(200).json({
    status: "success",
    message: "Organisation deleted successfully!",
  });
});

const getCategoryMasters = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: false,
  });

  const { rows: categoryMasterList, count } =
    await CategoryMaster.findAndCountAll(features.query);

  res.status(200).json({
    status: "success",
    message: categoryMasterList.length
      ? "Category list retrieved successfully."
      : "No Category list found.",
    total: count,
    results: categoryMasterList.length,
    data: categoryMasterList,
  });
});

const getCategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Category id is required",
    });
  }

  const category = await CategoryMaster.findOne({
    where: {
      id,
      is_deleted: false,
    },
    include: [
      {
        model: CategoryMaster,
        as: "Parent",
      },
      {
        model: CategoryMaster,
        as: "Children",
        where: { is_deleted: false },
        required: false,
      },
    ],
  });

  if (!category) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Category fetched successfully",
    data: category,
  });
});

const createCategoryMaster = catchAsync(async (req, res, next) => {
  const { categoryMaster } = req.body;

  // 1️⃣ Validate request body
  if (!categoryMaster || typeof categoryMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'categoryMaster' object is required.",
    });
  }

  const { category_code, name, parent_id, status } = categoryMaster;

  // 2️⃣ Basic required field validation
  if (
    !category_code ||
    !name ||
    parent_id === undefined ||
    status === undefined
  ) {
    return res.status(400).json({
      status: "error",
      message: "Required fields are missing.",
    });
  }

  // 3️⃣ Check duplicate category_code
  const existingCategory = await CategoryMaster.findOne({
    where: {
      category_code,
      is_deleted: false,
    },
  });

  if (existingCategory) {
    return res.status(409).json({
      status: "error",
      message: "Category code already exists.",
    });
  }

  // 4️⃣ Validate parent category (except root)
  if (parent_id !== 0) {
    const parentCategory = await CategoryMaster.findOne({
      where: {
        id: parent_id,
        is_deleted: false,
      },
    });

    if (!parentCategory) {
      return res.status(400).json({
        status: "error",
        message: "Invalid parent category selected.",
      });
    }
  }

  // 5️⃣ Create category
  const createdCategory = await CategoryMaster.create({
    category_code,
    name,
    parent_id,
    status,
    is_deleted: false,
  });

  // 6️⃣ Response
  res.status(201).json({
    status: "success",
    message: "Category Created!",
    data: {
      id: createdCategory.id,
    },
  });
});

const updateCategoryMaster = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { categoryMaster } = req.body;

  // 1️⃣ Validate ID
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Category id is required",
    });
  }

  // 2️⃣ Validate body
  if (!categoryMaster || typeof categoryMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'categoryMaster' object is required.",
    });
  }

  // 3️⃣ Check category exists
  const category = await CategoryMaster.findOne({
    where: {
      id,
      is_deleted: false,
    },
  });

  if (!category) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  // 4️⃣ Prevent duplicate category_code
  if (categoryMaster.category_code) {
    const duplicate = await CategoryMaster.findOne({
      where: {
        category_code: categoryMaster.category_code,
        is_deleted: false,
        id: { [Op.ne]: id },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        status: "error",
        message: "Category code already exists",
      });
    }
  }

  // 5️⃣ Validate parent category (if updating)
  if (
    categoryMaster.parent_id !== undefined &&
    categoryMaster.parent_id !== 0
  ) {
    const parentCategory = await CategoryMaster.findOne({
      where: {
        id: categoryMaster.parent_id,
        is_deleted: false,
      },
    });

    if (!parentCategory) {
      return res.status(400).json({
        status: "error",
        message: "Invalid parent category selected",
      });
    }

    // ❌ Prevent self-parenting
    if (Number(categoryMaster.parent_id) === Number(id)) {
      return res.status(400).json({
        status: "error",
        message: "Category cannot be its own parent",
      });
    }
  }

  // 6️⃣ Update category
  await category.update(categoryMaster);

  // 7️⃣ Response
  res.status(200).json({
    status: "success",
    message: "Category updated successfully!",
  });
});

const deleteCategoryMaster = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // 1️⃣ Validate ID
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Category id is required",
    });
  }

  // 2️⃣ Check category exists
  const category = await CategoryMaster.findOne({
    where: {
      id,
      is_deleted: false,
    },
  });

  if (!category) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  // 3️⃣ Check if category has active children
  const childExists = await CategoryMaster.findOne({
    where: {
      parent_id: id,
      is_deleted: false,
    },
  });

  if (childExists) {
    return res.status(400).json({
      status: "error",
      message: "Cannot delete category with active child categories",
    });
  }

  // 4️⃣ Soft delete
  await category.update({ is_deleted: true });

  // 5️⃣ Response
  res.status(200).json({
    status: "success",
    message: "Category deleted successfully!",
  });
});

const getAudienceList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: false,
  });

  const { rows: AudienceList, count } = await AudienceMaster.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: AudienceList.length
      ? " Audience list retrieved successfully."
      : "No Audience list found.",
    total: count,
    results: AudienceList.length,
    data: AudienceList,
  });
});

const createAudienceMaster = catchAsync(async (req, res, next) => {
  const { audienceMaster } = req.body;

  if (!audienceMaster || typeof audienceMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input — 'audienceMaster' object is required.",
    });
  }

  const { audience_code, name, status } = audienceMaster;

  if (!audience_code || !name) {
    return res.status(400).json({
      status: "error",
      message: "Audience code and name are required.",
    });
  }

  // Optional: check duplicate code
  const existingAudience = await AudienceMaster.findOne({
    where: {
      audience_code,
      is_deleted: false,
    },
  });

  if (existingAudience) {
    return res.status(409).json({
      status: "error",
      message: "Audience code already exists.",
    });
  }

  const createdAudience = await AudienceMaster.create({
    audience_code,
    name,
    status: status ?? true,
    is_deleted: false,
  });

  res.status(201).json({
    status: "success",
    message: "Audience created successfully!",
    data: {
      id: createdAudience.id,
    },
  });
});

const updateAudienceMaster = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide Audience ID to update.",
    });
  }

  const { audienceMaster } = req.body;

  if (!audienceMaster || typeof audienceMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'audienceMaster' object is required.",
    });
  }

  const { audience_code, name, status } = audienceMaster;

  // Conditional validations (PATCH-style)
  if (audience_code !== undefined && audience_code.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Audience code cannot be empty.",
    });
  }

  if (name !== undefined && name.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Audience name cannot be empty.",
    });
  }

  // Check duplicate audience_code (only if sent)
  if (audience_code !== undefined) {
    const existingCode = await AudienceMaster.findOne({
      where: {
        audience_code,
        id: { [Op.ne]: id },
        is_deleted: false,
      },
    });

    if (existingCode) {
      return res.status(409).json({
        status: "error",
        message: "Audience code already exists.",
      });
    }
  }

  const [updatedCount] = await AudienceMaster.update(audienceMaster, {
    where: {
      id,
      is_deleted: false,
    },
  });

  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Audience not found or no changes applied.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Audience Master Updated!",
    data: { id },
  });
});

const deleteAudienceMaster = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // 1. Validate ID
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide Audience ID to delete.",
    });
  }

  // 2. Soft delete
  const [deletedCount] = await AudienceMaster.update(
    { is_deleted: true },
    {
      where: {
        id,
        is_deleted: false,
      },
    },
  );

  // 3. Not found or already deleted
  if (deletedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Audience not found or already deleted.",
    });
  }

  // 4. Success response
  res.status(200).json({
    status: "success",
    message: "Audience deleted successfully.",
    data: { id },
  });
});

const getTypeList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: false,
  });

  const { rows: TypeMasterList, count } = await TypeMaster.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: TypeMasterList.length
      ? " Type list retrieved successfully."
      : "No Type list found.",
    total: count,
    results: TypeMasterList.length,
    data: TypeMasterList,
  });
});

const createTypeMaster = catchAsync(async (req, res, next) => {
  const { typeMaster } = req.body;

  if (!typeMaster || typeof typeMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'typeMaster' object is required.",
    });
  }

  const createdTypeMaster = await TypeMaster.create({
    ...typeMaster,
    is_deleted: false,
  });

  res.status(201).json({
    status: "success",
    message: "Type master Created Successfully!",
    data: {
      id: createdTypeMaster.id,
    },
  });
});

const updateTypeMaster = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide ID to update.",
    });
  }

  const { typeMaster } = req.body;

  if (!typeMaster || typeof typeMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'typeMaster' object is required.",
    });
  }

  const [updatedCount] = await TypeMaster.update(typeMaster, {
    where: { id, is_deleted: false },
  });

  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Type not found or already deleted.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Type Updated Successfully!",
    data: { id },
  });
});

const deleteTypeMaster = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide ID to delete.",
    });
  }

  const [deletedCount] = await TypeMaster.update(
    { is_deleted: true },
    { where: { id, is_deleted: false } },
  );

  if (deletedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Type not found or already deleted.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Type Deleted Successfully!",
  });
});

const getLanguageList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: false,
  });

  const { rows: LanguageList, count } = await LanguageMaster.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: LanguageList.length
      ? " Language list retrieved successfully."
      : "No Language list found.",
    total: count,
    results: LanguageList.length,
    data: LanguageList,
  });
});

const createLanguageMaster = catchAsync(async (req, res, next) => {
  const { languageMaster } = req.body;

  if (!languageMaster || typeof languageMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'languageMaster' object is required.",
    });
  }

  const { language_code } = languageMaster;

  // Check duplicate
  const existing = await LanguageMaster.findOne({
    where: { language_code, is_deleted: false },
  });

  if (existing) {
    return res.status(409).json({
      status: "error",
      message: "Language code already exists.",
    });
  }
  const created = await LanguageMaster.create({
    ...languageMaster,
    is_deleted: false,
  });

  res.status(201).json({
    status: "success",
    message: "Language Created!",
    data: { id: created.id },
  });
});

const updateLanguageMaster = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide Language ID.",
    });
  }

  const { languageMaster } = req.body;

  if (!languageMaster || typeof languageMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'languageMaster' object is required.",
    });
  }

  const [updatedCount] = await LanguageMaster.update(languageMaster, {
    where: { id, is_deleted: false },
  });

  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Language not found.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Language Updated!",
    data: { id },
  });
});

const deleteLanguageMaster = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide Language ID.",
    });
  }

  const language = await LanguageMaster.findOne({
    where: { id, is_deleted: false },
  });

  if (!language) {
    return res.status(404).json({
      status: "error",
      message: "Language not found.",
    });
  }

  await language.update({ is_deleted: true });

  res.status(200).json({
    status: "success",
    message: "Language deleted successfully!",
  });
});

const getLocaleLanguageList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  const { rows: localeLanguageList, count } =
    await LocaleLanguageMaster.findAndCountAll(features.query);

  res.status(200).json({
    status: "success",
    message: localeLanguageList.length
      ? "Locale language list retrieved successfully."
      : "No locale language list found.",
    total: count,
    results: localeLanguageList.length,
    data: localeLanguageList,
  });
});

const getLocaleMsgstrList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.include = [
    {
      association: "language",
      attributes: ["id", "lang_shortcode", "lang_name"],
    },
    {
      association: "message",
      attributes: ["id", "msgid", "msgname"],
    },
  ];
  features.query.distinct = true;

  const { rows: localeMsgstrList, count } = await LocaleMsgstr.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: localeMsgstrList.length
      ? "Locale message strings retrieved successfully."
      : "No locale message strings found.",
    total: count,
    results: localeMsgstrList.length,
    data: localeMsgstrList,
  });
});

const createLocaleMsgstr = catchAsync(async (req, res, next) => {
  const { localeMsgstr } = req.body ?? {};

  if (!localeMsgstr || typeof localeMsgstr !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'localeMsgstr' object is required.",
    });
  }

  const languageId = Number(localeMsgstr.language_id);
  const messageId = Number(localeMsgstr.msg_id);

  if (
    !Number.isInteger(languageId) ||
    languageId <= 0 ||
    !Number.isInteger(messageId) ||
    messageId <= 0 ||
    typeof localeMsgstr.msgstr !== "string" ||
    !localeMsgstr.msgstr.trim()
  ) {
    return res.status(400).json({
      status: "error",
      message:
        "language_id, msg_id, and msgstr are required and must be valid.",
    });
  }

  const [language, message] = await Promise.all([
    LocaleLanguageMaster.findByPk(languageId),
    LocaleMsgid.findByPk(messageId),
  ]);

  if (!language || !message) {
    return res.status(404).json({
      status: "error",
      message: !language
        ? "Locale language not found."
        : "Locale message ID not found.",
    });
  }

  const created = await LocaleMsgstr.create({
    language_id: languageId,
    msg_id: messageId,
    msgstr: localeMsgstr.msgstr,
  });

  res.status(201).json({
    status: "success",
    message: "Locale message string created!",
    data: { id: created.id },
  });
});

const updateLocaleMsgstr = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { localeMsgstr } = req.body;

  if (!localeMsgstr || typeof localeMsgstr !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'localeMsgstr' object is required.",
    });
  }

  const [updatedCount] = await LocaleMsgstr.update(localeMsgstr, {
    where: { id },
  });

  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Locale message string not found.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Locale message string updated!",
    data: { id },
  });
});

const createLocaleLanguageMaster = catchAsync(async (req, res, next) => {
  const { localeLanguageMaster } = req.body;

  if (
    !localeLanguageMaster ||
    typeof localeLanguageMaster !== "object" ||
    !localeLanguageMaster.lang_shortcode ||
    localeLanguageMaster.status == null
  ) {
    return res.status(400).json({
      status: "error",
      message:
        "A 'localeLanguageMaster' object with lang_shortcode and status is required.",
    });
  }

  const existing = await LocaleLanguageMaster.findOne({
    where: {
      lang_shortcode: localeLanguageMaster.lang_shortcode,
    },
  });

  if (existing) {
    return res.status(409).json({
      status: "error",
      message: "Locale language shortcode already exists.",
    });
  }

  const created = await LocaleLanguageMaster.create(localeLanguageMaster);

  res.status(201).json({
    status: "success",
    message: "Locale language created!",
    data: { id: created.id },
  });
});

const updateLocaleLanguageMaster = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { localeLanguageMaster } = req.body;

  if (!localeLanguageMaster || typeof localeLanguageMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'localeLanguageMaster' object is required.",
    });
  }

  const [updatedCount] = await LocaleLanguageMaster.update(
    localeLanguageMaster,
    {
      where: { id },
    },
  );

  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Locale language not found.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Locale language updated!",
    data: { id },
  });
});

const deleteLocaleLanguageMaster = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedCount = await LocaleLanguageMaster.destroy({ where: { id } });

  if (deletedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Locale language not found.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Locale language deleted successfully!",
  });
});

const getExtensionList = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    is_deleted: false,
  });

  const { rows: ExtensionList, count } = await MimeTypeMaster.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: ExtensionList.length
      ? " Language list retrieved successfully."
      : "No Language list found.",
    total: count,
    results: ExtensionList.length,
    data: ExtensionList,
  });
});

const createExtensionMaster = catchAsync(async (req, res, next) => {
  const { extensionMaster } = req.body;

  if (!extensionMaster || typeof extensionMaster !== "object") {
    return res.status(400).json({
      status: "error",
      message: "'extensionMaster' object is required.",
    });
  }

  const { extension, mimetype } = extensionMaster;

  // Check duplicate
  const existing = await MimeTypeMaster.findOne({
    where: { extension, is_deleted: false },
  });

  if (existing) {
    return res.status(409).json({
      status: "error",
      message: "Extension already exists.",
    });
  }

  const created = await MimeTypeMaster.create(extensionMaster);

  res.status(201).json({
    status: "success",
    message: "Extension created successfully!",
    data: { id: created.id },
  });
});

const updateExtensionMaster = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { extensionMaster } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide ID.",
    });
  }

  const [updatedCount] = await MimeTypeMaster.update(extensionMaster, {
    where: { id, is_deleted: false },
  });

  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "Extension not found.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Extension updated successfully!",
    data: { id },
  });
});

const deleteExtensionMaster = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Please provide ID.",
    });
  }

  const extension = await MimeTypeMaster.findOne({
    where: { id, is_deleted: false },
  });

  if (!extension) {
    return res.status(404).json({
      status: "error",
      message: "Extension not found.",
    });
  }

  await extension.update({ is_deleted: true });

  res.status(200).json({
    status: "success",
    message: "Extension deleted successfully!",
  });
});

const getAuditTrailList = catchAsync(async (req, res, next) => {
  let { startDate, endDate } = req.query;
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  features.query.where = Object.assign({}, features.query.where, {
    ...features.query.where,
  });

  if (!startDate && !endDate) {
    endDate = new Date();
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    features.query.where.date_time = {
      [Op.between]: [start, end],
    };
  }

  const { rows: AuditTrailList, count } = await AuditTrail.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: AuditTrailList.length
      ? " Audit Trail list retrieved successfully."
      : "No Audit Trail list found.",
    total: count,
    results: AuditTrailList.length,
    data: AuditTrailList,
  });
});

// exports

module.exports = {
  getTrashList,
  restoreTrash,
  deleteTrash,
  globalRolesList,
  menuList,
  userRolePermissionList,
  updateUserRolePermission,
  getWorkflowMaster,
  createWorkflowMaster,
  updateWorkflowMaster,
  deleteWorkflowMaster,
  getWorkflowView,
  getWorkflowState,
  getWorkflowTransition,
  getWorkflowActions,
  createWorkflowActions,
  updateWorkflowActions,
  deleteWorkflowActions,
  getWorkflowRoles,
  createWorkflowRole,
  updateWorkflowRole,
  deleteWorkflowRole,
  getWorkflowRole,
  getContentTypeList,
  createContentTypeMaster,
  updateContentTypeMaster,
  deleteContentTypeMaster,
  getContentMetadata,
  createContentMetadata,
  updateContentMetadata,
  deleteContentMetadata,
  getOrganisation,
  getOrganisationById,
  createOrganisation,
  patchOrganisation,
  deleteOrganisation,
  getCategoryMasters,
  getCategoryById,
  createCategoryMaster,
  updateCategoryMaster,
  deleteCategoryMaster,
  getAudienceList,
  createAudienceMaster,
  updateAudienceMaster,
  deleteAudienceMaster,
  getTypeList,
  createTypeMaster,
  updateTypeMaster,
  deleteTypeMaster,
  getLanguageList,
  createLanguageMaster,
  updateLanguageMaster,
  deleteLanguageMaster,
  getLocaleLanguageList,
  getLocaleMsgstrList,
  createLocaleMsgstr,
  updateLocaleMsgstr,
  createLocaleLanguageMaster,
  updateLocaleLanguageMaster,
  deleteLocaleLanguageMaster,
  getExtensionList,
  createExtensionMaster,
  updateExtensionMaster,
  deleteExtensionMaster,
  getAuditTrailList,
};
