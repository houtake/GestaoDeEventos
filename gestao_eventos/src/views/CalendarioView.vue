<template>
  <div class="calendario-container">
    <header class="cabecalho">
      <div>
        <h1>Calendário de Eventos</h1>
        <p>Logado como: <strong>{{ utilizadorAtual?.nome }}</strong> ({{ utilizadorAtual?.papel }})</p>
      </div>
      
      <!-- so adm ve botao -->
      <button v-if="utilizadorAtual?.papel === 'admin'" class="btn-adicionar">
        + Novo Evento
      </button>
    </header>
    
   <!-- Detalha a grelha sendo vista no momento -->
    <GrelhaCalendario 
      :eventos="eventosAPI" 
      :mesAtual="10" 
      :anoAtual="2026" 
      @adicionar-evento="lidarComNovoEvento"
      @excluir-evento="lidarComExclusao"
      @editar-evento="lidarComEdicao"
    />
    
  </div>
</template>

<script setup>
console.log(teste)
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CartaoEvento from '../components/CartaoEvento.vue'
import GrelhaCalendario from '../components/GrelhaCalendario.vue'
import { utilizadorAtual, tokenAutenticacao } from '../data/auth.js' 

const eventosAPI = ref([])
const router = useRouter()

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
</style>