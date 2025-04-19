<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api';
  import { authStore } from '$lib/stores/authStore';
  
  let books = [];
  let metadata = { total_items: 0, total_pages: 0 };
  let loading = true;
  let error = null;
  
  // Search and filter parameters
  let searchQuery = '';
  let currentPage = 1;
  let filters = {
    available: true,
    archived: false
  };
  
  // Fetch books with current filters
  async function fetchBooks() {
    loading = true;
    error = null;
    
    try {
      const response = await api.getBooks(currentPage, 20, filters);
      books = response.data;
      metadata = response.meta;
    } catch (err) {
      error = 'Failed to load books. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  // Handle page change
  function changePage(page) {
    currentPage = page;
    fetchBooks();
  }
  
  // Handle search
  function handleSearch() {
    // In a real implementation, you would send the search query to the backend
    // For now, we'll just filter the books client-side
    currentPage = 1;
    fetchBooks();
  }
  
  // Handle borrowing a book
  async function borrowBook(bookId) {
    if (!$authStore.isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    try {
      // In a real implementation, you would get the member ID from the user profile
      // For now, we'll use a placeholder
      await api.borrowBook(bookId, 1);
      
      // Update the book's availability
      books = books.map(book => 
        book.id === bookId ? { ...book, available: false } : book
      );
    } catch (err) {
      alert('Failed to borrow book. Please try again.');
      console.error(err);
    }
  }
  
  onMount(fetchBooks);
</script>

<div>
  <h1 class="text-3xl font-bold mb-6">Books Catalog</h1>
  
  <!-- Search and filters -->
  <div class="bg-base-200 p-4 rounded-lg mb-6">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="form-control flex-grow">
        <div class="input-group">
          <input 
            type="text" 
            bind:value={searchQuery} 
            placeholder="Search by title, author..." 
            class="input input-bordered w-full" 
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button class="btn btn-square" on:click={handleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="flex gap-2">
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text mr-2">Available Only</span>
            <input 
              type="checkbox" 
              class="toggle toggle-primary" 
              bind:checked={filters.available} 
              on:change={fetchBooks}
            />
          </label>
        </div>
        
        {#if $authStore.isAdmin}
          <div class="form-control">
            <label class="cursor-pointer label">
              <span class="label-text mr-2">Show Archived</span>
              <input 
                type="checkbox" 
                class="toggle toggle-primary" 
                bind:checked={filters.archived} 
                on:change={fetchBooks}
              />
            </label>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Books list -->
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
  {:else if books.length === 0}
    <div class="text-center my-12">
      <h3 class="text-xl font-semibold">No books found</h3>
      <p class="mt-2">Try adjusting your search or filters.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each books as book}
        <div class="card bg-base-100 shadow-xl h-full">
          {#if book.cover}
            <figure class="px-4 pt-4">
              <img src={book.cover} alt={book.title} class="rounded-xl h-48 object-contain" />
            </figure>
          {:else}
            <figure class="px-4 pt-4">
              <div class="bg-base-200 rounded-xl h-48 w-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </figure>
          {/if}
          
          <div class="card-body">
            <h2 class="card-title">{book.title}</h2>
            <p>By {book.author}</p>
            
            {#if book.abstract}
              <p class="text-sm opacity-70 line-clamp-3">{book.abstract}</p>
            {/if}
            
            <div class="flex flex-wrap gap-2 mt-2">
              {#if book.language}
                <div class="badge badge-outline">{book.language}</div>
              {/if}
              
              {#if book.category_type}
                <div class="badge badge-outline">{book.category_type}</div>
              {/if}
              
              {#if book.category_age}
                <div class="badge badge-outline">{book.category_age}</div>
              {/if}
            </div>
            
            <div class="card-actions justify-between items-center mt-4">
              <div>
                {#if book.available}
                  <span class="badge badge-success">Available</span>
                {:else}
                  <span class="badge badge-error">Unavailable</span>
                {/if}
              </div>
              
              <div class="flex gap-2">
                <a href={`/books/${book.id}`} class="btn btn-sm btn-outline">Details</a>
                
                {#if book.available && $authStore.isAuthenticated}
                  <button class="btn btn-sm btn-primary" on:click={() => borrowBook(book.id)}>
                    Borrow
                  </button>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Pagination -->
    {#if metadata.total_pages > 1}
      <div class="flex justify-center mt-8">
        <div class="join">
          {#each Array(metadata.total_pages) as _, i}
            <button 
              class="join-item btn {currentPage === i + 1 ? 'btn-active' : ''}" 
              on:click={() => changePage(i + 1)}
            >
              {i + 1}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>