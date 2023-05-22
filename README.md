# E2E and Visual regression testing Ghost CMS App using Playwright

This project demonstrates the use of Playwright to E2E testing on the Ghost CMS application.

## Project Information

- University: Universidad de los Andes
- Project: E2E testing of the Ghost CMS application

## Members

- David Sánchez
- Juan Chiroque
- Diego Correa
- Julio Cardenas

This project aims to test the Ghost CMS application using E2E tests.

## Prerequisites

- Google Chrome browser
- Docker
- Ghost CMS 3.41.1
- Ghost CMS 4.44.0

Install the version 3.41.1 of Ghost

```bash
docker run -d -e url=http://localhost:3001 -p 3001:2368 --name ghost_3.41.1 ghost:3.41.1
```

Create and admin user at (http://localhost:3001)[http://localhost:3001] with these credentials

```yaml
email: "dc.sanchezm1@uniandes.edu.co"
password: "$ArQ^P$Unuzj69"
```

Install the version 4.44.0 of Ghost

```bash
docker run -d -e url=http://localhost:3002 -p 3002:2368 --name ghost_4.44.0 ghost:4.44.0
```

Create and admin user at (http://localhost:3002)[http://localhost:3002] with these credentials

```yaml
email: "dc.sanchezm1@uniandes.edu.co"
password: "$ArQ^P$Unuzj69"
```

## Installation

To set up the project on your local machine, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/dcsm8/uniandes-playwright
```

2. Navigate to the project directory:

```bash
cd uniandes-playwright
```

3. Install the required dependencies:

```bash
npm install
```

4. Update the admin credentials if you used another email or password at page-objects/config.ts file

```javascript
export const config = {
  baseUrl: "http://localhost:3001",
  email: "dc.sanchezm1@uniandes.edu.co",
  password: "$ArQ^P$Unuzj69",
};
```

5. install playwright

```bash
npx playwright install
```

## Running the E2E Tests

1. Open the Playwright Test Runner:

```bash
npx playwright test --ui
```

2. Run V3 and V4 tests

## Running the Visual regression tests

1. Execute the script

```bash
node .\regression-testing\index.js
```


## Tests folder structure

tests
|   
├───apriori
│       page.spec.ts
│       post.spec.ts
│       staff.spec.ts
│       tag.spec.ts
│       
├───pseudo-random
│       page.spec.ts
│       post.spec.ts
│       tag.spec.ts
│       
└───random
        page.spec.ts
        post.spec.ts
        staff.spec.ts
        tag.spec.ts