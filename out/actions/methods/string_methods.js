"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripQuotes = stripQuotes;
function stripQuotes(str) {
    const s = str.trim();
    // Triple quotes '''...''' or """..."""
    if ((s.startsWith('"""') && s.endsWith('"""')) ||
        (s.startsWith("'''") && s.endsWith("'''"))) {
        return s.slice(3, -3);
    }
    // Single or double quotes
    if ((s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))) {
        return s.slice(1, -1);
    }
    return s;
}
//# sourceMappingURL=string_methods.js.map