# E2E test Ghost CMS App using Playwright

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

## Optional

If you don't have Ghost CMS 3.41.1 installed execute this command

```bash
docker run -d --name some-ghost -e NODE_ENV=development -e url=http://localhost:3001 -p 3001:2368 ghost:3.41.1
```

Create the admin user with the following credentials

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

4. Update the admin credentials at page-objects/config.ts file

```javascript
export const config = {
  baseUrl: "http://localhost:3001", <---- Update this
  email: "dc.sanchezm1@uniandes.edu.co", <---- Update this
  password: "$ArQ^P$Unuzj69", <---- Update this
};
```

## Running the Tests

1. Open the Playwright Test Runner:

```bash
npx playwright test --ui
```
