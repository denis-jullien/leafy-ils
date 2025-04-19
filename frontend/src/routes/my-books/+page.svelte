<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  
  let circulations = [];
  let loading = true;
  let error = null;
  
  async function fetchMyBooks() {
    if (!$authStore.isAuthenticated) {
      goto('/login');
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      // In a real implementation, you would filter circulations by the current user
      const response = await api.getCirculations();
      circulations = response.data.filter(c => !c.returned_date);
    } catch (err) {
      error = 'Failed to load your books. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  async function returnBook(circulationId) {
    try {
      await api.returnBook(circulationId);
      
      // Remove the returned book from the list
      circulations = circulations.filter(c => c.id !== circulationId);
    } catch (err) {
      alert('Failed to return book. Please try again.');
      console.error(err);
    }
  }
  
  onMount(fetchMyBooks);
</script>

<div>
  <h1 class="text-3xl font-bold mb-6">My Borrowed Books</h1>
  
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
  {:else if circulations.length === 0}
    <div class="text-center my-12">
      <h3 class="text-xl font-semibold">You haven't borrowed any books yet</h3>
      <p class="mt-2">Browse our collection and borrow books to see them here.</p>
      <a href="/books" class="btn btn-primary mt-4">Browse Books</a>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th>Book</th>
            <th>Borrowed Date</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each circulations as circulation}
            <tr>
              <td>
                <div class="flex items-center gap-3">
                  {#if circulation.book.cover}
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <img src={circulation.book.cover} alt={circulation.book.title} />
                      </div>
                    </div>
                  {/if}
                  <div>
                    <div class="font-bold">{circulation.book.title}</div>
                    <div class="text-sm opacity-70">{circulation.book.author}</div>
                  </div>
                </div>
              </td>
              <td>{new Date(circulation.borrowed_date).toLocaleDateString()}</td>
              <td>
                {#if circulation.due_date}
                  {new Date(circulation.due_date).toLocaleDateString()}
                  
                  {#if new Date(circulation.due_date) < new Date()}
                    <span class="badge badge-error ml-2">Overdue</span>
                  {/if}
                {:else}
                  N/A
                {/if}
              </td>
              <td>
                <div class="flex gap-2">
                  <a href={`/books/${circulation.book.id}`} class="btn btn-sm btn-outline">
                    Details
                  </a>
                  <button 
                    class="btn btn-sm btn-primary" 
                    on:click={() => returnBook(circulation.id)}
                  >
                    Return
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>