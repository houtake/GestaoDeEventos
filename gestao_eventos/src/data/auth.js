import { ref } from 'vue'

export const utilizadorAtual = ref(null)
export const tokenAutenticacao = ref(null)

export const fazerLogin = (dadosUtilizador, token) => {
  utilizadorAtual.value = dadosUtilizador
  tokenAutenticacao.value = token
}

export const fazerLogout = () => {
  utilizadorAtual.value = null
  tokenAutenticacao.value = null
}