import '@testing-library/jest-dom';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

// Mock DOMMatrixReadOnly for React Flow
if (typeof window.DOMMatrixReadOnly === 'undefined') {
  (window as any).DOMMatrixReadOnly = class {
    constructor() {}
  };
}