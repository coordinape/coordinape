The features folder is for large chunks of app-specific functionality, such as
authentication. Group files not by file type, but by interdependencies & high
likelihood of needing to be changed together.

To keep good encapsulation of features, try to minimize the number of imports
from other files in the feature into files outside the feature. Re-export code
that is meant to be used externally in `index.ts` at the feature's root.
