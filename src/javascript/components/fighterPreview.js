import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        // todo: show fighter info (image, name, health, etc.)
        const fighterImage = createFighterImage(fighter);
        // todo: extract method into domHelper
        const fighterStats = document.createTextNode(`Name: ${fighter.name}. Health: ${fighter.health}. Attach: ${fighter.attack}. Defense: ${fighter.defense}`);
        fighterElement.append(fighterImage);
        fighterElement.append(fighterStats);
    }


    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
