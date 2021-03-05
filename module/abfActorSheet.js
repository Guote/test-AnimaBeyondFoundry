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
      let roll = new Roll(dataset.roll, this.actor.data.data);
      roll.evaluate()

      /* Open roll implementation: To my knowledge, it is not possible
      to do it in a clean, neat way. You can't make independent 
      rolls and only add them together later, at least not if you want to
      preserve the "roll" status as regarded by Foundry, which may or
      may not be important later.
      What we do here is to mock a roll data structure. We have a complete 
      data structure from the "let roll". Inside of it we create the 
      arrays or fields that we need.

      The roll data structure itself looks like this:    
      data: {turno: 60}
      results: (3) [131, "+", 60]  <-- This we care about
      terms: (3) [Die, "+", 60]    <-- This we care about
        0: Die
          ...
          0: {result: 93, active: true, exploded: true}  <-- This we care about
          1: {result: 38, active: true, exploded: false} <-- This we care about
          ...
        1: "+"
        2: 60
      _dice: []
      _formula: "1d100 + 60"
      _rolled: true
      _total: 191                  <-- This we care about
      dice: (...)
      formula: (...)
      parts: (...)
      result: (...)
      total: (...)
      __proto__: Object */
    
      let openRange = 90;
      if (roll.results[0]>=openRange) {
        /* Initialize an accumulatedRoll object, since we'll be reusing "roll" */
        let accRoll = roll;
        /* Flag first die as exploded=true */
        accRoll.terms[0].results[0].exploded=true;
        
        while (roll.results[0]>=openRange) {
          let nextOpenRange = Math.min(openRange+1,100);
          /* Roll exploded die */
          roll = new Roll("1d100");
          roll.evaluate();

          /* Now we add the new roll data to the template.*/
          accRoll.results[0] += roll.results[0];
          accRoll._total += roll._total;
          let newResult = {result: roll.results[0], active: true, exploded: roll.results[0]>= nextOpenRange };
          accRoll.terms[0].results.push(newResult);

          openRange = nextOpenRange;
         }
         /* Once we leave the while loop, we rename accRoll to roll again,
         as if nothing was changed. */
         roll = accRoll;
      }

      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });

    };
  };
};