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
    is_superuser: false,
    is_active: true,
    is_verified: true
  };
  
  async function fetchUsers() {
    if (!$authStore.isAuthenticated || !$authStore.isAdmin) {
      goto('/login');
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      // Use the API service to fetch users
      users = await api.getUsers();
    } catch (err) {
      error = 'Failed to load users. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  async function addUser() {
    try {
      // Use the API service to create a new user
      const createdUser = await api.createUser(newUser);
      users = [...users, createdUser];
      
      // Reset form and close modal
      newUser = {
        email: '',
        password: '',
        is_superuser: false,
        is_active: true,
        is_verified: true
      };
      showAddUserModal = false;
      
    } catch (err) {
      error = `Failed to add user: ${err.message}`;
      console.error(err);
    }
  }
  
  async function toggleUserStatus(userId, isActive) {
    try {
      // Use the API service to update user status
      const updatedUser = await api.updateUser(userId, { is_active: !isActive });
      
      // Update the user in the local array
      users = users.map(user => 
        user.id === userId ? updatedUser : user
      );
      
    } catch (err) {
      error = `Failed to update user: ${err.message}`;
      console.error(err);
    }
  }
  
  async function toggleAdminStatus(userId, isSuperuser) {
    try {
      // Use the API service to update user admin status
      const updatedUser = await api.updateUser(userId, { is_superuser: !isSuperuser });
      
      // Update the user in the local array
      users = users.map(user => 
        user.id === userId ? updatedUser : user
      );
      
    } catch (err) {
      error = `Failed to update user: ${err.message}`;
      console.error(err);
    }
  }
  
  async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      // Use the API service to delete a user
      await api.deleteUser(userId);
      
      // Remove the user from the local array
      users = users.filter(user => user.id !== userId);
      
    } catch (err) {
      error = `Failed to delete user: ${err.message}`;
      console.error(err);
    }
  }
  
  onMount(fetchUsers);
</script>

<div class="p-6">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">User Management</h1>
    <button class="btn btn-primary" on:click={() => showAddUserModal = true}>
      Add User
    </button>
  </div>
  
  {#if error}
    <div class="alert alert-error mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  {/if}
  
  {#if loading}
    <div class="flex justify-center my-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Admin</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr>
              <td>{user.email}</td>
              <td>
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <input 
                      type="checkbox" 
                      class="toggle toggle-success" 
                      checked={user.is_active}
                      on:change={() => toggleUserStatus(user.id, user.is_active)}
                    />
                  </label>
                </div>
              </td>
              <td>
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <input 
                      type="checkbox" 
                      class="toggle toggle-primary" 
                      checked={user.is_superuser}
                      on:change={() => toggleAdminStatus(user.id, user.is_superuser)}
                    />
                  </label>
                </div>
              </td>
              <td>
                {#if user.is_verified}
                  <span class="badge badge-success">Verified</span>
                {:else}
                  <span class="badge badge-warning">Not Verified</span>
                {/if}
              </td>
              <td>
                <button 
                  class="btn btn-error btn-sm"
                  on:click={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<!-- Add User Modal -->
{#if showAddUserModal}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Add New User</h3>
      
      <form on:submit|preventDefault={addUser}>
        <div class="form-control mb-4">
          <label class="label" for="email">
            <span class="label-text">Email</span>
          </label>
          <input 
            type="email" 
            id="email"
            bind:value={newUser.email} 
            class="input input-bordered" 
            required
          />
        </div>
        
        <div class="form-control mb-4">
          <label class="label" for="password">
            <span class="label-text">Password</span>
          </label>
          <input 
            type="password" 
            id="password"
            bind:value={newUser.password} 
            class="input input-bordered" 
            required
          />
        </div>
        
        <div class="form-control mb-4">
          <label class="label cursor-pointer">
            <span class="label-text">Admin User</span>
            <input 
              type="checkbox" 
              class="toggle toggle-primary" 
              bind:checked={newUser.is_superuser}
            />
          </label>
        </div>
        
        <div class="modal-action">
          <button type="button" class="btn" on:click={() => showAddUserModal = false}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Add User
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}