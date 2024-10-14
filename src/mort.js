

export default class mort extends Phaser.Scene {
    constructor() {
        super({ key: "mort" });
    }
    //on charge les images
    preload() {
        this.load.image("fondmort", "src/assets/fondmort.png");
        this.load.image("boutonmort", "src/assets/boutonmort.png");
    }

    create() {
        // on place les éléments de fond
        this.add
            .image(0, 0, "fondmort")
            .setOrigin(0)
            .setDepth(0);

        //on ajoute un bouton de clic, nommé bouton_play
        var bouton_play = this.add.image(300, 450, "boutonmort").setDepth(1);

        //=========================================================
        //on rend le bouton interratif
        bouton_play.setInteractive();

        //Cas ou la souris passe sur le bouton play
        bouton_play.on("pointerover", () => {   

        });

        //Cas ou la souris ne passe plus sur le bouton play
        bouton_play.on("pointerout", () => {

        }); 


        //Cas ou la sourris clique sur le bouton play :
        // on lance le niveau 1
        bouton_play.on("pointerup", () => {
            this.scene.restart("selection");
            this.scene.stop("niveau1");
            this.scene.stop("niveau2");
            this.scene.start("menu");

            
        });
    }
} 