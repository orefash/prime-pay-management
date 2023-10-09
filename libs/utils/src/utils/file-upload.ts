
import { ConfigService } from '@nestjs/config';

export async function generateUniqueFilename(prefix, originalFilename) {
    // Extract the file extension from the original filename
    const fileExtension = originalFilename.split('.').pop();

    // Generate a unique timestamp
    const timestamp = new Date().getTime();

    // Generate a random number
    const randomNumber = Math.floor(Math.random() * 1000000);

    // Combine the prefix, timestamp, random number, and file extension
    const uniqueFilename = `${prefix}-${timestamp}-${randomNumber}.${fileExtension}`;

    return uniqueFilename;
}