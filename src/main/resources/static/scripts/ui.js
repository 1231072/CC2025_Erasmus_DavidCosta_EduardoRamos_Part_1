document.addEventListener('DOMContentLoaded', () => {
    // Referências do DOM
    const authView = document.getElementById('auth-view');
    const dataView = document.getElementById('data-view');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const createItemForm = document.getElementById('create-item-form');
    const logoutButton = document.getElementById('logout-button');
    const authMessage = document.getElementById('auth-message');
    const itemMessage = document.getElementById('item-message');

    // --- Gestão de Vistas ---

    function showView(viewId) {
        authView.classList.add('hidden');
        dataView.classList.add('hidden');
        document.getElementById(viewId).classList.remove('hidden');
    }

    function checkAuthAndShow() {
        if (localStorage.getItem('jwtToken')) {
            showView('data-view');
            loadItems();
        } else {
            showView('auth-view');
        }
    }

    // --- Handlers de Eventos ---

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authMessage.textContent = '';
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const success = await loginUser(username, password);

        if (success) {
            checkAuthAndShow();
        } else {
            authMessage.textContent = 'Erro de login. Verifique as credenciais.';
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authMessage.textContent = '';
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        const response = await registerUser(username, password);

        if (response.status === 201) {
            authMessage.textContent = 'Registo bem-sucedido! Pode fazer login.';
            registerForm.classList.add('hidden');
            document.getElementById('show-register').textContent = 'Registar';
        } else {
            const error = await response.text();
            authMessage.textContent = `Erro de registo: ${error}`;
        }
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = registerForm.classList.toggle('hidden');
        showRegisterLink.textContent = isHidden ? 'Registar' : 'Esconder Formulário';
    });

    logoutButton.addEventListener('click', () => {
        logout();
        checkAuthAndShow();
    });

    createItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        itemMessage.textContent = '';
        const name = document.getElementById('item-name').value;

        const response = await createItem(name);

        if (response.status === 201) {
            document.getElementById('item-name').value = ''; // Limpar input
            loadItems();
            itemMessage.textContent = 'Item criado com sucesso!';
            itemMessage.style.color = 'green';
        } else {
            itemMessage.textContent = 'Erro ao criar item. Sessão válida?';
            itemMessage.style.color = 'red';
        }
    });

    // --- Lógica de Renderização de Dados ---

    async function loadItems() {
        const items = await fetchItems();
        renderTable(items);
    }

    function renderTable(items) {
        const container = document.getElementById('items-table-container');
        if (items.length === 0) {
            container.innerHTML = '<p>Nenhum item encontrado. Por favor, crie um.</p>';
            return;
        }

        let html = '<table><thead><tr><th>ID</th><th>Nome</th></tr></thead><tbody>';
        items.forEach(item => {
            // Assumindo que a sua entidade Item tem campos 'id' e 'name'
            html += `<tr><td>${item.id}</td><td>${item.name}</td></tr>`;
        });
        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // Iniciar a aplicação verificando se há token
    checkAuthAndShow();
});