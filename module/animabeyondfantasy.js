// Import Modules
import { AnimaBeyondFantasyActor } from "./actor/actor.js";
import { AnimaBeyondFantasyActorSheet } from "./actor/actor-sheet.js";
import { AnimaBeyondFantasyItem } from "./item/item.js";
import { AnimaBeyondFantasyItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.animabeyondfantasy = {
    AnimaBeyondFantasyActor,
    AnimaBeyondFantasyItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = AnimaBeyondFantasyActor;
  CONFIG.Item.entityClass = AnimaBeyondFantasyItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("animabeyondfantasy", AnimaBeyondFantasyActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("animabeyondfantasy", AnimaBeyondFantasyItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});