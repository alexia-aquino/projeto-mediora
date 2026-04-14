<template>

    <div class="register-container">
        <LoadingSpinner :show="carregando" message="Criando sua conta..." />
        <div class="register-card">
            <div class="register-header">
                <h2>Cadastre-se</h2>
                <p>Crie sua conta para começar</p>
            </div>
            <form @submit.prevent="register">
                <div class="form-group">
                    <label for="nome">Nome Completo</label>
                    <input id="nome" v-model="nome" type="text" placeholder="Seu nome completo" required />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" v-model="email" type="email" placeholder="seu@email.com" required />
                </div>
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input id="password" v-model="password" type="password" placeholder="••••••••" required />
                </div>
                <div class="form-group">
                    <label for="tipo">Tipo de Usuário</label>
                    <select id="tipo" v-model="tipo" @change="toggleIdFuncionario">
                        <option value="paciente">Paciente</option>
                        <option value="secretario">Secretário</option>
                    </select>
                </div>
                <div class="form-group" v-if="tipo === 'secretario'">
                    <label for="id_funcionario">ID de Funcionário</label>
                    <input id="id_funcionario" v-model="id_funcionario" type="text"
                        placeholder="Digite qualquer valor" />
                    <small class="info-text">* Campo opcional para trabalho acadêmico</small>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="carregando">
                    <span v-if="carregando">Cadastrando...</span>
                    <span v-else>Cadastrar</span>
                </button>
            </form>
            <p v-if="error && !carregando" class="error-message">{{ error }}</p>
            <p v-if="success && !carregando" class="success-message">{{ success }}</p>
            <div class="register-footer">
                <router-link to="/">Já possui conta? Faça login</router-link>
            </div>
        </div>
    </div>
</template>

<script>
// Cliente HTTP para comunicação com backend
import axios from 'axios'

// Router para navegação programática
import { useRouter } from 'vue-router'

export default {
    name: 'RegisterView',

    // Estado reativo do formulário
    data() {
        return {
            nome: '',            // nome completo do usuário
            email: '',           // email de cadastro
            password: '',        // senha
            tipo: 'paciente',    // tipo padrão
            id_funcionario: '',  // campo adicional para secretário
            error: '',           // mensagem de erro
            success: '',         // mensagem de sucesso
            carregando: false    // estado de carregamento
        }
    },

    // Disponibiliza router no contexto do componente
    setup() {
        const router = useRouter()
        return { router }
    },

    methods: {
        // Limpa ID de funcionário caso usuário não seja secretário
        toggleIdFuncionario() {
            if (this.tipo !== 'secretario') {
                this.id_funcionario = ''
            }
        },

        // Realiza requisição de cadastro
        async register() {
            this.carregando = true
            try {

                // Envia dados para API de registro
                await axios.post('https://projeto-mediora.onrender.com/api/auth/register', {
                    nome: this.nome,
                    email: this.email,
                    senha: this.password,
                    tipo: this.tipo,

                    // envia id apenas se secretário
                    id_funcionario: this.tipo === 'secretario' ? this.id_funcionario : null
                })

                // Feedback visual de sucesso
                this.success = 'Cadastro realizado com sucesso!'
                this.error = ''

                // Redirecionamento após pequeno delay para usuário ler mensagem
                setTimeout(() => {
                    this.router.push('/')
                }, 1500)

            } catch (error) {
                this.error = error.response?.data?.msg || 'Erro no cadastro'
            } finally {
                this.carregando = false
            }
        }
    }
}
</script>

<style scoped>
/* Container Principal */
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 2rem;
}

/* Card de Registro */
.register-card {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 420px;
}

/* Cabeçalho do Formulário */
.register-header {
    text-align: center;
    margin-bottom: 2rem;
}

.register-header h2 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.register-header p {
    color: #666;
    font-size: 0.9rem;
}

/* Formulário */
.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #667eea;
}

/* Botões */
.btn {
    width: 100%;
    padding: 0.875rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

/* Botão primário */
.btn-primary {
    background-color: #32A398;
    color: white;
}

/* Hover do botão primário */
.btn-primary:hover {
    background-color: #667eea;
    transform: translateY(-2px);
}

/* Mensagens */
.error-message {
    color: #e74c3c;
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
}

.success-message {
    color: #27ae60;
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
}

/* Link do rodapé do formulário - voltar para o Login */
.register-footer {
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e0e0e0;
}

.register-footer a {
    color: #667eea;
    text-decoration: none;
    font-size: 0.9rem;
}

.register-footer a:hover {
    text-decoration: underline;
}

/* Texto de Informação */
.info-text {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: #666;
}

/* ============================================
    Responsividade
   ============================================ */

/* Tablets e mobile */
@media (max-width: 768px) {
    .register-container {
        padding: 1rem;
        min-height: 100vh;
    }

    .register-card {
        padding: 2rem;
        max-width: 100%;
    }

    .register-header h2 {
        font-size: 1.5rem;
    }

    .register-header p {
        font-size: 0.85rem;
    }

    .form-group {
        margin-bottom: 1.25rem;
    }

    .form-group label {
        font-size: 0.9rem;
    }

    .form-group input,
    .form-group select {
        font-size: 0.95rem;
        padding: 0.7rem 0.875rem;
    }

    .btn {
        padding: 0.875rem;
        font-size: 0.95rem;
    }

    .error-message,
    .success-message {
        font-size: 0.85rem;
        padding: 0.65rem;
    }

    .register-footer a {
        font-size: 0.85rem;
    }

    .info-text {
        font-size: 0.75rem;
    }
}

/* Telas muito pequenas */
@media (max-width: 375px) {
    .register-container {
        padding: 0.75rem;
        min-height: 100vh;
    }

    .register-card {
        padding: 1.5rem;
        max-width: 100%;
        border-radius: 12px;
    }

    .register-header {
        margin-bottom: 1.5rem;
    }

    .register-header h2 {
        font-size: 1.25rem;
        margin-bottom: 0.4rem;
    }

    .register-header p {
        font-size: 0.8rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        font-size: 0.85rem;
        margin-bottom: 0.4rem;
    }

    .form-group input,
    .form-group select {
        font-size: 0.9rem;
        padding: 0.65rem 0.75rem;
        border-radius: 6px;
    }

    .btn {
        padding: 0.75rem;
        font-size: 0.9rem;
        border-radius: 6px;
    }

    .error-message,
    .success-message {
        font-size: 0.8rem;
        padding: 0.6rem;
        margin-top: 0.75rem;
    }

    .register-footer {
        margin-top: 1.25rem;
        padding-top: 1.25rem;
    }

    .register-footer a {
        font-size: 0.8rem;
    }

    .info-text {
        font-size: 0.7rem;
        margin-top: 0.4rem;
    }
}

/* ============================================
   ANIMAÇÕES DE ENTRADA
   ============================================ */

.register-card {
    animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>