var groupeBullets;
var boutonFeu;
var groupe_plateformes;
var player;
var clavier;
var groupe_etoiles;
var score = 0;
var zone_texte_score;
var groupe_bombes;
var gameOver = false;
var portes;
var player2;
var J2Haut;
var J2Bas;
var J2Gauche;
var J2Droite;
var son_feu;
var musique_de_fond;



export default class selection extends Phaser.Scene {

    constructor() {
        super({ key: "selection" }); // mettre le meme nom que le nom de la classe
    }

    preload() {
        this.load.image('img_porte1', 'src/assets/door1.png');
        this.load.image('img_porte2', 'src/assets/door2.png');
        this.load.image('img_porte3', 'src/assets/door3.png');
        this.load.image("img_ciel", "src/assets/backvole.png");
        this.load.image("img_plateforme", "src/assets/platform.png");

        //spritesheet
        this.load.spritesheet("img_perso", "src/assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48
        });

        this.load.spritesheet("img_perso_idle", "src/assets/dude.png", {
            frameWidth: 32,
            frameHeight: 32
        })
        this.load.image("img_etoile", "src/assets/star.png");
        this.load.image("Phaser_tuilesdejeu", "src/assets/tuilesJeu.png");
        this.load.tilemapTiledJSON("carte", "src/map/map.json");
        this.load.image("img_bomb", "src/assets/bomb.png");
        this.load.image("bullet", "src/assets/balle.png");

        this.load.audio('coupDeFeu', 'src/assets/sound/pew.mp3');
        this.load.audio('background', 'src/assets/sound/guile.mp3'); 
    }

    create() {



        this.add.image(600, 400, "img_ciel");

        this.sound.pauseOnBlur = false;

        this.portes = this.physics.add.staticGroup();
        this.porte1 = this.portes.create(120, 450, "img_porte1");
        this.physics.add.collider(this.portes, this.groupe_plateformes);


        //joueur  
        player = this.physics.add.sprite(100, 450, 'img_perso');
        player.setCollideWorldBounds(true);
        player.body.onWorldBounds = true;
        this.physics.add.collider(player, groupe_plateformes);

            //pour qu'il meure 

        player.body.world.on(
            "worldbounds", // evenement surveillé
            function (body, up, down, left, right) {
                  // on verifie si la hitbox qui est rentrée en collision est celle du player,
                  // et si la collision a eu lieu sur le bord inférieur du player
                if (body.gameObject === player && down == true) {
                    // si oui : GAME OVER on arrete la physique et on colorie le personnage en rouge
                gameOver = true;
                player.setTint(0xff0000);
                }
            },
            this
            ); 

        //bind
        clavier = this.input.keyboard.createCursorKeys('');

        //anim'

        //gauche 
        this.anims.create({
            key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
            frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }), // on prend toutes les frames de img perso numerotées de 0 à 3
            frameRate: 10, // vitesse de défilement des frames
            repeat: -1 // nombre de répétitions de l'animation. -1 = infini
        });

        //droire 
        this.anims.create({
            key: "anim_tourne_droite", // key est le nom de l'animation : doit etre unique poru la scene.
            frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }), // on prend toutes les frames de img perso numerotées de 0 à 3
            frameRate: 10, // vitesse de défilement des frames
            repeat: -1 // nombre de répétitions de l'animation. -1 = infini
        });


        //idle 

        // creation de l'animation "anim_tourne_face" qui sera jouée sur le player lorsque ce dernier n'avance pas.
        this.anims.create({
            key: "anim_face",
            frames: [{ key: "img_perso", frame: 4 }],
            frameRate: 20
        });





        //etoiels 

        groupe_etoiles = this.physics.add.group();

        for (var i = 0; i < 10; i++) {
            var coordX = 70 + 70 * i;
            groupe_etoiles.create(coordX, 10, "img_etoile");

        }


        this.physics.add.collider(groupe_etoiles, groupe_plateformes);

        //rebond 
        groupe_etoiles.children.iterate(function iterateur(etoile_i) {
            // On tire un coefficient aléatoire de rerebond : valeur entre 0.4 et 0.8
            var coef_rebond = Phaser.Math.FloatBetween(0.15, 0.35);
            etoile_i.setBounceY(coef_rebond); // on attribut le coefficient de rebond à l'étoile etoile_i
        });


        zone_texte_score = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        groupe_bombes = this.physics.add.group();

        this.physics.add.collider(groupe_bombes, groupe_plateformes);

        this.physics.add.collider(player, groupe_bombes, chocAvecBombe, null, this);


        //MAP 
        // chargement de la carte
        const carteDuNiveau = this.add.tilemap("carte");

        // chargement du jeu de tuiles
        const tileset = carteDuNiveau.addTilesetImage(
            "SimpleTiles_allColors",
            "Phaser_tuilesdejeu"
        );

        // chargement du calque calque_background
        const calque_background = carteDuNiveau.createLayer(
            "calque_background",
            tileset
        );

        // chargement du calque calque_background_2
        const calque_background_2 = carteDuNiveau.createLayer(
            "calque_background_2",
            tileset
        );

        // chargement du calque calque_plateformes
        const calque_plateformes = carteDuNiveau.createLayer(
            "calque_plateformes",
            tileset
        );

        calque_plateformes.setCollisionByProperty({ estSolide: true });
        this.physics.add.collider(player, calque_plateformes);
        this.physics.add.collider(groupe_etoiles, calque_plateformes);
        this.physics.add.collider(groupe_bombes, calque_plateformes);



        //fonction de tir 
        // création du clavier - code déja présent sur le jeu de départ
        clavier = this.input.keyboard.createCursorKeys();

        // affectation de la touche A à boutonFeu
        boutonFeu = this.input.keyboard.addKey('A');

        groupeBullets = this.physics.add.group();


        //J2 

        // ajout d'un second joueur
        player2 = this.physics.add.sprite(500, 450, 'img_perso');
        // mise en place d'un rebond
        player2.setBounce(0.2);
        // collision avec les bords du niveau
        player2.setCollideWorldBounds(true);
        // collision avec les plates-formes
        this.physics.add.collider(player2, calque_plateformes);

        J2Haut = this.input.keyboard.addKey('Z');
        J2Bas = this.input.keyboard.addKey('S');
        J2Gauche = this.input.keyboard.addKey('D');
        J2Droite = this.input.keyboard.addKey('Q');

        son_feu = this.sound.add('coupDeFeu');
        musique_de_fond = this.sound.add('background', {
            loop: true,
            volume: 0.5
        });
    
        musique_de_fond.play();
        
    }

    update() {

       


        if (clavier.right.isDown) {
            player.setVelocityX(160);
            player.anims.play("anim_tourne_droite", true);
            player.direction = 'right';
        }
        else if (clavier.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play("anim_tourne_gauche", true);
            player.direction = 'left';
        }
        else {
            player.setVelocityX(0);
            player.anims.play('anim_face', true);
        }


        //J2

        if (J2Gauche.isDown) {
            player2.setVelocityX(160);
            player2.anims.play("anim_tourne_droite", true);
            player2.direction = 'right';
        }
        else if (J2Droite.isDown) {
            player2.setVelocityX(-160);
            player2.anims.play("anim_tourne_gauche", true);
            player2.direction = 'left';
        }
        else {
            player2.setVelocityX(0);
            player2.anims.play('anim_face', true);
        }

        if (J2Haut.isDown && player2.body.blocked.down) {
            player2.setVelocityY(-330);
        }


        // Saut
        if (clavier.up.isDown && player.body.blocked.down) {
            player.setVelocityY(-230);
        }

        this.physics.add.overlap(player, groupe_etoiles, ramasserEtoile, null, this);

        
        
        
        if (gameOver) {
            this.scene.start("mort");
            this.scene.stop("selection");
            
        }



        // déclenchement de la fonction tirer() si appui sur boutonFeu 
        if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
            tirer(player);
        }


        if (Phaser.Input.Keyboard.JustDown(clavier.space) == true) {
            if (this.physics.overlap(player, this.porte1)) this.scene.start("niveau1");
            if (this.physics.overlap(player, this.porte2)) this.scene.start("niveau2");
            if (this.physics.overlap(player, this.porte3)) this.scene.start("selection");
        }

        

    }

    



}




