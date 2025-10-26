# ImpactScore Backend - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation & Setup

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Setup Database
```bash
# Run migrations
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed
```

### 3. Start Development Server
```bash
npm run dev
```

The server will start at `http://localhost:3000`

## Demo Credentials

### Admin Account
- Email: `admin@demo.com`
- Password: `password`

### Teacher Accounts
- Email: `teacher1@demo.com` or `teacher2@demo.com`
- Password: `password`

### Student Accounts
- Email: `student1@demo.com` to `student5@demo.com`
- Password: `password`

### Parent Accounts
- Email: `parent1@demo.com` or `parent2@demo.com`
- Password: `password`

## Testing the API

### 1. Login and Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@demo.com",
    "password": "password"
  }'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Student Name",
    "email": "student@demo.com",
    "role": "STUDENT",
    "center": "Main Center"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Use Token for API Calls
```bash
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common API Endpoints

### Get Students
```bash
GET /api/students
Authorization: Bearer {token}
```

### Get Goals
```bash
GET /api/goals?studentId=student-id
Authorization: Bearer {token}
```

### Award XP
```bash
POST /api/xp/award
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": "student-id",
  "amount": 100,
  "category": "homework",
  "note": "Completed homework"
}
```

### Get Student Analytics
```bash
GET /api/analytics/students?studentId=student-id
Authorization: Bearer {token}
```

### Mark Attendance
```bash
POST /api/attendance
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": "student-id",
  "date": "2024-12-20",
  "status": "PRESENT",
  "notes": "Present"
}
```

## Database Management

### View Database in Prisma Studio
```bash
npx prisma studio
```

Opens at `http://localhost:5555`

### Reset Database
```bash
npx prisma migrate reset --force
```

### Generate Prisma Client
```bash
npx prisma generate
```

## Project Structure

```
app/api/
├── auth/
│   ├── login/route.ts
│   └── register/route.ts
├── students/route.ts
├── teachers/route.ts
├── parents/route.ts
├── goals/route.ts
├── badges/route.ts
├── xp/award/route.ts
├── schedule/route.ts
├── live-classes/route.ts
├── study-materials/route.ts
├── attendance/route.ts
└── analytics/students/route.ts

lib/
├── jwt.ts (JWT utilities)
├── middleware.ts (Auth middleware)
├── prisma.ts (Database client)
├── helpers.ts (Helper functions)
├── validation.ts (Data validation)
└── errors.ts (Error handling)

prisma/
├── schema.prisma (Database schema)
├── seed.js (Demo data)
└── dev.db (SQLite database)
```

## Environment Variables

Create `.env.local` file:
```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-key
```

## Troubleshooting

### Database Connection Error
```bash
# Reset database
npx prisma migrate reset --force

# Re-seed data
npx prisma db seed
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Prisma Client Error
```bash
# Regenerate Prisma client
npx prisma generate
```

## API Documentation

For complete API documentation, see `API_DOCUMENTATION.md`

## Features Implemented

✅ User Authentication (Login/Register)
✅ Role-Based Access Control
✅ Student Management
✅ Teacher Management
✅ Parent Management
✅ XP & Leveling System
✅ Badge System
✅ Goal Tracking
✅ Schedule Management
✅ Live Classes
✅ Study Materials
✅ Attendance Tracking
✅ Analytics & Progress Reports
✅ JWT Authentication
✅ Password Hashing
✅ Data Validation
✅ Error Handling

## Next Steps

1. **Connect Frontend**: Update frontend to use these API endpoints
2. **Add Tests**: Write unit and integration tests
3. **Deploy**: Deploy to production environment
4. **Monitor**: Set up logging and monitoring

## Support

- API Documentation: `API_DOCUMENTATION.md`
- Backend Summary: `BACKEND_SUMMARY.md`
- Database Schema: `prisma/schema.prisma`

---

**Happy Coding! 🚀**

