export default class abfRoll extends Roll {

    async evaluate({minimize=false, maximize=false}={}) {
        console.log("asdasdsd evaluate nuevo")
        if ( this._rolled ) throw new Error("This Roll object has already been rolled.");
    
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
        return this;
      }
  }