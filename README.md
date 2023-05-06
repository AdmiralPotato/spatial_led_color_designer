# Spatial LED Color Designer

A web tool to create animations for RGB LEDs that are arranged in patterns that don't conform to a "single line" or "regular grid" pattern.

## TODOs

- [ ] Animated patterns based on function expressions
	- [ ] Get function expressions animating
	- [ ] Export to frame sequence

### Redactd's feature wishlist

He likes the FastLED library, so it would be useful to get familiar with its capabilities

Here are some feature requests, listed in order of increasing difficulty:

- [ ] Ability to re-order the light indices and re-export those as a correctly ordered OBJ

- [ ] Draw pixel art on the lights, one light at a time, with multi-frame support
	- Example: https://www.youtube.com/watch?v=MNogUc4_8GM&list=PLDVHtC_tOo9GrB7hhHLN-oA3NHQOo-t_Z&t=693s
	- [ ] "add frame"
	- [ ] "previous frame"
	- [ ] "next frame"
	- [ ] Framerate control
	- [ ] Color picker
	- [ ] Click on light to color with the color picker value
	- [ ] Display a palette of all used colors to pick from

- [ ] Project a texture through the space to assign colors to lights
	- [ ] Explore existing UV coords vs in-browser mapping
		- [ ] UV
		- [ ] In-browser
	- [ ] Static texture first
	- [ ] Animated texture next
		- [ ] Framerate control

- [ ] Ability to scroll text
	- [ ] Generate the image at the size with a bitmap font
	- [ ] Select some good bitmap fonts
	- [ ] scroll speed
	- [ ] banner spacing for text repeat
