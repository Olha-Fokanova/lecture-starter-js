import showModal from './modal';
import { createFighterImage } from '../fighterPreview.js';

export default function showWinnerModal(fighter) {
    // call showModal function
    const title = fighter.name + " won!";
    showModal({
        title: title,
        bodyElement: createFighterImage(fighter),
        onClose: () => { window.location.reload() }});
}
