# Rate Limiting

ThiruXDB protects your external APIs from being overwhelmed by implementing a robust, distributed rate-limiting strategy on the API Gateway.

## How it works

When a client makes a request to the ThiruXDB public gateway:
1. **IP Tracking**: The client's IP address is extracted and hashed.
2. **Token Bucket**: A Redis-backed token bucket algorithm checks if the client has remaining requests for the current time window.
3. **Headers**: The response includes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers.

## Configuration

You can configure the global rate limits in your `.env` file:

```bash
# Maximum requests per 15 minutes per IP
RATE_LIMIT_MAX=100

# Window size in milliseconds
RATE_LIMIT_WINDOW_MS=900000
```

For production workloads, you can bypass these limits for internal microservices using static API keys.
