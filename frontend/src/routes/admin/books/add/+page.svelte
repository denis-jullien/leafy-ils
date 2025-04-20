<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  
  let book = {
    title: '',
    author: '',
    publisher: '',
    publication_date: '',
    isbn: '',
    language: '',
    format: '',
    category_type: '',
    category_age: '',
    category_topics: '',
    abstract: '',
    cover: '',
    catalog: '',
    available: true,
    archived: false
  };
  
  let loading = false;
  let error = null;
  
  onMount(() => {
    if (!$authStore.isAuthenticated || !$authStore.isAdmin) {
      goto('/login');
    }
  });
  
  async function saveBook() {
    loading = true;
    error = null;
    
    try {
      const newBook = await api.createBook(book);
      goto(`/books/${newBook.id}?edit=true`);
    } catch (err) {
      error = 'Failed to create book. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Add New Book</h1>
    
    <a href="/admin/books" class="btn btn-outline">
      Back to Books
    </a>
  </div>
  
  {#if error}
    <div class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  {/if}
  
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <form on:submit|preventDefault={saveBook}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label" for="title">
              <span class="label-text">Title</span>
            </label>
            <input 
              type="text" 
              id="title"
              bind:value={book.title} 
              class="input input-bordered w-full" 
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="author">
              <span class="label-text">Author</span>
            </label>
            <input 
              type="text" 
              id="author"
              bind:value={book.author} 
              class="input input-bordered w-full" 
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="publisher">
              <span class="label-text">Publisher</span>
            </label>
            <input 
              type="text" 
              id="publisher"
              bind:value={book.publisher} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="publication_date">
              <span class="label-text">Publication Date</span>
            </label>
            <input 
              type="date" 
              id="publication_date"
              bind:value={book.publication_date} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="isbn">
              <span class="label-text">ISBN</span>
            </label>
            <input 
              type="text" 
              id="isbn"
              bind:value={book.isbn} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="language">
              <span class="label-text">Language</span>
            </label>
            <input 
              type="text" 
              id="language"
              bind:value={book.language} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="format">
              <span class="label-text">Format</span>
            </label>
            <input 
              type="text" 
              id="format"
              bind:value={book.format} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="category_type">
              <span class="label-text">Category Type</span>
            </label>
            <input 
              type="text" 
              id="category_type"
              bind:value={book.category_type} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="category_age">
              <span class="label-text">Category Age</span>
            </label>
            <input 
              type="text" 
              id="category_age"
              bind:value={book.category_age} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="category_topics">
              <span class="label-text">Category Topics</span>
            </label>
            <input 
              type="text" 
              id="category_topics"
              bind:value={book.category_topics} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="cover">
              <span class="label-text">Cover URL</span>
            </label>
            <input 
              type="text" 
              id="cover"
              bind:value={book.cover} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label" for="catalog">
              <span class="label-text">Catalog</span>
            </label>
            <input 
              type="text" 
              id="catalog"
              bind:value={book.catalog} 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Status</span>
            </label>
            <div class="flex gap-4 mt-2">
              <label class="cursor-pointer label justify-start gap-2">
                <input 
                  type="checkbox" 
                  class="checkbox" 
                  bind:checked={book.available} 
                />
                <span class="label-text">Available</span>
              </label>
              
              <label class="cursor-pointer label justify-start gap-2">
                <input 
                  type="checkbox" 
                  class="checkbox" 
                  bind:checked={book.archived} 
                />
                <span class="label-text">Archived</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="form-control mt-6">
          <label class="label" for="abstract">
            <span class="label-text">Abstract</span>
          </label>
          <textarea 
            id="abstract"
            bind:value={book.abstract} 
            class="textarea textarea-bordered h-32" 
          ></textarea>
        </div>
        
        <div class="flex justify-end gap-4 mt-6">
          <a href="/admin/books" class="btn btn-outline">
            Cancel
          </a>
          <button 
            type="submit" 
            class="btn btn-primary" 
            disabled={loading}
          >
            {#if loading}
              <span class="loading loading-spinner"></span>
            {/if}
            Save Book
          </button>
        </div>
      </form>
    </div>
  </div>
</div>