//ramasse 
function ramasserEtoile(un_player, une_etoile) {
    // on désactive le "corps physique" de l'étoile mais aussi sa texture
    // l'étoile existe alors sans exister : elle est invisible et ne peut plus intéragir
    une_etoile.disableBody(true, true);

    if (groupe_etoiles.countActive(true) === 0) {
        // si ce nombre est égal à 0 : on va réactiver toutes les étoiles désactivées
        // pour chaque étoile etoile_i du groupe, on réacttive etoile_i avec la méthode enableBody
        // ceci s'ecrit bizarrement : avec un itérateur sur les enfants (children) du groupe (equivalent du for)
        groupe_etoiles.children.iterate(function iterateur(etoile_i) {
            etoile_i.enableBody(true, etoile_i.x, 0, true, true);
        });
    }
    score += 10;
    zone_texte_score.setText("Score: " + score);


    var x;
    if (player.x < 400) {
        x = Phaser.Math.Between(400, 800);
    } else {
        x = Phaser.Math.Between(0, 400);
    }

    var une_bombe = groupe_bombes.create(x, 16, "img_bomb");
    une_bombe.setBounce(1);
    une_bombe.setCollideWorldBounds(true);
    une_bombe.setVelocity(Phaser.Math.Between(-200, 200), 20);
    une_bombe.allowGravity = false;

}


function chocAvecBombe(un_player, une_bombe) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("anim_face");
    gameOver = true;



}



function tirer(player) {

son_feu.play();

    // mesasge d'alerte affichant les attributs de player
    console.log("joueur en position" + player.x + "," + player.y + ", direction du tir: "
        + player.direction);
    var coefDir;
    if (player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
    // on crée la balle a coté du joueur
    var bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');
    // parametres physiques de la balle.
    bullet.setCollideWorldBounds(false);
    bullet.body.allowGravity = false;
    bullet.setVelocity(1000 * coefDir, 0); // vitesse en x et en y
}  
