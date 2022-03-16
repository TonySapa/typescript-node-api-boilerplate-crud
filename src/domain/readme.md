# What's on "domain" folder
All info related to business logic. The goal is to extract any business related data and logic from the rest of the code.
Ideally, any change on business logic should not break the app. By changing content inside this folder the rest of the app should stay operative.

## Examples
Constants, functions or documentation of:
- Types of user account or subscription.
- Features of the app available for each type of user.
- Any other part of the code that is specific to the business domain and is subject to change at any point.