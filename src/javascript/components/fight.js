import controls from '../../constants/controls';

let keysPressed = {};

const abstractPlayer = {
    health: 0,
    maxHealth: 0,
    criticalHit: true,
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
        return keysPressed.hasOwnProperty(this.actionKeys.attack) && !firstPlayerBlock();
    },
    isCriticalHit: function () {
        let critComboKeysPushed = this.actionKeys.criticalHit.every(key => keysPressed.hasOwnProperty(key));
        return critComboKeysPushed && this.crit;
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
        let firstHealth = firstFighter.health,
            secondHealth = secondFighter.health;

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

        window.addEventListener('keydown', event => {
            keysPressed[event.code] = true;

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

        window.addEventListener('keyup', event => {
            delete keysPressed[event.code];
        });
    });
}

// export function changeHealthBar(id, health, maxHealth) {
//     document.getElementById(id).style.width = 100 * health / maxHealth + '%';
// }

export function firstPlayerBlock() {
    return keysPressed.hasOwnProperty(controls.PlayerOneBlock);
}

export function firstPlayerCanAttack() {
    return keysPressed.hasOwnProperty(controls.PlayerOneAttack) && !firstPlayerBlock();
}

export function firstPlayerCanCritHit() {
    let critComboKeysPushed = controls.PlayerOneCriticalHitCombination.every(key => keysPressed.hasOwnProperty(key));
    return critComboKeysPushed && playerOne.crit;
}

export function secondPlayerBlock() {
    return keysPressed.hasOwnProperty(controls.PlayerTwoBlock);
}

export function secondPlayerCanAttack() {
    return keysPressed.hasOwnProperty(controls.PlayerTwoAttack) && !secondPlayerBlock();
}

export function secondPlayerCanCritHit() {
    let critComboKeysPushed = controls.PlayerTwoCriticalHitCombination.every(key => keysPressed.hasOwnProperty(key));
    return critComboKeysPushed && playerOne.crit;
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
