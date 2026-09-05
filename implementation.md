<!!HAVE NOT IMPLEMENT>-CHANGE ALERT in loginForm and registerForm
<!!HAVE NOT IMPLEMENT>-  Next step - find a way to reduce database call
- generic function - cannot implement since the schema is complex
<!!HAVE NOT IMPLEMENT> - light/dark mode in every page
Product/page
<!!HAVE NOT IMPLEMENTED> - caching for pages
<HAVE IMPLEMENTED>  - pagination of Product/page
- RECHECK middleware.ts
- FIX formstyles from styles/product
- Loading UI in <Suspense> for product/page while loading database - HAVE IMPLEMENTED!!
-Caching - so that the database is only queried once

CreateProductForm 
- add number format(10,000)
- option to not write in some fields
- cannot scroll in mobile mode
- change demical number into plain js   - HAVE IMPLEMENTED!
- prefetch the createProduct button with link

SortHeader
- implement stock order -> need new logic and totalcount in product model
- also price

Error in login screen 
- cannot go to dashboard/products after login or register

ProductTableData
- change stock logic -> add totalCount in Product Model
Optimizations
- memoize the render loop logic - use child component to variants and stock
- stablize the accordion Callback
- Optimistic update for onBlur

product-helper 
- wrap withAuth in parant mutations
- deleteVariant, updateVariant, createVariant


Change from router to mutate swr in Product logic(createProduct)??
separate VariantRows from ProductTableData

update cache logic

deleteVariantButton
- fix the ugly ui of confirmantion      -HAVE IMPLEMENTED

- add srcollbar on variantTableData

product/getProductById
optimizations 
- request memoziation(react/cache)
- non-blocking deferred writes(after())

Next steps 
- one unified skeleton for [id]/page
- deleteButton for productData

variant/deleteVariantButton
- change divs to alertdialog

zod for backend actions

- VariantOptimisticAction

Fix ui of variantData

Features integration
mini stock audit log
bulk actions
intelligent low-stock thresholds

- stock threshold in salesVelocity