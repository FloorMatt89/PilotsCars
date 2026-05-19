# API Reference

## Overview

All API routes live under `/app/api/`. They use the Supabase SSR server client
(`lib/supabase/server.ts`) for all database and storage operations. Every route
logs `METHOD /api/...` on entry and `Done` on success.

**Authentication:** Supabase session cookie (set automatically by the login
route). Pass the `access_token` in the `Authorization: Bearer <token>` header
for stateless clients, or rely on cookies for browser clients.

**Error shape:**
```json
{ "error": "error_code", "message": "Human-readable message" }
```

---

## Auth

### POST /api/auth/signup
Register a new user account.

**Body:**
```json
{
  "email": "pilot@example.com",
  "password": "min8chars",
  "full_name": "Jane Smith",
  "phone": "+13055550000"
}
```

**Response 201:**
```json
{
  "token": "<supabase_access_token>",
  "user": {
    "id": "uuid",
    "email": "pilot@example.com",
    "full_name": "Jane Smith",
    "phone": "+13055550000",
    "is_verified": false,
    "created_at": "2026-05-19T..."
  }
}
```

**Side effects:** Creates row in `public.users` with `is_verified = false`.

---

### POST /api/auth/login
Authenticate an existing user.

**Body:**
```json
{ "email": "pilot@example.com", "password": "mypassword" }
```

**Response 200:**
```json
{
  "token": "<supabase_access_token>",
  "user": { "id": "...", "email": "...", "is_verified": true, ... },
  "is_verified": true
}
```

If `is_verified` is `false`, response also includes:
```json
{ "message": "Please upload airline ID to book" }
```

---

## Users

### POST /api/users/upload-airline-id
Upload a JPEG/PNG airline ID image (max 5 MB). Requires authentication.

**Body:** `multipart/form-data` with field `file` (JPEG or PNG, ≤ 5 MB).

**Response 200:**
```json
{
  "status": "uploaded",
  "storage_path": "<user_id>/1716123456789.jpg",
  "message": "Airline ID uploaded successfully. An admin will review and verify your account."
}
```

**Side effects:** Uploads file to `airline-ids/<user_id>/<filename>` bucket and
saves path to `users.airline_id_image_url`.

---

## Locations

### GET /api/locations
Returns all rental locations. Requires authentication.

**Response 200:**
```json
{
  "locations": [
    {
      "id": "uuid",
      "name": "Miami Airport",
      "city": "Miami",
      "address": "...",
      "phone": "...",
      "hours_open": "...",
      "created_at": "..."
    }
  ]
}
```

---

## Vehicles

### GET /api/vehicles
Returns available vehicles, optionally filtered. Requires authentication.

**Query params (all optional):**
- `location_id` — UUID of a location
- `vehicle_type` — one of `sedan`, `suv`, `van`, `minivan`

**Response 200:**
```json
{
  "vehicles": [
    {
      "id": "uuid",
      "make": "Nissan",
      "model": "Versa",
      "year": 2024,
      "color": "White",
      "daily_rate": "89.00",
      "vehicle_type": "sedan",
      "features": ["GPS", "backup camera"],
      "mileage": 12000,
      "location_id": "uuid",
      "images": ["https://...supabase.co/storage/...?token=..."]
    }
  ]
}
```

Images are signed URLs (1 hour TTL) from `vehicles-images` bucket. If a vehicle
has no `image_storage_path`, `images` will be `[]`.

---

## Bookings

### POST /api/bookings
Create a new booking. Requires authentication AND `is_verified = true`.

**Body:**
```json
{
  "vehicle_id": "uuid",
  "location_id": "uuid",
  "pickup_date": "2026-06-10",
  "return_date": "2026-06-14",
  "pickup_time": "10:00",
  "return_time": "10:00"
}
```

**Response 201:**
```json
{
  "booking": {
    "id": "uuid",
    "vehicle_id": "uuid",
    "location_id": "uuid",
    "pickup_date": "2026-06-10",
    "return_date": "2026-06-14",
    "pickup_time": "10:00",
    "return_time": "10:00",
    "status": "pending",
    "total_price": "356.00",
    "num_days": 4,
    "created_at": "..."
  }
}
```

`total_price = daily_rate × num_days` (minimum 1 day).
Unverified users receive `403 not_verified`.

---

### GET /api/bookings
Returns all bookings for the authenticated user, newest first.

**Response 200:**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "pickup_date": "2026-06-10",
      "return_date": "2026-06-14",
      "status": "pending",
      "total_price": "356.00",
      "vehicles": { "id": "...", "make": "Nissan", "model": "Versa", ... },
      "locations": { "id": "...", "name": "Miami Airport", "city": "Miami", ... }
    }
  ]
}
```

---

## Referrals

### GET /api/referrals
Returns the user's referral code, total commission earned, and referral history.
Requires authentication.

**Response 200:**
```json
{
  "referral_code": "PILOT-A1B2C3",
  "total_commission_earned": 71.20,
  "referrals": [
    {
      "id": "uuid",
      "referral_code": "PILOT-A1B2C3",
      "status": "earned",
      "commission_earned": "71.20",
      "paid_at": null,
      "created_at": "...",
      "referred_user_id": "uuid",
      "bookings": { "id": "...", "total_price": "890.00", "status": "confirmed", ... }
    }
  ]
}
```

Commission = 8% of the linked booking's `total_price` (computed in the service
layer when admin marks a referral as earned).

---

## Admin

### POST /api/admin/verify-airline-id
Approve or reject a user's airline ID. Admin-only.

**Body:**
```json
{ "user_id": "uuid", "approved": true }
```

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "email": "pilot@example.com",
    "full_name": "Jane Smith",
    "is_verified": true,
    "verified_at": "2026-05-19T...",
    "airline_id_image_url": "<storage_path>"
  }
}
```

If `approved` is `false`, sets `is_verified = false` and clears `verified_at`.

---

### GET /api/admin/airline-ids-pending
Returns unverified users who have uploaded an airline ID. Admin-only.
Each user includes a signed URL (1 hour TTL) for image preview.

**Response 200:**
```json
{
  "pending_users": [
    {
      "id": "uuid",
      "email": "pilot@example.com",
      "full_name": "Jane Smith",
      "phone": "+13055550000",
      "airline_id_signed_url": "https://...supabase.co/storage/...?token=...",
      "submitted_at": "2026-05-18T..."
    }
  ]
}
```

---

## Authentication Notes
- Use the `token` from login/signup in the `Authorization: Bearer <token>` header
  for API clients that don't send cookies.
- Cookie-based sessions are set automatically for browser clients.
- Admin routes additionally check `app_metadata.role === 'admin'` in the JWT.

## Rate Limiting (Future)
- 100 req/min per IP on public endpoints
- 1000 req/min per authenticated user on private endpoints
