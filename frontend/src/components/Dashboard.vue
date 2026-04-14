<template>
    <div class="page-container">
        <!-- Header da Página -->
        <header class="page-header">
            <!-- Botão Menu Hambúrguer -->
            <div class="mobile-menu-btn" @click="toggleMenu">
                <span class="hamburger-icon"></span>
                <span class="hamburger-icon"></span>
                <span class="hamburger-icon"></span>
            </div>

            <div class="greeting">
                <span class="greeting-text">
                    Seja bem-vindo (a), <strong>{{ userName }}</strong>
                </span>
            </div>

            <!-- Ações (botões) - só visíveis no desktop -->
            <div class="actions">
                <router-link to="/appointment" class="btn btn-primary">
                    Agendamentos
                </router-link>
                <button @click="handleLogout" class="btn btn-secondary">
                    Sair
                </button>
            </div>
        </header>

        <!-- Overlay do Menu (Tela Cheia) - FORA DO HEADER -->
        <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu">
            <div class="menu-content" @click.stop>
                <!-- Botão Fechar -->
                <button class="close-btn" @click="closeMenu">
                    ✕
                </button>

                <!-- Menu de Navegação -->
                <nav class="menu-nav">
                    <router-link to="/appointment" class="menu-link" @click="closeMenu">
                        Agendamentos
                    </router-link>
                    <button class="menu-link menu-logout" @click="handleLogout">
                        Sair
                    </button>
                </nav>
            </div>
        </div>

        <!-- Card Principal -->
        <section class="card">
            <div class="card-header">
                <h2>Painel de agendamentos</h2>
                <p class="subtitle">Visualize seus agendamentos cadastrados</p>
            </div>

            <!-- Estado Vazio -->
            <div v-if="appointments.length === 0" class="empty-state">
                <p class="empty-message">Nenhum agendamento encontrado.</p>
                <p class="empty-hint">Realize o cadastro do seu agendamento e atualize a página.</p>
            </div>

            <!-- Lista de Agendamentos -->
            <div v-else class="appointments-list">
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Data</th>
                            <th>Horário</th>
                            <th>CEP</th>
                            <th>Observação</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="apt in appointments" :key="apt.id">
                            <td>{{ apt.paciente }}</td>
                            <td>{{ formatDate(apt.data) }}</td>
                            <td>{{ apt.horario }}</td>
                            <td>{{ apt.cep }}</td>
                            <td>{{ apt.observacaoClima || '-' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios'
import { logout } from '../utils/auth'

export default {
    name: 'DashboardView',
    data() {
        return {
            appointments: [],
            userName: 'Usuário',
            userType: localStorage.getItem('userType') || 'paciente',
            isMenuOpen: false
        }
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return '-'
            const date = new Date(dateString)

            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()

            return `${day}/${month}/${year}`
        },
        getFullName() {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            return userData.nome || 'Usuário'
        },

        getFirstName(fullName) {
            if (!fullName) return 'Usuário'

            const nomeArray = fullName.trim().split(/\s+/)

            if (nomeArray.length === 1) {
                return nomeArray[0]
            }

            return nomeArray[0]
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen
        },
        closeMenu() {
            this.isMenuOpen = false
        },
        async loadAppointments() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('https://projeto-mediora.onrender.com/api/appointments', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                this.appointments = response.data
            } catch (error) {
                console.error('Erro ao carregar agendamentos:', error)
            }
        },
        handleLogout() {
            logout()
        }
    },
    mounted() {

        const userData = JSON.parse(localStorage.getItem('userData') || '{}')

        this.userName = this.getFirstName(userData.nome || 'Usuário')

        this.loadAppointments()
    }
}
</script>

<style scoped>
/* Container Principal */
.page-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 24px;
    padding: 3.5rem 0;
}

/* Cabeçalho */
.page-header {
    display: grid;
    grid-template-columns: 0.7fr 1fr auto;
    align-items: center;
    max-width: 1200px;
    width: 100%;
    padding-left: 2.9rem;
    padding-right: 2.9rem;
}

/* Título do cabeçalho */
.greeting {
    display: flex;
    align-items: center;
    font-size: 2.2rem;
    color: #2c3e50;
}

