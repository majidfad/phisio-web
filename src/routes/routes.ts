export const routes = {
  root: '/',
  login: '/login',
  register: '/register',
  unauthorized: '/unauthorized',
  admin: {
    root: '/admin',
    doctors: '/admin/doctors',
    patients: '/admin/patients',
    exercises: '/admin/exercises',
    articles: '/admin/articles',
    assignments: '/admin/assignments',
  },
  doctor: {
    root: '/doctor',
    patients: '/doctor/patients',
    exercises: '/doctor/exercises',
  },
  patient: {
    root: '/patient',
    exercises: '/patient/exercises',
    progress: '/patient/progress',
    doctors: '/patient/doctors',
    library: '/patient/library',
    articles: '/patient/articles',
  },
} as const;

export type AppRoutePath =
  | typeof routes.root
  | typeof routes.login
  | typeof routes.register
  | typeof routes.unauthorized
  | typeof routes.admin.root
  | typeof routes.admin.doctors
  | typeof routes.admin.patients
  | typeof routes.admin.exercises
  | typeof routes.admin.articles
  | typeof routes.admin.assignments
  | typeof routes.doctor.root
  | typeof routes.doctor.patients
  | typeof routes.doctor.exercises
  | typeof routes.patient.root
  | typeof routes.patient.exercises
  | typeof routes.patient.progress
  | typeof routes.patient.doctors
  | typeof routes.patient.library
  | typeof routes.patient.articles;
