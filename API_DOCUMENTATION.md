# ImpactScore Backend API Documentation

## Overview
Complete REST API for the ImpactScore gamified learning platform. All endpoints require JWT authentication via Bearer token in the Authorization header.

## Authentication

### Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "STUDENT",
    "center": "Main Center"
  },
  "token": "jwt-token-here"
}
```

### Register
**POST** `/api/auth/register`

Request:
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "STUDENT",
  "center": "Main Center"
}
```

## Students

### Get All Students
**GET** `/api/students?teacherId=teacher-id&center=Main Center`

Headers: `Authorization: Bearer {token}`

### Create Student
**POST** `/api/students`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "password123",
  "teacherId": "teacher-id",
  "center": "Main Center"
}
```

## Teachers

### Get All Teachers
**GET** `/api/teachers?center=Main Center`

Headers: `Authorization: Bearer {token}`

### Create Teacher
**POST** `/api/teachers`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "Teacher Name",
  "email": "teacher@example.com",
  "password": "password123",
  "subject": "Mathematics",
  "center": "Main Center"
}
```

## Goals

### Get Goals
**GET** `/api/goals?studentId=student-id`

Headers: `Authorization: Bearer {token}`

### Create Goal
**POST** `/api/goals`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "studentId": "student-id",
  "title": "Complete Math Chapter 5",
  "description": "Finish all exercises",
  "deadline": "2024-12-31"
}
```

### Update Goal
**PUT** `/api/goals`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "goalId": "goal-id",
  "progress": 75,
  "status": "ACTIVE"
}
```

## XP & Badges

### Award XP
**POST** `/api/xp/award`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "studentId": "student-id",
  "amount": 100,
  "category": "homework",
  "note": "Completed homework assignment"
}
```

### Get Badges
**GET** `/api/badges?studentId=student-id`

Headers: `Authorization: Bearer {token}`

### Award Badge
**POST** `/api/badges`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "studentId": "student-id",
  "name": "Perfect Attendance",
  "description": "100% attendance",
  "icon": "🎯"
}
```

## Schedules

### Get Schedules
**GET** `/api/schedule?teacherId=teacher-id&studentId=student-id`

Headers: `Authorization: Bearer {token}`

### Create Schedule
**POST** `/api/schedule`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "subject": "Mathematics",
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "10:00",
  "room": "Room 101",
  "center": "Main Center",
  "studentIds": ["student-id-1", "student-id-2"]
}
```

## Live Classes

### Get Live Classes
**GET** `/api/live-classes?teacherId=teacher-id&studentId=student-id`

Headers: `Authorization: Bearer {token}`

### Create Live Class
**POST** `/api/live-classes`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "title": "Introduction to Algebra",
  "description": "Learn the basics",
  "googleMeetLink": "https://meet.google.com/...",
  "scheduledTime": "2024-12-20T10:00:00Z",
  "center": "Main Center",
  "studentIds": ["student-id-1", "student-id-2"]
}
```

## Study Materials

### Get Study Materials
**GET** `/api/study-materials?teacherId=teacher-id&studentId=student-id&category=CLASS_NOTES`

Headers: `Authorization: Bearer {token}`

### Upload Study Material
**POST** `/api/study-materials`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "title": "Algebra Basics",
  "description": "Chapter 1",
  "category": "CLASS_NOTES",
  "fileUrl": "https://example.com/file.pdf",
  "fileName": "algebra-basics.pdf",
  "fileType": "pdf",
  "center": "Main Center",
  "studentIds": ["student-id-1", "student-id-2"]
}
```

## Attendance

### Get Attendance Records
**GET** `/api/attendance?studentId=student-id&startDate=2024-01-01&endDate=2024-12-31`

Headers: `Authorization: Bearer {token}`

### Mark Attendance
**POST** `/api/attendance`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "studentId": "student-id",
  "date": "2024-12-20",
  "status": "PRESENT",
  "notes": "Present"
}
```

## Analytics

### Get Student Analytics
**GET** `/api/analytics/students?studentId=student-id`

Headers: `Authorization: Bearer {token}`

Response includes:
- Student info
- Badges earned
- Goals progress
- Attendance percentage
- XP breakdown by category

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `VALIDATION_ERROR` (400)
- `AUTHENTICATION_ERROR` (401)
- `AUTHORIZATION_ERROR` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `INTERNAL_SERVER_ERROR` (500)

## Authentication Roles

- **ADMIN**: Full access to all endpoints
- **TEACHER**: Can manage students, create schedules, award XP/badges
- **STUDENT**: Can view own data, goals, schedules
- **PARENT**: Can view child's progress

## Database Models

### User
- id, name, email, password, role, center, createdAt, updatedAt

### Student
- id, userId, teacherId, parentId, level, xp, attendance, center, createdAt, updatedAt

### Teacher
- id, userId, center, subject, createdAt, updatedAt

### Parent
- id, userId, center, createdAt, updatedAt

### Badge
- id, studentId, name, description, icon, earnedDate, createdAt, updatedAt

### Goal
- id, studentId, title, description, progress, deadline, status, createdAt, updatedAt

### XPTransaction
- id, studentId, teacherId, amount, category, note, date, createdAt, updatedAt

### Schedule
- id, teacherId, subject, dayOfWeek, startTime, endTime, room, center, createdAt, updatedAt

### LiveClass
- id, teacherId, title, description, googleMeetLink, scheduledTime, center, status, createdAt, updatedAt

### StudyMaterial
- id, teacherId, title, description, category, fileUrl, fileName, fileType, center, uploadedAt, createdAt, updatedAt

### Attendance
- id, studentId, date, status, notes, createdAt, updatedAt

## XP System

- **Level Threshold**: 1500 XP per level
- **Level Formula**: `floor(totalXP / 1500) + 1`
- **XP Categories**: homework, participation, test, attendance, project, quiz, extra_credit

## Getting Started

1. **Login** to get JWT token
2. **Use token** in Authorization header for all requests
3. **Create resources** based on your role
4. **Track progress** using analytics endpoints

## Example Usage

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@demo.com","password":"password"}'

# Get students (with token)
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"

# Award XP
curl -X POST http://localhost:3000/api/xp/award \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"s1","amount":100,"category":"homework"}'
```

