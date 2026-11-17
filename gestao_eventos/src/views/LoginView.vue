<template>
  <div class="login-container">
    <div class="login-cartao">
      <h1>Gestão de Eventos</h1>
      <p class="subtitulo">Faça login para aceder ao sistema</p>

      <!-- @submit.prevent impede a página de recarregar quando o formulário é submetido -->
      <form @submit.prevent="entrar">
        <div class="grupo-input">
          <label for="nome">Nome de Utilizador</label>
          <input type="text" id="nome" v-model="nome" required placeholder="Digite o seu nome..." />
        </div>

        <!-- senha -->
        <div class="grupo-input">
          <label for="senha">Senha</label>
          <input type="password" id="senha" v-model="senha" required placeholder="Digite a sua senha..." />
        </div>

        <button type="submit" class="btn-entrar">Entrar no Sistema</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { fazerLogin } from '../data/auth.js'

const router = useRouter()

// Variáveis para guardar o que o utilizador escreve
const nome = ref('')
const senha = ref('')

const entrar = async () => {
  if (!nome.value) return
  
  try {
    // Faz a requisição POST para o seu servidor backend Node.js
    const resposta = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Envia o nome e o papel escolhidos na tela
      body: JSON.stringify({ 
        nome: nome.value, 
        senha: senha.value 
      })
    })

    if (!resposta.ok) {
      alert("Falha na autenticação com a API.")
      return
    }

    // Recebe a resposta do backend (que inclui o Token de segurança)
    const dados = await resposta.json()
    
    // Atualiza o estado global com os dados vindos do servidor!
    fazerLogin({ nome: dados.nome, papel: dados.papel }, dados.token)
    
    // Redireciona para o calendário
    router.push('/calendario')
    
  } catch (erro) {
    alert("Erro de conexão com o servidor. O backend está rodando?")
    console.error(erro)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e0f2f1;
}

.login-cartao {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-top: 0;
  color: #00695c;
  text-align: center;
}

.subtitulo {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.grupo-input {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.grupo-input label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.grupo-input input,
.grupo-input select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-entrar {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-entrar:hover {
  background-color: #45a049;
}
</style>