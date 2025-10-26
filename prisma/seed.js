const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@demo.com",
      password: await bcrypt.hash("password", 10),
      role: "ADMIN",
      center: "Main Center",
      admin: {
        create: {
          center: "Main Center",
        },
      },
    },
  })

  const teacherUser = await prisma.user.create({
    data: {
      name: "Ms. Patel",
      email: "teacher@demo.com",
      password: await bcrypt.hash("password", 10),
      role: "TEACHER",
      center: "Main Center",
    },
  })

  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      center: "Main Center",
      subject: "Mathematics",
    },
  })

  const studentUser = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "student@demo.com",
      password: await bcrypt.hash("password", 10),
      role: "STUDENT",
      center: "Main Center",
    },
  })

  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      teacherId: teacher.id,
      level: 5,
      xp: 1250,
      attendance: 95,
      center: "Main Center",
    },
  })

  const parentUser = await prisma.user.create({
    data: {
      name: "Mr. Sharma",
      email: "parent@demo.com",
      password: await bcrypt.hash("password", 10),
      role: "PARENT",
      center: "Main Center",
    },
  })

  const parent = await prisma.parent.create({
    data: {
      userId: parentUser.id,
      center: "Main Center",
    },
  })

  // Create another student
  const student2User = await prisma.user.create({
    data: {
      name: "Rahul Kumar",
      email: "student2@demo.com",
      password: await bcrypt.hash("password", 10),
      role: "STUDENT",
      center: "Main Center",
    },
  })

  const student2 = await prisma.student.create({
    data: {
      userId: student2User.id,
      teacherId: teacher.id,
      level: 4,
      xp: 980,
      attendance: 88,
      center: "Main Center",
    },
  })

  // Create badges
  await prisma.badge.create({
    data: {
      studentId: student.id,
      name: "Perfect Attendance",
      description: "100% attendance",
      icon: "🎯",
    },
  })

  // Create goals
  await prisma.goal.create({
    data: {
      studentId: student.id,
      title: "Complete Math Chapter 5",
      description: "Finish all exercises in chapter 5",
      progress: 60,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
    },
  })

  // Create schedule
  const schedule = await prisma.schedule.create({
    data: {
      teacherId: teacher.id,
      subject: "Mathematics",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "10:00",
      room: "Room 101",
      center: "Main Center",
    },
  })

  // Add students to schedule
  await prisma.scheduleStudent.create({
    data: {
      scheduleId: schedule.id,
      studentId: student.id,
    },
  })

  await prisma.scheduleStudent.create({
    data: {
      scheduleId: schedule.id,
      studentId: student2.id,
    },
  })

  // Create live class
  const liveClass = await prisma.liveClass.create({
    data: {
      teacherId: teacher.id,
      title: "Introduction to Algebra",
      description: "Learn the basics of algebra",
      googleMeetLink: "https://meet.google.com/sample-link",
      scheduledTime: new Date(Date.now() + 3600000),
      center: "Main Center",
      status: "SCHEDULED",
    },
  })

  // Add students to live class
  await prisma.liveClassStudent.create({
    data: {
      liveClassId: liveClass.id,
      studentId: student.id,
    },
  })

  await prisma.liveClassStudent.create({
    data: {
      liveClassId: liveClass.id,
      studentId: student2.id,
    },
  })

  // Create study material
  const studyMaterial = await prisma.studyMaterial.create({
    data: {
      teacherId: teacher.id,
      title: "Algebra Basics",
      description: "Chapter 1 - Introduction",
      category: "CLASS_NOTES",
      fileUrl: "https://example.com/algebra-basics.pdf",
      fileName: "algebra-basics.pdf",
      fileType: "pdf",
      center: "Main Center",
    },
  })

  // Add students to study material
  await prisma.studyMaterialStudent.create({
    data: {
      studyMaterialId: studyMaterial.id,
      studentId: student.id,
    },
  })

  await prisma.studyMaterialStudent.create({
    data: {
      studyMaterialId: studyMaterial.id,
      studentId: student2.id,
    },
  })

  // Create XP transaction
  await prisma.xPTransaction.create({
    data: {
      studentId: student.id,
      teacherId: teacher.id,
      amount: 100,
      category: "homework",
      note: "Completed homework assignment",
    },
  })

  // Create attendance record
  await prisma.attendance.create({
    data: {
      studentId: student.id,
      date: new Date(),
      status: "PRESENT",
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

