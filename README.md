
```
store-2.0
├─ .sixth
│  └─ skills
├─ AGENTS.md
├─ app
│  ├─ admin
│  │  ├─ orders
│  │  │  ├─ page.js
│  │  │  └─ [id]
│  │  │     └─ page.js
│  │  ├─ page.js
│  │  ├─ products
│  │  │  └─ page.js
│  │  ├─ settings
│  │  │  └─ page.js
│  │  ├─ updates
│  │  │  └─ page.js
│  │  └─ users
│  │     ├─ page.js
│  │     └─ [id]
│  │        └─ purchases
│  │           └─ page.js
│  ├─ api
│  │  ├─ admin
│  │  │  ├─ delivery
│  │  │  │  └─ retry
│  │  │  │     └─ route.js
│  │  │  ├─ orders
│  │  │  │  ├─ delete
│  │  │  │  │  └─ route.js
│  │  │  │  └─ route.js
│  │  │  ├─ products
│  │  │  │  ├─ delete
│  │  │  │  │  └─ route.js
│  │  │  │  └─ save
│  │  │  │     └─ route.js
│  │  │  ├─ servers
│  │  │  │  ├─ delete
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ page.jsx
│  │  │  │  └─ save
│  │  │  │     └─ route.js
│  │  │  ├─ settings
│  │  │  │  └─ route.js
│  │  │  ├─ updates
│  │  │  │  ├─ delete
│  │  │  │  │  └─ route.js
│  │  │  │  └─ save
│  │  │  │     └─ route.js
│  │  │  └─ users
│  │  │     ├─ delete
│  │  │     │  └─ route.js
│  │  │     └─ route.jsx
│  │  ├─ auth
│  │  │  └─ [...nextauth]
│  │  │     └─ route.js
│  │  ├─ delivery
│  │  │  └─ process
│  │  │     └─ route.js
│  │  ├─ maintenance-status
│  │  │  └─ route.js
│  │  ├─ payments
│  │  │  ├─ cashfree
│  │  │  │  ├─ create
│  │  │  │  │  └─ route.js
│  │  │  │  └─ verify
│  │  │  │     └─ route.js
│  │  │  └─ razorpay
│  │  │     ├─ create
│  │  │     │  └─ route.js
│  │  │     └─ verify
│  │  │        └─ route.js
│  │  ├─ promos
│  │  │  ├─ use
│  │  │  │  └─ route.js
│  │  │  └─ validate
│  │  │     └─ route.js
│  │  ├─ proxy-image
│  │  │  └─ route.js
│  │  ├─ redeem
│  │  │  └─ use
│  │  │     └─ route.js
│  │  ├─ redemptions
│  │  │  └─ fade-points
│  │  │     ├─ route.js
│  │  │     └─ validate
│  │  │        └─ route.js
│  │  ├─ top-buyers
│  │  │  └─ route.js
│  │  ├─ upload
│  │  ├─ user-status
│  │  │  └─ route.js
│  │  ├─ users
│  │  │  ├─ me
│  │  │  │  └─ route.js
│  │  │  └─ sync
│  │  │     └─ route.js
│  │  └─ webhooks
│  │     ├─ cashfree
│  │     │  └─ route.js
│  │     └─ razorpay
│  │        └─ route.js
│  ├─ checkout
│  │  ├─ page.js
│  │  └─ result
│  │     └─ page.js
│  ├─ contact
│  │  └─ page.js
│  ├─ globals.css
│  ├─ layout.js
│  ├─ legal
│  │  ├─ privacy
│  │  │  └─ page.jsx
│  │  ├─ refund
│  │  │  └─ page.jsx
│  │  └─ terms
│  │     └─ page.jsx
│  ├─ loading.js
│  ├─ login
│  │  └─ page.js
│  ├─ maintenance
│  │  └─ page.js
│  ├─ page.js
│  ├─ partners
│  │  └─ page.js
│  ├─ profile
│  │  ├─ page.js
│  │  └─ purchases
│  │     └─ page.js
│  ├─ providers.js
│  ├─ redeem
│  │  └─ page.js
│  ├─ store
│  │  ├─ page.js
│  │  └─ [id]
│  │     └─ page.js
│  └─ updates
│     └─ page.js
├─ bun.lock
├─ CLAUDE.md
├─ components
│  ├─ Admin.jsx
│  ├─ AdminAuthWrapper.jsx
│  ├─ AdminOrders.jsx
│  ├─ AdminOrdersWrapper.jsx
│  ├─ AdminProducts.jsx
│  ├─ AdminProductsWrapper.jsx
│  ├─ AdminSettings.jsx
│  ├─ AdminUpdates.jsx
│  ├─ AdminUpdatesWrapper.jsx
│  ├─ AdminUsers.jsx
│  ├─ AdminUsersWrapper.jsx
│  ├─ BackgroundCanvas.jsx
│  ├─ Button.jsx
│  ├─ Contact.jsx
│  ├─ Dropdown.jsx
│  ├─ Features.jsx
│  ├─ Hero.jsx
│  ├─ LayoutWrapper.jsx
│  ├─ Login.jsx
│  ├─ MaintenanceScreen.jsx
│  ├─ Marquee.jsx
│  ├─ Navbar.jsx
│  ├─ Partners.jsx
│  ├─ Profile.jsx
│  ├─ Skeleton.jsx
│  ├─ Store.jsx
│  ├─ StoreCard.jsx
│  ├─ TopBuyers.jsx
│  ├─ Updates.jsx
│  └─ UserSync.jsx
├─ eslint.config.mjs
├─ hooks
│  ├─ useAuth.js
│  ├─ useCart.js
│  ├─ useMaintenance.js
│  └─ useUserStatus.js
├─ jsconfig.json
├─ lib
│  ├─ adminAuth.js
│  ├─ admins.js
│  ├─ auth.js
│  ├─ client-users.js
│  ├─ data.js
│  ├─ delivery.js
│  ├─ fadePoints.js
│  ├─ firebase-admin.js
│  ├─ firebase.js
│  ├─ orders.js
│  ├─ products.js
│  ├─ productType.js
│  ├─ pterodactyl.js
│  ├─ rateLimit.js
│  ├─ serverPayments.js
│  ├─ settings-server.js
│  ├─ settings.js
│  ├─ top-buyers.js
│  ├─ types.js
│  ├─ updates.js
│  ├─ user-purchases.js
│  └─ users.js
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.js
├─ public
│  └─ fadeicon.png
├─ README.md
├─ server
└─ tailwind.config.js

```