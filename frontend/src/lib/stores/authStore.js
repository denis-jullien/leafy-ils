import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize the store with the token from localStorage if available
const initialToken = browser ? localStorage.getItem('token') : null;

function createAuthStore() {
  const { subscribe, set, update } = writable({
    token: initialToken,
    user: null,
    isAuthenticated: !!initialToken,
    isAdmin: false
  });

  return {
    subscribe,
    setToken: (token) => {
      if (browser) {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      }
      
      update(state => ({
        ...state,
        token,
        isAuthenticated: !!token
      }));
    },
    setUser: (user) => {
      update(state => ({
        ...state,
        user,
        isAdmin: user?.is_superuser || false
      }));
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('token');
      }
      
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isAdmin: false
      });
    }
  };
}

export const authStore = createAuthStore();