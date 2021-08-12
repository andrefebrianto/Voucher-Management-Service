const APM = require('elastic-apm-node');

const Logger = require('../../../../util/logger/console/Logger');
const ExtendedError = require('../../../../model/ExtendedError');
const {ERROR:ErrorCode} = require('../../../../constant/HttpStatusCode');
const ErrorMessage = require('../../../../constant/ErrorMessage');

class SqlQuery {
    constructor(database) {
        this.database = database;
    }

    async getById(id) {
        try {
            const getQuery = {
                name: "get-voucher",
                text: `SELECT id, reference_id AS "referenceId", category_id AS "categoryId", provider_id AS "providerId", name, value, price, margin, discount, status, term,
                    voucher_type AS "voucherType", description, image_url AS "imageUrl", start_date AS "startDate", end_date AS "endDate", stock, deleted_at AS "deletedAt",
                    created_at AS "createdAt", updated_at AS "updatedAt"
                    FROM public.voucher
                    WHERE id = $1;`,
                values: [id]
            }
                
            const voucher = await this.database.query(getQuery);
            if (voucher.rows.length === 0) {
                throw new ExtendedError("Voucher(s) not found", ErrorCode.NOT_FOUND);
            }
            return voucher.rows[0];
        } catch (error) {
            Logger.error("VoucherQuery:getById", "Error get voucher", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR);
        }
    }

    async getVouchers(page = 1, limit = 15, id, name, orderBy = "created_At", orderType = "ASC") {
        try {
            const offset = (page - 1) * limit;
            let queryName = `get-vouchers-order-by-${orderBy}-${orderType}`;
            let queryStatement = `SELECT voucher.id, reference_id AS "referenceId", category_id AS "categoryId", category.name AS "catagoryName", provider_id AS "providerId",
            provider.name AS "providerName", voucher.name, value, price, margin, discount, status, term, voucher_type AS "voucherType", description, voucher.image_url AS "imageUrl",
            start_date AS "startDate", end_date AS "endDate", stock, voucher.deleted_at AS "deletedAt", voucher.created_at AS "createdAt", voucher.updated_at AS "updatedAt"
            FROM public.voucher AS voucher
            JOIN public.voucher_category AS category ON (category.id = voucher.category_id)
            JOIN public.voucher_provider AS provider ON (provider.id = voucher.provider_id)
            WHERE (voucher.id = $3::bigint OR $3 IS NULL) AND (lower(voucher.name) LIKE lower('%' || $4 || '%') OR $4 IS NULL)
            ORDER BY voucher.#orderBy# #orderType#
            LIMIT $1 OFFSET $2;`;
            queryStatement = queryStatement.replace(/#orderBy#/g, orderBy);
            queryStatement = queryStatement.replace(/#orderType#/g, orderType);

            const getQuery = {
                name: queryName,
                text: queryStatement,
                values: [limit, offset, id, name]
            }
            const countQuery = {
                name: "count-get-all-voucher",
                text: `SELECT COUNT(*)
                    FROM public.voucher AS voucher
                    JOIN public.voucher_category AS category ON (category.id = voucher.category_id)
                    JOIN public.voucher_provider AS provider ON (provider.id = voucher.provider_id)
                    WHERE (voucher.id = $1::bigint OR $1 IS NULL) AND (lower(voucher.name) LIKE lower('%' || $2 || '%') OR $2 IS NULL);`,
                values: [id, name]
            }

            const vouchers = await this.database.query(getQuery);
            if (vouchers.rows.length === 0) {
                throw new ExtendedError("Voucher(s) not found", ErrorCode.NOT_FOUND);
            }

            const numberOfVouchers = await this.database.query(countQuery);
            const totalData = parseInt(numberOfVouchers.rows[0].count);
            const totalPage = Math.ceil(totalData / limit);
            const totalDataOnPage = vouchers.rows.length;
            const meta = {
                page,
                totalData,
                totalPage,
                totalDataOnPage
            }

            return {data: vouchers.rows, meta}

        } catch (error) {
            Logger.error("VoucherQuery:getVouchers", "Error get vouchers", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR);
        }
    }

    async getActiveVouchers(page = 1, limit = 15, id, categoryId) {
        try {
            const offset = (page - 1) * limit;
            const getQuery = {
                name: "get-all-active-voucher",
                text: `SELECT voucher.id, reference_id AS "referenceId", category_id AS "categoryId", provider_id AS "providerId", voucher.name, value, price, margin, discount,
                    status, voucher_type AS "voucherType", term, description, image_url AS "imageUrl", start_date AS "startDate", end_date AS "endDate", stock, voucher.deleted_at AS "deletedAt",
                    voucher.created_at AS "createdAt", voucher.updated_at AS "updatedAt"
                    FROM public.voucher AS voucher
                    JOIN public.voucher_provider AS provider ON (provider.id = provider_id)
                    WHERE (voucher.id = $3::bigint OR $3 IS NULL) AND (voucher.category_id = $4::bigint OR $4 IS NULL) AND status = 'ACTIVE'
                    AND provider.deleted_at IS NULL AND start_date <= NOW()::date AND NOW()::date <= end_date AND (stock IS NULL OR stock > 0)
                    ORDER BY voucher.created_at ASC
                    LIMIT $1 OFFSET $2;`,
                values: [limit, offset, id, categoryId]
            }
            const countQuery = {
                name: "count-get-all-active-voucher",
                text: `SELECT COUNT(*)
                    FROM public.voucher AS voucher
                    JOIN public.voucher_provider AS provider ON (provider.id = provider_id)
                    WHERE (voucher.id = $1::bigint OR $1 IS NULL) AND (voucher.category_id = $2::bigint OR $2 IS NULL) AND status = 'ACTIVE'
                    AND provider.deleted_at IS NULL AND start_date <= NOW()::date AND NOW()::date <= end_date;`,
                values: [id, categoryId]
            }

            const vouchers = await this.database.query(getQuery);
            if (vouchers.rows.length === 0) {
                throw new ExtendedError("Voucher(s) not found", ErrorCode.NOT_FOUND);
            }

            const numberOfVouchers = await this.database.query(countQuery);
            const totalData = parseInt(numberOfVouchers.rows[0].count);
            let totalPage = Math.ceil(totalData / limit);
            const totalDataOnPage = vouchers.rows.length;
            const meta = {
                page,
                totalData,
                totalPage,
                totalDataOnPage
            }

            return {data: vouchers.rows, meta}

        } catch (error) {
            Logger.error("VoucherQuery:getActiveVouchers", "Error get active vouchers", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = SqlQuery;
