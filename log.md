Clothing app

[19/06]
-include store model (each account with their own database)
-User model : role,stores
- Product model: storeId
- will have login and register page
- create indexes for foreign keys and createdAt for faster fetching and queries
- change Float to decimal for minimizing rounding errors
- implement singleton db(src/lib/db.ts)
- implement auth.config.ts(src/lib/auth.config.ts)
- implement auth.ts(src/lib/auth.ts)
- implement middleware.ts
- implement [...nextauth]/route.ts
- NEW sessionProvider in src/components ( get sessiondata in frontend,avoiding multiple callback to backend)
- change app/layout.tsx

[20/06]
- NEW src/types/next-auth.d.ts (module augmentation so that our custom database properties can be accessed from session)
- NEW implement response in utils.ts
- NEW implement src/app/api/auth/register (same as the crumbs, include checking for existing users) 
- test the auth apis
- implement register page logic(src/app/(auth)/register), need to think about uis
- include productCode in product model
- NEW modifysku and function generateVarient in util.ts

Error - when error occurs, only showing frontend message, backend didn't go through
- Register page - add isJson to check if the data is returning correctly

[21/06]
- NEW implement src/app/action - to store register,login,logout actions
- CHANGE register page - use new registerAction from action
- DELETE api/auth/register - because registerAction handles all from frontend
- COMPLETELY CHANGE register page - add a new button function
- all the logic will be completed in registerAction

Error - when the user enters the data and error occurs - all data are wiped
- useState for name and email, include value and OnChange on html

- NEW IDEA - TWO interfaces for users role (ADMIN AND SUPERADMIN) - HAVE NOT IMPLEMENETED YET
- change user roles to Enum 
- change user and store relation( only one-to-one)
- add storeId in user
- add users[] in store
- change auth.ts - include role in callbacks(authorize, jwt,session)
- changes in auth.contig.ts - include backend protection for admin and superadmin
- include role in next-auth.d.ts so that the entire folder knows the new type
- so auth.ts has no need for type declare at the top of its file
- changes in  actions/auth
ActionState : include fields?
registerAction: include field, have db.$transcation to be atomic , create store first then user
- change in register/page
useActionState(change from useFormState) for formAction & isPending variable
delete submitButton function and re write button
useState for storename
create a new div and label for storeName
- change in logInAction
first, get data and trim, check if null, check the email format
find the email address, different routes for users based on role, sign in
when signIn - go to auth.ts -> find email, compare the password->if wrong, return CredentialsSignIn error -> catch in logInAction error: invalid password or email
- implement login/page
useState for email
useActionState for formData


Next Step - authentication for API first in middleware, clean code in auth.config
API development
Product Implementation

[22/06]
- implement a show password button in login/page
- change the structure according to shadcn
html changes - div to card components, Button, Input,Label
- NEW src/style/auth - include all the auth page ui class name in one file
- change the classNames in login/page

[25/06]
- implement show password icon in register/page
- change html structure to shadcn
same as login/pagee
- change the className 
- Input password - change type to showPassword or not
- CHANGE auth.contig to minimal, no callback function
- implement all authenciation to middleware
- implement NEW function redirect for nextResponse.redirect in utils
- NEW variable - ROUTES to include all the routes in one place and has sublist, when one name changes, only change here\
- update matcher
MIDDLEWARE logic
- get the req url, login and role
- auth api - everyone can access
- login/register - only not login can access
- apis - only login can access
- admin routes - only admin
- superadmin routes - only superadmin
STORE API(for products)
- store doesn't have an interface so no api
- create app/api/store/products
- should not let the user enter the storeId as they can manipulate the id
- solution: when login, automatically fetch the user's storeId
- How to fetch: in current stage, auth only fetch userId and role
- first, declare the new storeId in next-auth.d.ts so that typescript knows
Changes in auth.ts
- Fetch from database: change authorize() , include storeId in return object
- jwt() -include token.storedId in callbacks:jwt(), catches the object from authorize, encrypts into edge-readable cookie 
- session() - include session.user.storeId, decrypts the cookie , exposes the selected fields to Frontend/api

NEXT STEP - check the storeId when calling apis from table
Schema Changes
-performing actions will always require storeId of the current user
- include foreign key storeId in Sales and sale[] in Store

