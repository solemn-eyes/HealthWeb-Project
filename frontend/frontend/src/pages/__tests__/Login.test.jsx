import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Login from '../Login';
import { AuthContext } from '../../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Login page', () => {
  it('navigates to dashboard on successful login', async () => {
    const mockLogin = vi.fn().mockResolvedValue(true);
    const mockNavigate = vi.fn();

    // Mock useNavigate from react-router-dom
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    render(
      <AuthContext.Provider value={{ loginUser: mockLogin }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const username = screen.getByPlaceholderText(/username/i);
    const password = screen.getByPlaceholderText(/password/i);
    const btn = screen.getByRole('button', { name: /login/i });

    fireEvent.change(username, { target: { value: 'test@test.com' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(btn);

    // wait for the async call
    expect(await mockLogin.mock.results[0].value).resolves.toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
