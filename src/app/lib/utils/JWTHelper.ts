import jwt, { Secret, SignOptions } from "jsonwebtoken";

export class JWTHelper {
    /**
     * Generate a JWT token with a given payload
     * @param payload - The data to include in the token
     * @param options - Optional JWT sign options
     * @returns {string} - The signed JWT token
     */
    static generateToken(payload: object, options: SignOptions = {}): string {
        const secret: Secret = (process.env.JWT_SECRET as string) || "default_secret";
        const signOptions: SignOptions = {
            expiresIn: options.expiresIn || (process.env.JWT_EXPIRES_IN as any) || "7d"
        };
        // Explicitly use the overload for (payload, secret, options)
        return jwt.sign(payload, secret, signOptions);
    }

    /**
     * Verify a JWT token
     * @param token - The token to verify
     * @returns {any} - The decoded payload
     */
    static verifyToken(token: string) {
        const secret: Secret = (process.env.JWT_SECRET as string) || "default_secret";
        return jwt.verify(token, secret);
    }
}