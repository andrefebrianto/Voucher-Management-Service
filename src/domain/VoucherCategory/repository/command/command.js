const APM = require('elastic-apm-node');

const Logger = require('../../../../util/logger/console/Logger');
const ExtendedError = require('../../../../model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../../../constant/HttpStatusCode');
const {ERROR:ErrorCode} = require('../../../../constant/PostgreSqlErrorCode');
const ErrorMessage = require('../../../../constant/ErrorMessage');

class Command {
    constructor(database) {
        this.database = database;
    }

    async insert(category) {
        try {
            const insertQuery = {
                name: "insert-voucher-category",
                text: `INSERT INTO public.voucher_category(
                    name, image_url, created_at, updated_at, deleted_at)
                    VALUES ($1, $2, $3, $4, $5);`,
                values: [category.name, category.imageUrl, new Date(), new Date(), null]
            }

            await this.database.query(insertQuery);
            return true;
        } catch (error) {
            if (error.code === ErrorCode.UNIQUE_VIOLATION) {
                throw new ExtendedError("Voucher category name already exist", HttpErrorCode.BAD_REQUEST);
            }
            Logger.error("VoucherCategorySqlCommand:insert", "Error insert voucher category", error);
            APM.captureError(error);
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async update(category) {
        try {
            const updateQuery = {
                name: "update-voucher-category",
                text: `UPDATE public.voucher_category
                    SET name = $2, image_url = $3, updated_at = $4
                    WHERE id = $1;`,
                values: [category.id, category.name, category.imageUrl, new Date()]
            }

            const updateResult = await this.database.query(updateQuery);
            if (updateResult.rowCount === 0) {
                throw new ExtendedError("Voucher category not found", HttpErrorCode.NOT_FOUND);
            }
            return true;
        } catch (error) {
            if (error.code === ErrorCode.UNIQUE_VIOLATION) {
                throw new ExtendedError("Voucher category name already exist", HttpErrorCode.BAD_REQUEST);
            }
            Logger.error("VoucherCategorySqlCommand:update", "Error update voucher category", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async softDelete(id) {
        try {

            const deactivedVoucherWithEqualCategoryID = {
                name: "delete-voucher-same-category",
                text: `UPDATE public.voucher
                    SET status = 'DELETED',
                        deleted_at = $2
                    WHERE 
                        category_id = $1
                    AND    
                        status = 'ACTIVE'
                        ;`,
                values: [id, new Date()]
            }
            await this.database.query(deactivedVoucherWithEqualCategoryID);
      
            const deleteQuery = {
                name: "delete-voucher-category",
                text: `UPDATE public.voucher_category
                    SET deleted_at = $2
                    WHERE id = $1;`,
                values: [id, new Date()]
            }

            const deleteResult = await this.database.query(deleteQuery);
            if (deleteResult.rowCount === 0) {
                throw new ExtendedError("Voucher category not found", HttpErrorCode.NOT_FOUND);
            }

            return true;
        } catch (error) {
            Logger.error("VoucherCategorySqlCommand:softDelete", "Error delete voucher category", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async countActiveVoucher(id) {
        try {
            const countQuery = {
                name: "count-active-voucher-category",
                text: `SELECT 
                        COUNT(*) 
                       FROM 
                        public.voucher
                       WHERE 
                        status = 'ACTIVE'
                       AND
                         category_id = $1;`,
                values: [id]
            }

            const countResult = await this.database.query(countQuery);
            if (countResult.rowCount === 0) {
                throw new ExtendedError("Active voucher not found with referencing category id", HttpErrorCode.NOT_FOUND);
            }
            return countResult.rows[0].count;
        } catch (error) {
            Logger.error("VoucherCategorySqlCommand:countActiveVoucher", "Error get active voucher not found with referencing category id", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = Command;
