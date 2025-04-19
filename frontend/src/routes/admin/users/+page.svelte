<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  
  let users = [];
  let loading = true;
  let error = null;
  let showAddUserModal = false;
  let newUser = {
    email: '',
    password: '',
    is_superuser: false
  };
  
  async function fetchUsers() {
    if (!$authStore.isAuthenticated || !$authStore.isAdmin) {
      goto('/login');
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      // This would need to be implemented in your API service
      // For now, we'll use a placeholder
      users = [
        { id: 1, email: 'admin@example.com', is_superuser: true, is_active: true },
        { id: 2, email: 'user@example.com', is_superuser: false, is_active: true },
        { id: 3, email: 'librarian@example.com', is_superuser: false, is_active: true }
      ];
    } catch (err) {
      error = 'Failed to load users. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  async function addUser() {
    try {
      // This would need to be implemented in your API service
      // For now, we'll just add to the local array
      const id = users.length + 1;
      users = [...users, { id, ...newUser, is_active: true }];
      showAddUserModal = false;
      newUser = { email: '', password: '', is_superuser: false };
    } catch (err) {
      alert('Failed to add user. Please try again.');
      console.error(err);
    }
  }
  
  async function toggleUserStatus(userId) {
    try {
      // This would need to be implemented in your API service
      // For now, we'll just update the local array
      users = users.map(user => 
        user.id === userId ? { ...user, is_active: !user.is_active } : user
      );
    } catch (err) {
      alert('Failed to update user status. Please try again.');
      console.error(err);
    }
  }
  
  async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // This would need to be implemented in your API service
      // For now, we'll just remove from the local array
      users = users.filter(user => user.id !== userId);
    } catch (err) {
      alert('Failed to delete user. Please try again.');
      console.error(err);
    }
  }
  
  onMount(fetchUsers);
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Manage Users</h1>
    
    <button class="btn btn-primary" on:click={() => showAddUserModal = true}>
      Add New User
    </button>
  </div>
  
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
  {:else if users.length === 0}
    <div class="text-center my-12">
      <h3 class="text-xl font-semibold">No users found</h3>
      <p class="mt-2">Add new users to get started.</p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>
                {#if user.is_superuser}
                  <span class="badge badge-primary">Admin</span>
                {:else}
                  <span class="badge">User</span>
                {/if}
              </td>
              <td>
                {#if user.is_active}
                  <span class="badge badge-success">Active</span>
                {:else}
                  <span class="badge badge-error">Inactive</span>
                {/if}
              </td>
              <td>
                <div class="flex gap-2">
                  <button 
                    class="btn btn-sm btn-outline"
                    on:click={() => toggleUserStatus(user.id)}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    class="btn btn-sm btn-error"
                    on:click={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
  
  <!-- Add User Modal -->
  {#if showAddUserModal}
    <div class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Add New User</h3>
        
        <div class="py-4">
          <div class="form-control">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <input 
              type="email" 
              id="email"
              bind:value={newUser.email} 
              placeholder="Enter email" 
              class="input input-bordered w-full" 
              required
            />
          </div>
          
          <div class="form-control mt-4">
            <label class="label" for="password">
              <span class="label-text">Password</span>
            </label>
            <input 
              type="password" 
              id="password"
              bind:value={newUser.password} 
              placeholder="Enter password" 
              class="input input-bordered w-full" 
              required
            />
          </div>
          
          <div class="form-control mt-4">
            <label class="cursor-pointer label justify-start gap-2">
              <input 
                type="checkbox" 
                class="checkbox" 
                bind:checked={newUser.is_superuser} 
              />
              <span class="label-text">Admin privileges</span>
            </label>
          </div>
        </div>
        
        <div class="modal-action">
          <button class="btn" on:click={() => showAddUserModal = false}>Cancel</button>
          <button 
            class="btn btn-primary" 
            on:click={addUser}
            disabled={!newUser.email || !newUser.password}
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>