const NotificationSystem = {
    show: function(type, title, message, duration = 3000) {
        const container = document.getElementById('notificationContainer');
        
        if (!container) {
            console.error('Notification container not found!');
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="NotificationSystem.close(this)">×</button>
            <div class="notification-progress"></div>
        `;
        
        container.appendChild(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                this.close(notification.querySelector('.notification-close'));
            }, duration);
        }
    },
    
    close: function(button) {
        const notification = button.closest('.notification');
        if (notification) {
            notification.classList.add('removing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    },
    
    success: function(title, message, duration = 3000) {
        this.show('success', title, message, duration);
    },
    
    error: function(title, message, duration = 4000) {
        this.show('error', title, message, duration);
    },
    
    warning: function(title, message, duration = 3500) {
        this.show('warning', title, message, duration);
    },
    
    info: function(title, message, duration = 3000) {
        this.show('info', title, message, duration);
    }
};

window.notify = NotificationSystem;