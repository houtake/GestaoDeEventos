<template>
  <div v-if="visivel" class="modal-fundo" @click.self="$emit('fechar')">
    <div class="modal-conteudo">
      <header class="modal-cabecalho">
        <h2>Eventos - {{ dia }}/{{ mes }}/{{ ano }}</h2>
        <button class="btn-fechar" @click="$emit('fechar')">X</button>
      </header>

      <div class="modal-corpo">
        <!-- Vista de Lista (quando não estamos a criar um evento) -->
        <div v-if="!mostrandoFormulario">
          <div v-if="eventos.length > 0">
            <CartaoEvento v-for="evento in eventos" :key="evento.id" :evento="evento" />
          </div>
          <div v-else class="sem-eventos">
            <p>Não existem eventos agendados para este dia.</p>
          </div>
        </div>

        <!-- Vista de Formulário (usando v-model para capturar dados) -->
        <div v-else class="formulario-evento">
          <input v-model="novoTitulo" placeholder="Título do Evento" class="input-form" />
          <select v-model="novoTipo" class="input-form">
            <option value="reuniao">Reunião</option>
            <option value="conferencia">Conferência</option>
          </select>
          <input v-model="novasPessoas" placeholder="Envolvidos (separados por vírgula)" class="input-form" />
        </div>
      </div>

      <footer class="modal-rodape">
        <button v-if="!mostrandoFormulario" class="btn-adicionar-modal" @click="mostrandoFormulario = true">
          + Novo Evento
        </button>
        <div v-else class="botoes-form">
          <button class="btn-cancelar" @click="cancelarFormulario">Cancelar</button>
          <button class="btn-guardar" @click="guardarEvento">Guardar</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CartaoEvento from './CartaoEvento.vue'

const props = defineProps({
  visivel: Boolean, dia: Number, mes: Number, ano: Number, eventos: Array
})

// Adicionamos 'adicionar' aos eventos que este componente pode emitir
const emit = defineEmits(['fechar', 'adicionar'])

// Variáveis reativas para o formulário
const mostrandoFormulario = ref(false)
const novoTitulo = ref('')
const novoTipo = ref('reuniao')
const novasPessoas = ref('')

const cancelarFormulario = () => {
  mostrandoFormulario.value = false
  novoTitulo.value = ''
  novasPessoas.value = ''
}

const guardarEvento = () => {
  if (!novoTitulo.value) {
    alert("O título é obrigatório!")
    return
  }

  const mesFormatado = props.mes.toString().padStart(2, '0')
  const diaFormatado = props.dia.toString().padStart(2, '0')
  
  const novoEvento = {
    id: Date.now(), // Gera um ID único temporário
    titulo: novoTitulo.value,
    data: `${props.ano}-${mesFormatado}-${diaFormatado}`,
    tipo: novoTipo.value,
    pessoas: novasPessoas.value.split(',').map(p => p.trim())
  }

  // Envia o novo evento para fora do componente
  emit('adicionar', novoEvento)
  cancelarFormulario()
}
</script>

<style scoped>
/* Mantemos o CSS anterior e adicionamos estilos para o formulário */
.modal-fundo { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-conteudo { background: white; width: 90%; max-width: 500px; border-radius: 8px; display: flex; flex-direction: column; max-height: 80vh; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
.modal-cabecalho { padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.modal-cabecalho h2 { margin: 0; font-size: 1.2rem; }
.btn-fechar { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #666; }
.modal-corpo { padding: 20px; overflow-y: auto; }
.sem-eventos { text-align: center; color: #888; padding: 20px 0; }
.modal-rodape { padding: 15px 20px; border-top: 1px solid #eee; text-align: right; }
.btn-adicionar-modal { background-color: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
.btn-adicionar-modal:hover { background-color: #45a049; }

/* Novos estilos do formulário */
.formulario-evento { display: flex; flex-direction: column; gap: 10px; }
.input-form { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
.botoes-form { display: flex; justify-content: flex-end; gap: 10px; }
.btn-cancelar { background-color: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
.btn-guardar { background-color: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
</style>