# 🛍️ Mini E-Commerce Frontend

A simplified yet real-world e-commerce frontend built with **Next.js**, **Tailwind CSS**, and **React Hooks/Context API**, featuring a complete flow from product discovery to cart management.


## 📦 Features

### ✅ Home Page
- Hero banner (static or carousel)
- Featured categories grid
- Trending Products using shared ProductCard

### ✅ Product Listing Page (PLP)
- Filters: Category, Brand, Price, Rating
- Sorting by relevance, price, and newest
- Infinite scroll
- Client-side search

### ✅ Product Detail Page (PDP)
- Image carousel with at least 3 images
- Variant selection: color, size
- Quantity selector
- Add to cart + Wishlist
- Similar products carousel

### ✅ Cart Page
- Product summary, quantity control, remove button
- Apply promo code (mock logic)
- Price breakdown (MRP, discount, tax, total)
- Mobile sticky checkout bar

### 🆗 Optional: Checkout Modal
- Dummy form (Name, Email, Address, etc.)
- Shows success message on submit


## 🛠️ Tech Stack

- **Framework:** [Next.js]
- **Styling:** [Tailwind CSS]
- **State Management:** React Context API (or Redux Toolkit)
- **Animation:** [Framer Motion]
- **Icons:** [Lucide]
- **Persistence:** LocalStorage for Cart & Wishlist
- **API:** [DummyJSON Products API](https://dummyjson.com/products)


## 📲 Mobile-First Design

The UI is built with mobile users in mind, and adapts smoothly across breakpoints for tablets and desktops.


## 🧪 How to Run Locally
# Clone the repo
git clone https://github.com/REDDIRANI1/Mini-E-Commerce-Frontend.git
# Navigate into the project
cd ecom-main
# Install dependencies
npm install
# Start development server
npm run dev

📌 Design Decisions
Component-driven approach with a clear separation of concerns
Context API for simplicity and scoped state management
Tailwind CSS for utility-first styling and speed
API layer abstracts external and internal requests
Accessibility considerations via semantic HTML and keyboard-focusable elements