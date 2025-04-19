<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api';
  import { authStore } from '$lib/stores/authStore';
  
  const bookId = $page.params.id;
  
  let book = null;
  let loading = true;
  let error = null;
  
  async function fetchBook() {
    loading = true;
    error = null;
    
    try {
      book = await api.getBook(bookId);
    } catch (err) {
      error = 'Failed to load book details. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  async function borrowBook() {
    if (!$authStore.isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    try {
      // In a real implementation, you would get the member ID from the user profile
      // For now, we'll use a placeholder
      await api.borrowBook(bookId, 1);
      
      // Update the book's availability
      book = { ...book, available: false };
    } catch (err) {
      alert('Failed to borrow book. Please try again.');
      console.error(err);
    }
  }
  
  onMount(fetchBook);
</script>

<div>
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
  {:else if book}
    <div class="flex flex-col md:flex-row gap-8">
      <div class="md:w-1/3">
        {#if book.cover}
          <img src={book.cover} alt={book.title} class="rounded-lg shadow-lg w-full max-h-96 object-contain bg-base-200" />
        {:else}
          <div class="bg-base-200 rounded-lg shadow-lg w-full h-96 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        {/if}
        
        <div class="mt-6 flex flex-col gap-4">
          {#if book.available && $authStore.isAuthenticated}
            <button class="btn btn-primary w-full" on:click={borrowBook}>
              Borrow This Book
            </button>
          {:else if !book.available}
            <button class="btn btn-disabled w-full">
              Currently Unavailable
            </button>
          {/if}
          
          <a href="/books" class="btn btn-outline w-full">
            Back to Books
          </a>
        </div>
      </div>
      
      <div class="md:w-2/3">
        <h1 class="text-3xl font-bold">{book.title}</h1>
        <h2 class="text-xl mt-2">by {book.author}</h2>
        
        <div class="flex flex-wrap gap-2 mt-4">
          {#if book.language}
            <div class="badge badge-lg">{book.language}</div>
          {/if}
          
          {#if book.category_type}
            <div class="badge badge-lg">{book.category_type}</div>
          {/if}
          
          {#if book.category_age}
            <div class="badge badge-lg">{book.category_age}</div>
          {/if}
          
          {#if book.available}
            <div class="badge badge-lg badge-success">Available</div>
          {:else}
            <div class="badge badge-lg badge-error">Unavailable</div>
          {/if}
        </div>
        
        {#if book.abstract}
          <div class="mt-6">
            <h3 class="text-lg font-semibold">Abstract</h3>
            <p class="mt-2">{book.abstract}</p>
          </div>
        {/if}
        
        <div class="divider"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#if book.publisher}
            <div>
              <h3 class="font-semibold">Publisher</h3>
              <p>{book.publisher}</p>
            </div>
          {/if}
          
          {#if book.publication_date}
            <div>
              <h3 class="font-semibold">Publication Date</h3>
              <p>{book.publication_date}</p>
            </div>
          {/if}
          
          {#if book.format}
            <div>
              <h3 class="font-semibold">Format</h3>
              <p>{book.format}</p>
            </div>
          {/if}
          
          {#if book.isbn}
            <div>
              <h3 class="font-semibold">ISBN</h3>
              <p>{book.isbn}</p>
            </div>
          {/if}
          
          {#if book.catalog}
            <div>
              <h3 class="font-semibold">Catalog</h3>
              <p>{book.catalog}</p>
            </div>
          {/if}
          
          {#if book.category_topics}
            <div>
              <h3 class="font-semibold">Topics</h3>
              <p>{book.category_topics}</p>
            </div>
          {/if}
        </div>
        
        {#if $authStore.isAdmin}
          <div class="mt-8">
            <div class="divider"></div>
            <h3 class="text-lg font-semibold mb-4">Admin Actions</h3>
            <div class="flex gap-4">
              <a href={`/admin/books/edit/${book.id}`} class="btn btn-outline">
                Edit Book
              </a>
              <button class="btn btn-error">
                Delete Book
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="alert alert-error">
      <span>Book not found</span>
    </div>
  {/if}
</div>