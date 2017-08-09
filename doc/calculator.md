JavaScript Calculator
=====================

[IMAGE](LINK)

  #JavaScript #QUnit #CSS

## Description

I wanted to make a calculator that acts exactly like a simple desktop calculator.  It needed to operate naturally and be able to keep a running tally.  These requirements meant 1) no Reverse Polish Notation, and 2) no `exec()`.

After working out a rough first draft, I realized how convenient it would be to have a suite of fundamental tests to run on the logic.  Punching out a sequence of keystrokes each time was not just random but also tedious.  Hence, my entry into the land of unit testing.

## Execution

When a user hits a button, a string is passed to `sendKeyPress()`.

<pre class="prettyprint linenum">
sendKeyPress()
</pre>

`sendKeyPress()` then sets off a chain reaction.  First, `identifyKeyPress` assigns the proper value to the `key_press` instance variable.  `routeKeyPress` then calls one of several functions, depending on the type of key pressed (number, operator, square root, etc.).

<pre class="prettyprint linenum">
routeKeyPress()
</pre>

If a number was pressed, `setNumber()` decides whether the number should be appended to the current register, or sent to the next register, using a `switch` statement.

<pre class="prettyprint linenum">
setNumber()
</pre>

If an operator was pressed, `setOperator()` decides whether to fill the next operator register with the operator, or to run a calculation loop.  This is where things get complicated, due to order of operations.  Since multiplication and division take precedence over addition or subtraction, if a sequence like `1 + 2 * 3 *` is entered, the `2 * 3` should be evaluated, but not yet added to the 1.  It should end up like `1 + (6 * ...)`.  However, if a user enters `1 + 2 * 3 +`, the `+` should trigger a complete calculation.  First, the expression becomes `1 + 6 +`, and then it becomes `7 + ...`.

My best solution so far is to use a bunch of if-else statements within `setOperator()`'s `switch` statement.  It's not pretty, and at some point I would like to refactor this, but it currently gets the job done.
