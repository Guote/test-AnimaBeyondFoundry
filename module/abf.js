// Import Modules
import abfActorSheet from "./abfActorSheet.js";
import abfItemSheet from "./abfItemSheet.js";
import abfCombat from "./abfCombat.js";
import abfRoll from "./abfRoll.js";

Hooks.once('init', function() {

  CONFIG.Combat.initiative = {
    formula: "1d100x>90 + @attributes.turno.value",
  };

  CONFIG.Combat.entityClass = abfCombat;
 /*  CONFIG.Roll.entityClass = abfRoll; */

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("abf", abfActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("abf", abfItemSheet, { makeDefault: true })
})