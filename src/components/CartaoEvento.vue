<template>
  <div class="cartao-evento">
    <h3>{{ evento.titulo }}</h3>
    <p><strong>Data:</strong> {{ evento.data }}</p>
    <p><strong>Envolvidos:</strong> {{ evento.pessoas.join(', ') }}</p>
  </div>
</template>

<script setup>
// defineProps permite que o componente receba dados (o evento) da página principal
defineProps({
  evento: {
    type: Object,
    required: true
  }
})
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
</style>