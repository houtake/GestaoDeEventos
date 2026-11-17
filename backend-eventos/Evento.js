class Evento {
  // Construtor para inicializar as 6 propriedades
  constructor(id, titulo, data, tipo, descricao, pessoas = []) {
    this._id = id;
    this._titulo = titulo;
    this._data = data;
    this._tipo = tipo;
    this._descricao = descricao;
    this._pessoas = pessoas;
  }

  // Getters
  get id() { return this._id; }
  get titulo() { return this._titulo; }
  get data() { return this._data; }
  get tipo() { return this._tipo; }
  get descricao() { return this._descricao; }
  get pessoas() { return this._pessoas; }

  // Setters exigidos
  set titulo(novoTitulo) {
    if (!novoTitulo || novoTitulo.trim() === '') {
      throw new Error('O título é obrigatório.');
    }
    this._titulo = novoTitulo;
  }
  set data(novaData) { this._data = novaData; }
  set tipo(novoTipo) { this._tipo = novoTipo; }
  set descricao(novaDescricao) { this._descricao = novaDescricao; }
  set pessoas(novasPessoas) { this._pessoas = novasPessoas; }

  //converte pra json sem erro de formatacao
  
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      data: this.data,
      tipo: this.tipo,
      descricao: this.descricao,
      pessoas: this.pessoas
    };
  }
  //reusmo do evento
  obterResumo() {
    return `${this._titulo} agendado para ${this._data}. Tipo: ${this._tipo}`;
  }
}

module.exports = Evento;