export const getStorage = jest.fn();
export const ref = jest.fn(() => 'mockRef');
export const uploadBytes = jest.fn(() => Promise.resolve('uploaded'));
export const getDownloadURL = jest.fn(() =>
    Promise.resolve('https://this-is-a-fake-url.com')
);