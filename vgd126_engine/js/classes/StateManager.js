/**
 * @file StateManager.js
 * @description Minimal state machine to route the game loop to the active state.
 * @example
 * // Define states:
 * gameStates["menu"] = () => {  draw menu  };
 * gameStates["level1"] = () => {  per-frame level logic };
 * // Switch:
 * gameStates.changeState("menu");
 */

/** Manages which state (function) the loop should run. */
class StateManager {
  constructor() {
    /** @type {string} Current state key (e.g., "menu", "level1"). */
    this.currentState = undefined;
  }

  /**
   * Change the active game state.
   * @param {string} _newState - Key referencing a function on `gameStates`.
   */
  changeState(_newState) {
    this.currentState = _newState;
  }
}

/**
 * Global registry of states and the manager instance.
 * Each property (except methods) should be a function with no args that
 * performs one frame of logic & rendering.
 * @type {Record<string, Function> & StateManager}
 */
var gameStates = new StateManager();