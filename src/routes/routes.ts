export const routes = {
  root: '/',
  about: '/about',
  download: '/download',
  privacy: '/privacy',
  terms: '/terms',
  login: '/login',
  register: '/register',
  unauthorized: '/unauthorized',
  admin: {
    root: '/admin',
    doctors: '/admin/doctors',
    patients: '/admin/patients',
    clinics: '/admin/clinics',
    exercises: '/admin/exercises',
    exerciseCategories: '/admin/exercise-categories',
    articles: '/admin/articles',
    assignments: '/admin/assignments',
  },
  clinicManager: {
    root: '/clinic-manager',
  },
  doctor: {
    root: '/doctor',
    clinics: '/doctor/clinics',
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
  | typeof routes.about
  | typeof routes.download
  | typeof routes.privacy
  | typeof routes.terms
  | typeof routes.login
  | typeof routes.register
  | typeof routes.unauthorized
  | typeof routes.admin.root
  | typeof routes.admin.doctors
  | typeof routes.admin.patients
  | typeof routes.admin.clinics
  | typeof routes.admin.exercises
  | typeof routes.admin.exerciseCategories
  | typeof routes.admin.articles
  | typeof routes.admin.assignments
  | typeof routes.clinicManager.root
  | typeof routes.doctor.root
  | typeof routes.doctor.clinics
  | typeof routes.doctor.patients
  | typeof routes.doctor.exercises
  | typeof routes.patient.root
  | typeof routes.patient.exercises
  | typeof routes.patient.progress
  | typeof routes.patient.doctors
  | typeof routes.patient.library
  | typeof routes.patient.articles;
