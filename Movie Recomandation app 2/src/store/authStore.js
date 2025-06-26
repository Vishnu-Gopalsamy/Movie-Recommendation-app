import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

// Mock user data
const mockUser = {
  id: 1,
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: null
};

// Mock API call to simulate authentication
const mockAuthApi = async (endpoint, data, delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (endpoint) {
        case 'login': {
          const { email, password } = data;
          if (email === 'user@example.com' && password === 'password') {
            resolve({
              success: true,
              user: mockUser,
              token: 'mock-jwt-token'
            });
          } else {
            reject(new Error('Invalid email or password'));
          }
          break;
        }
          
        case 'register': {
          if (Math.random() < 0.9) { // 90% success rate for demo
            resolve({
              success: true,
              user: {
                id: Date.now(),
                ...data,
                avatar: null
              },
              token: 'mock-jwt-token'
            });
          } else {
            reject(new Error('Email is already taken'));
          }
          break;
        }
          
        case 'logout': {
          resolve({ success: true });
          break;
        }
          
        default:
          reject(new Error('Invalid endpoint'));
      }
    }, delay);
  });
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      // Actions
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await mockAuthApi('login', { email, password });
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false
          });
          
          toast.success('Login successful! Welcome back.');
          return { success: true };
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message || 'Login failed. Please check your credentials.' 
          });
          return { success: false, error: error.message };
        }
      },
      
      register: async (userData) => {
        try {
          set({ loading: true, error: null });
          const response = await mockAuthApi('register', userData);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false
          });
          
          toast.success('Registration successful! Welcome to MovieFlix.');
          return { success: true };
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message || 'Registration failed. Please try again.' 
          });
          return { success: false, error: error.message };
        }
      },
      
      logout: async () => {
        try {
          set({ loading: true });
          await mockAuthApi('logout');
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false
          });
          
          toast.info('You have been logged out successfully.');
          return { success: true };
        } catch (error) {
          set({ loading: false });
          return { success: true }; // Force logout even if API fails
        }
      },
      
      updateUser: (userData) => {
        set(state => ({
          user: {
            ...state.user,
            ...userData
          }
        }));
        return { success: true };
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;