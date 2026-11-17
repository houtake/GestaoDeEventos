<template>
  <div class="cartao-evento">
    <div class="cabecalho-cartao">
      <h3>{{ evento.titulo }}</h3>
      
      <!-- Ações do Admin -->
      <div v-if="utilizadorAtual?.papel === 'admin'" class="acoes-admin">
        <button class="btn-editar" @click="$emit('editar', evento)">EDIT</button>
        <button class="btn-del" @click="$emit('excluir', evento.id)">DEL</button>
      </div>
    </div>
    <p><strong>Data:</strong> {{ evento.data }}</p>
    <p><strong>Envolvidos:</strong> {{ evento.pessoas.join(', ') }}</p>
  </div>
</template>

<script setup>
import { utilizadorAtual } from '../data/auth.js'

defineProps({
  evento: {
    type: Object,
    required: true
  }
})

// Declara que este componente pode emitir o evento 'excluir'
defineEmits(['excluir'])
</script>

<style scoped>
.cartao-evento {
  background-color: white;
  border-left: 4px solid #4CAF50;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.cabecalho-cartao {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.cabecalho-cartao h3 {
  margin: 0 0 10px 0;
}

.btn-del {
  background-color: #f44336; /* Vermelho padrão */
  color: white; /* Texto em branco */
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-del:hover {
  background-color: #d32f2f; /* Vermelho mais escuro ao passar o rato */
}

.btn-editar {
  background-color: #2196F3; /* Azul padrão */
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-editar:hover {
  background-color: #1976D2; /* Azul mais escuro ao passar o rato */
}

.acoes-admin { display: flex; gap: 8px; }

.btn-acao { background: none; 
  border: none; cursor: pointer; 
  font-size: 1.1rem; opacity: 0.7; }

.btn-acao:hover { opacity: 1; }
</style>