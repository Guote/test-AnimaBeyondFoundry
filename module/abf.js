// Import Modules
import abfActorSheet from "./abfActorSheet.js";
import abfItemSheet from "./abfItemSheet.js";
import abfCombat from "./Combat.js";

Hooks.once('init', function() {

  CONFIG.Combat.initiative = {
    formula: "1d100xaTurno + @atributos.turno.value",
  };
  CONFIG.Combat.entityClass = abfCombat;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("abf", abfActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("abf", abfItemSheet, { makeDefault: true })

  /* Define a new entry in the game global variable with all the custom stuff 
  so that other methods can access it from anywhere */
/*   game.abf = {
    abfRoll
  } */

  // Define custom Roll class
/*   CONFIG.Dice.rolls.unshift(abfRoll);
 */
})
