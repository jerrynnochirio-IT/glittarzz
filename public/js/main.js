const productContainer = document.getElementById("productContainer");

/*
LOAD ANNOUNCEMENT
*/

fetch("/api/announcement")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("announcementText").innerText = data.announcement;
  });

/*
LOAD PRODUCTS
*/

function loadProducts(category = "All Collections") {
  fetch(`/api/products?category=${category}`)
    .then((res) => res.json())

    .then((products) => {
      productContainer.innerHTML = "";

      products.forEach((product) => {
        productContainer.innerHTML += `

<div class="col-lg-3 col-md-6 mb-4">

<div class="product-card">

<div class="image-box">

<img src="${product.image}">

</div>

<div class="p-3">

<h5>${product.name}</h5>

<p class="price">
₦${Number(product.price).toLocaleString()}
</p>

<button class="buy-btn">
Add To Cart
</button>

</div>

</div>

</div>

`;
      });
    });
}

loadProducts();

/*
CATEGORY FILTER
*/

document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".category-btn")
      .forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    loadProducts(button.dataset.category);
  });
});
