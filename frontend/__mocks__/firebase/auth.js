export const createUserWithEmailAndPassword = jest.fn(() =>
    Promise.resolve({ user: { uid: "abc123", email: "test1@gmail.com", password: "password" }})
)

export const getAuth = jest.fn(() => ({}));

export const signInWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();

export const initializeAuth = jest.fn();
export const getReactNativePersistence = jest.fn();