const API_URL = '/api/v1';
const AUTH_URL = '';

/**
 * Base fetch function with authentication handling
 */
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${endpoint.startsWith('/auth') ? AUTH_URL : API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (response.status === 401) {
    // Handle unauthorized - redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  
  return response;
}

export const api = {
  // Auth endpoints
  async login(email, password) {
    const response = await fetchWithAuth('/auth/jwt/login', {
      method: 'POST',
      body: new URLSearchParams({
        username: email,
        password: password
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      return data;
    }
    
    throw new Error('Login failed');
  },
  
  async register(userData) {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Registration failed');
  },
  
  async logout() {
    localStorage.removeItem('token');
    return true;
  },
  
  // Books endpoints
  async getBooks(page = 1, limit = 20, filters = {}) {
    let queryParams = `page=${page}&limit=${limit}`;
    
    if (filters.available !== undefined) {
      queryParams += `&filter[available]=${filters.available}`;
    }
    
    if (filters.archived !== undefined) {
      queryParams += `&filter[archived]=${filters.archived}`;
    }
    
    const response = await fetchWithAuth(`/books?${queryParams}`);
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch books');
  },
  
  async getBook(id) {
    const response = await fetchWithAuth(`/books/${id}`);
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch book');
  },
  
  async createBook(bookData) {
    const response = await fetchWithAuth('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to create book');
  },
  
  async createBookByISBN(isbn) {
    const response = await fetchWithAuth(`/books/${isbn}`, {
      method: 'POST'
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to create book from ISBN');
  },
  
  async updateBook(id, bookData) {
    const response = await fetchWithAuth(`/books/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bookData)
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to update book');
  },
  
  async deleteBook(id) {
    const response = await fetchWithAuth(`/books/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      return true;
    }
    
    throw new Error('Failed to delete book');
  },
  
  // Family endpoints
  async getFamilies(page = 1, limit = 20) {
    const response = await fetchWithAuth(`/families?page=${page}&limit=${limit}`);
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch families');
  },
  
  // Member endpoints
  async getMembers(page = 1, limit = 20) {
    const response = await fetchWithAuth(`/members?page=${page}&limit=${limit}`);
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch members');
  },
  
  // Circulation endpoints
  async getCirculations(page = 1, limit = 20) {
    const response = await fetchWithAuth(`/circulations?page=${page}&limit=${limit}`);
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch circulations');
  },
  
  async borrowBook(bookId, memberId) {
    const today = new Date().toISOString().split('T')[0];
    
    const response = await fetchWithAuth('/circulations', {
      method: 'POST',
      body: JSON.stringify({
        book_id: bookId,
        member_id: memberId,
        borrowed_date: today
      })
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to borrow book');
  },
  
  async returnBook(circulationId) {
    const today = new Date().toISOString().split('T')[0];
    
    const response = await fetchWithAuth(`/circulations/${circulationId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        returned_date: today
      })
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to return book');
  },
  async getUsers() {
    const response = await fetchWithAuth('/users');
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch users');
  },
  
  async createUser(userData) {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to create user');
  },
  
  async updateUser(userId, userData) {
    const response = await fetchWithAuth(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to update user');
  },
  
  async deleteUser(userId) {
    const response = await fetchWithAuth(`/users/${userId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      return true;
    }
    
    throw new Error('Failed to delete user');
  }
};

// Add these methods to your existing api.js file

