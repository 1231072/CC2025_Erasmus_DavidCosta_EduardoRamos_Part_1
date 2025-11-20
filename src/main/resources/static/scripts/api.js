// A URL base da sua API Spring Boot
const BASE_URL = 'https://erasmus-cc2025-api.azurewebsites.net/api';

// --- Funções de Autenticação ---

async function registerUser(username, password) {
    const url = `${BASE_URL}/auth/register`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return response;
}

async function loginUser(username, password) {
    const url = `${BASE_URL}/auth/login`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        const jwt = data.token;
        localStorage.setItem('jwtToken', jwt);
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('jwtToken');
    // NÃO use window.location.reload() aqui se estiver a chamar dentro de um loop
}

function getAuthHeader() {
    const token = localStorage.getItem('jwtToken');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

// --- Funções de Consumo de Dados ---

async function fetchItems() {
    const url = `${BASE_URL}/items`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeader()
        });

        if (response.ok) {
            return await response.json();
        }

        // 🛑 CORREÇÃO DO LOOP INFINITO 🛑
        if (response.status === 401 || response.status === 403) {
            console.warn("Sessão inválida. A fazer logout...");
            logout(); // Limpa o token

            // Em vez de recarregar a página (que causa o loop),
            // apenas forçamos a UI a mostrar o ecrã de login.
            // O ui.js deve detetar que não há token na próxima interação.
            if (typeof showView === 'function') {
                showView('auth-view');
            }
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar items:", error);
        return [];
    }
    return [];
}

async function createItem(name) {
    const url = `${BASE_URL}/items`;
    const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ name: name })
    });
    return response;
}