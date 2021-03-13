/* import abfRoll from "./abfRoll.js"; */
import customAbfRolls from "./dice.js";

export default class abfActorSheet extends ActorSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["abf", "sheet", "actor"], 
      template: "systems/abf/templates/actor-sheet.html",
      width: 600,
      height: 700,
    });
  } 

  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  async _onRoll(event) {event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let formula = roll._formula;

      // Ask for modifiers and process custom roll options
      roll = await customAbfRolls(roll,formula);
      console.log(roll)

      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });

    };
  };
};
