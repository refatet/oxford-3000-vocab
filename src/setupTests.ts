import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './__mocks__/handlers';

// Setup mock service worker
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
