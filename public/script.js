const addProductForm = document.getElementById('add-product-form');
const productList = document.getElementById('product-list');

// Add event listener for form submission
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const product = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price')),
  };

  try {
    const response = await fetch('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      console.log('Product added successfully!');
      e.target.reset();
      fetchProducts();
    } else {
      alert('Failed to add product.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Fetch and display products
const fetchProducts = async () => {
  try {
    const response = await fetch('/products');
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Display products in the product list
const displayProducts = (products) => {
  productList.innerHTML = '';
  products.forEach((product) => {
    const li = document.createElement('li');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => deleteProduct(product._id));
    li.textContent = `Name: ${product.name}, Description: ${product.description}, Price: $${product.price}`;
    li.appendChild(deleteBtn);
    productList.appendChild(li);
  });
};

const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`/products/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Product deleted successfully!');
      fetchProducts();
    } else {
      alert('Failed to delete product.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Initial fetch of products
fetchProducts();