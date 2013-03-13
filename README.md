# Add to Wunderlist - shared extension code

========================

This is the repository for the shared code between the Add to Wunderlist browser extensions for Chrome, Safari and Firefox. This project is based on the work of [Buffer](https://github.com/bufferapp) - props for open sourcing!

## How to add an "Add to Wunderlist" button for any site

First, fork this repository. If you're not sure how to, [this guide will teach you](https://help.github.com/articles/fork-a-repo). But be aware, this repo is only the shared code between the browser extensions - to actually run and develop locally you also have to fork the extension code for [Chrome](https://github.com/6wunderkinder/wunderlist-chrome-extension), [Safari](https://github.com/6wunderkinder/wunderlist-safari-extension) or [Firefox](https://github.com/6wunderkinder/wunderlist-firefox-extension), which includes this repo as a submodule.

Second step is to add an injector in Injector.js, which is split into two parts - an url validation rule and an injector callback function. Look at the existing examples and extend them with the site you want, by first creating a new rule for when to activate the injector, and then adding a callback that actually injects the button the site.

If your injected button needs site specific styling, put this in  css/styles.css, following the existing formatting.

Next thing to do, if needed, is to add a custom scraper. By default, we scrape the site for OpenGraph, TwitterCard and meta tag data to create the task and note to be created. But in some cases you might want to change the way the data is formatted, or simply grab another piece of information from the site.

In Scrapers.js, add another url validation rule and extend the Scrapers object with a custom callback, that should return the data object to be added. This file is full of examples, so look around to see the options for how to best scrape for the information you need.

Last step is to submit a pull request. We look forward to your contribution!

## Roadmap

- Simplify and clean up general structure
- Add headless browser tests for injectors

## License

Extending on Buffer's work with the same licensing, MPL 1.1/GPL 2.0/LGPL 2.1.
