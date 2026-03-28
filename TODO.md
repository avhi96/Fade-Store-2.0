# Navbar Active State Fix - TODO

## Plan Breakdown
1. [x] Update components/Navbar.jsx:
   - Import usePathname from next/navigation
   - Remove local active state
   - Compute active based on current pathname
   - Update button classes and conditions
   - Clean up onClick handlers
2. [x] Test navigation between pages (home, store, updates, etc.)
3. [x] Verify mobile menu works correctly
4. [x] Complete task