NEW - implement lib/action-utils.ts
ActionResponse - to give the frontend consistent data format
- suceess,data and error
withStore - wrapper function that take another function as an argument and performs its function
- TArgs = any - this is what frontend will pass
- TResult - this is the backend data
- when the frontend call the action (exp..createProduct)  
- it will pass into withStore args(action=>Promise<TResult>)
- the parameters in createProduct will become args:TArgs
- here, the createProduct will wait for the withStore to finish to get <TResult>
- withStore function will return the data in ActionResponse format
- withStore function starts - get the storeId and check
- if error occurs, it will stop the function and return the data to createProduct, both createProduct and withStore is completed.
- if pass - createProduct will execute its code
- return the data and withStore is completed
- any errors - return success: false and the error

NEW create actions/product.ts - this will act as api(rather than fetching, it communicates directly with database)
product.ts
- CreateProductInput interface - the format that the front end will send
- createProduct - create the product in database
- check storedId with wrapper function withStore
- create the product with its variants
- automitically generate sku with generateVarientSku from lib/utils
- create the stocklog change
- include variantes 

Product.ts 
getProduct - fetch all the products from the storeId including variants(order-asc), start at the lastest product
- NEW implement classNames in style/product.ts - this is the main css for the product pages
- pageStyles for overall, formStyles for forms, tableStyles for tables
- include light/dark mode from shadcn
- match the styles to be relative
- install next-themes to enable themes
- implement components/theme-provider to enable the light/dark themes
- wrap in app/layout for every page to use
- implement theme-toggle in components/theme-toggle.tsx
- this is component for light/dark mode button

NEW IDEA - separate login/register page into components
- separate the original login/page into login/page and components/auth/LoginForm
LoginForm - 'use client', this is the interaction file,everything the user does is coded here, no change in code
page - this is the server side now, implement LogInForm under CardContent 
- implement className theme in style/auth
- implement themeToggle in login/page

Error - too many redirect (middleware.ts)
- forgot to return after checking if user is not logined

- do the same implementation in register/page and components/auth/registerForm


Next step - create ProductForm
[27/06]
- NEW implement components/product/ProductForm.tsx
- this will handle all the user interaction in creating a new product

- divide createProduct into createInteralProduct and createProduct
createInteralProduct - wrap in withStore,original code
createProduct - a function that calls createInteralProduct
Why split - because typescript and server wants a function when calling in frontend and createInternalProdcut is an variable to wrap the inStore function

- implement input and submitBtn in styles/product/formStyles

ProductForm.tsx
useTransition -for steamlessly transition the data and calling createProdcut action
useRouter - to refresh the page
Flow - product/page.tsx -> user wants to create a new product 
-> go to createProductForm -> enter the details 
-> call handleSubmit -> format the data exactly what createProduct action expects 
-> transition and call createProduct() ->go to createInternalProduct 
-> call withStore() wrapper -> checks the storeId first 
-> return data in ActionResponse format 
-> perform createProductInternal 
-> return the product to createProductForm -> refresh the page
Optimizations
1. Toaster - to show if the product is successfully created
- install shadcn sonner
- implement Toaster in app/layout
- richColors for green and errors, position = 'bottom-right'
- implement toast in createProductForm(import toast and add toast.erro and toast.success in handlesubmit)
2. useRef - so that the users don't have to click createProduct again and again
- import {useRef} from 'react'
- initialize the nameInputRef
- after creating product in handlesubmit, call nameInputRef to focus on the first input for next entry
- include ref ={nameInputRef} in field of name
3. Logic check - costPrice <= selling price
- check the logic before transitioning to database
- return if not match so that it will not go through database

-NEW implement components/product/CreateProductDialog
CreateProductDialog - a popup page  where user click create new product-> call createProductForm
- implement dialog interface

-NEW implement products/page
Error - too many redirects

[30/06]
- fixed a problem where logging in cause too many redirects
- change the callbacks into auth.config since middleware reads from there
- the cookie has role after the changes in auth.config ,still redirect
- change the public route to dashboard/product
- chagne admin route to (admin) and all subsuquence routes
NEW FEATURES
<Search Filter>
1. SearchInput - for url trimming and adding a search box
- useRouter for redirecting the pag
- useSearchParams for the url searching
- useTransition for pending state and router to replace the url
- use searchStyles from style/product
- use shadcn for ui , include a submit button
Flow - users type something, click enter -> goes to handleSubmit -> prevents reloading -> search the params -> isPending -true -> replace the router url

2. Changes in action/product/getProduct - add a searchQuery
- allows getProductInternal to include a searchQuery params, change getProduct from undefined to searchQuery

