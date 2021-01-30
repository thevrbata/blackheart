### Overview
Widget for tarkov.help site, checks if streamer(s) online and show it in frame on right bottom corner of page

You need Twitch Dev app registration, collect from API ypur personal Bearer Token (please, use your own) and change Client ID and Bearer Token in code.

TODO: Exclude auth data from code, streamers array from code, parent in frame from code

### Minify js
```bash
terser --compress --mangle --output blackheart.min.js -- blackheart.js
```

### Usage
Add to head section:
```html
<link rel="stylesheet" href="https://thevrbata.github.io/blackheart/blackheart.css">
```
Add to body
```html
<div id="stream-widget"></div>
```
Add to footer
```html
<script src="https://thevrbata.github.io/blackheart/blackheart.min.js"></script>
```
