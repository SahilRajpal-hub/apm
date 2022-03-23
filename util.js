

function getValue(lines, property, separator, trimmed, lineMatch) {
    separator = separator || ':';
    property = property.toLowerCase();
    trimmed = trimmed || false;
    lineMatch = lineMatch || false;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].toLowerCase().replace(/\t/g, '');
        if (trimmed) {
            line = line.trim();
        }
        if (line.startsWith(property) && (lineMatch ? (line.match(property + separator)) : true)) {
            const parts = trimmed ? lines[i].trim().split(separator) : lines[i].split(separator);
            if (parts.length >= 2) {
                parts.shift();
                return parts.join(separator).trim();
            } else {
                return '';
            }
        }
    }
    return '';
}

module.exports = { getValue }