3. Changes in page - implement search filter
- NEW interface ProductsPageProps for the search filtering
- first wait to get the params, search and return the product

[01/07]
<Optimizations>
1. add index([name]) in product model to save time
2. Add Suspense state for ui optimization
- add skeleton from shadcn
- TableSkeleton - this is the dummy version of table before fetching for actual data
Changes in product/page - separate into two function(page(for static)and ProductTableData(for actual data))
ProductsPage - include title and headers and search button
- have a suspense state so that when the data is fetching, it will falllback to TableSkeleton, otherwise go to ProductTableData
ProductTableData - this is the actual data fetching
- map the product id 

Final flow of product page 
when user first arrives the page -> load the static page which include headers
-> then the suspense will load the dummy data from skeleton
-> if data fetching is finised in backend, load ProductDataTable
-> if click add product -> createProductDialog -> createProductForm -> enter the details -> createProductInternal ->withStore -> goes back
-> if search -> searchInput -> getProduct(query) -> withStore -> after the data is fetched -> changes in suspense state -> call ProductDataTable

<Error in CreateProductForm>
- cannot create a new product
1. Async Event Crash -  server actions are asynchronous so when backend respond, the e.target.value is already gone
Solution - add a permanent pointer to form DOM formElement, change to formData.reset() in createProductForm

