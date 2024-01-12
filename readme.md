### This is John:
![image](https://github.com/TonySapa/typescript-node-api-boilerplate-crud/assets/49716479/9ecd0b2b-4ee4-4d92-a060-f99377fe8e02)

Whenever John starts a new API with Node he always clones the coolest over-engineered external boilerplates found on Github.

### And this is Tony:
![image](https://github.com/TonySapa/typescript-node-api-boilerplate-crud/assets/49716479/b48c974c-9f30-4860-8a2d-e5035a1e22b4)

Whenever Tony starts a new API he does it from scratch. Maybe because of pride, or in order to have control over dependencies, or maybe because he just relies on scripts and vscode snippets to achieve same speed of development instead.

But Tony decided to create his own boilerplate and...

### Now Tony is more like John
![image](https://github.com/TonySapa/typescript-node-api-boilerplate-crud/assets/49716479/4820912c-c89e-46c1-b503-374a7f77c8a1)

With an ultra-light, unopinionated and relatively easy to maintain boilerplate to build Express APIs.

#### Folder structure
```
...
├───src
│   ├───controllers
│   ├───domain [*1]
│   ├───labels
│   │   └───api_messages
│   ├───middlewares [*2]
│   │   ├───authentication
│   │   └───error_handling
│   ├───models
│   │   ├───entry
│   │   └───user
│   ├───utils
│   └───views
│       ├───html
│       └───json
├───tests
│   ├───automated
│   └───manual [*3]
│       ├───entries
│       ├───ping_routes
│       └───users
...
```
[1] So your company have 3 type of user accounts: "Freepsters", "Floofies" and "SuperPremiumFloofies". Naming was the decided by Mr.MarketingDude. But today, the aforementioned Mr.MarketingDude decided to revoke permissions and functionalities for "Floofies" and make it available only for "SuperPremiumFloofies". Oh, and by the way! Don't forget "Freepsters" type of account will not even exist on next release. You get what I'm saying. Business logic are always subject to change and better be re-factorized, without that necessarily meaning you are compromising to any type of architecture. You can name this architecture as you want, as for now, lets name it "pragmatic-mrmarketingdude-lover-patterns".

[2] Full-scope middlewares for error-handling and authentication. Both are application-level middlewares binded to the app object instance.

[3] [*.http] files for manual testing the API using vscode extension REST Client  v0.25.1 You might like it more than Postman (for specific use-cases) if you give it a try. 🤫

#### Dependencies and tools

##### Development environment
| Dependency | Version | About |
|-|-|-|
| [eslint]('https://github.com/eslint/eslint') | ^8.0.1 |ESLINT is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. In many ways, it is similar to JSLint and JSHint with a few exceptions: ESLint uses Espree for JavaScript parsing. ESLINT uses an AST to evaluate patterns in code. ESLint is completely pluggable, every single rule is a plugin and you can add more at runtime.
| [cross-env]('https://github.com/kentcdodds/cross-env') | ^17.0.0 |Run scripts that set and use environment variables across platforms. cross-env makes it so you can have a single command without worrying about setting or using the environment variable properly for the platform. Just set it like you would if it's running on a POSIX system, and cross-env will take care of setting it properly. |
| [jest]('https://github.com/jestjs/jest/tree/packages/jest') | ^29.7.0 |🃏 Delightful JavaScript Testing *�🏻‍💻 Developer Ready: Complete and ready to set-up JavaScript testing solution. Works out of the box for any React project. *�🏽 Instant Feedback: Failed tests run first. Fast interactive mode can switch between running all tests or only test files related to changed files. *� Snapshot Testing: Jest can capture snapshots of React trees or other serializable values to simplify UI testing. Read More: https://jestjs.io/ |
[supertest]('https://github.com/visionmedia/supertest')|^6.2.2|The motivation with this module is to provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent.
| Others ||Other dependencies are dependent of the above, such as eslint plugins. Or are obviated obviated from the list for being core packages, such as typescript package itself.


##### Production environment
| Dependency | Version | About |
|-|-|-|
[axios]('https://github.com/axios/axios')	|^1.6.5|Promise based HTTP client for the browser and node.js Features: Make XMLHttpRequests from the browser. Make http requests from node.js Supports the Promise API. Intercept request and response. Transform request and response data. Cancel requests. Automatic transforms for JSON data. 🆕 Automatic data object serialization to multipart/form-data and x-www-form-urlencoded body encodings. Client side support for protecting against XSRF
[bcrypt]('https://github.com/kelektiv/node.bcrypt.js')|^5.0.1|A library to help you hash passwords. You can read about bcrypt in Wikipedia as well as in the following article: How To Safely Store A Password
[cors]('https://github.com/expressjs/cors')|^2.8.5|CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
[dotenv]('https://github.com/motdotla/dotenv')|^16.0.0|Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.
[express]('https://github.com/expressjs/express')|^4.17.1|Fast, unopinionated, minimalist web framework for Node.js.
[jsonwebtoken]('https://github.com/auth0/node-jsonwebtoken')|^9.0.2|An implementation of JSON Web Tokens. This was developed against draft-ietf-oauth-json-web-token-08. It makes use of node-jws
[mongoose]('https://github.com/Automattic/mongoose')|^8.0.4|Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports Node.js and Deno (alpha).
[mongoose-unique-validator]('https://github.com/blakehaswell/mongoose-unique-validator')|^4.0.0|mongoose-unique-validator is a plugin which adds pre-save validation for unique fields within a Mongoose schema. This makes error handling much easier, since you will get a Mongoose validation error when you attempt to violate a unique constraint, rather than an E11000 error from MongoDB.

### What are you doing here anyway?

This repo is just a personal project to use as a template or as a quick URL to showcase how I approach the first steps when building an API. I'm not expecting anybody to land here, but if you did, enjoy it! If you were looking for an over-engineered and production-ready boilerplate with 100 dependencies ask John! 🤷‍♂️🤘
