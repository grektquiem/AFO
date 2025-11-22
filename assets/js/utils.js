// Utilidades generales para la aplicación

// Función para detectar si estamos en GitHub Pages
function isGitHubPages() {
    return window.location.hostname.includes('github.io');
}

// Función para obtener la ruta base
function getBasePath() {
    if (isGitHubPages()) {
        const path = window.location.pathname;
        // Obtener el nombre del repositorio de la URL
        const repoName = path.split('/')[1];
        return repoName ? '/' + repoName : '';
    }
    return '';
}

// Función para resolver rutas correctamente
function resolvePath(path) {
    const base = getBasePath();
    
    if (path.startsWith('./')) {
        return base + path.substring(1);
    }
    
    if (path.startsWith('/')) {
        return base + path;
    }
    
    if (path.startsWith('http')) {
        return path;
    }
    
    return base + '/' + path;
}

// Función para redireccionar correctamente
function redirectTo(path) {
    window.location.href = resolvePath(path);
}

// Función para verificar autenticación (común a todas las páginas)
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAuthPage = window.location.pathname.includes('index.html') || 
                      window.location.pathname.includes('registrarse.html') ||
                      window.location.pathname.includes('contraseña-olvidada.html');
    
    if (currentUser && isAuthPage) {
        redirectTo('dashboard.html');
        return null;
    }
    
    if (!currentUser && !isAuthPage) {
        redirectTo('index.html');
        return null;
    }
    
    return currentUser;
}

// Función para cargar información del usuario
function loadUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userElements = document.querySelectorAll('#currentUser, #welcomeUser');
    
    if (currentUser && userElements.length > 0) {
        userElements.forEach(element => {
            element.textContent = currentUser.name || 'Usuario';
        });
    }
}

// Función para formatear fechas
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para calcular porcentaje
function calculatePercentage(part, total) {
    return total > 0 ? Math.round((part / total) * 100) : 0;
}

// Función para generar ID único
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Función para guardar datos en localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
        return false;
    }
}

// Función para cargar datos de localStorage
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error cargando de localStorage:', error);
        return null;
    }
}

// Función para limpiar datos específicos de localStorage
function clearStorageData(keys) {
    if (Array.isArray(keys)) {
        keys.forEach(key => localStorage.removeItem(key));
    } else {
        localStorage.removeItem(keys);
    }
}

// Función para inicializar la página con autenticación
function initializePage() {
    // Verificar autenticación
    const user = checkAuth();
    
    // Cargar información del usuario si está logueado
    if (user) {
        loadUserInfo();
    }
    
    // Configurar logout si existe el botón
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                localStorage.removeItem('currentUser');
                redirectTo('index.html');
            }
        });
    }
    
    console.log('Página inicializada correctamente');
    console.log('Ruta base:', getBasePath());
    console.log('Usuario:', user);
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initializePage);

// Exportar funciones para uso global
window.AppUtils = {
    isGitHubPages,
    getBasePath,
    resolvePath,
    redirectTo,
    formatDate,
    calculatePercentage,
    generateId,
    isValidEmail,
    showNotification,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearStorageData,
    checkAuth,
    loadUserInfo
};