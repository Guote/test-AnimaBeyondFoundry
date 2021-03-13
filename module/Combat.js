import customAbfRolls from "./dice.js"

export default class abfCombat extends Combat {

  /* Override nextRound method so that it resets initiative */
  async nextRound() {
    let turn = 0;
    if ( this.settings.skipDefeated ) {
      turn = this.turns.findIndex(t => {
      return !(t.defeated ||
      t.actor?.effects.find(e => e.getFlag("core", "statusId") === CONFIG.Combat.defeatedStatusId ));
      });
      if (turn === -1) {
        ui.notifications.warn(game.i18n.localize("COMBAT.NoneRemaining"));
        turn = 0;
      }
    }
      let advanceTime = Math.max(this.turns.length - this.data.turn, 1) * CONFIG.time.turnTime;
      advanceTime += CONFIG.time.roundTime;

      ////////////////////////////////////////////////////////////////////////
      /* This is the only Anima modification: Reset initiative every round. */
      game.combat.resetAll()
      ////////////////////////////////////////////////////////////////////////

      return this.update({round: this.round+1, turn: turn}, {advanceTime});
  }
/* 
  async _getInitiativeRoll(combatant, formula) {
    const rollData = combatant.actor ? combatant.actor.getRollData() : {};
    let roll = Roll.create(formula, rollData).evaluate();
    // Ask for modifiers and process custom roll options
    roll = await customAbfRolls(roll,formula);
    console.log(roll)
    return roll;
  } */

}