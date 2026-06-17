// Shared, reactive "Custom Fish" state. Both the Fish Stats table
// (editable row) and the Simulator read/write this same object, so
// edits in the table immediately affect simulations.
import { CUSTOM_FISH_DEFAULTS } from './data/fish.js';

export const customFish = $state({ ...CUSTOM_FISH_DEFAULTS });
