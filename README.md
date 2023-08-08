# Spatial LED Color Designer

A web tool to create fancy animations for RGB LEDs that are arranged in patterns that don't conform to a "single line" or "regular grid" pattern.

Live version here: [https://admiralpotato.github.io/spatial_led_color_designer/](https://admiralpotato.github.io/spatial_led_color_designer/)

Inputs:

- A `Wavefront/OBJ` file from which LED positions are read
- A JavaScript function that returns a color value for each RGB LED per tick

Outputs are available in several formats:

- Static C header files
- Python scripts + static binary data

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
