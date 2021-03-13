export default async function customAbfRolls(roll,formula){
  let openRange = 50;
  let fumbleRange = 3;
  let canExplode = formula.includes("xa");
  let isTurno = formula.includes("Turno");

  // Erase keywords from formula so they aren't showd later in chat
  if (isTurno) {
    roll._formula = roll.formula.replace("Turno","")
    roll.terms[0].modifiers[0] = roll.terms[0].modifiers[0].replace("Turno","")
  }

  // Roll evaluate
  roll.evaluate()

  // Open popup asking for adittional roll modifiers
  let mod = await modDialog();

  if (mod!=="0") {
    roll.results.push("+")
    roll.results.push(mod)
    roll.terms.push("+")
    roll.terms.push(mod)
    roll._formula += ` + ${mod}`
    roll._total = String(Number(roll._total)+Number(mod));
  }

  // Case - Open roll
  if (canExplode && roll.results[0]>=openRange) {
    let x = roll.results[0];

    while (x>=openRange) {
      let newRoll = new Roll("1d100").evaluate();
      let newResult = {result: newRoll.results[0], active: true };

      // Rewrite result data
      roll.results[0] += newRoll.results[0];
      roll._total += newRoll._total;
      roll.terms[0].results.push(newResult);  

      // Flag previous result as exploded 
      roll.terms[0].results[roll.terms[0].results.length-2].exploded=true;

      // Update loop conditions (x is defined here because using "this" is weird and this works)
      x = newRoll.results[0];
      openRange = Math.min(openRange+1, 100);
    }
  }

  // Case - Fumble
  /* if (canExplode && !isTurno && this.results[0]<=3){
    let fumbleLevel = new abfRoll("1d100");
    fumbleLevel.evaluate();
    //
    //
    // NECESITO PODER PONER RESULTS NEGATIVOS EN EL DADO O 
    // PONER OTRO TIPO DE DADOS
  } */

  // Case - Fumble on initiative
  if (isTurno && roll.results[0]<=fumbleRange){
    let pen = 0;
    switch(roll.results[0]){
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
    roll._total = roll._total - roll.results[0] + pen;
  }

  return roll
}

// Open the mod Dialog window. It returns resolver(html), which in turn returns the modifier
async function modDialog(){
  return new Promise(resolve => {
    new Dialog({
      content: `
      <form>
      <div class="form-group">
        <label>Modificador</label>
        <input id="mod" type="text" name="mod" value="0" placeholder="0"/>
      </div>
      </form>`,
      buttons: {
        submit: { 
          icon: '<i class="fas fa-check"></i>',
          label: "Aceptar", 
          callback: (html) => {
            resolve(resolver(html))
          }
        }
      },
      default: "submit",
    }).render(true);
  })
}

const resolver = (html) => {
  const results = (new FormDataExtended(html.find("form")[0])).toObject();
  return results.mod
}
