import abfRoll from "./abfRoll.js";

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

  _onRoll(event) {event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      let roll = new abfRoll(dataset.roll, this.actor.data.data);

      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });

    };
  };
};