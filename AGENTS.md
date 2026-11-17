<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

PizzaHub — Project Context
Build PizzaHub as a functional, responsive pizza ordering and delivery platform. Treat the assignment requirements below as the project source of truth.
Tech stack
- Frontend: Next.js App Router, TypeScript or JavaScript, shadcn/ui.
- Notifications: Use react-hot-toast for success and error messages. Do not use browser alerts.
- Backend: Express.js and MongoDB, using TypeScript or JavaScript.
- Authentication: Better Auth with MongoDB adapter, email/password, Google OAuth, and JWT verification for protected backend APIs.
- Payments: Stripe Checkout with server-verified webhooks for vendor subscriptions only.
- Image hosting: ImgBB file uploads are required for menu item images.
Keep the client and server in separate GitHub repositories. Store credentials in environment variables. Never commit .env files or secrets.
Product and roles
PizzaHub lets customers browse local restaurant menus and place food orders. Vendors manage restaurant profiles, menu items, orders, and subscriptions. Admins manage users, review menu items, and view transactions.
- Customers: Browse, search, filter, sort, and view approved active items; place orders with delivery details; track orders; cancel pending orders; manage their profiles.
- Vendors: Manage their restaurant profile and menu; review orders for their own items; manage availability and subscriptions.
- Admins: Manage users and menu items; review submissions; view platform transactions.
Enforce roles, blocked status, and resource ownership on the server as well as in the interface. Users must not gain access to another role’s dashboard by changing a URL.
Authentication and authorization
- Sign-up fields: full name, email, password, optional profile image, and role (Customer or Vendor). Never allow public Admin registration.
- Require passwords to have at least six characters, one uppercase letter, and one lowercase letter.
- Support email/password and Google sign-in. Show clear success and error messages, then redirect users according to role.
- Protect dashboard routes and item details. Redirect unauthenticated users to Sign In when they access private pages or try to order.
- Blocked users must not use protected features.
- Verify JWTs on protected backend routes and reject invalid or expired tokens. Return 401 for unauthenticated requests and 403 for authenticated users without permission.
- Derive identity and role from verified authentication data, never from client-supplied IDs or roles. Validate request data and verify ownership before updates or deletion.
- Users may edit permitted profile fields, but cannot change their role, blocked status, or subscription through profile updates.
Pages and navigation
Public pages: Home, Browse Menu, Sign In, and Sign Up.

Private pages: item details (/menu/[id]), role-specific dashboards, Profile Settings, Payment Success, and Payment Cancel. Customers, Vendors, and Admins may access only their own dashboard.

The navbar must update immediately when authentication changes. Logged-out navigation includes Home, Browse Menu, Sign In, and Sign Up. Logged-in navigation includes Home, Browse Menu, and role-relevant links. The profile menu includes the user’s name and image, Dashboard, Profile Settings, and Logout.

Include a footer with the PizzaHub identity and short description, navigation links, contact information, social links, and copyright.
Home and menu browsing
Create a professional, original, responsive pizza-themed design using warm reds, oranges, and cream backgrounds. Do not copy projects from course modules or conceptual sessions. Keep typography, buttons, spacing, card dimensions, and image sizing consistent. Use the new X logo instead of the Twitter bird. Build reusable components and use shadcn/ui appropriately. Avoid clutter and unnecessary animation.

The homepage must include:
- A pizza-themed banner, clear headline and description, and “Explore Pizza Menu” CTA.
- At least six database-driven featured items, limited to approved and active items. Cards show image, name, category, price, location, vendor, and View Details.
- The required categories: Classic Pizzas, Vegetarian Pizzas, Meat Lovers, Specialty/Gourmet Pizzas, Sides & Appetizers, and Beverages & Desserts.
- A “Why Choose PizzaHub?” section and at least one of: How PizzaHub Works, Popular Pizza Combos, Customer Testimonials, or Pizza Lovers’ Tips.
- Smooth, suitable Motion animations that do not interfere with usability.
Browse Menu is public and displays only approved, active items. Include search by name, filters by category and location, and sorting by price ascending or descending. Provide loading, empty, and error states. Cards show image, name, category, price, location, vendor, and View Details.

Item details must show the item name, multiple images when available, category, description, price, location, vendor, and order option. Handle invalid IDs and missing records clearly. Only approved, active items may be ordered. Vendors cannot order their own items, and Admins cannot place customer orders.
Orders
The customer order form collects delivery date, delivery address, and optional message or special instructions. Derive the customer, vendor, and item from authenticated identity and the selected item. Save orders with default status pending.

