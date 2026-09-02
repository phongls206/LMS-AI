import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('docs/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1.5 },
  });

  const page = await browser.newPage();

  // 1. Login page
  console.log('1. Capturing login page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outDir, '01_login_screen.png') });

  // 2. Admin login & Dashboard
  console.log('2. Admin Dashboard...');
  // Click Admin demo button (first button in demo roles grid)
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Quản Lý')) {
      await b.click();
      break;
    }
  }
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '02_admin_dashboard.png') });

  // 3. Admin Courses
  console.log('3. Admin Courses...');
  await page.goto('http://localhost:3000/admin/courses', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '03_admin_courses.png') });

  // 4. Admin Classes
  console.log('4. Admin Classes...');
  await page.goto('http://localhost:3000/admin/classes', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '04_admin_classes.png') });

  // 5. Admin Students
  console.log('5. Admin Students...');
  await page.goto('http://localhost:3000/admin/students', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '05_admin_students.png') });

  // 6. Admin Fees
  console.log('6. Admin Fees...');
  await page.goto('http://localhost:3000/admin/fees', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '06_admin_fees.png') });

  // 7. Teacher login & Attendance
  console.log('7. Teacher Attendance...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  const tButtons = await page.$$('button');
  for (const b of tButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Giáo Viên')) {
      await b.click();
      break;
    }
  }
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.goto('http://localhost:3000/teacher/attendance', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '07_teacher_attendance.png') });

  // 8. Teacher Grades
  console.log('8. Teacher Grades...');
  await page.goto('http://localhost:3000/teacher/grades', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '08_teacher_grades.png') });

  // 9. Teacher AI Exercises
  console.log('9. Teacher AI Exercises...');
  await page.goto('http://localhost:3000/teacher/ai-exercises', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '09_teacher_ai_exercises.png') });

  // 10. Student Enroll & AI
  console.log('10. Student Enroll...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  const sButtons = await page.$$('button');
  for (const b of sButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Học Viên')) {
      await b.click();
      break;
    }
  }
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.goto('http://localhost:3000/student/enroll', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '10_student_enroll.png') });

  // 11. Student AI Consult
  console.log('11. Student AI Consult...');
  await page.goto('http://localhost:3000/student/ai-consult', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '11_student_ai_consult.png') });

  // 12. Student AI Practice
  console.log('12. Student AI Practice...');
  await page.goto('http://localhost:3000/student/ai-practice', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '12_student_ai_practice.png') });

  // 13. Student AI Progress
  console.log('13. Student AI Progress...');
  await page.goto('http://localhost:3000/student/ai-progress', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '13_student_ai_progress.png') });

  // 14. Staff New Student
  console.log('14. Staff New Student...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  const staffBtns = await page.$$('button');
  for (const b of staffBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Tư Vấn')) {
      await b.click();
      break;
    }
  }
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.goto('http://localhost:3000/staff/new-student', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '14_staff_new_student.png') });

  // 15. Swagger Docs
  console.log('15. Swagger Docs...');
  await page.goto('http://localhost:8000/api/docs', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '15_swagger_docs.png') });

  await browser.close();
  console.log('Done capturing all screenshots!');
}

capture().catch(err => {
  console.error('Error capturing:', err);
  process.exit(1);
});
