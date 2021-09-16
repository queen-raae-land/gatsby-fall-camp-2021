# Gatsby Fall Camp 2021 Demo

This is the demo code from my talk about Gatsby Functions at [Gatsby Fall Camp 2021](https://queen.raae.codes/gatsby-fall-camp-2021/).

It demos how to charge money for time traveling using Stripe, and then letting the travellers know if they found the princess or not using SendGrid.

Who is this princess, why time travelling? Sign up for [the backstory](http://queen.raae.codes/ruby/) via email.

Get notified about up-coming plugins, workshops, streams and future articles to help you get the most out of Gatsby by [signing up for emails from yours truly](https://queen.raae.codes/emails/).

## Development

1.  **Add env variables**

    Copy/paste `.env.example` into `.env.development` and add your own values.

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    npm run develop
    ```

1.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!

    Edit `src/pages/index.js` to change the form, and `src/pages/sucess` to change the sucess page.

    The functions are running at

    - http://localhost:8000/api/stripe-webook
    - http://localhost:8000/api/time-travel

    Edit `src/api/stripe-webhook.js` and/or `src/api/time-travel.js`to change them.

1.  **Learn more from Gatsby**

    - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Tutorials](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Guides](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