.actions {
    display: flex;
    gap: 40px;
    justify-self: end;
}

/* Botões */
.btn {
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    will-change: transform;
}

/* Botão Agendamentos */
.btn-primary {
    display: inline-flex;
    min-width: 180px;
    height: 50px;
    padding: 1rem 60px;
    background: #f8f9fa;
    border-radius: 16px;
    text-align: center;
    color: #2c3e50;
    border: 1px solid white;
}

/* Hover do botão Agendamentos */
.btn-primary:hover {
    background: #667eea;
    border: 1px solid #4a63cf;
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
}

/* Botão Sair */
.btn-secondary {
    padding: 0.875rem 30px;
    /* From https://css.glass */
    background: rgba(255, 0, 0, 0.40);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(13.5px);
    -webkit-backdrop-filter: blur(13.5px);
    border: 1px solid rgba(255, 0, 0, 0.19);
    color: white;
}

/* Hover do botão Sair */
.btn-secondary:hover {
    background-color: #BB0202;
    border: 1px solid #8c0000;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
}

.btn:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}

.btn:active {
    transform: translateY(0);
}

/* Card Principal */
.card {
    background: white;
    border-radius: 12px;
    padding: 2.9rem;
    max-width: 1200px;
    width: 100%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
}

/* Cabeçalho do Card */
.card-header {
    margin-bottom: 2rem;
}

.card-header h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    margin-left: 0.2rem;
}

/* Subtítulo do Card */
.subtitle {
    font-size: 1rem;
    color: #666;
    margin-left: 0.2rem;
}

/* Estado Vazio */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
}

.empty-message {
    font-size: 1.25rem;
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.empty-hint {
    font-size: 0.95rem;
    color: #999;
}

/* Lista de Agendamentos */
.appointments-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}

th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
    position: sticky;
    top: 0;
    z-index: 2;
}

tr:hover {
    background-color: #f8f9fa;
}

/* Botão Menu Hambúrguer - Menu responsivo */
.mobile-menu-btn {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 10px;
    z-index: 1000;
}

.hamburger-icon {
    display: block;
    width: 25px;
    height: 3px;
    background-color: #2c3e50;
    border-radius: 2px;
    transition: all 0.3s ease;
}

.hamburger-icon:nth-child(1) {
    transform: translateY(0px);
}

.hamburger-icon:nth-child(3) {
    transform: translateY(0px);
}

/* ============================================
   RESPONSIVIDADE
   ============================================ */

/* Tablets e mobile */
@media (max-width: 768px) {
    .page-container {
        margin-left: 15px;
        margin-right: 15px;
        padding: 1rem;
        gap: 16px;
        position: relative;
        height: 100vh;
    }

    .page-header {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 10px;
        position: sticky;
        top: 0;
        z-index: 100;
        padding: 0.75rem 0;
    }

    .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 5px;
    }

    .greeting {
        margin-left: 8px;
        margin-top: 0;
        font-size: 1.25rem;
        line-height: 1;
    }

    .greeting span {
        text-align: left;
    }

    .actions {
        display: none;
    }

    /* Overlay do Menu (Tela Cheia) */
    .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    }

    /* Menu hambúrguer */
    .menu-content {
        background: #E5CEB3;
        padding: 2rem;
        border-radius: 16px;
        width: 100%;
        height: 100%;
        align-content: center;
        max-width: 400px;
        position: relative;
        animation: slideUp 0.3s ease;
    }

    /* Botão de Fechar o Menu*/
    .close-btn {
        position: absolute;
        top: 3rem;
        right: 1.5rem;
        background: none;
        border: none;
        font-size: 2rem;
        color: #2c3e50;
        cursor: pointer;
        padding: 0.5rem;
        line-height: 1;
    }

    .close-btn:hover {
        color: #e74c3c;
    }

    .menu-nav {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }

    .menu-link {
        display: block;
        padding: 1rem 1.5rem;
        background: #f8f9fa;
        border-radius: 16px;
        text-align: center;
        text-decoration: none;
        color: #2c3e50;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }

    .menu-link:hover {
        background: #667eea;
        color: white;
        transform: translateY(-2px);
    }

    .menu-logout {
        padding: 0.875rem 30px;
        /* From https://css.glass */
        background: rgba(255, 0, 0, 0.40);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(13.5px);
        -webkit-backdrop-filter: blur(13.5px);
        border: 1px solid rgba(255, 0, 0, 0.19);
        color: white;
    }

    .menu-logout:hover {
        background: #e74c3c;
        color: white;
    }

    .card {
        padding: 1.2rem 1.2rem 1.2rem 2rem;
        min-height: 400px;
        max-height: calc(100vh - 150px);
        overflow: hidden;
    }

    .card-header h2 {
        font-size: 1.5rem;
    }

    table {
        font-size: 0.85rem;
    }

    th,
    td {
        padding: 0.75rem;
    }
}

