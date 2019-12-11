#!/bin/sh
# this is a script that will generate a lot of random product data for your demo
node data/data-reset.js
node data/fake-users.js
node data/fake-books.js
node data/fake-authors.js
node data/fake-reviews-a.js