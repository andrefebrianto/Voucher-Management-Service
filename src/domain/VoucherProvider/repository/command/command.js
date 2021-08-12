const APM = require('elastic-apm-node');

const Logger = require('../../../../util/logger/console/Logger');
const ExtendedError = require('../../../../model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../../../constant/HttpStatusCode');
const {ERROR:ErrorCode} = require('../../../../constant/PostgreSqlErrorCode');
const ErrorMessage = require('../../../../constant/ErrorMessage');

class SqlCommand {
    constructor(database) {
        this.database = database;
    }

    async insert(voucherProvider) {
        try {
            const insertQuery = {
                name: "insert-voucher-provider",
                text: `INSERT INTO public.voucher_provider(
                    name, created_at, updated_at, deleted_at)
                    VALUES ($1, $2, $3, $4);`,
                values: [voucherProvider.name, new Date(), new Date(), null]
            }

            await this.database.query(insertQuery);
            return true;
        } catch (error) {
            if (error.code === ErrorCode.UNIQUE_VIOLATION) {
                throw new ExtendedError("Voucher provider name already exist", HttpErrorCode.BAD_REQUEST);
            }
            Logger.error("VoucherProviderSqlCommand:insert", "Error insert voucher provider", error);
            APM.captureError(error);
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async update(voucherProvider) {
        try {
            const updateQuery = {
                name: "update-voucher-provider",
                text: `UPDATE public.voucher_provider
                    SET name = $2, updated_at = $3
                    WHERE id = $1;`,
                values: [voucherProvider.id, voucherProvider.name, new Date()]
            }

            const updateResult = await this.database.query(updateQuery);
            if (updateResult.rowCount === 0) {
                throw new ExtendedError("Voucher provider not found", HttpErrorCode.NOT_FOUND);
            }
            return true;
        } catch (error) {
            if (error.code === ErrorCode.UNIQUE_VIOLATION) {
                throw new ExtendedError("Voucher provider name already exist", HttpErrorCode.BAD_REQUEST);
            }
            Logger.error("VoucherProviderSqlCommand:update", "Error update voucher provider", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async softDelete(id) {
        try {

            const deactivedVoucherWithEqualProviderID = {
                name: "delete-voucher-same-provider",
                text: `UPDATE public.voucher
                    SET status = 'DELETED',
                        deleted_at = $2
                    WHERE 
                        provider_id = $1
                    AND    
                        status = 'ACTIVE';`,
                values: [id, new Date()]
            }
            await this.database.query(deactivedVoucherWithEqualProviderID);

            const deleteQuery = {
                name: "delete-voucher-provider",
                text: `UPDATE public.voucher_provider
                    SET deleted_at = $2
                    WHERE id = $1;`,
                values: [id, new Date()]
            }

            const deleteResult = await this.database.query(deleteQuery);
            if (deleteResult.rowCount === 0) {
                throw new ExtendedError("Voucher provider not found", HttpErrorCode.NOT_FOUND);
            }

            return true;
        } catch (error) {
            Logger.error("VoucherProviderSqlCommand:softDelete", "Error delete voucher provider", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    async countActiveVoucher(id) {
        console.log("\nVoucherProviderCommand : ", id)
        try {
            const countQuery = {
                name: "count-active-voucher-provider",
                text: `SELECT 
                        COUNT(*) 
                       FROM 
                        public.voucher
                       WHERE 
                        status = 'ACTIVE'
                       AND
                         provider_id = $1;`,
                values: [id]
            }

            const countResult = await this.database.query(countQuery);
            if (countResult.rowCount === 0) {
                throw new ExtendedError("Active voucher not found with referencing provider id", HttpErrorCode.NOT_FOUND);
            }
            return countResult.rows[0].count;
        } catch (error) {
            Logger.error("VoucherProviderSqlCommand:countActiveVoucher", "Error get active voucher not found with referencing provider id", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

}

module.exports = SqlCommand;
