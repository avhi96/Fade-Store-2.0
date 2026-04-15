# Firestore Setup for Fade Store

## Collections

### 1. `products` (for store)
```
products/{productId}
  - name: string
  - cat: 'ranks' | 'keys' | 'money' | 'bundles'
  - icon: string (Crown, Star, etc.)
  - price: number
  - old: number (original price)
  - badge: 'popular' | 'sale' | 'new' | ''
  - color: hex color
  - perks: array of strings
  - createdAt: timestamp
```

### 2. `users` (for admin panel)
```
users/{userId}
  - name: string
  - email: string  
  - discordId: string
  - points: number (default 0)
  - purchases: array of product refs
  - isBanned: boolean (default false)
  - createdAt: timestamp
  - updatedAt: timestamp (optional)
```

### 3. `orders` (future)
```
orders/{orderId}
  - userId: string
  - products: array
  - total: number
  - status: 'pending' | 'completed' | 'failed'
  - createdAt: timestamp
```

## Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authenticated users can read products
    match /products/{doc} {
      allow read: if true;
      allow write: if false; // Admin only via Functions
    }
    
    // Users can read/write own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read, write: if request.auth != null; // Admin reads all
    }
    
    // Orders
    match /orders/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Quick Test Data
Add to `users` collection:
```
userId: test1
name: Test User
email: test@example.com
discordId: 123456789
points: 150
purchases: [] 
isBanned: false
createdAt: now()
```

