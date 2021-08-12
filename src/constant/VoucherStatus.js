const ENUMS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    DELETED: "DELETED"
}

function getEnumValue() {
    return Object.values(ENUMS);
}

module.exports = { ...ENUMS, getEnumValue }
