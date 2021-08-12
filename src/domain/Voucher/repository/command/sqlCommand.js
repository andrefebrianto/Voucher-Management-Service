const APM = require('elastic-apm-node');

const Logger = require('../../../../util/logger/console/Logger');
const ExtendedError = require('../../../../model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../../../constant/HttpStatusCode');
const {ERROR:ErrorCode} = require('../../../../constant/PostgreSqlErrorCode');
const VoucherStatus = require('../../../../constant/VoucherStatus');
const ErrorMessage = require('../../../../constant/ErrorMessage');

class SqlCommand {
    constructor(database) {
        this.database = database;
    }

    async insert(voucher) {
        try {
            const insertQuery = {
                name: "insert-voucher",
                text: `INSERT INTO public.voucher(
                    category_id, provider_id, reference_id, name, value, price, margin, discount, status, term, description, image_url, start_date, end_date, stock,
                    created_at, updated_at, deleted_at, voucher_type)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19);`,
                values: [voucher.categoryId, voucher.providerId, voucher.referenceId, voucher.name, voucher.value, voucher.price, voucher.margin, voucher.discount, voucher.status,
                voucher.term, voucher.description, voucher.imageUrl, voucher.startDate, voucher.endDate, voucher.stock, new Date(), new Date(), null, voucher.voucherType]
            }
            
            await this.database.query(insertQuery);
            return true;
        } catch (error) {
            if (error.code === ErrorCode.FOREIGN_KEY_VIOLATION) {
                throw new ExtendedError("Foreign key not exist", HttpErrorCode.BAD_REQUEST);
            }
            Logger.error("VoucherSqlCommand:insert", "Error insert voucher", error);
            APM.captureError(error);
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async update(voucher) {
        try {
            const updateQuery = {
                name: "update-voucher",
                text: `UPDATE public.voucher
                    SET category_id=$2, provider_id=$3, reference_id=$4, name=$5, value=$6, price=$7, margin=$8, discount=$9, status=$10, term=$11, description=$12,
                    image_url=$13, start_date=$14, end_date=$15, stock=$16, updated_at=$17, voucher_type=$18
                    WHERE id = $1;`,
                values: [voucher.id, voucher.categoryId, voucher.providerId, voucher.referenceId, voucher.name, voucher.value, voucher.price, voucher.margin, voucher.discount,
                    voucher.status, voucher.term, voucher.description, voucher.imageUrl, voucher.startDate, voucher.endDate, voucher.stock, new Date(), voucher.voucherType]
            }
    
            const updateResult = await this.database.query(updateQuery);
            if (updateResult.rowCount === 0) {
                throw new ExtendedError("Voucher not found", HttpErrorCode.NOT_FOUND);
            }
            return true;
        } catch (error) {
            if (error.code === ErrorCode.FOREIGN_KEY_VIOLATION) {
                throw new ExtendedError("Foreign key not exist", HttpErrorCode.BAD_REQUEST);
            }
            Logger.error("VoucherSqlCommand:update", "Error update voucher", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async softDelete(id) {
        try {
            const deleteQuery = {
                name: "delete-voucher",
                text: `UPDATE public.voucher
                    SET status = $2, deleted_at = $3
                    WHERE id = $1;`,
                values: [id, VoucherStatus.DELETED, new Date()]
            }
            
            const deleteResult = await this.database.query(deleteQuery);
            if (deleteResult.rowCount === 0) {
                throw new ExtendedError("Voucher not found", HttpErrorCode.NOT_FOUND);
            }
            return true;
        } catch (error) {
            Logger.error("VoucherSqlCommand:softDelete", "Error delete voucher", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async decreaseStock(id, amount) {
        try {
            const updateQuery = {
                name: "update-voucher",
                text: `UPDATE public.voucher
                    SET stock = (CASE
                        WHEN stock IS NULL
                            THEN stock
                        ELSE stock - $2
                    END),
                    updated_at=$3
                    WHERE id = $1;`,
                values: [id, amount, new Date()]
            }
    
            const updateResult = await this.database.query(updateQuery);
            if (updateResult.rowCount === 0) {
                throw new ExtendedError("Voucher not found", HttpErrorCode.NOT_FOUND);
            }
            return true;
        } catch (error) {
            Logger.error("VoucherSqlCommand:update", "Error update voucher", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = SqlCommand;
