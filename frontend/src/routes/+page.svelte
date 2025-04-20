<script>
  import { authStore } from '$lib/stores/authStore';
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api';
  
  let latestBooks = [];
  let latestArticles = [];
  let loading = true;
  let error = null;
  
  // Fetch latest books and articles
  async function fetchLatestContent() {
    loading = true;
    error = null;
    
    try {
      // Fetch latest books (limit to 10)
      const booksResponse = await api.getBooks(1, 5, { sort: 'created_at:desc' });
      latestBooks = booksResponse.data;
      
      // For demo purposes, we'll create some mock articles
      // In a real implementation, you would fetch these from your API
      latestArticles = [
        {
          id: 1,
          title: 'Summer Reading Program',
          excerpt: 'Join our summer reading program and win exciting prizes!',
          date: '2023-06-15',
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765'
        },
        {
          id: 2,
          title: 'New Fiction Arrivals',
          excerpt: 'Check out the latest fiction books added to our collection.',
          date: '2023-06-10',
          image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794'
        },
        {
          id: 3,
          title: 'Library Hours Extended',
          excerpt: 'We are now open longer hours on weekends to serve you better.',
          date: '2023-06-05',
          image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66'
        }
      ];
    } catch (err) {
      error = 'Failed to load content. Please refresh the page.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  onMount(fetchLatestContent);
</script>

<div class="hero min-h-[10vh] bg-base-200 rounded-lg">
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

<!-- Latest Books Carousel -->
<div class="py-12">
  <h2 class="text-3xl font-bold text-center mb-8">Latest Additions</h2>
  
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
  {:else if latestBooks.length === 0}
    <div class="text-center my-12">
      <p>No new books have been added recently.</p>
    </div>
  {:else}
    <div class="carousel carousel-center w-full p-4 space-x-4 rounded-box">
      {#each latestBooks as book}
        <div class="carousel-item">
          <div class="card w-64 bg-base-100 shadow-xl">
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
              <h2 class="card-title text-sm">{book.title}</h2>
              <p class="text-xs">By {book.author}</p>
              
              <div class="card-actions justify-end mt-2">
                <a href={`/books/${book.id}`} class="btn btn-xs btn-primary">View</a>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="flex justify-center mt-4">
      <a href="/books" class="btn btn-outline">View All Books</a>
    </div>
  {/if}
</div>

<!-- Latest Articles -->
<div class="py-12 bg-base-200 rounded-lg mt-8">
  <h2 class="text-3xl font-bold text-center mb-8">Latest News & Articles</h2>
  
  {#if loading}
    <div class="flex justify-center my-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if latestArticles.length === 0}
    <div class="text-center my-12">
      <p>No articles have been published recently.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
      {#each latestArticles as article}
        <div class="card bg-base-100 shadow-xl">
          {#if article.image}
            <figure>
              <img src={article.image} alt={article.title} class="h-48 w-full object-cover" />
            </figure>
          {/if}
          
          <div class="card-body">
            <h2 class="card-title">{article.title}</h2>
            <p class="text-sm">{article.excerpt}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-xs opacity-70">{new Date(article.date).toLocaleDateString()}</span>
              <button class="btn btn-sm btn-primary">Read More</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
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
