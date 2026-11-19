<template>
  <div class="admin-container">
    <header class="cabecalho">
      <h1>Painel de Administração</h1>
      <router-link to="/calendario" class="btn-voltar">Voltar ao Calendário</router-link>
    </header>

    <div v-if="utilizadorAtual?.papel !== 'admin'" class="alerta-erro">
      Acesso Negado. Apenas administradores podem ver esta página.
    </div>

    <div v-else>
      <!-- Navegação por Abas -->
      <div class="abas">
        <button 
          class="btn-aba" 
          :class="{ ativa: abaAtiva === 'usuarios' }" 
          @click="abaAtiva = 'usuarios'"
        >
          Utilizadores
        </button>
        <button 
          class="btn-aba" 
          :class="{ ativa: abaAtiva === 'categorias' }" 
          @click="abaAtiva = 'categorias'"
        >
          Categorias de Eventos
        </button>
      </div>

      <!-- ABA 1: UTILIZADORES -->
      <div v-if="abaAtiva === 'usuarios'" class="admin-conteudo">
        <div class="cartao-form">
          <h2>Criar Novo Utilizador</h2>
          <form @submit.prevent="criarUsuario">
            <input v-model="novoNome" type="text" placeholder="Nome de Utilizador" required class="input-form"/>
            <input v-model="novaSenha" type="password" placeholder="Senha" required class="input-form"/>
            <select v-model="novoPapel" class="input-form">
              <option value="espectador">Membro da Equipa</option>
              <option value="admin">Administrador</option>
            </select>
            <button type="submit" class="btn-salvar">Adicionar Utilizador</button>
          </form>
        </div>

        <div class="cartao-lista">
          <h2>Utilizadores Registados</h2>
          <ul>
            <li v-for="user in listaUsuarios" :key="user.id" class="item-lista">
              <strong>{{ user.nome }}</strong> 
              <span class="badge" :class="user.papel">{{ user.papel }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- ABA 2: CATEGORIAS DE EVENTOS -->
      <div v-if="abaAtiva === 'categorias'" class="admin-conteudo">
        <div class="cartao-form">
          <h2>Nova Categoria de Evento</h2>
          <form @submit.prevent="criarCategoria">
            <input 
              v-model="novaCategoria" 
              type="text" 
              placeholder="Ex: Workshop, Treinamento, Prazo..." 
              required 
              class="input-form"
            />
            <button type="submit" class="btn-salvar">Adicionar Categoria</button>
          </form>
        </div>

        <div class="cartao-lista">
          <h2>Categorias Disponíveis</h2>
          <ul>
            <li v-for="cat in listaCategorias" :key="cat.id" class="item-lista">
              <strong>{{ cat.nome }}</strong>
              <span class="badge categoria">{{ cat.valor }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { utilizadorAtual, tokenAutenticacao } from '../data/auth.js'

const router = useRouter()
const abaAtiva = ref('usuarios') // Controla qual aba está aberta

// Estado de Utilizadores
const listaUsuarios = ref([])
const novoNome = ref('')
const novaSenha = ref('')
const novoPapel = ref('espectador')

// Estado de Categorias
const listaCategorias = ref([])
const novaCategoria = ref('')

const carregarUsuarios = async () => {
  if (utilizadorAtual.value?.papel !== 'admin') return
  try {
    const resposta = await fetch('http://localhost:3000/usuarios', {
      headers: { 'Authorization': tokenAutenticacao.value }
    })
    if (resposta.ok) listaUsuarios.value = await resposta.json()
  } catch (erro) {
    console.error("Erro ao carregar utilizadores:", erro)
  }
}

const carregarCategorias = async () => {
  if (utilizadorAtual.value?.papel !== 'admin') return
  try {
    const resposta = await fetch('http://localhost:3000/tipos-evento', {
      headers: { 'Authorization': tokenAutenticacao.value }
    })
    if (resposta.ok) listaCategorias.value = await resposta.json()
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro)
  }
}

const criarUsuario = async () => {
  try {
    const resposta = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': tokenAutenticacao.value
      },
      body: JSON.stringify({
        nome: novoNome.value,
        senha: novaSenha.value,
        papel: novoPapel.value
      })
    })

    if (resposta.ok) {
      const usuarioCriado = await resposta.json()
      listaUsuarios.value.push(usuarioCriado)
      novoNome.value = ''
      novaSenha.value = ''
      alert("Utilizador criado com sucesso!")
    } else {
      const erro = await resposta.json()
      alert("Erro: " + erro.erro)
    }
  } catch (erro) {
    console.error("Erro ao criar utilizador:", erro)
  }
}

const criarCategoria = async () => {
  try {
    const resposta = await fetch('http://localhost:3000/tipos-evento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': tokenAutenticacao.value
      },
      body: JSON.stringify({ nome: novaCategoria.value })
    })

    if (resposta.ok) {
      const categoriaCriada = await resposta.json()
      listaCategorias.value.push(categoriaCriada)
      novaCategoria.value = ''
      alert("Categoria adicionada com sucesso!")
    } else {
      const erro = await resposta.json()
      alert("Erro: " + erro.erro)
    }
  } catch (erro) {
    console.error("Erro ao criar categoria:", erro)
  }
}

onMounted(() => {
  if (!tokenAutenticacao.value) {
    router.push('/')
  } else {
    carregarUsuarios()
    carregarCategorias()
  }
})
</script>

<style scoped>
.admin-container { padding: 20px; max-width: 1000px; margin: 0 auto; }
.cabecalho { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-voltar { background-color: #607d8b; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; }

/* Estilos das Abas */
.abas { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; }
.btn-aba { background: #f5f5f5; border: 1px solid #ccc; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; color: #555; }
.btn-aba.ativa { background: #2196F3; color: white; border-color: #2196F3; }

.admin-conteudo { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.cartao-form, .cartao-lista { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.input-form { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.btn-salvar { background-color: #4CAF50; color: white; border: none; padding: 10px; width: 100%; border-radius: 4px; cursor: pointer; font-weight: bold; }
.item-lista { padding: 15px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.badge { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; }
.badge.admin { background-color: #ffe0b2; color: #e65100; }
.badge.espectador { background-color: #e3f2fd; color: #1565c0; }
.badge.categoria { background-color: #e8f5e9; color: #2e7d32; }
.alerta-erro { background-color: #ffebee; color: #c62828; padding: 20px; text-align: center; border-radius: 8px; }
</style>