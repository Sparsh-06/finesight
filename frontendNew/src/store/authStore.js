import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { API_URL } from '../util/URL';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (response.ok) {
            set({
              user: data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, data };
          } else {
            set({
              error: data.error || "Login failed",
              isLoading: false,
            });
            return { success: false, error: data.error || "Login failed" };
          }
        } catch (err) {
          const errorMessage = "Network error. Please try again.";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (response.ok) {
            set({ isLoading: false, error: null });
            return { success: true, data };
          } else {
            set({
              error: data.error || "Registration failed",
              isLoading: false,
            });
            return { success: false, error: data.error || "Registration failed" };
          }
        } catch (err) {
          const errorMessage = "Network error. Please try again.";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Verify OTP action
      verifyOTP: async (email, otp) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
          });

          const data = await response.json();

          if (response.ok) {
            set({ isLoading: false, error: null });
            return { success: true, data };
          } else {
            set({
              error: data.error || "Invalid OTP",
              isLoading: false,
            });
            return { success: false, error: data.error || "Invalid OTP" };
          }
        } catch (err) {
          const errorMessage = "Network error. Please try again.";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Resend OTP action
      resendOTP: async (email) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, resend: true }),
          });

          if (response.ok) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false };
          }
        } catch (err) {
          set({ isLoading: false });
          return { success: false };
        }
      },

      // Logout action
      logout: async () => {
        const { accessToken } = get();

        try {
          // Call backend logout if we have an access token
          if (accessToken) {
            await fetch(`${API_URL}/api/auth/logout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
              },
            });
          }
        } catch (error) {
          console.error("Logout error:", error);
        }

        // Clear local state
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Refresh access token
      refreshToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        try {
          const response = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          const data = await response.json();

          if (response.ok) {
            set({
              accessToken: data.accessToken,
              user: data.user,
            });
            return { success: true, data };
          } else {
            // Refresh token is invalid, logout user
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              error: data.error || "Session expired",
            });
            return { success: false, error: data.error || "Session expired" };
          }
        } catch (error) {
          // Network error, logout user
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: "Network error",
          });
          return { success: false, error: "Network error" };
        }
      },

      // Get auth headers for API calls
      getAuthHeaders: () => {
        const { accessToken } = get();
        return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      },

      // Make authenticated API call with automatic token refresh
      authenticatedFetch: async (url, options = {}) => {
        const { accessToken, refreshToken: refreshTokenFunc } = get();

        const makeRequest = (token) => {
          const headers = {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          };

          return fetch(url, {
            ...options,
            headers,
          });
        };

        // First attempt with current access token
        if (accessToken) {
          const response = await makeRequest(accessToken);

          // If token is expired (401), try to refresh
          if (response.status === 401) {
            try {
              const refreshResult = await refreshTokenFunc();

              if (refreshResult.success) {
                // Retry with new access token
                return makeRequest(refreshResult.data.accessToken);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              // Token refresh failed, user needs to login again
              set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                error: 'Session expired. Please login again.',
              });
              throw new Error('Session expired');
            }
          }

          return response;
        }

        // No access token, make request without auth
        return makeRequest(null);
      },

      // Set user manually (for cases where we get user data from somewhere else)
      setUser: (user, accessToken = null, refreshToken = null) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: !!user,
          error: null,
        });
      },

      // Check if user is authenticated
      checkAuth: () => {
        const { user, accessToken, refreshToken } = get();
        return !!user && !!accessToken && !!refreshToken;
      },

      // Initialize auth state (call this on app startup)
      initializeAuth: async () => {
        const { user, accessToken, refreshToken } = get();
        
        if (user && accessToken && refreshToken) {
          // Try to validate the current access token
          try {
            const response = await fetch(`${API_URL}/api/auth/verify-token`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              set({ isAuthenticated: true });
              return;
            }
          } catch (error) {
            console.log("Token validation failed, attempting refresh...");
          }

          // If access token is invalid, try to refresh
          try {
            const refreshResult = await get().refreshToken();
            if (refreshResult.success) {
              set({ isAuthenticated: true });
              return;
            }
          } catch (refreshError) {
            console.log("Token refresh failed, logging out...");
          }
        }

        // If we reach here, authentication failed
        set({ 
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null
        });
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these fields
    }
  )
);

export default useAuthStore;
