const ENUMS = {
    BARCODE: "BARCODE",
    QR_CODE: "QR-CODE",
    TEXT_CODE: "TEXT CODE",
    URL_LINK: "URL LINK"
}

function getEnumValue() {
    return Object.values(ENUMS);
}

module.exports = { ...ENUMS, getEnumValue }
