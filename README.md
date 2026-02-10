# 🛒 Product Listing Page 🏷️

A responsive, accessible e-commerce Product Listing Page with search, filtering, sorting, infinite scroll, and cart management.

Built with **React 18** · **TypeScript** · **Vite 6** · **Vitest**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🛍️ **Product Grid** | Responsive CSS Grid — 1 col mobile, 2 col tablet, 4 col desktop |
| 🛒 **Add to Cart** | Click multiple times; badge on card shows quantity; slide-out cart drawer |
| 📦 **Cart Management** | Increment/decrement quantity, remove items, clear cart, line totals |
| 🏷️ **Category Filter** | Filter by All / Electronics / Jewelery / Men's / Women's clothing |
| 🔀 **Sort** | Price (Low → High, High → Low), Top Rated, Name A–Z |
| 🔍 **Search** | Debounced text search across product title and description |
| ⭐ **Top Rated Badge** | Gold badge on products rated ≥ 4.5 stars |
| ♾️ **Infinite Scroll** | Products load in pages of 8 |
| ⬆️ **Scroll to Top** | Floating button appears after scrolling 400px |
| 💀 **Skeleton Loading** | Shimmer placeholders while API fetches |
| ⚠️ **Error Handling** | Retry button on API failure & React ErrorBoundary |
| ♿ **Accessibility** | Skip link, ARIA labels, keyboard nav, semantic HTML, WCAG AA contrast |

---

## 📦 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/rvpanchal10/equalexperts-plp-ecommerce-demo.git plp-ecommerce-demo
cd plp-ecommerce-demo
```

### 2. Install Dependencies

#### Using npm
```bash
npm install
```

#### Or using Yarn
```bash
yarn install
```

### 3. Project Structure

```
plp-ecommerce-demo/
├── .gitignore
├── README.md
├── index.html                              
├── package.json
├── tsconfig.json                           
├── vite.config.ts                          
│
├── public/
│   └── favicon.svg                         
│
└── src/
    ├── main.tsx                            
    ├── App.tsx                             
    ├── App.css                             
    ├── vite-env.d.ts                       
    ├── setupTests.ts                       
    │
    ├── types/
    │   └── index.ts                        
    │
    ├── services/
    │   └── productService.ts               
    │
    ├── utils/
    │   └── format.ts                       
    │
    ├── hooks/
    │   ├── useProducts.ts                  
    │   ├── useCart.ts                      
    │   ├── useProductFilters.ts            
    │   └── useInfiniteScroll.ts            
    │
    ├── components/
    │   ├── Header/                         
    │   ├── SearchBar/                      
    │   ├── FilterBar/                      
    │   ├── SortDropdown/                   
    │   ├── ProductCard/                    
    │   ├── TopRatedBadge/                  
    │   ├── ProductGrid/                    
    │   ├── Cart/                           
    │   ├── CartItem/                       
    │   ├── Loading/                        
    │   ├── ScrollToTop/                    
    │   └── ErrorBoundary/                  
    │
    └── __tests__/                          
        ├── fixtures.ts                     
        ├── format.test.ts                  
        ├── productService.test.ts          
        ├── useCart.test.ts                 
        ├── useProducts.test.ts             
        ├── useProductFilters.test.ts       
        ├── Header.test.tsx                 
        ├── ProductCard.test.tsx            
        ├── ProductGrid.test.tsx            
        ├── Cart.test.tsx                   
        ├── CartItem.test.tsx               
        ├── Loading.test.tsx                
        ├── FilterBar.test.tsx              
        ├── SortDropdown.test.tsx           
        ├── SearchBar.test.tsx             
        └── App.test.tsx                    
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Run Tests

```bash
npm test                 # Watch mode
npm run test:run         # Single run
npm run test:coverage    # Coverage report with thresholds
```

### 6. Build for Production

```bash
npm run build
npm run preview          # Preview production build locally
```

## 📖 API

### Endpoint Used

```
GET https://equalexperts.github.io/frontend-take-home-test-data/products.json
```

Returns an array of 20 products, each with:

```json
{
  "id": 1,
  "title": "Product Name",
  "price": 109.95,
  "description": "Product description...",
  "category": "men's clothing",
  "image": "https://...",
  "rating": { "rate": 3.9, "count": 120 }
}
```

---