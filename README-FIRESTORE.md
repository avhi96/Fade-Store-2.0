# Firestore Integration Complete

## Features Added
- **Store page**: Real-time products from Firestore 'products' collection
- **Admin dashboard** (`/admin`): Discord login required
  - Products table with delete
  - Add product modal (name, cat, icon, price, old price, perks (lines), badge, color)
  - Sign out button
- Static data deprecated

## Setup
1. Ensure Firebase project 'fade-0l3' Firestore enabled
2. Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
3. `npm run dev`
4. Login Discord at `/admin`, add products
5. View at `/store` – real-time sync!

## Test Data Example
```
name: "VIP"
cat: "ranks"
icon: "⭐"
price: 4.99
perks: "Custom prefix\nVIP commands\n2x rewards"
color: "#63b3ed"
```

Buy button ready for Stripe extension.

