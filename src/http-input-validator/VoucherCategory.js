const { query, body, param } = require('express-validator');
const StringCaseFormatter = require('../util/common-formatter/StringCaseFormatter');

exports.validateInsertCategory = [
    body('name').isString().isLength({ min: 3 }).withMessage("Invalid category name format"),
    body('imageUrl').optional({ nullable: true }).isString().isLength({ min: 6 }).withMessage("Invalid image url format")
]

exports.validateUpdateCategory = [
    param('id').isInt({ min: 1 }).withMessage("Invalid id format"),
    body('name').optional({ nullable: true }).isString().isLength({ min: 6 }).withMessage("Invalid category name format"),
    body('imageUrl').optional({ nullable: true }).isString().isLength({ min: 6 }).withMessage("Invalid image url format")
]

exports.validateDeleteCategory = [
    param('id').isInt({ min: 1 }).withMessage("Invalid id format")
]

exports.validateCountCategory = [
    param('id').isInt({ min: 1 }).withMessage("Invalid id format")
]

exports.validateGetCategory = [
    query('page').optional({ nullable: true }).isInt({ min: 1, max: 20 }).withMessage("Invalid page format"),
    query('limit').optional({ nullable: true }).isInt({ min: 1, max: 20 }).withMessage("Invalid limit format"),
    query('id').optional({ nullable: true }).isInt({ min: 1 }).withMessage("Invalid id format"),
    query('name').optional({ nullable: true }).isString().withMessage("Invalid name format"),
    query('orderBy').optional({ nullable: true }).customSanitizer(StringCaseFormatter.lowering)
    .isIn(["name"]).withMessage("Invalid order by format"),
    query('orderType').optional({ nullable: true }).customSanitizer(StringCaseFormatter.uppering).isIn(["ASC", "DESC"])
    .withMessage("Invalid order type format")
]
