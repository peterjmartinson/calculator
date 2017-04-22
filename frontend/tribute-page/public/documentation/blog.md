## Don't be lazy, dare to be Semantic! The Free Code Camp Tribute Project

[Chingu Cohorts](https://tropicalchancer.github.io/projectus/) is a fantastic subgroup of [Free Code Camp](https://www.freecodecamp.com). They set up collaborative programming experiences among members of FCC on a roughly monthly schedule to help them develop their professional coding abilities. I have been taking part for the last two months or so, and have met great people, put together a solid project ([/pengo](http://pengo.herokuapp.com)), and generally learned a ton.

This round, I signed up for the [FCC Speedrun](https://medium.com/chingu-fcc-speedrun). The goal is to complete all the FCC projects in five weeks. I may not acheive that goal, but set a few additional goals for myself.

1. Create a standard "boilerplate" semantic webpage structure that will get improved each project.
2. Learn to do [unit testing](http://qunitjs.com/intro/), and [test driven development](http://mochajs.org/) in general.
3. Come to love [CSS](https://css-tricks.com/).
4. Develop a sustainable workflow that I can apply in a professional setting.

I just completed the first project - the [Tribute Page](https://www.freecodecamp.com/challenges/build-a-tribute-page). Two aspects I'll discuss here are semantic design and using JavaScript for static webpages, i.e. "why use JavaScript for static webpages, Peter!?"

## Semantics

[Semantics](http://html.com/semantic-markup/) is a fancy name for the proper user of HTML in a webpage. Semantics means using the right tags for the right situation. It helps someone read the code and figure out what's what, but also helps automated web crawlers identify specific pieces of information. HTML5 introduced many new tags, like `<article>` and `<figure>` that offer more descriptive markup.  When designing webpages, I usually find I need tags that don't exist. Tags like `` or `` - not the `` that shows up in the page tab, but a title splash area. But, it's ok in these cases to just add either `class` or `id` attributes, or to just be creative. For example, my title splash zone is denoted as a special `<section>` above the main `<article>`.

```html
<section>
  <h1>Adolf Seilacher</h1>
  <span>(March 15, 1925 - April 26, 2014)</span>
  <h2>Linked the deep ocean with prehistoric life</h2>
</section>
<article>
  <section>
    It is said that old warriors never die, they just fade away.
    ...
```
At the bottom of the page, I put a standard footer that will appear (better and better!) in each project. Each is inside its own `<div>` and placed appropriately using specific `class` attributes.

HTML:
```html
<footer>
  <div class="copyright">Â© 2017 Peter Martinson</div>
  <div class="github"><a href="https://github.com/peterjmartinson/chingu-fcc-speedrun-challenge/tree/master/frontend/tribute-page">FCC : Tribute 1.0</a></div>
  <div class="license">MIT License</div>
</footer>
```
CSS:
```css
footer .copyright {
  width: 32%;
  text-align: left;
  padding-left: 1%;
}

footer .github {
  width: 33%;
  text-align: center;
}

footer .license {
  width: 32%;
  text-align: right;
  padding-right: 1%;
}
```

## JavaScript

I chose to put only the footer in `index.html`, but the rest of the page is injected from `app.js`.

```javascript
var output = '';

output += '<section>';
output += '<h1>Adolf Seilacher</h1>';
...
var tag = document.getElementById("app");
tag.innerHTML = output;
```

Why? There are a couple reasons, besides the fact that I like doing things the hard way, to learn. First, reusability. All future pages can use the same basic `index.html` and CSS, but will need their own `.js` file. Ultimately, all these pages will be loaded dynamically into a portfolio page, and I think it will be useful to have them already JavaScripted. Second, proof of principle. I'm not using a framework because I want to force myself to get deep into JavaScript. I'll use some jQuery, but want to try to limit that to AJAX stuff and whatever may get crazy across sundry browsers. Third, testing. Though there is no test here, I want to begin implementing unit tests, which means you *need* your pages to be slapped in with JavaScript.

That's it. Go see the finished product in [CodePen](http://codepen.io/peterjmartinson/pen/JKWVxO), and the source code at [GitHub](https://github.com/peterjmartinson/chingu-fcc-speedrun-challenge/tree/master/frontend/tribute-page).
