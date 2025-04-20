<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  
  let books = [];
  let metadata = { total_items: 0, total_pages: 0 };
  let loading = true;
  let error = null;
  let currentPage = 1;
  let searchQuery = '';
  let showAddBookModal = false;
  let newBookISBN = '';
  let isbnLoading = false;
  
  // Fetch books
  async function fetchBooks() {
    if (!$authStore.isAuthenticated || !$authStore.isAdmin) {
      goto('/login');
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      const response = await api.getBooks(currentPage, 20, { archived: false });
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
    currentPage = 1;
    fetchBooks();
  }
  
  // Add book by ISBN
  async function addBookByISBN() {
    if (!newBookISBN) return;
    
    isbnLoading = true;
    
    try {
      await api.createBookByISBN(newBookISBN);
      showAddBookModal = false;
      newBookISBN = '';
      fetchBooks();
    } catch (err) {
      alert('Failed to add book. Please check the ISBN and try again.');
      console.error(err);
    } finally {
      isbnLoading = false;
    }
  }
  
  // Delete book
  async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await api.deleteBook(bookId);
      books = books.filter(book => book.id !== bookId);
    } catch (err) {
      alert('Failed to delete book. Please try again.');
      console.error(err);
    }
  }
  
  onMount(fetchBooks);
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Manage Books</h1>
    
    <button class="btn btn-primary" on:click={() => showAddBookModal = true}>
      Add New Book
    </button>
  </div>
  
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
    </div>
  </div>
  
  <!-- Books table -->
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
      <p class="mt-2">Try adjusting your search or add new books.</p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each books as book}
            <tr>
              <td>{book.id}</td>
              <td>
                <div class="flex items-center gap-3">
                  {#if book.cover}
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <img src={book.cover} alt={book.title} />
                      </div>
                    </div>
                  {/if}
                  <div>
                    <div class="font-bold">{book.title}</div>
                    {#if book.isbn}
                      <div class="text-sm opacity-70">ISBN: {book.isbn}</div>
                    {/if}
                  </div>
                </div>
              </td>
              <td>{book.author}</td>
              <td>
                {#if book.available}
                  <span class="badge badge-success">Available</span>
                {:else}
                  <span class="badge badge-error">Unavailable</span>
                {/if}
              </td>
              <td>
                <div class="flex gap-2">
                  <a href={`/books/${book.id}`} class="btn btn-sm btn-outline">
                    View
                  </a>
                  <a href={`/books/${book.id}?edit=true`} class="btn btn-sm btn-primary">
                    Edit
                  </a>
                  <button 
                    class="btn btn-sm btn-error" 
                    on:click={() => deleteBook(book.id)}
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
  
  <!-- Add Book Modal -->
  {#if showAddBookModal}
    <div class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Add New Book</h3>
        
        <div class="py-4">
          <div class="tabs tabs-boxed mb-4">
            <a class="tab tab-active">By ISBN</a>
            <a href="/admin/books/add" class="tab">Manual Entry</a>
          </div>
          
          <div class="form-control">
            <label class="label" for="isbn">
              <span class="label-text">ISBN</span>
            </label>
            <input 
              type="text" 
              id="isbn"
              bind:value={newBookISBN} 
              placeholder="Enter ISBN (e.g., 9780738531366)" 
              class="input input-bordered w-full" 
            />
            <label class="label">
              <span class="label-text-alt">Book details will be fetched automatically</span>
            </label>
          </div>
        </div>
        
        <div class="modal-action">
          <button class="btn" on:click={() => showAddBookModal = false}>Cancel</button>
          <button 
            class="btn btn-primary" 
            on:click={addBookByISBN}
            disabled={!newBookISBN || isbnLoading}
          >
            {#if isbnLoading}
              <span class="loading loading-spinner"></span>
            {/if}
            Add Book
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>