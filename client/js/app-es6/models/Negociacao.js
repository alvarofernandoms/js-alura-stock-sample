class Negociacao {

  constructor(data, quantidade, valor) {
    this._data = new Date(data.getTime());
    this._quantidade = quantidade;
    this._valor = valor;
    Object.freeze(this);
  }

  get volume() {
    return this._quantidade * this._valor;
  }

  get data() {
    return new Date(this._data.getTime());
  }

  get quantidade() {
    return this._quantidade;
  }

  get valor() {
    return this._valor;
  }

  isEqual(outraNegociacao) {
    return this._data.getTime() == outraNegociacao._data.getTime() &&
      this._valor == outraNegociacao._valor;
    // return JSON.stringify(this) == JSON.stringify(outraNegociacao)
  }
}