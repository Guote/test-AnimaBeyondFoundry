class ActorSheetAnima extends ActorSheet {

  /**Return the type of the current Actor.
   * @return {String} Actor type - character, npc, or creature */
  get actorType() {
    return this.actor.data.type;
  }
  
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.tabs = [{navSelector: ".tabs", contentSelector: ".content", initial: "main"}]
    //Anchura minima de la ventana
	options.width = 576;
	  return options;
  }
  
  /**Overrides the default ActorSheet.render to add functionality.
   * This function adds scroll position saving support, as well as tooltips for the
   * custom buttons.*/
  async _render(force = false, options = {}) {
    this._saveScrollPos(); // Save scroll positions
    await super._render(force, options);
    this._setScrollPos();  // Set scroll positions

    // Add Tooltips
    $(this._element).find(".close").attr("title", game.i18n.localize("SHEET.Close"));
    $(this._element).find(".configure-sheet").attr("title", game.i18n.localize("SHEET.Configure"));
    $(this._element).find(".configure-token").attr("title", game.i18n.localize("SHEET.Token"));
    $(this._element).find(".import").attr("title", game.i18n.localize("SHEET.Import"));
  }

    /**Saves all the scroll positions in the sheet for setScrollPos() to use. All elements in 
	 * the sheet that use ".save-scroll" class has their position saved to
     * this.scrollPos array, which is used when rendering (rendering a sheet resets all 
     * scroll positions by default).*/
	 
	_saveScrollPos()
    {
      if (this.form === null)
        return;

      const html = $(this.form).parent();
      this.scrollPos = [];
      let lists = $(html.find(".save-scroll"));
      for (let list of lists)
      {
        this.scrollPos.push($(list).scrollTop());
      }
    }

    /**
     * Sets all scroll positions to what was saved by saveScrollPos(). All elements in the sheet that 
	 * use ".save-scroll" class has their position set to what was saved by saveScrollPos before rendering.*/
    _setScrollPos()
    {
      if (this.scrollPos)
      {
        const html = $(this.form).parent();
        let lists = $(html.find(".save-scroll"));
        for (let i = 0; i < lists.length; i++)
        {
          $(lists[i]).scrollTop(this.scrollPos[i]);
        }
      }
    }
}

Actors.unregisterSheet("core", ActorSheet);

Hooks.on("popout:renderSheet", (sheet) => {
  sheet.element.css({ width: "610px", height: "740px", padding: "0px"})
})