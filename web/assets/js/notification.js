window.NotificationSystem = {
    show: function(type, title, message, duration) {
        if (typeof duration === 'undefined') {
            duration = 5000;
        }
        
        var container = document.getElementById('notification-container');
        if (!container) {
            console.error('Notification container not found');
            return;
        }

        var icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        var icon = icons[type] || 'ℹ';

        var notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        
        var iconDiv = document.createElement('div');
        iconDiv.className = 'notification-icon';
        iconDiv.textContent = icon;
        
        var contentDiv = document.createElement('div');
        contentDiv.className = 'notification-content';
        
        var titleP = document.createElement('p');
        titleP.className = 'notification-title';
        titleP.textContent = title;
        contentDiv.appendChild(titleP);
        
        if (message) {
            var messageP = document.createElement('p');
            messageP.className = 'notification-message';
            messageP.textContent = message;
            contentDiv.appendChild(messageP);
        }
        
        var closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.textContent = '×';
        closeBtn.onclick = function() {
            notification.remove();
        };
        
        notification.appendChild(iconDiv);
        notification.appendChild(contentDiv);
        notification.appendChild(closeBtn);
        
        container.appendChild(notification);

        setTimeout(function() {
            notification.classList.add('hiding');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, duration);

        notification.addEventListener('click', function(e) {
            if (!e.target.classList.contains('notification-close')) {
                this.classList.add('hiding');
                var self = this;
                setTimeout(function() {
                    self.remove();
                }, 300);
            }
        });
    },

    success: function(title, message, duration) {
        this.show('success', title, message, duration);
    },

    error: function(title, message, duration) {
        this.show('error', title, message, duration);
    },

    warning: function(title, message, duration) {
        this.show('warning', title, message, duration);
    },

    info: function(title, message, duration) {
        this.show('info', title, message, duration);
    }
};