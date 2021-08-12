const APM = require('elastic-apm-node');

const Logger = require('../../../../util/logger/console/Logger');
const ExtendedError = require('../../../../model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../../../constant/HttpStatusCode');
const ErrorMessage = require('../../../../constant/ErrorMessage');

class Query {
    constructor(database) {
        this.database = database;
    }

    async getById(id) {
        try {
            const getQuery = {
                name: "get-voucher-category",
                text: `SELECT id, name, image_url AS "imageUrl", created_at AS "createdAt", updated_at AS "updatedAt", deleted_at AS "deletedAt"
                    FROM public.voucher_category
                    WHERE id = $1;`,
                values: [id]
            }

            const voucherCategory = await this.database.query(getQuery);
            if (voucherCategory.rows.length === 0) {
                throw new ExtendedError("Voucher category(s) not found", HttpErrorCode.NOT_FOUND);
            }
            return voucherCategory.rows[0];
        } catch (error) {
            Logger.error("VoucherCategoryQuery:getById", "Error get voucher category", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async getAll(page = 1, limit = 15, id, name, orderBy = "created_At", orderType = "ASC") {
        try {
            const offset = (parseInt(page) - 1) * parseInt(limit);
            let queryName = `get-voucher-categories-order-by-${orderBy}-${orderType}`;
            let queryStatement = `SELECT id, name, image_url AS "imageUrl", created_at AS "createdAt", updated_at AS "updatedAt", deleted_at AS "deletedAt"
            FROM public.voucher_category
            WHERE (id = $3::bigint OR $3 IS NULL) AND (lower(name) LIKE lower('%' || $4 || '%') OR $4 IS NULL) AND deleted_at IS NULL
            ORDER BY #orderBy# #orderType#
            LIMIT $1 OFFSET $2;`
            queryStatement = queryStatement.replace(/#orderBy#/g, orderBy);
            queryStatement = queryStatement.replace(/#orderType#/g, orderType);

            const getQuery = {
                name: queryName,
                text: queryStatement,
                values: [limit, offset, id, name]
            }
            const countQuery = {
                name: "count-get-all-voucher-category",
                text: `SELECT COUNT(*)
                    FROM public.voucher_category
                    WHERE (id = $1::bigint OR $1 IS NULL) AND (lower(name) LIKE lower('%' || $2 || '%') OR $2 IS NULL) AND deleted_at IS NULL;`,
                values: [id, name]
            }

            const categories = await this.database.query(getQuery);
            if (categories.rows.length === 0) {
                throw new ExtendedError("Voucher category(s) not found", HttpErrorCode.NOT_FOUND);
            }

            const numberOfCategories = await this.database.query(countQuery);
            const totalData = parseInt(numberOfCategories.rows[0].count);
            const totalPage = Math.ceil(totalData / limit);
            const totalDataOnPage = categories.rows.length;
            const meta = {
                page,
                totalData,
                totalPage,
                totalDataOnPage
            }

            return {data: categories.rows, meta}
        } catch (error) {
            Logger.error("VoucherCategoryQuery:getAll", "Error get voucher categories", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = Query;
