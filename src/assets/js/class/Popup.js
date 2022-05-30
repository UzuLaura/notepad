import * as $ from 'jquery';

export class Popup {
    /**
     * Create HTML for a popup.
     * 
     * @param {string} content 
     * @param {string} title 
     * @returns 
     */
    create(content, title) {
        const card = $(`
            <div class="popup card bg-white w-75 min-h-50 border-light"></div>
        `);
        const closeIcon = $(`<span class="close-icon"></span>`)
            .on('click', function() {
                new Popup().close(card);
            });
        const cardTitle = $(`
            <div class="card-header bg-white d-flex justify-between justify-content-between align-items-center fw-bold">
                <span>${title || ''}</span>
            </div>
        `).append(closeIcon);
        const cardBody = $(`<div class="card-body p-3"><div>`).append(content);

        card.append(cardTitle);
        card.append(cardBody);
        
        return card;
    }

    /**
     * Show a popup on the UI.
     * 
     * @param {string} content 
     * @param {string} title 
     */
    show(content, title) {
        const overlay = $('.bg-overlay');
        overlay.append(this.create(content, title));
        overlay.addClass('d-flex');
        overlay.removeClass('d-none');
    }

    /**
     * Remove a popup from the UI.
     * 
     * @param {jQuery} element - popup element
     */
    close(element) {
        element.remove();
        const overlay = $('.bg-overlay');
        overlay.addClass('d-none');
        overlay.removeClass('d-flex');
    }
}