# Cosouls 

### Description

This project generates a display unique to each user which grows in proportion to the user's level of PGive.

The main element is an [L-System](http://paulbourke.net/fractals/lsys/)  mirrored radially. The User's ID is used as a seed which affects the L-system growth. Additionally there are 14 L-System rules, one of which is assigned to the user based on the seed. The secondary element is a wireframe background which is also determined by the seed.

The visualization uses two overlaid canvases. One uses a drawing context to draw the L-system and wireframe shapes. The second canvas uses a WebGL context using fragment shaders as a background animation.

### Program Structure

Main.js is the entry point of the program. This file gets the input parameters ID and PGive into the program, populates an object `glob_params` based on those values and passes that to a `start` function which is defined in Display.js.

Display.js initializes everything to be displayed using two classes `lineview` and `glview` which respectively run the canvas API and WebGL animations. Everything controlled by these classes is in the programs folder. The two line drawing programs are `l-module` and `g-module` which create the L-system and 3D geometry. The shader modules `waves` and `waves2` are also in the programs folder.

### Available Parameters 
---

Most of the available parameters are in **Main.js** These include:

`LEVEL_MAX` - The PGive value used as the maximum, where the L-System is grown to it's maximum extent.

`OVERFLOW` - An option to reset the level if PGive exceeds `LEVEL_MAX`. This only exists to allow a possible implementation of multiple designs for every time the value wraps level_max, so is best to leave false.

`fetch_params` - If true the program fetches the input parameters as JSON from a server endpoint. Otherwise, it parses them using a query string in the URL ie: ***?&id=asdf&pgive=5500***. The parameter "s" can be used alone where it's assumed to be obfuscated with the `encodeURLCipher` function in which case it's decoded and then parsed.

`log_params` - Console.log the received parameters.

`fetch_url` - This is the server endpoint to fetch JSON from.

Mapping callbacks -`lsys_rot`, `lsys_rule`, `geom_poly` can be modified to alter how to map input parameters to visually relevant variables in the program modules. `lsys_rot` maps the PGive level to the number of symmetry rotations. `lsys_rule` and `geom_poly` simply make weighted choices but can me modified if needed. 

`line_l`, `line_g` - These are the L-system and wireframe colors. The HSL values are used by the GUI in dev mode, for efficiency's sake the CSS string used as the default should be set manually.

`lsysweights`, `lsysweights`- These are the probability values to make weighted choices for the Lystem rules and polyhedron models. The 2nd index is the probability, which does not need to sum to any value only the relative values matter.

---

Other available parameters are in **Display.js**. 

`resolution` - Importantly this is the dimension of the display, the canvas will be resized to this value which is set currently at 600x600.

`linewidth` - the width for both the polyhedron and L-system. Somewhere between .5 and 1 is desirable, thicker lines than 1 can affect performance.

`animate` - This variable is set false in GUI mode for testing purposes.

---

Some parameters are hidden in **l_module.js** , **g_module.js**,  and the **waves.js** and **waves2.js** shader modules. The main purpose of GUI mode is to experiment with these easily in addition to some of the reviously listed ones.

`mainamp` - A master radius setting for the L-system (a minimum radius setting will be useful and is on the todo list to add).

`hold` - The hold time between the periodic animated rotations of the L-system.

`scenevals` - Default setting the 3D wireframe snap to for each polyhedron model. There are 1 for each of the 6 models, but multiple "scenes" per model can also be used.

---

Color and alpha uniform values can be set for the **Waves.js** shader in `prog.uniforms`. In **Waves2.js** there are two color values for diffuse and specular color, `amp` which is spatial scale, `tscale` or time, alpha ,and a lighting vector with the uniform name `vmouse`.

### Running and testing

The `package.json` includes 7 available `npm run` scripts:

`build`: Build `bundle.js` in development mode with the source map available to the browser and no minimization.

`prod`: Build in production mode without the source map and minimized.

`dev`: Build in development mode with the GUI activated. This is usually excluded with `#ifdef` statements.

`serve`: Live-serve the development mode build.

`serve-dev`: Live-serve with the GUI activated.

`serve-json`: Start a test server to run in parallel to test JSON fetching. The server is in `test/serve.js` where there is also an html file that can be used do demo different query strings or cipher coded strings.

`prep`: Pre-prepares the polyhedron models and is only necessary to add new .obj models as can be seen in `selectmodels.js`.

---

(c) 2023 shellderr
