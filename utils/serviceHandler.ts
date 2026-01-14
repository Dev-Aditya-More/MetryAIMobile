import { ApiEnvelope, SUCCESS_CODE } from "./apiResponse";
import { handleError } from "./handleError";

export type ServiceResponse<T> =
    | { success: true; data: T; message?: string }
    | { success: false; error: string; statusCode?: number; originalError?: any };

/**
 * Wraps an API call or async service function to provide a standardized response format.
 * This catches both network errors and custom errors thrown by the efficient helper/validator.
 * 
 * AUTOMATIC UNWRAPPING:
 * If the serviceFn returns an object resembling an ApiEnvelope (with 'code' and 'msg'),
 * this handler will automatically check for success (code === "0") and unwrap the 'data' property.
 *
 * @param serviceFn - The async function to execute (usually contains the API call and logic)
 * @returns {Promise<ServiceResponse<T>>}
 */
export const serviceHandler = async <T>(
    serviceFn: () => Promise<T | ApiEnvelope<T>>
): Promise<ServiceResponse<T>> => {
    try {
        const result = await serviceFn();

        // Check if result is an ApiEnvelope
        if (isApiEnvelope(result)) {
            if (result.code === SUCCESS_CODE) {
                return { success: true, data: result.data };
            } else {
                return {
                    success: false,
                    error: result.msg || "API Error",
                    statusCode: parseInt(result.code, 10) || 400, // Approximate mapping
                    originalError: result
                };
            }
        }

        // Default case: result is already the data we want (e.g. from Supabase or transformed data)
        return { success: true, data: result as T };
    } catch (err: any) {
        const errorMessage = handleError(err);
        const statusCode = err.response?.status;

        return {
            success: false,
            error: errorMessage,
            statusCode,
            originalError: err,
        };
    }
};

// Type Guard to check if an object is an ApiEnvelope
function isApiEnvelope(obj: any): obj is ApiEnvelope<any> {
    return (
        obj &&
        typeof obj === "object" &&
        "code" in obj &&
        "msg" in obj &&
        "data" in obj // Ensure 'data' exists, though it might be null
    );
}
