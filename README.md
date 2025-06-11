# AUTOMATION

This project goes through the whole login process in Notion using Google SSO, handles 2FA. Goes to the settings of your Notion page and prints all of the members you have, their names and roles in the terminal.
All of this is done using Playwright.

## Setup

For this to work you need to create your .env file in the root of your project and add these neccessary data:

```env
GOOGLE_EMAIL=<your-google-email>
GOOGLE_PASSWORD=<your-google-email-password>
GOOGLE_TOTP_SECRET=<your-google-totp-secret>
```

And you need to install all of the neccessary dependencies:

```bash
pnpm install
```

## Project

The start the project do this:

```bash
pnpm run dev
```

## My learnings

It was instructive to go through the discovery of how to go through the 2FA process in the app.

Spent some time researching how to bypass some of Googles security policies regarding automated browsers.

I became very conscious of targeting elements by attributes other than the inner text because of internationalization. For example I am from Croatia and Googles Login dialog is in my language so I cannot target that using inner text in buttons.
