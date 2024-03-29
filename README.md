# Squid Game Grid

A simple web representation of the Squid Game Grid.

[The demo can be found here](https://andhw.github.io/squid-game-grid/).

Designed to be responsive.

Just a POC, the code is not very nelegant and disregarded broswer compatibility.

## Config

See [main.js](main.js) to set the `DEFAULT_NUM_OF_PLAYERS`.

You may also upload a `config.json` file in the following format:

```json
{
    "players": [
        {
            "number": 1,
            "picUrl": "456.webp"
        },
    ]
}
```

Only 1 to 100 are tested.

## Handy debugging commands

```js
[...document.querySelectorAll(".square:not(.gone, .empty)")].slice(0,-1).forEach((e)=>e.click());
```

## Ideas

- Save the state of the game to a cookie.
- Add squid game geometric shaped buttons (reset the game, toggle fullscreen, etc).

## References

- <https://www.youtube.com/watch?v=0-Azzeh4b2g>
