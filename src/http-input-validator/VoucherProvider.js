const { query, body, param } = require('express-validator');
const StringCaseFormatter = require('../util/common-formatter/StringCaseFormatter');

exports.validateInsertProvider = [
    body('name').isString().isLength({ min: 3 }).withMessage("Invalid provider name format")
]

exports.validateUpdateProvider = [
    param('id').isInt({ min: 1 }).withMessage("Invalid id format"),
    body('name').optional({ nullable: true }).isString().isLength({ min: 6 }).withMessage("Invalid provider name format")
]

exports.validateDeleteProvider = [
    param('id').isInt({ min: 1 }).withMessage("Invalid id format")
]

exports.validateCountProvider = [
    param('id').isInt({ min: 1 }).withMessage("Invalid id format")
]

exports.validateGetProvider = [
    query('page').optional({ nullable: true }).isInt({ min: 1, max: 20 }).withMessage("Invalid page format"),
    query('limit').optional({ nullable: true }).isInt({ min: 1, max: 20 }).withMessage("Invalid limit format"),
    query('id').optional({ nullable: true }).isInt({ min: 1 }).withMessage("Invalid id format"),
    query('name').optional({ nullable: true }).isString().withMessage("Invalid name format"),
    query('orderBy').optional({ nullable: true }).customSanitizer(StringCaseFormatter.lowering)
    .isIn(["name"]).withMessage("Invalid order by format"),
    query('orderType').optional({ nullable: true }).customSanitizer(StringCaseFormatter.uppering).isIn(["ASC", "DESC"])
    .withMessage("Invalid order type format")
]
