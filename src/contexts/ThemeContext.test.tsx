import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

it('đổi giao diện sáng tối và nhãn nút', () => {
  function Toggle() {
    const { theme, toggleTheme } = useTheme();
    return <button onClick={toggleTheme}>{theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}</button>;
  }
  render(<ThemeProvider><Toggle /></ThemeProvider>);
  fireEvent.click(screen.getByRole('button', { name: 'Giao diện tối' }));
  expect(document.documentElement.dataset.theme).toBe('dark');
  fireEvent.click(screen.getByRole('button', { name: 'Giao diện sáng' }));
  expect(document.documentElement.dataset.theme).toBe('light');
});

it('useTheme ngoài Provider báo lỗi rõ ràng', () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => renderHook(() => useTheme())).toThrow('useTheme phải được dùng trong ThemeProvider');
  spy.mockRestore();
});
