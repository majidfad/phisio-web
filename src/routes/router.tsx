import { createBrowserRouter } from 'react-router-dom';

import { AdminLayout, AuthLayout, DoctorLayout, PatientLayout, RootLayout } from '@/layouts';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AssignmentsPage } from '@/pages/admin/AssignmentsPage';
import { DoctorsPage } from '@/pages/admin/DoctorsPage';
import { ExercisesPage } from '@/pages/admin/ExercisesPage';
import { PatientsPage } from '@/pages/admin/PatientsPage';
import { UnauthorizedPage } from '@/pages/errors/UnauthorizedPage';
import { DoctorExercisesPage } from '@/pages/doctor/DoctorExercisesPage';
import { DoctorHomePage } from '@/pages/doctor/DoctorHomePage';
import { DoctorPatientsPage } from '@/pages/doctor/DoctorPatientsPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { PatientExercisesPage } from '@/pages/patient/PatientExercisesPage';
import { PatientHomePage } from '@/pages/patient/PatientHomePage';
import { PatientProgressPage } from '@/pages/patient/PatientProgressPage';
import { GuestRoute } from '@/routes/guards/GuestRoute';
import { ProtectedRoute } from '@/routes/guards/ProtectedRoute';
import { RootRedirect } from '@/routes/guards/RootRedirect';

import { routes } from './routes';

export const router = createBrowserRouter([
  {
    path: routes.root,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: routes.login,
                element: <LoginPage />,
              },
              {
                path: routes.register,
                element: <RegisterPage />,
              },
            ],
          },
        ],
      },
      {
        path: routes.unauthorized,
        element: <UnauthorizedPage />,
      },
      {
        element: <ProtectedRoute role="Admin" />,
        children: [
          {
            path: routes.admin.root,
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <AdminDashboardPage />,
              },
              {
                path: 'doctors',
                element: <DoctorsPage />,
              },
              {
                path: 'patients',
                element: <PatientsPage />,
              },
              {
                path: 'exercises',
                element: <ExercisesPage />,
              },
              {
                path: 'assignments',
                element: <AssignmentsPage />,
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute role="Doctor" />,
        children: [
          {
            path: routes.doctor.root,
            element: <DoctorLayout />,
            children: [
              {
                index: true,
                element: <DoctorHomePage />,
              },
              {
                path: 'patients',
                element: <DoctorPatientsPage />,
              },
              {
                path: 'exercises',
                element: <DoctorExercisesPage />,
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute role="Patient" />,
        children: [
          {
            path: routes.patient.root,
            element: <PatientLayout />,
            children: [
              {
                index: true,
                element: <PatientHomePage />,
              },
              {
                path: 'exercises',
                element: <PatientExercisesPage />,
              },
              {
                path: 'progress',
                element: <PatientProgressPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
