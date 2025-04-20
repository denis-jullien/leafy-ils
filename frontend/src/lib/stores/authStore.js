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

  async function fetchUserData() {
    if (browser && initialToken) {
      try {
        const response = await fetch('/users/me', {
          headers: {
            'Authorization': `Bearer ${initialToken}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          update(state => ({
            ...state,
            user: userData,
            isAdmin: userData?.is_superuser || false
          }));
        } else {
          // If token is invalid, clear it
          localStorage.removeItem('token');
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isAdmin: false
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
  }

  // Fetch user data on initialization
  if (browser && initialToken) {
    fetchUserData();
  }

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
      
      // Fetch user data when token is set
      if (token) {
        fetchUserData();
      }
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
    },
    refreshUserData: fetchUserData
  };
}

export const authStore = createAuthStore();