1. The responsive stuff
2. Trying to make it modular/extensible
3. What you did to make it semantic


FCC Portfolio: the Secret to Responsiveness
===========================================

[IMAGE: RESPONSIVE PAGES]
/#html /#css /#javascript

## Design Parameters  

My old portfolio stank, so I decided to try to clone one that was beautiful.  My attempt is far better than what I had before, but still a pale comparison to my exemplar:  [Eina Onting's Portfolio](LINK).

Depending on the device, I wanted to emulate some specific features.

Mobile:
1. Simple header with my icon and name
2. Footer with links to my web presence and my email address
3. A navigation bar that sticks at the bottom of the page - no hamburgers!

Desktop:
1. A navigation/header section on the left with all relevant links and my icon
2. Footer that is nearly identical to the mobile version
3. No navigation bar

## Execution

It's not too difficult to make a page responsive, but there is a secret.  First, design the CSS for mobile. Then, add a `@media` query that modifies the relevant tags when the screen reaches a width threshold.

```JAVASCRIPT
@media all and (min-width: 720px) {
  ...
}
```

The secret sauce is in the HTML.  Between the head tags, you need the following:

```HTML
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

Now, the page will scale properly to the device, and everything else is easy. 


[Live Version](LINK)
[Source](LINK)
