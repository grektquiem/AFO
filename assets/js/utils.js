// Utilidades generales para la aplicación INFINITE AFO

// Configuración específica para el repositorio AFO
const REPO_NAME = 'AFO';

// Función para detectar si estamos en GitHub Pages
function isGitHubPages() {
    return window.location.hostname.includes('github.io');
}

// Función para obtener la ruta base
function getBasePath() {
    if (isGitHubPages()) {
        return '/' + REPO_NAME;
    }
    return '';
}

// Función para resolver rutas correctamente
function resolvePath(path) {
    const base = getBasePath();
    
    // Si ya es una ruta completa, no hacer cambios
    if (path.startsWith('http')) {
        return path;
    }
    
    // Si la ruta ya incluye el base path, no duplicar
    if (path.includes(REPO_NAME)) {
        return path;
    }
    
    // Para rutas relativas
    if (path.startsWith('./')) {
        return base + path.substring(1);
    }
    
    // Para rutas absolutas
    if (path.startsWith('/')) {
        return base + path;
    }
    
    // Para rutas sin slash
    return base + '/' + path;
}

// Función para redireccionar correctamente
function redirectTo(path) {
    const resolvedPath = resolvePath(path);
    console.log('Redirigiendo a:', resolvedPath);
    window.location.href = resolvedPath;
}

// Función para verificar autenticación (común a todas las páginas)
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPath = window.location.pathname;
    
    console.log('Verificando autenticación para:', currentPath);
    console.log('Usuario actual:', currentUser);
    
    const isAuthPage = currentPath.includes('index.html') || 
                      currentPath.includes('registrarse.html') ||
                      currentPath.includes('contraseña-olvidada.html');
    
    if (currentUser && isAuthPage) {
        console.log('Usuario autenticado en página de auth, redirigiendo a dashboard');
        redirectTo('dashboard.html');
        return null;
    }
    
    if (!currentUser && !isAuthPage) {
        console.log('Usuario no autenticado, redirigiendo a login');
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

// Función para inicializar la página con autenticación
function initializePage() {
    console.log('=== INICIALIZANDO PÁGINA ===');
    console.log('Repositorio:', REPO_NAME);
    console.log('Ruta base:', getBasePath());
    console.log('URL actual:', window.location.href);
    
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
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initializePage);

// Exportar funciones para uso global
window.AppUtils = {
    REPO_NAME,
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
    checkAuth,
    loadUserInfo
};
