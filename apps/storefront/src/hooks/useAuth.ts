'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { user, isAuthenticated, login, logout, setUser } = useAuthStore();
  const router = useRouter();

  const { data: meData, isLoading: isLoadingMe } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (meData) setUser(meData);
  }, [meData, setUser]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({
      name,
      email,
      password,
      phone,
    }: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) => authService.register(name, email, password, phone),
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push('/');
    },
  });

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      logout();
      router.push('/');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoadingMe,
    loginMutation,
    registerMutation,
    handleLogout,
    loginError: loginMutation.error as Error | null,
    registerError: registerMutation.error as Error | null,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
