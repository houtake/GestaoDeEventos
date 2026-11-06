<template>
  <div class="calendario-container">
    <header class="cabecalho">
      <h1>Calendário de Eventos</h1>
      <button class="btn-adicionar">+ Novo Evento</button>
    </header>
    
    <!-- Novo Componente de Grelha -->
   <!-- Passamos a lista de eventos e o mês/ano que queremos visualizar -->
    <GrelhaCalendario 
      :eventos="eventosMock" 
      :mesAtual="10" 
      :anoAtual="2026" 
      @adicionar-evento="lidarComNovoEvento"
    />
    
    <!-- Mantemos a lista abaixo temporariamente para referência -->
    <h2 class="titulo-secao">Próximos Eventos</h2>
    <div class="lista-eventos">
      <CartaoEvento 
        v-for="evento in eventosMock" 
        :key="evento.id" 
        :evento="evento" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CartaoEvento from '../components/CartaoEvento.vue'
import GrelhaCalendario from '../components/GrelhaCalendario.vue'
import { eventos } from '../data/eventos.js'

const eventosMock = ref(eventos)

const lidarComNovoEvento = (novoEvento) => {
  // .push() adiciona o item ao final da nossa lista reativa
  eventosMock.value.push(novoEvento)
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