

export function capitalizeString(str: string): string{
    return str.replace(/^\w/, (c) => c.toUpperCase());
}