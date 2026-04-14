<template>
    <div class="appointment-container">
        <LoadingSpinner :show="carregando" :message="loadingMessage" />
        <div class="appointment-card">
            <div class="appointment-header">
                <h2>Agendar Consulta</h2>
                <p>Preencha os campos para agendar</p>
            </div>
            <form @submit.prevent="createAppointment">
                <div class="form-group">
                    <label for="paciente">Nome do Paciente</label>
                    <input id="paciente" v-model="paciente" type="text" placeholder="Nome completo" required />
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="data">Data da Consulta</label>
                        <input id="data" v-model="data" type="date" :min="minDate" :max="maxDate" required />
                        <small v-if="dataError" class="info-text error">{{ dataError }}</small>
                    </div>
                    <div class="form-group">
                        <label for="horario">Horário</label>
                        <input id="horario" v-model="horario" type="time" required />
                    </div>
                </div>
                <div class="form-group">
                    <label for="cep">CEP</label>
                    <input id="cep" v-model="cepFormatado" type="text" placeholder="00000-000" @input="formatarCep"
                        @blur="buscarEndereco" maxlength="9" />
                    <small v-if="carregando" class="info-text">
                        🔍 Buscando endereço...
                    </small>
                    <small v-if="endereco" class="info-text">
                        📍 {{ endereco.logradouro }}, {{ endereco.bairro }}, {{ endereco.localidade }} - {{ endereco.uf
                        }}
                    </small>
                    <small v-if="error && !carregando && cep.length === 8" class="info-text error">
                        ❌ {{ error }}
                    </small>
                </div>
                <div class="form-group">
                    <label for="observacaoClima">Observação de Clima</label>
                    <input id="observacaoClima" v-model="observacaoClima" type="text"
                        placeholder="Ex: Sem previsão de chuva" :disabled="observacaoClimaCarregando" readonly />
                    <small v-if="observacaoClimaCarregando" class="info-text">
                        ⏳ Verificando previsão do tempo...
                    </small>
                    <small v-if="!observacaoClimaCarregando && !observacaoClima && (data || endereco)"
                        class="info-text">
                        ⚠️ Selecione data e CEP para ver previsão
                    </small>
                </div>
                <div class="container-btn">
                    <button type="submit" class="btn btn-primary" :disabled="enviando">
                        <span v-if="enviando">Agendando...</span>
                        <span v-else>Agendar Consulta</span>
                    </button>
                    <div class="back-button-container">
                        <button @click="goBack" class="btn btn-back">
                            Voltar
                        </button>
                    </div>
                </div>
            </form>
            <p v-if="error && !carregando" class="error-message">{{ error }}</p>
            <p v-if="success && !carregando" class="success-message">{{ success }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AppointmentView',
    data() {
        return {
            paciente: '',
            data: '',
            horario: '',
            cep: '',
            cepFormatado: '',
            endereco: null,
            observacaoClima: '',
            observacaoClimaCarregando: false,
            dataError: '',
            error: '',
            success: '',
            carregando: false,
            loadingMessage: '',
            enviando: false
        }
    },
    computed: {
        minDate() {
            const hoje = new Date()
            const ano = hoje.getFullYear()
            const mes = String(hoje.getMonth() + 1).padStart(2, '0')
            const dia = String(hoje.getDate()).padStart(2, '0')
            return `${ano}-${mes}-${dia}`
        },
        maxDate() {
            const futuro = new Date()
            futuro.setFullYear(futuro.getFullYear() + 1)
            const ano = futuro.getFullYear()
            const mes = String(futuro.getMonth() + 1).padStart(2, '0')
            const dia = String(futuro.getDate()).padStart(2, '0')
            return `${ano}-${mes}-${dia}`
        }
    },
    watch: {
        data() {
            this.buscarClima()
        },
        endereco() {
            this.buscarClima()
        }
    },  // ← VÍRGULA CRÍTICA AQUI
    methods: {
        formatarCep() {
            let cepLimpo = this.cepFormatado.replace(/\D/g, '')
            cepLimpo = cepLimpo.substring(0, 8)
            if (cepLimpo.length >= 5) {
                cepLimpo = cepLimpo.substring(0, 5) + '-' + cepLimpo.substring(5)
            }
            this.cepFormatado = cepLimpo
            this.cep = cepLimpo.replace(/\D/g, '')
            console.log('Formatado:', this.cepFormatado, 'Limpo:', this.cep)
            
            if (this.cep.length === 8) {
                this.buscarEndereco()
            } else {
                this.endereco = null
                this.error = ''
            }
        },
        goBack() {
            this.$router.push('/dashboard')
        },
        validarData() {
            if (!this.data) {
                this.dataError = 'Data é obrigatória'
                return false
            }
            const dataSelecionada = new Date(this.data)
            const hoje = new Date()
            hoje.setHours(0, 0, 0, 0)
            if (dataSelecionada < hoje) {
                this.dataError = 'Não é possível agendar para datas passadas'
                return false
            }
            const futuro = new Date()
            futuro.setFullYear(futuro.getFullYear() + 1)
            if (dataSelecionada > futuro) {
                this.dataError = 'Não é possível agendar para mais de 1 ano no futuro'
                return false
            }
            this.dataError = ''
            return true
        },
        async buscarEndereco() {
            this.error = ''
            this.carregando = true
            this.loadingMessage = 'Buscando endereço...'
            console.log('CEP para API:', this.cep)
            if (!this.cep || this.cep.length !== 8) {
                this.endereco = null
                this.error = 'Digite um CEP válido (8 dígitos)'
                this.carregando = false
                return
            }
            try {
                const response = await fetch(`https://viacep.com.br/ws/${this.cep}/json/`)
                const data = await response.json()
                console.log('Resposta ViaCEP:', data)
                if (data.erro) {
                    this.endereco = null
                    this.error = 'CEP não encontrado!'
                } else {
                    this.endereco = data
                    this.error = ''
                    if (this.data) this.buscarClima()
                }
            } catch (error) {
                console.error('Erro:', error)
                this.endereco = null
                this.error = 'Erro de conexão'
            } finally {
                this.carregando = false
            }
        },
        async buscarClima() {
            if (!this.data || !this.endereco) return
            this.observacaoClimaCarregando = true
            this.observacaoClima = ''
            try {
                const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
                const lat = this.endereco.lat || -23.5505
                const lon = this.endereco.lon || -46.6333
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`)
                if (!response.ok) throw new Error('Erro API clima')
                const data = await response.json()
                const diaConsulta = data.list.find(item => new Date(item.dt * 1000).toISOString().split('T')[0] === this.data)
                if (diaConsulta) {
                    const condicao = diaConsulta.weather[0].main.toLowerCase()
                    if (condicao.includes('rain') || condicao.includes('drizzle')) {
                        this.observacaoClima = `⚠️ Chuva prevista`
                    } else if (condicao.includes('clouds')) {
                        this.observacaoClima = `☁️ Céu nublado`
                    } else {
                        this.observacaoClima = `☀️ Tempo bom`
                    }
                } else {
                    this.observacaoClima = '⚠️ Sem previsão'
                }
            } catch (error) {
                console.error('Clima erro:', error)
                this.observacaoClima = '⚠️ Erro clima'
            } finally {
                this.observacaoClimaCarregando = false
            }
        },
        async createAppointment() {
            if (!this.validarData()) return
            this.enviando = true
            this.carregando = true
            this.loadingMessage = 'Salvando...'
            if (!this.cep || this.cep.length !== 8) {
                this.error = 'CEP inválido'
                this.carregando = this.enviando = false
                return
            }
            try {
                const token = localStorage.getItem('token')
                await axios.post('https://projeto-mediora.onrender.com/api/appointments', {
                    paciente: this.paciente,
                    data: this.data,
                    horario: this.horario,
                    cep: this.cep,
                    observacaoClima: this.observacaoClima
                }, { headers: { 'Authorization': `Bearer ${token}` } })
                this.success = 'Agendado com sucesso!'
                setTimeout(() => this.$router.push('/dashboard'), 1500)
            } catch (error) {
                this.error = error.response?.data?.msg || 'Erro ao agendar'
            } finally {
                this.carregando = this.enviando = false
            }
        }
    }
}
</script>

<style scoped>
/* Container principal */
.appointment-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 1rem;
    box-sizing: border-box;
}

/* Card principal */
.appointment-card {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 500px;
    animation: fadeInUp 0.4s ease;
}

/* Cabeçalho do card principal */
.appointment-header {
    text-align: center;
    margin-bottom: 2rem;
}

.appointment-header h2 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 1.75rem;
}

.appointment-header p {
    color: #666;
    font-size: 0.9rem;
}

/* Formulário de agendamentos */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 500;
    font-size: 0.95rem;
}

.form-group input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
}

.form-group input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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
    margin-top: 1rem;
}

/* Botão de agendar */
.btn-primary {
    background: #32A398;
    color: white;
}

/* Hover do botão de agendar */
.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn:active {
    transform: translateY(0);
}

.back-button-container {
    margin-bottom: 1.5rem;
}

/* Botão de voltar */
.btn-back {
    background-color: #f8f9fa;
    color: #2c3e50;
    border: 2px solid #e0e0e0;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

/* Hover do botão de voltar */
.btn-back:hover {
    background-color: #e0e0e0;
    border-color: #ccc;
}

/* Mensagens de feedback */
.error-message {
    color: #e74c3c;
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    padding: 0.75rem;
    background: #ffebee;
    border-radius: 8px;
}

.success-message {
    color: #27ae60;
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    padding: 0.75rem;
    background: #e8f5e9;
    border-radius: 8px;
}

/* Texto de informação */
.info-text {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: #666;
}

.info-text.error {
    color: #e74c3c;
}

/* ============================================
   RESPONSIVIDADE
   ============================================ */

/* Tablets e mobile */
@media (max-width: 768px) {
    .appointment-container {
        padding: 1rem;
        min-height: 100vh;
    }

    .appointment-card {
        padding: 2rem;
        max-width: 100%;
    }

    .appointment-header h2 {
        font-size: 1.5rem;
    }

    .appointment-header p {
        font-size: 0.85rem;
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .form-group {
        margin-bottom: 1.25rem;
    }

    .form-group label {
        font-size: 0.9rem;
    }

    .form-group input {
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

    .btn-back {
        font-size: 0.85rem;
        padding: 0.6rem 1rem;
    }
}

/* Telas muito pequenas */
@media (max-width: 375px) {
    .appointment-container {
        padding: 0.75rem;
        min-height: 100vh;
    }

    .appointment-card {
        padding: 1.5rem;
        max-width: 100%;
        border-radius: 12px;
    }

    .appointment-header {
        margin-bottom: 1.5rem;
    }

    .appointment-header h2 {
        font-size: 1.25rem;
        margin-bottom: 0.4rem;
    }

    .appointment-header p {
        font-size: 0.8rem;
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        font-size: 0.85rem;
        margin-bottom: 0.4rem;
    }

    .form-group input {
        font-size: 0.9rem;
        padding: 0.65rem 0.75rem;
        border-radius: 6px;
    }

    .btn {
        padding: 0.75rem;
        font-size: 0.9rem;
        border-radius: 6px;
    }

    .btn-primary {
        margin-top: 0.75rem;
    }

    .back-button-container {
        margin-bottom: 1rem;
    }

    .btn-back {
        font-size: 0.8rem;
        padding: 0.5rem 0.875rem;
        border-radius: 6px;
    }

    .error-message,
    .success-message {
        font-size: 0.8rem;
        padding: 0.6rem;
        margin-top: 0.75rem;
    }
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