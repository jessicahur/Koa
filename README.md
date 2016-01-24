## Express Alternative: Koa

### The Down Side
I started using Koa after I have used Express, and the transition was not easy. Here are the reasons why:

1. I was so used to having router and static file serving as already-built-ins with Express.When I found out that Koa came bare-boned (it makes you think that it's just an empty application) and I have to look for the appropriate packages that can serve my purposes, I was quite upset: I had to google the packages, read their documentations, run npm, and import them into my app.

2. I was not clear on how Promises and Function Generator work since I have never used ES6 before, thus, I struggled with writing a simple router module with yield promises.

### The Up Side
I spent a few days hating Koa until I finally had a chance to look at many examples of how awesome Promises and Function Generators are, and also read on analyses of programmers about Koa. I changed my mind. After all, the developer behind Express built Koa as a separate framework for several good reasons. Here are the advantages that I think Koa has over Express:

1. Since Koa comes bare-boned, it's extremely light-weight. I was surprised at how fast npm installed Koa. It was significantly faster than installing Express. This also gives you the advantage of installing only the modules you need. Come to think of it, there are probably many other built-in functionalities of Express that I haven't used in my Express-running apps.

2. It was not very clear in my code since I didn't need many layers of callbacks, but if you write a router that involves several callback functions, you may very well end up with a pyramid of doom. Even if you try to flaten you code with wrappers, the error handlers may very well be called several times, making your code look not very D.R.Y. Also, your code will look much longer and verbose compared to a piece of code that use Promise libraries. Also, with yielded promises in Koa, you can chain the operations.

3. Function generator makes it possible to have several async calls in a synchronous way in Koa. I can yield many promises, then combine them all to perform a final operations, or call yield next to pass the control to the downstream middlewares and resume where I left off once the final middleware has run.

### Conclusion
Due to my limited experiences with Koa and ES6, I could only come up with three. It's a shame since I'm sure that it's just the tip of the iceberge.If given a choice, I'd choose Koa over Express just so that my code will look flatter, cleaner, shorter and more flexible. I'm also looking forward to learning more about ES6 Promises and Function Generators and being able to apply them with ease. Hopefully such day is not far away!
