<template>
  <div class="cartao-evento">
    <div class="cabecalho-cartao">
      <h3>{{ evento.titulo }}</h3>
      
      <!-- Ações do Admin -->
      <div v-if="utilizadorAtual?.papel === 'admin'" class="acoes-admin">
        <button class="btn-acao" @click="$emit('editar', evento)">EDIT</button>
        <button class="btn-acao btn-excluir" @click="$emit('excluir', evento.id)">DEL</button>
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
.btn-excluir {
  background-color: rgb(255, 0, 0);
  border-radius: 5px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
}
.acoes-admin { display: flex; gap: 8px; }

.btn-acao { background: none; 
  border: none; cursor: pointer; 
  font-size: 1.1rem; opacity: 0.7; }

.btn-acao:hover { opacity: 1; }
</style>