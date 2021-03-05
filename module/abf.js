// Import Modules
import abfActorSheet from "./abfActorSheet.js";
import abfItemSheet from "./abfItemSheet.js";

Hooks.once('init', function() {

  /* CONFIG.Combat.initiative = {
    formula: "1d100 + @attributes.turno",
    decimals: 2
  }; */

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("abf", abfActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("abf", abfItemSheet, { makeDefault: true })
})
