# Discord Glitter
🌠🎇 Animated text messages for your Discord server.

> As one can imagine, this bot doesn't really work in practice since Discord rate-limits requests to its API. That said,
it can yield some nice results for short animations with low frame rate.

# Setup & usage

Add Glitter to your npm project:

```bash
npm install --save discord-glitter
```

Create an `index.js` file with the following contents:

```javascript
const Glitter = require('discord-glitter');

const glitter = new Glitter({
    token: 'your_secret_token',
    //prefix: '@g', /* Custom prefix for bot commands. */
});

glitter.start();
```

# Adding custom animations:

If you wanna try to add a custom animation, you'll need to clone this repo and  extend
[`lib/frame-generator.js`](./lib/frame-generator.js). You will need to add a new key to `AnimationTypes` object and
handle appropriate logic in `generateFrames(...)`. 
