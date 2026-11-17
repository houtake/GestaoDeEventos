<template>
  <div class="calendario-container">
    <header class="cabecalho">
      <div>
        <h1>Calendário de Eventos</h1>
        <p>Logado como: <strong>{{ utilizadorAtual?.nome }}</strong> ({{ utilizadorAtual?.papel }})</p>
      </div>
      
      <div class="acoes-cabecalho">
        <!-- leva pra pagina -->
        <button 
          v-if="utilizadorAtual?.papel === 'admin'" 
          class="btn-admin" 
          @click="router.push('/admin')">
          Painel Admin
        </button>

        <button 
          v-if="utilizadorAtual?.papel === 'admin'" 
          class="btn-adicionar" 
          @click="modalGlobalAberto = true">
          + Novo Evento
        </button>
      </div>
    </header>
    
    <div class="barra-filtros">
      <input 
        v-model="filtroTexto" 
        type="text" 
        placeholder="Buscar por título ou pessoa..." 
        class="filtro-input-texto"
      />
      
      <div class="filtros-data">
        <select v-model="filtroAno" class="filtro-select">
          <option :value="2025">2025</option>
          <option :value="2026">2026</option>
          <option :value="2027">2027</option>
        </select>

        <select v-model="filtroMes" class="filtro-select">
          <option v-for="mes in 12" :key="mes" :value="mes">
            Mês {{ mes.toString().padStart(2, '0') }}
          </option>
        </select>

        <select v-model="filtroDia" class="filtro-select">
          <option value="">Todos os Dias</option>
          <option v-for="dia in 31" :key="dia" :value="dia">
            Dia {{ dia.toString().padStart(2, '0') }}
          </option>
        </select>

        <button @click="limparFiltros" class="btn-limpar">Limpar</button>
      </div>
    </div>

   <!-- Detalha a grelha sendo vista no momento -->
    <GrelhaCalendario 
      :eventos="eventosFiltrados" 
      :mesAtual="filtroMes" 
      :anoAtual="filtroAno" 
      @adicionar-evento="lidarComNovoEvento"
      @excluir-evento="lidarComExclusao"
      @editar-evento="lidarComEdicao"
    />
    <ModalDia 
      :visivel="modalGlobalAberto"
      :dia="1" 
      :mes="filtroMes" 
      :ano="filtroAno"
      :eventos="[]"
      @fechar="modalGlobalAberto = false"
      @adicionar="(novo) => { lidarComNovoEvento(novo); modalGlobalAberto = false }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import CartaoEvento from '../components/CartaoEvento.vue'
import GrelhaCalendario from '../components/GrelhaCalendario.vue'
import { utilizadorAtual, tokenAutenticacao } from '../data/auth.js' 
import ModalDia from '../components/ModalDia.vue'

const eventosAPI = ref([])
const router = useRouter()

// 1. Variáveis Reativas para os Filtros
const filtroTexto = ref('')
const filtroAno = ref(2026) // Ano central do sistema
const filtroMes = ref(10) // Começa em Outubro
const filtroDia = ref('') // Vazio significa "todos os dias"
const modalGlobalAberto = ref(false)

const eventosFiltrados = computed(() => {
  return eventosAPI.value.filter(evento => {
    // Filtro por Texto (Título ou Pessoas envolvidas)
    const termo = filtroTexto.value.toLowerCase()
    const matchTexto = !termo || 
      evento.titulo.toLowerCase().includes(termo) || 
      evento.pessoas.some(p => p.toLowerCase().includes(termo))
    
    // Filtro por Dia
    const diaDoEvento = evento.data.split('-')[2] // Extrai apenas o dia da data "YYYY-MM-DD"
    const matchDia = !filtroDia.value || diaDoEvento === filtroDia.value.toString().padStart(2, '0')

    return matchTexto && matchDia
  })
})

// 3. Função para Limpar os Filtros
const limparFiltros = () => {
  filtroTexto.value = ''
  filtroAno.value = 2026
  filtroMes.value = 10
  filtroDia.value = ''
}

