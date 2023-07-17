
export function isValidDate(dateString: string): boolean {
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime());
}