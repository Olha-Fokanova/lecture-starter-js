import createElement from '../helpers/domHelper';

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

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        // todo: show fighter info (image, name, health, etc.)
        const fighterImage = createFighterImage(fighter);
        const fighterStats = createElement({ tagName: 'p', className: 'fighter-preview___details' });
        fighterStats.innerHTML = `Name: <b>${fighter.name}</b><br/> Health: <b>${fighter.health}</b><br/> Attach: <b>${fighter.attack}</b><br/> Defense: <b>${fighter.defense}</b>`;
        // const fighterStats = document.createTextNode();
        fighterElement.append(fighterImage, fighterStats);
    }

    return fighterElement;
}
