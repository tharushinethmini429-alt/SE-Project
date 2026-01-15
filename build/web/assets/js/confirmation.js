const ConfirmModal = {
    show: function(options) {
        return new Promise((resolve) => {
            const {
                title = 'Confirm Action',
                message = 'Are you sure you want to proceed?',
                icon = 'warning',
                confirmText = 'Confirm',
                cancelText = 'Cancel',
                confirmClass = 'confirm-btn-confirm'
            } = options;

    
            const overlay = document.createElement('div');
            overlay.className = 'confirm-overlay';
            overlay.id = 'confirmOverlay';

          
            const icons = {
                warning: '⚠',
                danger: '✕',
                info: 'ℹ'
            };

            
            overlay.innerHTML = `
                <div class="confirm-modal">
                    <div class="confirm-header">
                        <div class="confirm-icon ${icon}">
                            ${icons[icon] || icons.warning}
                        </div>
                        <div class="confirm-text">
                            <h3 class="confirm-title">${title}</h3>
                            <p class="confirm-message">${message}</p>
                        </div>
                    </div>
                    <div class="confirm-footer">
                        <button class="confirm-btn confirm-btn-cancel" id="confirmCancel">
                            ${cancelText}
                        </button>
                        <button class="confirm-btn ${confirmClass}" id="confirmOk">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

            
            document.body.appendChild(overlay);

            
            const confirmBtn = document.getElementById('confirmOk');
            const cancelBtn = document.getElementById('confirmCancel');

           
            confirmBtn.onclick = () => {
                this.close(overlay);
                resolve(true);
            };

            
            cancelBtn.onclick = () => {
                this.close(overlay);
                resolve(false);
            };

            
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    this.close(overlay);
                    resolve(false);
                }
            };

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    this.close(overlay);
                    resolve(false);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    },

    close: function(overlay) {
        overlay.classList.add('closing');
        setTimeout(() => {
            overlay.remove();
        }, 200);
    },

    delete: function(itemName = 'this item') {
        return this.show({
            title: 'Delete Confirmation',
            message: `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
            icon: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            confirmClass: 'confirm-btn-confirm'
        });
    },

    warning: function(title, message) {
        return this.show({
            title: title,
            message: message,
            icon: 'warning',
            confirmText: 'Yes, Continue',
            cancelText: 'Cancel',
            confirmClass: 'confirm-btn-primary'
        });
    },

    info: function(title, message) {
        return this.show({
            title: title,
            message: message,
            icon: 'info',
            confirmText: 'OK',
            cancelText: 'Cancel',
            confirmClass: 'confirm-btn-primary'
        });
    }
};

window.confirmModal = ConfirmModal;