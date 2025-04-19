<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  
  let user = null;
  let loading = true;
  let error = null;
  let saving = false;
  
  // Password change fields
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let passwordError = '';
  
  async function fetchUserProfile() {
    if (!$authStore.isAuthenticated) {
      goto('/login');
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      // This would need to be implemented in your API service
      // For now, we'll use the user from the auth store
      user = $authStore.user || { email: 'user@example.com' };
    } catch (err) {
      error = 'Failed to load profile. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  async function updateProfile() {
    saving = true;
    
    try {
      // This would need to be implemented in your API service
      // For now, we'll just update the local state
      authStore.setUser(user);
      alert('Profile updated successfully');
    } catch (err) {
      error = 'Failed to update profile. Please try again.';
      console.error(err);
    } finally {
      saving = false;
    }
  }
  
  async function changePassword() {
    passwordError = '';
    
    if (newPassword !== confirmPassword) {
      passwordError = 'Passwords do not match';
      return;
    }
    
    saving = true;
    
    try {
      // This would need to be implemented in your API service
      // For now, we'll just show a success message
      alert('Password changed successfully');
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
    } catch (err) {
      passwordError = 'Failed to change password. Please try again.';
      console.error(err);
    } finally {
      saving = false;
    }
  }
  
  onMount(fetchUserProfile);
</script>

<div>
  <h1 class="text-3xl font-bold mb-6">My Profile</h1>
  
  {#if loading}
    <div class="flex justify-center my-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if error}
    <div class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  {:else if user}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Profile Information -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Profile Information</h2>
          
          <form on:submit|preventDefault={updateProfile}>
            <div class="form-control">
              <label class="label" for="email">
                <span class="label-text">Email</span>
              </label>
              <input 
                type="email" 
                id="email"
                bind:value={user.email} 
                class="input input-bordered w-full" 
                readonly
              />
            </div>
            
            <div class="form-control mt-4">
              <label class="label" for="name">
                <span class="label-text">Name</span>
              </label>
              <input 
                type="text" 
                id="name"
                bind:value={user.name} 
                placeholder="Your name" 
                class="input input-bordered w-full" 
              />
            </div>
            
            <div class="form-control mt-6">
              <button 
                type="submit" 
                class="btn btn-primary" 
                disabled={saving}
              >
                {#if saving}
                  <span class="loading loading-spinner"></span>
                {/if}
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Change Password -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Change Password</h2>
          
          {#if passwordError}
            <div class="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{passwordError}</span>
            </div>
          {/if}
          
          <form on:submit|preventDefault={changePassword}>
            <div class="form-control">
              <label class="label" for="currentPassword">
                <span class="label-text">Current Password</span>
              </label>
              <input 
                type="password" 
                id="currentPassword"
                bind:value={currentPassword} 
                placeholder="Enter current password" 
                class="input input-bordered w-full" 
                required
              />
            </div>
            
            <div class="form-control mt-4">
              <label class="label" for="newPassword">
                <span class="label-text">New Password</span>
              </label>
              <input 
                type="password" 
                id="newPassword"
                bind:value={newPassword} 
                placeholder="Enter new password" 
                class="input input-bordered w-full" 
                required
              />
            </div>
            
            <div class="form-control mt-4">
              <label class="label" for="confirmPassword">
                <span class="label-text">Confirm New Password</span>
              </label>
              <input 
                type="password" 
                id="confirmPassword"
                bind:value={confirmPassword} 
                placeholder="Confirm new password" 
                class="input input-bordered w-full" 
                required
              />
            </div>
            
            <div class="form-control mt-6">
              <button 
                type="submit" 
                class="btn btn-primary" 
                disabled={saving}
              >
                {#if saving}
                  <span class="loading loading-spinner"></span>
                {/if}
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Borrowing History -->
    <div class="card bg-base-100 shadow-xl mt-8">
      <div class="card-body">
        <h2 class="card-title">Borrowing History</h2>
        
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrowed Date</th>
                <th>Returned Date</th>
              </tr>
            </thead>
            <tbody>
              <!-- This would be populated with actual borrowing history -->
              <tr>
                <td>The Great Gatsby</td>
                <td>2023-01-15</td>
                <td>2023-02-01</td>
              </tr>
              <tr>
                <td>To Kill a Mockingbird</td>
                <td>2023-03-10</td>
                <td>2023-03-25</td>
              </tr>
              <tr>
                <td>1984</td>
                <td>2023-05-05</td>
                <td>2023-05-20</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}
</div>