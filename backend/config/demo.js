export const DEMO_PASSWORD_MIN_LENGTH = 8;

export const DEMO_PASSWORDS = Object.freeze({
  student: 'student@123',
  faculty: 'faculty@123',
  admin: 'admin@123',
});

export const DEMO_PASSWORD_ENVS = Object.freeze({
  student: 'DEMO_STUDENT_PASSWORD',
  faculty: 'DEMO_FACULTY_PASSWORD',
  admin: 'DEMO_ADMIN_PASSWORD',
});

export function resolveDemoPassword(role) {
  const envName = DEMO_PASSWORD_ENVS[role];
  if (!envName) {
    throw new Error(`Unknown demo role: ${role}`);
  }

  const value = (process.env[envName] || '').trim() || DEMO_PASSWORDS[role];

  if (value.length < DEMO_PASSWORD_MIN_LENGTH) {
    throw new Error(`${envName} must be at least ${DEMO_PASSWORD_MIN_LENGTH} characters.`);
  }

  return value;
}
