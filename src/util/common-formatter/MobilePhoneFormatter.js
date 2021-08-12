class MobilePhoneFormatter {
    static format = /^(0|62)8[0-9]{9,11}$/

    static validateFormat(mobilePhone) {
        return this.format.test(mobilePhone);
    }

    static formatWithIndonesianCountryCode(mobilePhone) {
        return mobilePhone.replace(/^0/, 62);
    }
}

module.exports = MobilePhoneFormatter;