2. String SKU bug - can only create one product sku
- beacause of single quote in generatesku
Solution - change single quote to backticks` in generateSKU

3. Nextjs Serialization - prisma have data types like decimal while nextjs only has simple js primitives
- map the product and change their values for decimal
- return the new changed variable
- change in createProductInternal and getProductInternal


<Pagination on Product/page>
1. Update the backend engine - getProduct & getProductInternal
- update the params to searchQuery,page,pageSize in getProductInternal
- intiialize the whereclause in one place since we use in both getting the product and the pageCount
- change the product to include rawProduct and totalCount
- use Promise.all to fetch the products and total simulatenously
- include Prisma features, take(how many to grab) and skip(how many to jump)
- then count the total pages
getProduct - change to include all the params
- default page to 1 and size to 10

2. Update the frontend - Product/page
- extend ProductsPageProps interface to include page number
ProductsPage
- variable for current page
- update the suspense key to include currentPage
- update ProductTableData to include page
ProductTableData - will now include the page
- variable for page size
- getProduct include all the params
- totalCount - total numbers of products
- totalPages to calculate the number of pages needed
- Footer at the bottom if totalPages > 1

3. Pagination Footer - this is for the display of the footer
- take two params - currentPage and totalPages
- router to redirect the page and searchParams for url
- button click - change to either page-1 or page+1
Flow -> user click previous->page-1 -> handlePageChange -> clone the current url ->update only the page ->  then router push that page

[02/07]
<Category Filter>
Prisma Update
- include category in index for faster fetching

1. Backend Update - getProductInternal and getProduct
getProductInternal - include category in params
- add category to whereClause
getProduct - include category

2. fetch the Categories - actions/product
getCategoriesInternal  - wrap with withAuth and check the storeId first
- find the unique categories using distinct, select only categories for fast fetching
- then map the categories
getCateogries - call getCategoriesInternal with empty list

3. CategoryFilterBar - UI for the category row
- router for pushing, params for reading url, transition for displaying isPending state
- CategoryFilterBarProps - interface include category and selectedCategory
- filter categories for string
- change the state of page after clicking the button, while fetching , show transition state
- onMouseEnter - while user hovers over a button, go and prefetch that category, do not show yet

Styles/product/categoryFilterStyles
- flexible style for categoryFilterBar ui

4. Final Product/page
ProductsPageProp - include category
ProductsPage - check if any category is selected using params
- get back the response from getCategories
- check if there is data or not, if data -> get the data, if not -> empty
- filter out the array to be only string since typescript need explicit types
- add the CategoryFilterBar with categories and selectedCategory
ProductTableData - include category in params

Final Flow -> user enter the page -> categories -> getCategoriesInternal -> withAuth -> get the categories
-> filter to string -> CategoryFilterBar -> display the categories
user hovers over a button -> prefetch the categories -> click-> page change

Error - when click to category, showing all products
Cause - forget to add category in ProductTableData
Solution - call category={selectedCategory} in ProductTableData
- change the suspense key to include selectedCategory
- change whereCaluse category mood to mode
- CreateProductInternal -> trim and lower the category to be consistent

createProductForm
- optimize the ui

<Sorting>
1. BackEnd Update - actions/product
interface getProudctProps - to type cast all the params
- include sortBy and sortOrder params in both getProductInternal & getProduct
- sortBy is default to createdAt
- FOR NOW, valid field is name only
- check if the sort Field is valid or not
- update rawProducts to include orderby

2. SortHeader - UI for sorting
interface SortHeaderProps - for label and key
- check the current sortBy and order
- implement logic -> desc -> click -> asc
- getSortIcon -> show arrow according to asc or desc
- handleSort -> change the url when click
- handlePrefetch -> if user's pointer on the arrow, prefetch next state

3. FrontEnd - Product/page
ProductsPage
- update PrductsPageProps to include sortBy and sortOrder
- get the current sortBy and sortOrder
ProductTAbleData
- update the interface
- update the params
- add sortHeader in name tableHead for now

Final Flow -> enter the page -> get the current sortBy and sortOrder 
-> call ProductTableData -> getProduct -> sortHeader for display
if user click-> sortHeader -> handleSort -> url change -> re render ProductTableData -> getProduct -> change the sortHeader icon

[03/07]
<Product Table with Expandable rows>
Core Parent Row - shows the high-level info
children row - shows variants 

1. Schema Changes 
- add totallCoutn in Product Model(defalut 0) to count all the total Stocks

2. Split Page into ProductsPage and ProductTableData
- implement ProductTableData in separate components since the users will interact with this
- ProductsPage remain static and call ProductTableData in footer

3. tableStyles - styles/product
- update and optimize tableStyles to fit the new subrows
- has two new suboptions
- variants and subrows

4. ProductTableData - components/product/ProductTableData
- strip async from ProductTableData since client actions are not allowed in this state
useState for storing the state of expandedRows(to know if the user click the expand or not)
Fragment - shadcn doesn't allow <div> inside <TableBody> so we use React Fragment to not break the structure

useSWR - to dynamically handle the state and effects inside of manually tracking the useState and useEffects
- cacheKey to monitor browser memory and store memory
- Initially , the cacheKey is empty -> user calls -> place in memory
- if user calls again -> SWR looks in cacheKey first -> if exists, 0ms delay
- if not, go and fetch in database and store
three params - data -> this is the database data
             - error -> catch any errors
             - isValidating -> true/false -> load fresh data

isInitialLoading - very first fetching state -> cachekey is empty
isSyncing - means it is fetching data since there is no match in cacheKey

Build Dynamic Structure - to show summary of size and colors in parent row
totalStock  
- find the variants -> two variables sum and its count -> add its count to sum ->if no stock -0->if no sum-> 0-> move to next variant using reduce -> if no variants 0
uniqueSizes 
- map product variants to its size -> filter if true or not ->
turns into Set so that there is no duplicate -> turns the set into Array
SizesList - if length>0 -> join with ,
uniqueColors - same with uniqueSizes
colorCounts - length of uniqueColors
- render the ui of variants and stock

StateManagement - toggleRow - checks if user expanded the rows or not
- useState for expandedRow -Record, keys- string and value: boolean
toggleRow - checks for productId
- check the prev state of the expandedRow 
- copy all the currently open rows
- find the specific Id and flips its value
- update the expendedRows by checking the prev state

How Table works
-  isSyncing, show the Refershing produts..
-  isInitailLoading - cannot interactive with the table and lower the opacity
- shows the Table
TableHeader 
- add toggleColumn for the interactive button
- Product Name with sortable button
- Category
-Variants & stock
- Price

TableBody 
- check if there is data first, if not -> no products found
- map the products so that the products will loop and show their details
- check if the product row is expended or not
- Fragment since we will be using div for variants & stock
- key would be productId
Mapping of ProductDetails
- trigger button for expanedrow -> onClick call toggleRow with its id
- check if the product is expanded -> change icons according to it
- productName and code
- category with upper letters
Variants and stock - calculate first
- if stock<5 red color, show totalStock
- Sizes with SizeList
- number of Colors
Pricing - show the very first variant price in string with decimal of 2

Variant Table - if a product is expended and has variants
- Layers to divide between variants
Headers - SkU,Size,Color,Current Stock and Price
VariantBody - map the variants and loop
- sku,size
- match the color text with its color in background
- stock 

Footer
- call PagniationFooter

DataFlow 
user in page -> call ProductTableData -> initial stage -> change in parameters -> useSWR -> cache Hit -> ui renders -> cache Miss -> fetch database
 
Row not expanded ->user clicks toggleButton -> toggleRow -> isExpended -> show the variants table
Row expanded -> users clicks toggleButton-> toggleRow -> isExpanded false -> no variants table

[05/07]
<Logic Changes in ProductTableData> 
- implement a stockchange function so that it can used for other actions too

1. syncTotalStock - actions/product-helper
aggreation - sum all the stock in the variants
exactStock - to safeGurad against the null values
- then update the totalStock in product
- return the total stock

2. updateVariantStock - actions/variant
UpdateVariantStock - take two params -> variantId and newStock
- check with withStore first to make sure of storeId
- update the variant stock
- call the syncTotalStock

3. ProductTableData
- import mutate from swr to refresh the layout
- import updateVariantStock
Product Table - change the totalStock from reduce to product.totalStock
Variant Table - change the stock column
- include a input column whose defalut is variant.stock
onBlur 
-> fires network request when the user types and click away from stock 
-> get the new stock number
-> if no newStock or the same as the previous -> return
- if not, call updateVariantStock
- if success -> refresh the page with mutate(cacheKey) to auto change the total Stock
- if error -> alert the error and stock to the original stock

Flow -> user changes the stock -> click away -> onBlur -> updateVariantStock -> syncTotalStock -> mutate and refresh

<Optimizations>
1. product-helper
- add $transcation to prevent race condition and ensure atomic integrity

[06/07]
<CreateNewVariant>
createVariant -> createVariantForm -> createVariantDialog -> ProductTableData

1. createVariantInternal - actions/variant
interface CreateVariantProps - to initial the type of the params
CreateProductInternal - call database to create a new variant
- wrap with withStore to check the storeId first
- find the product first
- if no -> error and return
- get productCode from the parentProduct
- generate sku from the internal function
- both create the variant and sync the totalstock at one transaction to ensure atomic integration
- create the new variant, trim the size and color, stock should be no less than 0
- serializedVariant -> jsontify the variant for the server to read
- sync the toalStock

2. Styles/variant   - implement ui for form and dialog
- formStyles for the form - wraps the buttons to make sure they stay at bottom
- dialogStyles - just the header and shell of form
- both responsive ui

3. CreateVariantForm -  users types the details and upload to database
- useState for errorState
- useTransition for smooth transition between calling database and ui
- useRef for auto focusing on size
- CreateVariantFormProps - to initial types of params
HandleSubmit 
- get the data directly as html element
- prevent the data from going back to default/clearing
- get the formElement and formData
- breakdown the data into their respective types and modification
- logic check -> needs size,color, costPrice, price and stock
- price should be lower than costPrice
- if all passes, the state will transition
- call the createVariant function
- check for error
- if success -> mutate the key from cache so that the ui instantly update
- reset the form
- refocus on the size
UI - implement formStyle

4. createVariantDialog  - only contains the header and shell for form
CreateVariantDialogProps - initialize the type of params
- doesn't include the trigger in dialog because it broke in main page
- when opening the dialog -> autoFocus on size field
- prevent the fields from clearing or going back to default
- have headers
- call CreateVariantForm if the dialog is open

5. ProductTableData     - implements dialog button
- useState to handle if the dialog is open or not
VariantTable
- at the bottom of the table - add a row for addNewVariant button
- the trigger is handled here, if click ->set variantOpen to true
- outside the variantTable -> mount the createVariantDialog

Flow -> user arrives at the page -> extends the productRow -> call VariantTable -> show the content -> at the bottom, have add New variant button -> user Clicks -> setOpen = true -> createVariantDialog -> createVariantForm -> user enters the details -> createVariant -> finished updating -> user cancel the dialog -> mutate calls the key -> show the new variant in the table


[09/07]
- change middleware matcher

[10/07]
<Split ProductTablelData into two components> - products table,variant table

[12/07]
<Sorting and Filtering>

[13/07]
<delete variant>

[15/07]
<edit variant>

[17/07] 
<productID page>

[18/07]
<productData and getProductById>
<edit product and updateProductAction>

[24/07]
<delete button> - both frontend and backend
<types/productdata> - for easier type script
- separate productDetails into editDialog/form and main productDetails

[27/07]
<Optimizations for editForm>
----

[25/08]
<VariantData>
<product/[id]/page>