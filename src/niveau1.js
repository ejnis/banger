


export default class niveau1 extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
        super({
            key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
        });
    }
    preload() {//A COMPLETER SI ON VEUT CHARGER D'AUTRES IMAGES QUE LES SCENES PRECEDENTES !!!!!!!!
    }

    create() {
        
        this.add.image(400, 300, "img_ciel");
        this.groupe_plateformes = this.physics.add.staticGroup();
        this.groupe_plateformes.create(200, 584, "img_plateforme");
        this.groupe_plateformes.create(600, 584, "img_plateforme");
        // ajout d'un texte distintcif  du niveau
        this.add.text(400, 100, "Vous êtes dans le niveau 1", {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: "22pt"
        });

        this.player = this.physics.add.sprite(100, 450, "img_perso");
        this.player.refreshBody();
        this.player.setCollideWorldBounds(true);
        this.clavier = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.groupe_plateformes);
        
        this.portes = this.physics.add.staticGroup();
        this.porte2 = this.portes.create(220, 550, "img_porte2");
        this.physics.add.collider(this.portes, this.groupe_plateformes);


    }

    update() {
        if (this.clavier.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("anim_tourne_gauche", true);
        } else if (this.clavier.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("anim_tourne_droite", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("anim_face");
        }
        if (this.clavier.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }


        if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
            if (this.physics.overlap(this.player, this.porte1)) this.scene.start("niveau1");
            if (this.physics.overlap(this.player, this.porte2)) this.scene.start("niveau2");
            if (this.physics.overlap(this.player, this.porte3)) this.scene.start("selection");
          } 

        

        
    }
}


