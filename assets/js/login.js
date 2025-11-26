// Simulación de base de datos de usuarios
const users = [
    { username: 'marco', password: '1234', name: 'Marco Gonzalez', role: 'Estudiante', email: 'marco@infiniteafo.com' },
    { username: 'rodrigo', password: '1234', name: 'Rodrigo Terraza', role: 'Estudiante', email: 'rodrigo@infiniteafo.com' },
    { username: 'gabriel', password: '1234', name: 'Gabriel Villa', role: 'Estudiante', email: 'gabriel@infiniteafo.com' },
    { username: 'matias', password: '1234', name: 'Matias Flores', role: 'Estudiante', email: 'matias@infiniteafo.com' },
    { username: 'tester', password: 'prueba123', name: 'Usuario de Prueba', role: 'Estudiante', email: 'tester@infiniteafo.com' }
];

// Función para validar el login
function validateLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Intentando login con:', username, password);
    
    // Combinar usuarios predefinidos con usuarios registrados
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const allUsers = [...users, ...registeredUsers];
    
    const user = allUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Guardar usuario en localStorage (sin password por seguridad)
        const userSession = {
            username: user.username,
            name: user.name,
            role: user.role,
            email: user.email
        };
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        
        // Mostrar mensaje de éxito
        showMessage(`¡Bienvenido ${user.name}!`, 'success');
        
        console.log('Login exitoso, redirigiendo...');
        
        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
            // Usar la función de redirección de utils.js
            if (window.AppUtils && window.AppUtils.redirectTo) {
                window.AppUtils.redirectTo('dashboard.html');
            } else {
                // Fallback si utils.js no está cargado
                window.location.href = '/AFO/dashboard.html';
            }
        }, 1000);
    } else {
        console.log('Credenciales incorrectas');
        showMessage('Usuario o contraseña incorrectos', 'error');
    }
}

// Función para mostrar mensajes
function showMessage(message, type) {
    // Remover mensajes anteriores
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} login-message mt-3`;
    messageDiv.textContent = message;
    
    // Insertar después del formulario
    const form = document.getElementById('loginForm');
    form.appendChild(messageDiv);
    
    // Auto-remover después de 5 segundos (solo para éxito)
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Función para recuperar contraseña
function handleForgotPassword(e) {
    e.preventDefault();
    console.log('Navegando a recuperar contraseña');
    
    if (window.AppUtils && window.AppUtils.redirectTo) {
        window.AppUtils.redirectTo('contraseña-olvidada.html');
    } else {
        window.location.href = '/AFO/contraseña-olvidada.html';
    }
}

// Función para manejar el registro
function handleRegister(e) {
    e.preventDefault();
    console.log('Navegando a registro');
    
    if (window.AppUtils && window.AppUtils.redirectTo) {
        window.AppUtils.redirectTo('registrarse.html');
    } else {
        window.location.href = '/AFO/registrarse.html';
    }
}

// Función para verificar si ya hay un usuario logueado
function checkExistingSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('Usuario actual en sesión:', currentUser);
    
    if (currentUser && window.location.pathname.includes('index.html')) {
        console.log('Ya hay sesión, redirigiendo a dashboard');
        if (window.AppUtils && window.AppUtils.redirectTo) {
            window.AppUtils.redirectTo('dashboard.html');
        } else {
            window.location.href = '/AFO/dashboard.html';
        }
    }
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// Función para agregar el icono de mostrar/ocultar contraseña
function addPasswordToggle() {
    const passwordField = document.getElementById('password');
    if (!passwordField) return;
    
    // Crear contenedor para el campo de contraseña
    const passwordContainer = document.createElement('div');
    passwordContainer.className = 'password-container position-relative';
    
    // Mover el input al contenedor
    passwordField.parentNode.insertBefore(passwordContainer, passwordField);
    passwordContainer.appendChild(passwordField);
    
    // Agregar icono de ojo
    const toggleIcon = document.createElement('span');
    toggleIcon.id = 'togglePassword';
    toggleIcon.className = 'fas fa-eye password-toggle';
    toggleIcon.style.cssText = `
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #666;
        z-index: 10;
    `;
    toggleIcon.addEventListener('click', togglePasswordVisibility);
    
    passwordContainer.appendChild(toggleIcon);
    
    // Ajustar padding del input para el icono
    passwordField.style.paddingRight = '40px';
}

// Función para inicializar la aplicación
function initializeApp() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordBtn = document.getElementById('forgotPassword');
    const registerBtn = document.getElementById('register');
    
    console.log('Inicializando aplicación login...');
    
    if (loginForm) {
        loginForm.addEventListener('submit', validateLogin);
        console.log('Formulario de login configurado');
    }
    
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', handleForgotPassword);
        console.log('Botón recuperar contraseña configurado');
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
        console.log('Botón registro configurado');
    }
    
    // Agregar funcionalidad de mostrar/ocultar contraseña
    addPasswordToggle();
    
    // Verificar sesión existente
    checkExistingSession();
    
    // Debug: mostrar usuarios disponibles
    console.log('Usuarios disponibles:', users.map(u => u.username));
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initializeApp);
