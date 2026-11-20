🍕 PizzaHub — Pizza Ordering & Delivery Platform

PizzaHub is a role-based pizza ordering platform. Customers browse menus and place orders, vendors publish menu items and manage orders, and admins manage users, menu items and transactions. Vendors can upgrade to Premium via Stripe Checkout for unlimited items and featured placement.

🔗 Links

Live Site: https://your-live-site.com
Client Repo: https://github.com/your-username/pizzahub-client
Server Repo: https://github.com/your-username/pizzahub-server
Admin Login: admin@example.com / Admin123
Stripe Test Card: 4242 4242 4242 4242 (any future date, any CVC)


✨ Key Features
Better Auth login/signup with email-password and Google OAuth
Role-based access (Admin, Vendor, Customer) verified on both client and server
JWT verification middleware with 401/403 responses and ownership checks
Browse menu with search, category/location filters and price sorting
Order system with duplicate-order and self-order prevention
Vendor dashboard: add, update, delete menu items (ImgBB image upload), accept/reject orders
Free plan (3 active items) and Premium plan (unlimited, badge, featured placement)
Stripe Checkout; Premium activates only after a verified webhook event
Admin dashboard: block/unblock users, approve/reject menu items, read-only transactions
Dashboard stats and charts for every role
Framer Motion animations, toast notifications, loading and error states
Fully responsive design with custom 404 page
🛠️ Tech Stack

Client: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Better Auth, Framer Motion, Recharts, Sonner, React Hook Form, Zod, Lucide React

Server: Express.js, MongoDB, jsonwebtoken, Stripe, cors, dotenv, Zod

🏆 Challenges

Advanced search & sorting — GET /api/menu-items?search=&category=&location=&sort=price_asc|price_desc&page=&limit= The server always filters status: "approved", applies a case-insensitive regex for search, adds category/location filters, then sorts by price and paginates.

JWT verification — Request → verifyToken → verifyRole → ownership check → controller Invalid, missing or expired tokens return 401. Wrong role or blocked users return 403. Role and block status are always read from the database, never from the client.

🚀 Run Locally
bash
# Server
git clone https://github.com/your-username/pizzahub-server.git
cd pizzahub-server
npm install
cp .env.example .env
npm run dev

# Client
git clone https://github.com/your-username/pizzahub-client.git
cd pizzahub-client
npm install
cp .env.example .env.local
npm run dev

# Stripe webhook (local testing)
stripe listen --forward-to localhost:5000/api/webhooks/stripe
🔐 Environment Variables

Server: PORT, MONGODB_URI, DB_NAME, CLIENT_URL, JWT_SECRET, BETTER_AUTH_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID

Client: NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, MONGODB_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_IMGBB_API_KEY