Prevent duplicate active orders for the same item and delivery date. Customers may cancel only their own pending orders. Vendors may accept or reject only pending orders belonging to them, and may act only once. Users must not view or modify another user’s orders.

Order statuses: pending, accepted, rejected, and cancelled. Use clear messages and loading states during submission and processing.

Do not integrate Stripe for customer pizza orders. Provide the order action without customer payment processing. Stripe is only for vendor subscription payments.
Vendor dashboard
Provide a responsive dashboard with sidebar navigation, profile area, statistics, and charts where useful. Include:
- Overview: Total and active menu items, pending and accepted orders, current plan.
- My Menu Items: Show only the vendor’s items and approval status. Allow viewing, editing, deleting, and managing availability. Rejected items must never be visible to customers.
- Add Menu Item: Require item name, category, description, price, location, and an image uploaded as a file to ImgBB. Validate required fields. New items start as pending.
- Customer Orders: Show customer and item information, delivery date/address, message, and status. Only accept or reject pending orders belonging to the vendor.
- Subscription: Show current plan and an Upgrade to Premium action.
- Profile Settings.
Free vendors may have at most three active menu items; Premium vendors may have unlimited active items. Enforce this rule on the server. Premium includes unlimited active items, a Premium badge, and featured placement.
Customer dashboard
Provide responsive role-based navigation and:
- Overview: Total, pending, accepted, and rejected orders.
- My Orders: Item image/name, vendor, delivery date/address, status, and request date. Allow order details and cancellation only for pending orders owned by the customer.
- Profile Settings.
Admin dashboard
Provide responsive role-based navigation and:
- Overview: Registered users, vendors, customers, menu items, pending menu items, and transactions.
- Manage Users: View details; search by name/email; filter by role; block or unblock users. Blocked users cannot use protected features.
- Manage Menu Items: View, search, and filter submissions; approve or reject pending items; change published item status; delete inappropriate items. Only approved and active items appear publicly.
- Transactions: View vendor, plan, amount, payment status, and transaction date. Admins cannot edit payment records or mark payments successful.
Vendor subscriptions and Stripe
Vendors use Stripe Checkout to upgrade to Premium. The backend creates the session and ensures a vendor can create sessions only for their own account. Provide Payment Success and Payment Cancel pages.

Never activate Premium based on the success redirect. Verify Stripe webhook events on the server, then update subscription status and save the transaction. Keep Stripe secret keys server-side. Handle cancellation and expiration correctly, and prevent forged or duplicate activation.
Database
Better Auth manages its own authentication collections. Keep business data in these four MongoDB collections:
- users (Better Auth): Include applicable profile fields and securely managed role, isBlocked, vendor businessName, subscriptionPlan, and subscriptionExpiresAt.
- menuItems: vendorId, itemName, category, description, price, location, images, status, createdAt.
- orders: itemId, vendorId, customerId, deliveryDate, deliveryAddress, message, status, createdAt.
- transactions: vendorId, plan, amount, currency, stripeSessionId, stripeSubscriptionId, status, createdAt.
Use proper references and avoid unnecessary collections.
UI, reliability, and deployment
Make the experience responsive on mobile, tablet, and desktop. Ensure all buttons and links work. Use react-hot-toast for success and error notifications.

Provide meaningful loading states for data fetching, dashboards, forms, orders, image uploads, and payments. Handle API failures, invalid forms, unauthorized access, missing records, failed image uploads, and invalid routes with clear messages and a custom 404 page.

Production requirements:
- Live routes must load directly and survive browser reloads.
- Logged-in users must remain authenticated on private routes after reload.
- Ensure correct production CORS and no 404 or 504 errors.
- Verify the live landing page, protected routes, subscription checkout, webhook flow, and supplied Admin credentials.
Delivery and documentation
Maintain separate client and server repositories. Make at least 20 meaningful client commits and 12 meaningful server commits, each with descriptive messages.

The README must include the project name and description, key features, technology stack and npm packages, installation and local run instructions, live site URL, client/server repository links, and environment variable names. Explain advanced search/sorting query parameters and JWT verification middleware flow. Document how the assignment challenges were implemented. Never include secret values.
Optional enhancements
Implement at least two: menu or restaurant reviews and ratings; dark/light mode; order status timeline; customer favorites/wishlist; or email notifications when an order is accepted or rejected.
