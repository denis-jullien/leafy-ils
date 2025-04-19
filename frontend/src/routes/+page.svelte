<script>
  import { authStore } from '$lib/stores/authStore';
</script>

<div class="hero min-h-[70vh] bg-base-200 rounded-lg">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">LeafyILS</h1>
      <p class="py-6">Welcome to LeafyILS - Your Integrated Library System. Discover, borrow, and manage books with ease.</p>
      
      {#if !$authStore.isAuthenticated}
        <div class="flex gap-4 justify-center">
          <a href="/login" class="btn btn-primary">Login</a>
          <a href="/register" class="btn btn-outline">Register</a>
        </div>
      {:else}
        <div class="flex gap-4 justify-center">
          <a href="/books" class="btn btn-primary">Browse Books</a>
          <a href="/my-books" class="btn btn-outline">My Books</a>
        </div>
      {/if}
    </div>
  </div>
</div>

<div class="py-12">
  <h2 class="text-3xl font-bold text-center mb-8">Features</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Book Search</h2>
        <p>Search for books by title, author, or category to find exactly what you're looking for.</p>
      </div>
    </div>
    
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Easy Borrowing</h2>
        <p>Borrow books with a single click and keep track of your reading history.</p>
      </div>
    </div>
    
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">User Management</h2>
        <p>Administrators can easily manage users, books, and generate reports.</p>
      </div>
    </div>
  </div>
</div>
