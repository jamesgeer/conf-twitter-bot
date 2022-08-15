# Conference Twitter Bot

## Scheduling Tweets about Papers and Presentations with Ease

The Conference Twitter Bot is a system to run Twitter accounts for
academic conferences and workshops. The main aim is to support
you in selecting and curating Tweets to advertise and promote the research
presented at an event.

Instead of giving the authors exposure at a single point in time in the year,
we want to help others to find research more easily by making it available
on platforms such as Twitter.

The key features are:
 - retrieving paper details from platforms such the ACM Digital Library and Researchr.org
 - composing tweets for papers with customizable templates
 - scheduling them tweets in relatively regular intervals to avoid overload and encourage engagement

### Build With

To simplify development, this project tries to stick to a few basic technologies:

 - TypeScript as language for frontend and backend
 - JQuery and Mustache templates on the client
 - Node.js with [Koa](https://koajs.com/) on the server
 - Jest for testing
 - npm for building

## Current Feature List

 - ACM DL and ResearchR scrapper to extra paper details
 - data and configuration is stored in JSON files
 - Tweet composer, that uses customizable Mustache templates
 - Image generator to make tweets more informative, currently it uses title, author names, abstract, and other information, for instance the next submission deadline. The images are created right in the browser WYSIWYG
 - a queue of scheduled tweets, and a list of past tweets
 - automatic tweeting using the Twitter API
 - schedule generator based on a Tweet every n-days, in a certain time range
 - password-based authentication, but basically a single-user system
 - support for multiple Twitter accounts, each with its own, separate Tweet queue

## License

Distributed under the MIT License. See `LICENSE.md` for more information.
