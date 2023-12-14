import controls from '../../constants/controls';

let keysPressed = {};

const abstractPlayer = {
    health: 0,
    maxHealth: 0,
    canDoCritHit: true,
    fighter: {},
    healthBarId: '',
    actionKeys: {
        attack: '',
        block: '',
        criticalHit: []
    },
    updateHealthBar: function () {
        document.getElementById(this.healthBarId).style.width = (100 * this.health) / this.maxHealth + '%';
    },
    isBlock: function () {
        return keysPressed.hasOwnProperty(this.actionKeys.block);
    },
    isAttack: function () {
        return keysPressed.hasOwnProperty(this.actionKeys.attack) && !this.isBlock();
    },
    isCriticalHit: function () {
        let critComboKeysPushed = this.actionKeys.criticalHit.every(key => keysPressed.hasOwnProperty(key));
        const canCrit = critComboKeysPushed && this.canDoCritHit;
        console.log(this.healthBarId, canCrit);
        return canCrit;
    },
    isDead: function () {
        if (this.health < 1) {
            this.health = 0;
        }
        return this.health < 1;
    }
};

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // Initiate player 1
        const playerOne = Object.create(abstractPlayer);
        playerOne.fighter = firstFighter;
        playerOne.health = playerOne.fighter.health;
        playerOne.maxHealth = playerOne.fighter.health;
        playerOne.healthBarId = 'left-fighter-indicator';
        playerOne.actionKeys = {
            attack: controls.PlayerOneAttack,
            block: controls.PlayerOneBlock,
            criticalHit: controls.PlayerOneCriticalHitCombination
        };

        // Initiate player 2
        const playerTwo = Object.create(abstractPlayer);
        playerTwo.fighter = secondFighter;
        playerTwo.health = playerTwo.fighter.health;
        playerTwo.maxHealth = playerTwo.fighter.health;
        playerTwo.healthBarId = 'right-fighter-indicator';
        playerTwo.actionKeys = {
            attack: controls.PlayerTwoAttack,
            block: controls.PlayerTwoBlock,
            criticalHit: controls.PlayerTwoCriticalHitCombination
        };

        // Register key and do fight actions if given key is in action keys list
        window.addEventListener('keydown', event => {
            keysPressed[event.code] = true;

            console.log(playerOne.health, playerTwo.health);

            if (playerOne.isCriticalHit()) {
                playerTwo.health -= playerOne.fighter.attack * 2;
                playerTwo.updateHealthBar();
                playerOne.canDoCritHit = false;
                setTimeout(() => {
                    playerOne.canDoCritHit = true;
                }, 10 * 1000);

                if (playerTwo.isDead()) {
                    resolve(playerOne.fighter);
                }
                return;
            }

            if (playerTwo.isCriticalHit()) {
                playerOne.health -= playerTwo.fighter.attack * 2;
                playerTwo.updateHealthBar();
                playerTwo.canDoCritHit = false;
                setTimeout(() => {
                    playerTwo.canDoCritHit = true;
                }, 10 * 1000);
                if (playerOne.isDead()) resolve(playerTwo.fighter);
                return;
            }

            switch (event.code) {
                case controls.PlayerOneAttack:
                    if (playerOne.isAttack()) {
                        playerTwo.health -= getDamage(playerOne, playerTwo);

                        playerTwo.updateHealthBar();

                        if (playerTwo.isDead()) {
                            resolve(playerOne.fighter);
                        }
                    }
                    break;

                case controls.PlayerTwoAttack:
                    if (playerTwo.isAttack()) {
                        playerOne.health -= getDamage(playerOne, playerTwo);

                        playerOne.updateHealthBar();

                        if (playerOne.isDead()) {
                            resolve(playerTwo.fighter);
                        }
                    }
                    break;
            }
        });

        // Unregister key
        window.addEventListener('keyup', event => {
            delete keysPressed[event.code];
        });
    });
}

export function getDamage(attacker, defender) {
    let damage = getHitPower(attacker) - getBlockPower(defender);

    if (damage < 0) damage = 0;

    return damage;
}

export function getHitPower(player) {
    const critChance = Math.floor(Math.random() * 2) + 1;
    return player.fighter.attack * critChance;
}

export function getBlockPower(player) {
    if (!player.isBlock()) {
        return 0; // deal full damage if player not blocking
    }
    const dodgeChance = Math.floor(Math.random() * 2) + 1;
    return player.fighter.defense * dodgeChance;
}
