
/**
 * Safely parses product images from various formats (JSON string, array, null).
 * Returns an array of image URLs or a default placeholder if no images are found.
 * 
 * @param images - The raw images field from the database (can be string, array, or null)
 * @returns string[] - An array of valid image URLs
 */
export function parseProductImages(images: any): string[] {
    const placeholder = '/images/placeholder-product.jpg';
    
    if (!images) {
        return [placeholder];
    }

    try {
        // Case 1: Already an array
        if (Array.isArray(images)) {
            return images.length > 0 ? images : [placeholder];
        }

        // Case 2: Stringified JSON
        if (typeof images === 'string') {
            // Try to parse the string
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }

        // Case 3: Single string URL (edge case)
        if (typeof images === 'string' && (images.startsWith('http') || images.startsWith('/'))) {
            return [images];
        }

    } catch (e) {
        console.error('Error parsing product images:', e);
    }

    // Default fallback
    return [placeholder];
}
