declare module 'jwks-client' {
  export interface JwksClient {
    getSigningKey(kid: string, cb: (err: Error | null, key?: SigningKey) => void): void;
  }

  export interface SigningKey {
    getPublicKey(): string;
    rsaPublicKey?: string;
  }

  export interface ClientOptions {
    jwksUri: string;
    cache?: boolean;
    cacheMaxEntries?: number;
    cacheMaxAge?: number;
  }

  export default function jwksClient(options: ClientOptions): JwksClient;
}