import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';

describe('AuthProvider', () => {
  it('rend correctement ses enfants', () => {
    render(
      <AuthProvider>
        <div data-testid="child">Hello World</div>
      </AuthProvider>
    );

    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Hello World');
  });
});
