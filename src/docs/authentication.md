# Authentication

ThiruXDB provides multiple layers of authentication to secure both the admin dashboard and the public API gateway.

## Admin Dashboard

The admin dashboard is protected via JWT (JSON Web Tokens). 
When an administrator logs in, a token is generated and stored in a secure, `HttpOnly` cookie.

```javascript
// Example token generation
const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: '1d' });
```

## API Keys (Public Gateway)

For external services connecting to ThiruXDB, we use API Keys passed via the `Authorization` header.

### Authenticating a Request

```http
GET /api/v1/data HTTP/1.1
Host: api.thiruxdb.com
Authorization: Bearer thx_YOUR_API_KEY_HERE
```

If the key is invalid or missing, the gateway will return a `401 Unauthorized` error.
