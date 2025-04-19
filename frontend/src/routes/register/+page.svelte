<script>
  import { api } from '$lib/services/api';
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let loading = false;
  
  async function handleRegister() {
    error = '';
    
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }
    
    loading = true;
    
    try {
      await api.register({
        email,
        password
      });
      
      // Redirect to login page after successful registration
      goto('/login?registered=true');
    } catch (err) {
      error = 'Registration failed. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto">
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-2xl font-bold mb-6">Register</h2>
      
      {#if error}
        <div class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      {/if}
      
      <form on:submit|preventDefault={handleRegister}>
        <div class="form-control">
          <label class="label" for="email">
            <span class="label-text">Email</span>
          </label>
          <input 
            type="email" 
            id="email"
            bind:value={email} 
            placeholder="Enter your email" 
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
            bind:value={password} 
            placeholder="Enter your password" 
            class="input input-bordered w-full" 
            required
          />
        </div>
        
        <div class="form-control mt-4">
          <label class="label" for="confirmPassword">
            <span class="label-text">Confirm Password</span>
          </label>
          <input 
            type="password" 
            id="confirmPassword"
            bind:value={confirmPassword} 
            placeholder="Confirm your password" 
            class="input input-bordered w-full" 
            required
          />
        </div>
        
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary" disabled={loading}>
            {#if loading}
              <span class="loading loading-spinner"></span>
            {/if}
            Register
          </button>
        </div>
      </form>
      
      <div class="divider">OR</div>
      
      <div class="text-center">
        <p>Already have an account?</p>
        <a href="/login" class="link link-primary">Login</a>
      </div>
    </div>
  </div>
</div>