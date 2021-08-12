const { query, body, param } = require('express-validator');

const VoucherStatus = require('../constant/VoucherStatus');
const VoucherType = require('../constant/VoucherType');
const StringCaseFormatter = require('../util/common-formatter/StringCaseFormatter');

exports.validateInsertVoucher = [
    body('referenceId').isString().isLength({ min: 1 }).withMessage("Invalid reference id format"),
    body('categoryId').isInt({ min: 1 }).withMessage("Invalid category id format"),
    body('providerId').isInt({ min: 1 }).withMessage("Invalid provider id format"),
    body('name').isString().isLength({ min: 3 }).withMessage("Invalid name format"),
    body('value').isInt({ min: 0}).withMessage("Invalid value format"),
    body('price').isInt({ min: 0}).withMessage("Invalid price format"),
    body('margin').isInt({ min: 0}).withMessage("Invalid margin format"),
    body('discount').isInt({ min: 0}).withMessage("Invalid discount format"),
    body('status').customSanitizer(StringCaseFormatter.uppering).isIn(VoucherStatus.getEnumValue()).withMessage("Invalid status format"),
    body('voucherType').customSanitizer(StringCaseFormatter.uppering).isIn(VoucherType.getEnumValue()).withMessage("Invalid voucher type format"),
    body('term').optional({ nullable: true }).isString().isLength({ min: 1 }).withMessage("Invalid term format"),
    body('description').optional({ nullable: true }).isString().isLength({ min: 1 }).withMessage("Invalid description format"),
    body('imageUrl').optional({ nullable: true }).isString().isLength({ min: 1 }).withMessage("Invalid image url format"),
    body('startDate').isString().isLength({ min: 3 }).withMessage("Invalid start date format"),
    body('endDate').isString().isLength({ min: 3 }).withMessage("Invalid end date format"),
    body('stock').optional({ nullable: true }).isInt({min: 0}).withMessage("Invalid stock format")
]

exports.validateUpdateVoucher = [
    param('id').isInt({ min: 1 }).withMessage("Invalid id format"),
    body('referenceId').optional({ nullable: true }).isString().isLength({ min: 1 }).withMessage("Invalid reference id format"),
    body('categoryId').optional({ nullable: true }).isInt({ min: 1 }).withMessage("Invalid category id format"),
    body('providerId').optional({ nullable: true }).isInt({ min: 1 }).withMessage("Invalid provider id format"),
    body('name').optional({ nullable: true }).isString().isLength({ min: 3 }).withMessage("Invalid name format"),
    body('value').optional({ nullable: true }).isInt({ min: 0}).withMessage("Invalid value format"),
    body('price').optional({ nullable: true }).isInt({ min: 0}).withMessage("Invalid price format"),
    body('margin').optional({ nullable: true }).isInt({ min: 0}).withMessage("Invalid margin format"),
    body('discount').optional({ nullable: true }).isInt({ min: 0}).withMessage("Invalid discount format"),
    body('status').optional({ nullable: true }).customSanitizer(StringCaseFormatter.uppering).isIn(VoucherStatus.getEnumValue()).withMessage("Invalid status format"),
    body('voucherType').optional({ nullable: true }).customSanitizer(StringCaseFormatter.uppering).isIn(VoucherType.getEnumValue()).withMessage("Invalid voucher type format"),
    body('term').optional({ nullable: true }).isString().isLength({ min: 1 }).withMessage("Invalid term format"),
    body('description').optional({ nullable: true }).isString().isLength({ min: 1 }).withMessage("Invalid description format"),
    body('imageUrl').optional({ nullable: true }).isString().isLength({ min: 1 }).withMessage("Invalid image url format"),
    body('startDate').optional({ nullable: true }).isString().isLength({ min: 3 }).withMessage("Invalid start date format"),
    body('endDate').optional({ nullable: true }).isString().isLength({ min: 3 }).withMessage("Invalid end date format"),
    body('stock').optional({ nullable: true }).isInt({min: 0}).withMessage("Invalid stock format")
]

exports.validateDeleteVoucher = [
    param('id').isInt({ min: 1 }).withMessage("Invalid id format")
]

exports.validateGetVoucher = [
    query('page').optional({ nullable: true }).isInt({ min: 1, max: 20 }).withMessage("Invalid page format"),
    query('limit').optional({ nullable: true }).isInt({ min: 1, max: 20 }).withMessage("Invalid limit format"),
    query('id').optional({ nullable: true }).isInt({ min: 1 }).withMessage("Invalid id format"),
    query('filter').optional({ nullable: true }).isString().withMessage("Invalid filter format"),
    query('orderBy').optional({ nullable: true }).customSanitizer(StringCaseFormatter.lowering)
    .isIn(["category_id", "provider_id", "name", "value"]).withMessage("Invalid order by format"),
    query('orderType').optional({ nullable: true }).customSanitizer(StringCaseFormatter.uppering).isIn(["ASC", "DESC"])
    .withMessage("Invalid order type format")
]

exports.validateGetActiveVoucher = [
    query('page').optional({ nullable: true }).isInt({ min: 1, max: 25 }).withMessage("Invalid page format"),
    query('limit').optional({ nullable: true }).isInt({ min: 1, max: 15 }).withMessage("Invalid limit format"),
    body('categoryId').optional({ nullable: true }).isInt({ min: 1 }).withMessage("Invalid category id format"),
    body('partnerCode').isString().isLength({min: 1, max: 5}).withMessage("Invalid partner code format"),
    body('voucherId').optional({ nullable: true }).isInt({ min: 1 }).withMessage("Invalid voucher id format")
]

exports.validateOrder = [
    body("transactionId").isString().isLength({min: 36}).withMessage("Invalid transaction id"),
    body("voucherId").isInt({min: 1}).withMessage("Invalid voucher id"),
    body("partnerCode").isString().isLength({min: 1, max: 5}).withMessage("Invalid partner code")
]

exports.validateGetStatus = [
    param("transactionId").isString().isLength({min: 36}).withMessage("Invalid transaction id")
]
