let authErrors = new Map<string, string>();

authErrors.set(
  'Firebase: Error (auth/wrong-password).',
  'Contraseña no es valida'
);
authErrors.set('Firebase: Error (auth/user-not-found).', 'Usuario no existe');

export default authErrors;