// Busca os eventos do servidor Node.js
const carregarEventos = async () => {
  // Se não tiver token, manda de volta para o login
  if (!tokenAutenticacao.value) {
    alert("Acesso negado. Faça login primeiro.")
    router.push('/')
    return
  }

  try {
    const resposta = await fetch('http://localhost:3000/eventos', {
      method: 'GET',
      headers: {
        'Authorization': tokenAutenticacao.value // Envia o token
      }
    })

    if (resposta.status === 401) {
      alert("Sessão inválida ou expirada. Faça login novamente.")
      router.push('/')
      return
    }

    // atualiza pela resposta
    const dados = await resposta.json()
    eventosAPI.value = dados

  } catch (erro) {
    console.error("Erro ao carregar eventos:", erro)
  }
}

// Executa a função carregarEventos assim que a tela abre
onMounted(() => {
  carregarEventos()
})

// Salva o novo evento de fato na API
const lidarComNovoEvento = async (novoEvento) => {
  try {
    const resposta = await fetch('http://localhost:3000/eventos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': tokenAutenticacao.value
      },
      // Convertendo o evento do Vue para texto JSON para o Node.js entender
      body: JSON.stringify(novoEvento)
    })

    if (resposta.ok) {
      const eventoCriado = await resposta.json()
      // Adiciona na tela apenas se o backend confirmou (status 201)
      eventosAPI.value.push(eventoCriado)
    } else {
      const erroDados = await resposta.json()
      alert("Erro ao criar evento: " + erroDados.erro)
    }
  } catch (erro) {
    console.error("Erro ao salvar:", erro)
  }
}
// Excluir evento através da API
const lidarComExclusao = async (idParaExcluir) => {
  // Pede confirmação antes de apagar
  if (!confirm("Tem certeza que deseja excluir este evento?")) return;

  try {
    const resposta = await fetch(`http://localhost:3000/eventos/${idParaExcluir}`, {
      method: 'DELETE',
      headers: {
        'Authorization': tokenAutenticacao.value
      }
    })

    if (resposta.ok) {
      // Remove o evento visualmente da tela se a API confirmar a exclusão
      eventosAPI.value = eventosAPI.value.filter(e => e.id !== idParaExcluir)
    } else {
      alert("Erro ao excluir o evento no servidor.")
    }
  } catch (erro) {
    console.error("Erro na exclusão:", erro)
  }
}
// Atualizar evento existente (PUT)
const lidarComEdicao = async (eventoEditado) => {
  try {
    const resposta = await fetch(`http://localhost:3000/eventos/${eventoEditado.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': tokenAutenticacao.value
      },
      body: JSON.stringify(eventoEditado)
    })

    if (resposta.ok) {
      const eventoAtualizadoAPI = await resposta.json()
      //teste de commit
      // Encontra a posição do evento antigo na lista e substitui pelo novo
      const index = eventosAPI.value.findIndex(e => e.id === eventoAtualizadoAPI.id)
      if (index !== -1) {
        eventosAPI.value[index] = eventoAtualizadoAPI
      }
    } else {
      alert("Erro ao editar o evento.")
    }
  } catch (erro) {
    console.error("Erro na edição:", erro)
  }
}
</script>

<style scoped>
.calendario-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.acoes-cabecalho {
  display: flex;
  gap: 15px;
  align-items: center;
}

/* Estilo do novo Botão Admin */
.btn-admin {
  background-color: #607d8b; /* Cinza azulado para diferenciar da ação principal */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-admin:hover {
  background-color: #455a64;
}

.btn-adicionar {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-adicionar:hover {
  background-color: #45a049;
}

.titulo-secao {
  margin-top: 40px;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #333;
}

.barra-filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: space-between;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.filtro-input-texto {
  flex-grow: 1;
  min-width: 250px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.filtros-data {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filtro-select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.btn-limpar {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-limpar:hover {
  background-color: #d32f2f;
}
</style>