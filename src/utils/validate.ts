export function isEmpty(value: any) {
    if (typeof value === 'boolean') {
        return false;
    }
    if (typeof value === 'number') {
        return false;
    }
    if (value instanceof Array) {
        return value.length === 0;
    }
    if (value === null || value === undefined || value === '') {
        return true;
    }
    if (value instanceof Object) {
        return Object.keys(value).length === 0;
    }
    return false;
}
