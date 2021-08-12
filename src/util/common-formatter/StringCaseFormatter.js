class StringCaseFormatter {
    static uppering(text) {
        if (text) {
            return text.toUpperCase();
        }
        return text;
    }

    static lowering(text) {
        if (text) {
            return text.toLowerCase();
        }
        return text;
    }
}

module.exports = StringCaseFormatter;
