Clothing app

//19/06/26
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

//20/06/26
- NEW src/types/next-auth.d.ts (module augmentation so that our custom database properties can be accessed from session)
- NEW implement response in utils.ts
- NEW implement src/app/api/auth/register (same as the crumbs, include checking for existing users) 
- test the auth apis
- implement register page logic(src/app/(auth)/register), need to think about uis
- include productCode in product model
- NEW modifysku and function generateVarient in util.ts

Error - when error occurs, only showing frontend message, backend didn't go through
- Register page - add isJson to check if the data is returning correctly

// 21/06/26
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

/22/06
- implement a show password button in login/page
- change the structure according to shadcn
html changes - div to card components, Button, Input,Label
- NEW src/style/auth - include all the auth page ui class name in one file
- change the classNames in login/page



