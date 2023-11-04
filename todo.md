# TODOs

- [x] Animated patterns based on function expressions
	- [x] Get function expressions animating
	- [x] Add click/drag camera controls
	- [x] Use localStorage persistence of last uploaded model
	- [x] Get build/deploy working
	- [x] Add controls for frame range TO export
	- [x] Add controls for frame RATE
	- [x] Add timeline to scrub along
	- [x] Add pause/play buttons
	- [x] Export to frame sequence
	- [x] Ability to reset to default equation
- [x] Panelize it better
- [x] C Header output
- [ ] Python Class output
- [x] Python BIN output
- [ ] Animations presets should include duration/framerate
- [x] Code syntax highlighting
- [?] Slider to control scale of lights

## Redactd's feature wishlist

He likes the FastLED library, so it would be useful to get familiar with its capabilities

Here are some feature requests, listed in order of increasing difficulty:

- [ ] Ability to re-order the light indices and re-export those as a correctly ordered OBJ
	- [x] Create a mechanism to detect cursor overlap on the verts
	- [x] Create a mechanism to select the verts
	- [x] Deselect all verts with ctrl-d
	- [ ] Add a "mode" to initiate this state
	- [ ] Start to do the re-ordering
	- [ ] Persist the state of the re-ordered object
	- [ ] Export the state of the re-ordered object

- [ ] Ability to create a grid matrix in this software, with the ability to delete certain points
	- [ ] Also add some options like these: https://macetech.github.io/FastLED-XY-Map-Generator/

- [ ] Draw pixel art on the lights, one light at a time, with multi-frame support
	- Example: https://www.youtube.com/watch?v=MNogUc4_8GM&list=PLDVHtC_tOo9GrB7hhHLN-oA3NHQOo-t_Z&t=693s
	- Another Example: https://htmlpreview.github.io/?https://github.com/defconfurs/dcfurs-badge-dc28/blob/master/webanimator.html
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
		- [ ] Show manipulators
		- [ ] Add a toggle to hide all the non-light elements in the 3d space
		- [ ] Show projection vector
		- [ ] Show transparent plane with the texture image on it parented to the manipulators
	- [ ] Animated texture next
		- [ ] Framerate control

- [ ] Ability to scroll text
	- [ ] Generate the image at the size with a bitmap font
	- [ ] Select some good bitmap fonts
	- [ ] scroll speed
	- [ ] banner spacing for text repeat

- [ ] Look up WLED's web interface? What are they doing that's cool? https://kno.wled.ge/
	- [ ] Look at how it sets up "Segments"
