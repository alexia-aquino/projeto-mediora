<template>
    <div class="login-container">

        <LoadingSpinner :show="carregando" message="Fazendo login..." />

        <!-- Container principal centraliza o card de login na tela -->
        <div class="login-card">

            <!-- Coluna Esquerda: Imagem -->
            <div class="login-image">
                <img src="../assets/imagem-login.png"
                    alt="Imagem de uma médica segurando um estetoscópio de braços cruzados." width="100%">
            </div>

            <!-- Coluna Direita: Formulário -->
            <div class="login-form">
                <div class="form-header">
                    <h1>Login</h1>
                    <p>Acesse suas consultas e realize agendamentos em qualquer hora, em qualquer lugar!</p>
                </div>

                <!--
                    submit.prevent:
                    - impede reload da página
                    - executa método login()
                -->
                <form @submit.prevent="login">
                    <div class="form-group">
                        <label for="email">Email</label>

                        <!-- v-model cria binding reativo com data().email -->
                        <input id="email" v-model="email" type="email" placeholder="seu@email.com" required />
                    </div>

                    <!-- Campo de senha vinculado ao estado password -->
                    <div class="form-group">
                        <label for="password">Senha</label>
                        <input id="password" v-model="password" type="password" placeholder="••••••••" required />
                    </div>

                    <!-- Botão que dispara autenticação -->
                    <button type="submit" class="btn btn-primary" :disabled="carregando">
                        <span v-if="carregando">Entrando...</span>
                        <span v-else>Entrar</span>
                    </button>
                </form>

                <transition name="fade-slide">
                    <p v-if="error && !carregando" class="error-message">
                        {{ error }}
                    </p>
                </transition>

                <!-- Separador visual -->
                <hr class="divider" />

                <!-- Navegação para tela de cadastro -->
                <div class="register-link">
                    <router-link to="/register">Ainda não possui uma conta? Cadastre-se</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Cliente HTTP para comunicação com API
import axios from 'axios'

// Hook do Vue Router para navegação programática
import { useRouter } from 'vue-router'

// Estado reativo do formulário
export default {
    name: 'LoginView',
    data() {
        return {
            email: '',       // email informado pelo usuário
            password: '',   // senha informada
            error: '',      // mensagem de erro retornada pela API
            carregando: false // estado de carregamento
        }
    },

    // Disponibiliza router dentro do componente para navegação após login bem-sucedido
    setup() {
        const router = useRouter()
        return { router }
    },
    methods: {

        // Realiza autenticação do usuário
        async login() {

            this.carregando = true

            // limpa erro anterior
            this.error = ''

            try {
                const response = await axios.post('https://projeto-mediora.onrender.com/api/auth/login', {
                    email: this.email,
                    senha: this.password
                })

                // salva sessão
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('userType', response.data.user.tipo)
                localStorage.setItem('userData', JSON.stringify(response.data.user))

                // redireciona
                this.$router.push('/dashboard')

            } catch (error) {
                console.log('Erro login:', error)

                if (error.response && error.response.data && error.response.data.msg) {
                    this.error = error.response.data.msg
                } else {
                    this.error = 'Erro ao realizar login'
                }
            } finally {
                this.carregando = false
            }
        }
    }
}
</script>

<style scoped>
/* Container principal da página de login */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* Card Principal */
.login-card {
    display: flex;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-width: 1000px;
    width: 100%;
    min-height: 500px;
}

/* Coluna Esquerda: Imagem */
.login-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem;
}

/* Ajuste visual da imagem */
.login-image img {
    justify-content: center;
    align-items: center;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
}

/* Placeholder preparado para possíveis estados futuros */
.image-placeholder img {
    color: #999;
}

.image-placeholder span {
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
}

/* Coluna Direita: Formulário */
.login-form {
    flex: 1;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Cabeçalho do Formulário */
.form-header {
    text-align: center;
    margin-bottom: 2.5rem;
}

.form-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.form-header p {
    font-size: 0.95rem;
    color: #666;
}

/* Campos do Formulário */
.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
    font-size: 0.95rem;
}

/* Inputs do formulário */
.form-group input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

/* Estado de foco do input */
.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Botões */
.btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

/* Botão principal */
.btn-primary {
    background-color: #32A398;
    color: white;
}

/* Hover do botão principal */
.btn-primary:hover {
    background-color: #667eea;
    transform: translateY(-2px);
}

/* Estado ativo do botão principal */
.btn:active {
    transform: translateY(0);
}

/* Divisor Visual */
.divider {
    border: none;
    border-top: 1px solid #ddd;
    margin: 1.5rem 0;
}

/* Área do link de cadastro */
.register-link {
    text-align: center;
    margin-top: 1rem;
}

/* Estilo do link */
.register-link a {
    color: #32A398;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
}

.register-link a:hover {
    color: #5568d3;
    text-decoration: underline;
}

/* Mensagem de Erro */
.error-message {
    color: #e74c3c;
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
}

/* ============================================
    Responsividade
   ============================================ */

/* Tablets e mobile */
@media (max-width: 768px) {
    .login-card {
        flex-direction: column;
        margin: 1.5rem;
        max-width: 500px;
    }

    /* Oculta imagem em telas menores */
    .login-image {
        display: none;
    }

    .login-form {
        padding: 2rem;
    }

    .register-link {
        margin-top: 0;
    }

    .form-header h1 {
        font-size: 1.75rem;
    }
}

/* Telas muito pequenas */
@media (max-width: 375px) {
    .login-container {
        padding: 1rem;
    }

    .login-form {
        padding: 1.5rem;
    }

}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.35s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>