/* Desktop e telas maiores */
@media (min-width: 769px) and (max-width: 1024px) {
    .page-header {
        display: flex;
        align-items: center;
        gap: 15px;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }

    .mobile-menu-btn {
        display: flex !important;
        flex: 0 0 auto;
        margin-top: 5px;
        align-content: center;
    }

    .greeting {
        flex: 0 0 auto;
        font-size: 1.7rem;
    }

    .actions {
        display: none !important;
    }

    .card {
        padding: 1.2rem 1.2rem 1.2rem 2rem;
        min-height: 55vh;
        max-height: 80vh;
        overflow: hidden;
    }

    .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    }

    .menu-content {
        background: #E5CEB3;
        padding: 4rem;
        border-radius: 16px;
        width: 80%;
        max-width: 500px;
        position: relative;
        animation: slideUp 0.3s ease;
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        color: #2c3e50;
        cursor: pointer;
        padding: 0.5rem;
        line-height: 1;
    }

    .close-btn:hover {
        color: #e74c3c;
    }

    .menu-nav {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }

    .menu-link {
        display: block;
        padding: 1rem 1.5rem;
        background: #f8f9fa;
        border-radius: 16px;
        text-align: center;
        text-decoration: none;
        color: #2c3e50;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }

    .menu-link:hover {
        background: #667eea;
        color: white;
        transform: translateY(-2px);
    }

    .menu-logout {
        padding: 0.875rem 30px;
        /* From https://css.glass */
        background: rgba(255, 0, 0, 0.40);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(13.5px);
        -webkit-backdrop-filter: blur(13.5px);
        border: 1px solid rgba(255, 0, 0, 0.19);
        color: white;
    }

    .menu-logout:hover {
        background: #e74c3c;
        color: white;
    }
}

/* Telas menores */
@media (max-width: 375px) {
    .page-container {
        padding: 0.5rem;
        gap: 8px;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .page-header {
        padding: 0.5rem 0;
        gap: 1px;
        position: relative;
        top: 0;
        z-index: 100;
        margin-bottom: 0;
        flex-shrink: 0;
        height: auto;
    }

    .mobile-menu-btn {
        padding: 8px;
    }

    .hamburger-icon {
        width: 20px;
        height: 2px;
    }

    .greeting {
        font-size: 1.2rem;
    }

    .card {
        padding: 1rem;
        height: calc(100vh - 120px);
        min-height: 0;
        overflow-y: auto;
        overflow-x: auto;
        margin-top: 0;
        -webkit-overflow-scrolling: touch;
    }

    .card-header h2 {
        font-size: 1.25rem;
    }

    .subtitle {
        font-size: 0.85rem;
    }

    .menu-content {
        padding: 1.5rem;
        width: 95%;
        max-width: 300px;
    }

    .close-btn {
        font-size: 1.8rem;
        top: 0.5rem;
        right: 0.5rem;
    }

    .menu-link {
        padding: 0.75rem 1rem;
        font-size: 1rem;
    }

    table {
        font-size: 0.7rem;
        min-width: 500px;
    }

    th,
    td {
        padding: 0.5rem;
    }

    .empty-icon {
        font-size: 2.5rem;
    }

    .empty-message {
        font-size: 1rem;
    }

    .empty-hint {
        font-size: 0.8rem;
    }
}

/* Animações */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(50px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>