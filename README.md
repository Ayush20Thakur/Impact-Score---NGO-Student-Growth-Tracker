# 🎓 ImpactScore - NGO Student Growth Tracker

A comprehensive student growth tracking system designed for NGOs to monitor and enhance student learning outcomes. Built with Next.js 14, TypeScript, and Prisma.

## ✨ Features

### 🎯 Core Features
- **Multi-Role Dashboard**: Separate dashboards for Teachers, Students, Parents, and Admins
- **XP & Leveling System**: Gamified learning with experience points and levels (1500 XP per level)
- **Badge Awards**: Teachers can award badges for achievements
- **Goal Setting**: Set and track student goals with progress monitoring
- **Behavior Evaluation**: Track and evaluate student behavior
- **Schedule/Timetable Management**: Create and manage class schedules
- **Attendance Tracking**: Monitor student attendance
- **Live Classes**: Schedule and manage Google Meet classes
- **Study Materials**: Upload and share study materials
- **AI Study Buddy**: AI-powered chat assistant for students (powered by Google Gemini)

### 🌐 Multi-Language Support
- 🇬🇧 English
- 🇮🇳 हिन्दी (Hindi)
- 🇮🇳 தமிழ் (Tamil)
- 🇮🇳 తెలుగు (Telugu)
- 🇧🇩 বাংলা (Bengali)

### 👥 User Roles
1. **Admin**: System administration and oversight
2. **Teacher**: Manage students, award XP, set goals, create schedules
3. **Student**: View progress, chat with AI buddy, access materials
4. **Parent**: Monitor child's progress and performance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd nogtacker
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your API keys
```

Required environment variables:
- `DATABASE_URL`: SQLite database path
- `JWT_SECRET`: Secret key for JWT authentication
- `GOOGLE_GENERATIVE_AI_API_KEY`: Google AI API key for AI Study Buddy

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Accounts

### Teacher Account
- Email: `teacher@demo.com`
- Password: `password`

### Student Account
- Email: `student@demo.com`
- Password: `password`

### Parent Account
- Email: `parent@demo.com`
- Password: `password`

### Admin Account
- Email: `admin@demo.com`
- Password: `password`

## 📊 Database Management

### Prisma Studio (Visual Database Browser)
```bash
npx prisma studio
```
This will open Prisma Studio at [http://localhost:5555](http://localhost:5555)

### Database Commands
```bash
# View database schema
npx prisma db pull

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.25 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **AI**: Google Gemini API
- **Authentication**: JWT-based auth
- **State Management**: React Context API

## 📁 Project Structure

```
nogtacker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── students/     # Student-related endpoints
│   │   ├── schedules/    # Schedule management
│   │   └── ai-chat/      # AI chat endpoint
│   ├── teacher/          # Teacher dashboard
│   ├── student/          # Student dashboard
│   ├── parent/           # Parent dashboard
│   └── admin/            # Admin dashboard
├── components/            # React components
├── context/              # React context providers
├── lib/                  # Utility functions and database
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## 🎨 Key Features Explained

### XP & Leveling System
- Students earn XP for various activities
- 1500 XP required per level
- Teachers can award XP with categories: homework, participation, test, attendance

### Badge System
- Predefined badges: Perfect Attendance, Top Performer, Helpful Friend, etc.
- Teachers award badges to students
- Badges displayed on student dashboard

### Goal Setting
- Teachers set goals for students
- Goals have title, description, progress (0-100%), and deadline
- Students can track their goal progress

### Schedule/Timetable
- Teachers create weekly schedules
- Schedules include: subject, day, time, room, center
- Students view their personalized timetable

### AI Study Buddy
- Powered by Google Gemini AI
- Responds in the student's selected language
- Provides educational assistance and motivation

## 🌍 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `DATABASE_URL`
- `JWT_SECRET` (use a strong secret!)
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `NEXT_PUBLIC_API_URL`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built for NGOs to track and improve student outcomes
- Designed with accessibility and multi-language support in mind
- Powered by modern web technologies

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ for education and social impact
