ESTA ES UNA VERSIÓN CON COMENTARIOS PARA ENTENDER EL FUNCIONAMIENTO DE SYSTEM.

PARA EDITAR EL SYSTEM ID A "SYSTEM.JSON".

"name": "anima"
	Nombre interno del sistema
"title": "Anima: Beyond Fantasy",
	Título que se muestra al usuario del sistema
"description": "A game system for Foundry VTT based on the Anima: Beyond Fantasy roleplaying game",
	Auto-explicativo
"version": 0.01,
	Versión actual del sistema
"author": "Calgori, Mario, DarknesSeeker, Guote",
	Autoexplicativo, string de creadores
"scripts":[],
	Uso de scripts externos al sistema o más avanzados
"esmodules": ["anima.js"],
	Corazón del sistema.
	Importa todos y cada uno de los submódulos, aplicaciones etc, y prepara los hooks.
	Haría falta revisar sistemas más complejos, pero es altamente posible que estos corazones
	puedan montarse como paquetes de expansión, teniendo cada subsistema su propio modulo-core
"styles":["anima.css"],
	Como todo css, se trata del configurador visual del sistema.
	//REVISAR el de Warhammer, será mucho más completo que el de D&D
"packs":[
 {
	{
	"name": "heroes"
	"label": "Starter Heroes",
	"system": "anima",
	"path": "./packs/heroes.db",
	"entity": "Actor"
	}
 }
 ],
	LOS PACKS GUARDAN LOS ELEMENTOS DENTRO DEL JUEGO EN UNA BASE DE DATOS.
	HEROES, MONSTRUOS, OBJETOS, HECHIZOS, CLASES Y DEMÁS ELEMENTOS NECESITAN ESTOS PACKS
		"name": Nombre interno del packs
		"label": Nombre de la pestaña y/o muestra al usuario
		"system": Sistema que utiliza al paquete. Como anoté antes, sería teóricamente posible definir 
		de qué libro viene cada elemento (habilidades de Ki del libro Core vs del Dominus)
		"path": ruta de la base de datos.
		"entity": Tipo de elemento que contiene esta base de datos. Existen dos tipos principales:
			— Actor: Monstruos, héroes, entidades "vivas" del entorno.
			— Item: Armas, utensilios, elementos equipables en el inventario etc
		Estos tipos de entidades se pueden repetir, por supuesto.
 
 
"languages": [
    {
      "lang": "en",
      "name": "English",
      "path": "lang/en.json"
    }
  ],
	Listado de lenguajes del juego, con su nombre técnico, de usuario y su ruta de acceso.
"initiative": "1d100 + @abilities.init.value
	Sistema de iniciativa del juego. Comprobar donde configurar el @abities
"gridDistance": 1,
	Distancia de las casillas in-game.
"gridUnits": "mtrs",
	String con el nombre a dar a la distancia, NO CAMBIA LA MEDIDA REAL (Podrías llamarlo limones si quisieras"