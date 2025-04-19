<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  
  let loading = true;
  let error = null;
  let reportType = 'borrowing';
  let dateRange = 'month';
  
  // Sample report data
  let borrowingStats = {
    totalBorrowed: 0,
    totalReturned: 0,
    overdue: 0,
    mostBorrowed: []
  };
  
  let userStats = {
    totalUsers: 0,
    activeUsers: 0,
    topBorrowers: []
  };
  
  let bookStats = {
    totalBooks: 0,
    availableBooks: 0,
    unavailableBooks: 0,
    archivedBooks: 0,
    byCategory: []
  };
  
  async function fetchReportData() {
    if (!$authStore.isAuthenticated || !$authStore.isAdmin) {
      goto('/login');
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      // This would need to be implemented in your API service
      // For now, we'll use placeholder data
      
      // Borrowing stats
      borrowingStats = {
        totalBorrowed: 156,
        totalReturned: 142,
        overdue: 8,
        mostBorrowed: [
          { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', count: 12 },
          { title: 'To Kill a Mockingbird', author: 'Harper Lee', count: 10 },
          { title: '1984', author: 'George Orwell', count: 9 },
          { title: 'Pride and Prejudice', author: 'Jane Austen', count: 7 },
          { title: 'The Catcher in the Rye', author: 'J.D. Salinger', count: 6 }
        ]
      };
      
      // User stats
      userStats = {
        totalUsers: 87,
        activeUsers: 42,
        topBorrowers: [
          { email: 'john.doe@example.com', count: 15 },
          { email: 'jane.smith@example.com', count: 12 },
          { email: 'bob.johnson@example.com', count: 9 },
          { email: 'alice.williams@example.com', count: 7 },
          { email: 'charlie.brown@example.com', count: 5 }
        ]
      };
      
      // Book stats
      bookStats = {
        totalBooks: 523,
        availableBooks: 412,
        unavailableBooks: 111,
        archivedBooks: 24,
        byCategory: [
          { name: 'Fiction', count: 245 },
          { name: 'Non-Fiction', count: 178 },
          { name: 'Children', count: 67 },
          { name: 'Reference', count: 33 }
        ]
      };
    } catch (err) {
      error = 'Failed to load report data. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  function changeReportType(type) {
    reportType = type;
  }
  
  function changeDateRange(range) {
    dateRange = range;
    fetchReportData();
  }
  
  onMount(fetchReportData);
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Reports</h1>
    
    <div class="flex gap-2">
      <select class="select select-bordered" bind:value={dateRange} on:change={() => fetchReportData()}>
        <option value="week">Last Week</option>
        <option value="month">Last Month</option>
        <option value="quarter">Last Quarter</option>
        <option value="year">Last Year</option>
        <option value="all">All Time</option>
      </select>
      
      <button class="btn btn-outline">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>
    </div>
  </div>
  
  <div class="tabs tabs-boxed mb-6">
    <a 
      class={`tab ${reportType === 'borrowing' ? 'tab-active' : ''}`}
      on:click={() => changeReportType('borrowing')}
    >
      Borrowing
    </a>
    <a 
      class={`tab ${reportType === 'users' ? 'tab-active' : ''}`}
      on:click={() => changeReportType('users')}
    >
      Users
    </a>
    <a 
      class={`tab ${reportType === 'books' ? 'tab-active' : ''}`}
      on:click={() => changeReportType('books')}
    >
      Books
    </a>
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
  {:else}
    <!-- Borrowing Report -->
    {#if reportType === 'borrowing'}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="stat bg-base-100 shadow">
          <div class="stat-title">Total Borrowed</div>
          <div class="stat-value">{borrowingStats.totalBorrowed}</div>
          <div class="stat-desc">Books borrowed</div>
        </div>
        
        <div class="stat bg-base-100 shadow">
          <div class="stat-title">Total Returned</div>
          <div class="stat-value">{borrowingStats.totalReturned}</div>
          <div class="stat-desc">Books returned</div>
        </div>
        
        <div class="stat bg-base-100 shadow">
          <div class="stat-title">Overdue</div>
          <div class="stat-value text-error">{borrowingStats.overdue}</div>
          <div class="stat-desc">Books past due date</div>
        </div>
      </div>
      
      <div class="bg-base-100 shadow-xl rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">Most Borrowed Books</h2>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Borrowed Count</th>
              </tr>
            </thead>
            <tbody>
              {#each borrowingStats.mostBorrowed as book}
                <tr>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.count}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    
    <!-- Users Report -->
    {:else if reportType === 'users'}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="stat bg-base-100 shadow">
          <div class="stat-title">Total Users</div>
          <div class="stat-value">{userStats.totalUsers}</div>
          <div class="stat-desc">Registered users</div>
        </div>
        
        <div class="stat bg-base-100 shadow">
          <div class="stat-title">Active Users</div>
          <div class="stat-value">{userStats.activeUsers}</div>
          <div class="stat-desc">Users who borrowed books</div>
        </div>
      </div>
      
      <div class="bg-base-100 shadow-xl rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">Top Borrowers</h2>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Books Borrowed</th>
              </tr>
            </thead>
            <tbody>
              {#each userStats.topBorrowers as user}
                <tr>
                  <td>{user.email}</td>
                  <td>{user.count}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    
    <!-- Books Report -->
    {:else if reportType === 'books'}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stat bg-base-100 shadow">
          <div class="stat-title">Total Books</div>
          <div class="stat-value">{bookStats.totalBooks}</div>
          <div class="stat-desc">In the library</div>
        </div>
        
        <div class="stat bg-base-100 shadow">
          <div class="stat-title">Available</div>
          <div class="stat-value text-success">{bookStats.availableBooks}</div>
          <div class="stat-desc">Ready to borrow</div>
        </div>
        
        <div class="stat bg-base-100 shadow">
          <div class="stat-title">Unavailable</div>
          <div class="stat-value text-warning">{bookStats.unavailableBooks}</div>
          <div class="stat-desc">Currently borrowed</div>
        </div>
        
        <div class="stat bg-base-100 shadow">
          <div class="stat-title">Archived</div>
          <div class="stat-value text-error">{bookStats.archivedBooks}</div>
          <div class="stat-desc">Not in circulation</div>
        </div>
      </div>
      
      <div class="bg-base-100 shadow-xl rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">Books by Category</h2>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {#each bookStats.byCategory as category}
                <tr>
                  <td>{category.name}</td>
                  <td>{category.count}</td>
                  <td>{Math.round((category.count / bookStats.totalBooks) * 100)}%</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  {/if}
</div>