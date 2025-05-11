// router/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRouter } from 'vue-router';
import StudentDashboard from '../pages/StudentView/Dashboard.vue';
import OrganizerDashboard from '../pages/OrganizerView/Dashboard.vue';

const routes = [
  { path: '/student', component: StudentDashboard, meta: { role: 'student' } },
  { path: '/organizer', component: OrganizerDashboard, meta: { role: 'organizer' } }
];