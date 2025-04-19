<script>
  import '../app.css';
  
  let { children } = $props();
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/authStore';
  import { onMount } from 'svelte';
  
  let theme = 'light';
  
  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  onMount(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    theme = savedTheme;
    document.documentElement.setAttribute('data-theme', theme);
  });
</script>

<div class="min-h-screen flex flex-col">
  <header class="bg-base-200 shadow-md">
    <div class="navbar container mx-auto">
      <div class="navbar-start">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="/" class:active={$page.url.pathname === '/'}>Home</a></li>
            <li><a href="/books" class:active={$page.url.pathname.startsWith('/books')}>Books</a></li>
            {#if $authStore.isAuthenticated}
              <li><a href="/my-books" class:active={$page.url.pathname === '/my-books'}>My Books</a></li>
              {#if $authStore.isAdmin}
                <li>
                  <a>Admin</a>
                  <ul class="p-2">
                    <li><a href="/admin/books" class:active={$page.url.pathname === '/admin/books'}>Manage Books</a></li>
                    <li><a href="/admin/users" class:active={$page.url.pathname === '/admin/users'}>Manage Users</a></li>
                    <li><a href="/admin/reports" class:active={$page.url.pathname === '/admin/reports'}>Reports</a></li>
                  </ul>
                </li>
              {/if}
            {/if}
          </ul>
        </div>
        <a href="/" class="btn btn-ghost normal-case text-xl">LeafyILS</a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><a href="/" class:active={$page.url.pathname === '/'}>Home</a></li>
          <li><a href="/books" class:active={$page.url.pathname.startsWith('/books')}>Books</a></li>
          {#if $authStore.isAuthenticated}
            <li><a href="/my-books" class:active={$page.url.pathname === '/my-books'}>My Books</a></li>
            {#if $authStore.isAdmin}
              <li>
                <details>
                  <summary>Admin</summary>
                  <ul class="p-2 bg-base-100 z-10">
                    <li><a href="/admin/books" class:active={$page.url.pathname === '/admin/books'}>Manage Books</a></li>
                    <li><a href="/admin/users" class:active={$page.url.pathname === '/admin/users'}>Manage Users</a></li>
                    <li><a href="/admin/reports" class:active={$page.url.pathname === '/admin/reports'}>Reports</a></li>
                  </ul>
                </details>
              </li>
            {/if}
          {/if}
        </ul>
      </div>
      <div class="navbar-end">
        <button class="btn btn-ghost btn-circle" on:click={toggleTheme}>
          {#if theme === 'light'}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          {/if}
        </button>
        
        {#if $authStore.isAuthenticated}
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="avatar placeholder">
                <div class="bg-neutral text-neutral-content rounded-full w-10">
                  <span>{$authStore.user?.email?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
              </div>
            </label>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a href="/profile">Profile</a></li>
              <li><a href="/my-books">My Books</a></li>
              <li>
                <a href="/login" on:click|preventDefault={() => {
                  authStore.logout();
                  window.location.href = '/';
                }}>Logout</a>
              </li>
            </ul>
          </div>
        {:else}
          <a href="/login" class="btn btn-primary">Login</a>
        {/if}
      </div>
    </div>
  </header>
  
  <main class="flex-grow container mx-auto py-8 px-4">
    {@render children()}
  </main>
  
  <footer class="footer footer-center p-4 bg-base-200 text-base-content">
    <div>
      <p>Copyright © 2023 - LeafyILS - All rights reserved</p>
    </div>
  </footer>
</div>
