export default class abfRoll extends Roll {

    /* this.results.push("+")
    this.results.push(mod)
    this.terms.push("+")
    this.terms.push(mod)
    this._formula += ` + ${mod}`
    this._total = String(Number(this._total)+Number(mod)); */

  customAbfRolls(formula){
    let canExplode = formula.includes("xa");
    let isTurno = formula.includes("Turno");

    // Erase keywords from formula so they aren't showd later in chat
    if (isTurno) {
      this._formula = this.formula.replace("Turno","")
      this.terms[0].modifiers[0] = this.terms[0].modifiers[0].replace("Turno","")
    }

    let openRange = 90;
    let fumbleRange = 3;

    // Open roll
    if (canExplode && this.results[0]>=openRange) {
      let x = this.results[0];

      while (x>=openRange) {
        let roll = new abfRoll("1d100").evaluate();
        let newResult = {result: roll.results[0], active: true };

        // Rewrite result data
        this.results[0] += roll.results[0];
        this._total += roll._total;
        this.terms[0].results.push(newResult);  

        // Flag previous result as exploded 
        this.terms[0].results[this.terms[0].results.length-2].exploded=true;

        // Update loop conditions (x is defined here because using "this" is weird and this works)
        x = roll.results[0];
        openRange = Math.min(openRange+1, 100);
      }
    }

    /* if (canExplode && !isTurno && this.results[0]<=3){
      let fumbleLevel = new abfRoll("1d100");
      fumbleLevel.evaluate();
      //
      //
      // NECESITO PODER PONER RESULTS NEGATIVOS EN EL DADO O 
      // PONER OTRO TIPO DE DADOS
    } */

    // Fumble on initiative
    if (isTurno && this.results[0]<=fumbleRange){
      let pen = 0;
      switch(this.results[0]){
        case 1:
          pen = -125;
          break;
        case 2:
          pen = -75;
          break;
        case 3:
          pen = -50;
          break;
      }
      this._total = this._total - this.results[0] + pen;
    }
    
    console.log(this)
    return this
  }

  // Overwrite just to include the abf roll keywords
  evaluate({minimize=false, maximize=false}={}) {
    if ( this._rolled ) throw new Error("This Roll object has already been rolled.");

    // Step 0 - 
    new Dialog({
      content: `
      <form>
      <div class="form-group">
        <label>Modificador</label>
        <input id="mod" type="text" name="mod" value="0" placeholder="0"/>
      </div>
      </form>`,
      buttons: {
        submit: { label: "Submit", callback: (html) => {
          const results = (new FormDataExtended(html.find("form")[0])).toObject();
          console.log(`Hello, ${results.mod}`); // 
        }}
      },
      default: "submit",
    }).render(true);

    // Step 1 - evaluate any inner Rolls and recompile the formula
    let hasInner = false;
    this.terms = this.terms.map((t, i, terms) => {
      if ( t instanceof Roll ) {
        hasInner = true;
        t.evaluate({minimize, maximize});
        this._dice = this._dice.concat(t.dice);
        const priorMath = (i > 0) && (terms[i-1].split(" ").pop() in Math);
        return priorMath ? `(${t.total})` : String(t.total);
      }
      return t;
    });

    // Step 2 - re-compile the formula and re-identify terms
    const formula = this.constructor.cleanFormula(this.terms);
    this.terms = this._identifyTerms(formula, {step: 1});

    // Step 3 - evaluate remaining terms
    this.results = this.terms.map(term => {
      if ( term.evaluate ) return term.evaluate({minimize, maximize}).total;
      else return term;
    });

    // Step 4 - safely evaluate the final total
    let total = this._safeEval(this.results.join(" "));
    if ( total === null ) total = 0;
    if ( !Number.isNumeric(total) ) {
      throw new Error(game.i18n.format("DICE.ErrorNonNumeric", {formula: this.formula}));
    }

    // Store final outputs
    this._total = total;
    this._rolled = true;

    /////////////////////////////////////////
    //  Apply specific abf shit
    this.customAbfRolls(formula);
    /////////////////////////////////////////

    return this;
  }

}