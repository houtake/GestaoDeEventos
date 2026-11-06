<template>
  <div class="grelha-calendario">
    <div class="dias-semana">
      <div v-for="dia in diasSemana" :key="dia" class="dia-cabecalho">{{ dia }}</div>
    </div>
    
    <div class="dias-mes">
      <!-- Adicionámos o @click para preparar a expansão do dia -->
      <div 
        v-for="dia in diasDoMes" 
        :key="dia" 
        class="dia-celula"
        @click="abrirDia(dia)"
      >
        <span class="numero-dia">{{ dia }}</span>
        
        <!-- Mostra os eventos correspondentes a este dia -->
        <div class="eventos-do-dia">
          <div 
            v-for="evento in eventosDoDia(dia)" 
            :key="evento.id" 
            class="etiqueta-evento"
            :class="evento.tipo"
          >
            {{ evento.titulo }}
          </div>
        </div>
      </div>
    </div>
    <ModalDia 
      :visivel="modalAberto"
      :dia="diaSelecionado"
      :mes="mesAtual"
      :ano="anoAtual"
      :eventos="diaSelecionado ? eventosDoDia(diaSelecionado) : []"
      @fechar="fecharModal"
      @adicionar="(evento) => emit('adicionar-evento', evento)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDia from './ModalDia.vue' // Importamos o novo modal

const props = defineProps({
  eventos: { type: Array, required: true },
  mesAtual: { type: Number, default: 10 },
  anoAtual: { type: Number, default: 2026 }
})
const emit = defineEmits(['adicionar-evento'])

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const diasDoMes = ref(Array.from({ length: 31 }, (_, i) => i + 1))

// Novos estados para controlar o modal
const modalAberto = ref(false)
const diaSelecionado = ref(null)

const eventosDoDia = (dia) => {
  return props.eventos.filter(evento => {
    const diaFormatado = dia.toString().padStart(2, '0')
    const mesFormatado = props.mesAtual.toString().padStart(2, '0')
    const dataComparacao = `${props.anoAtual}-${mesFormatado}-${diaFormatado}`
    return evento.data === dataComparacao
  })
}

// Substituímos o alert() pela abertura do modal
const abrirDia = (dia) => {
  diaSelecionado.value = dia
  modalAberto.value = true
}

const fecharModal = () => {
  modalAberto.value = false
  diaSelecionado.value = null
}
</script>

<style scoped>
.grelha-calendario {
  margin-top: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
}

.dias-mes {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.dia-celula {
  border: 1px solid #eaeaea;
  min-height: 100px;
  padding: 8px;
  border-radius: 4px;
  transition: border-color 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.dia-celula:hover {
  border-color: #4CAF50;
  background-color: #f9fff9;
}

.numero-dia {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

/* Estilos para as miniaturas dos eventos dentro do calendário */
.eventos-do-dia {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 5px;
}

.etiqueta-evento {
  font-size: 0.75rem;
  padding: 4px 6px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #e0f2f1; /* Cor padrão */
  color: #00695c;
}

/* Cores dinâmicas baseadas no tipo de evento */
.etiqueta-evento.reuniao {
  background-color: #e3f2fd;
  color: #1565c0;
}

.etiqueta-evento.conferencia {
  background-color: #f3e5f5;
  color: #7b1fa2;
}
</style>