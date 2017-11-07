import { HttpService } from './HttpService';
import { ConnectionFactory } from "./ConnectionFactory";
import { NegociacaoDao } from "../dao/NegociacaoDao";
import { Negociacao } from "../models/Negociacao";

export class NegociacaoService {
  constructor() {
    this._http = new HttpService();
  }

  _obterNegociacoesDaSemana() {
    return this._http
      .get('negociacoes/semana')
      .then(negociacoes => {
        return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
      })
      .catch(erro => {
        console.log(erro);
        throw new Error('Não foi possível obter as negociações da semana');
      })
  }

  _obterNegociacoesDaSemanaAnterior() {
    return this._http
      .get('negociacoes/anterior')
      .then(negociacoes => {
        return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
      })
      .catch(erro => {
        console.log(erro);
        throw new Error('Não foi possível obter as negociações da semana anterior');
      })
  }

  _obterNegociacoesDaSemanaRetrasada() {
    return this._http
      .get('negociacoes/retrasada')
      .then(negociacoes => {
        return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
      })
      .catch(erro => {
        console.log(erro);
        throw new Error('Não foi possível obter as negociações da semana retrasada');
      })
  }

  obterNegociacoes() {
    return Promise.all([
      this._obterNegociacoesDaSemana(),
      this._obterNegociacoesDaSemanaAnterior(),
      this._obterNegociacoesDaSemanaRetrasada()
    ]).then(periodos => {
      let negociacoes = periodos
        .reduce((dados, periodo) => dados.concat(periodo), []);
      return negociacoes;
    }).catch(erro => {
      throw new Error(erro);
    });
  }

  cadastra(negociacao) {
    return ConnectionFactory
      .getConnection()
      .then(conexao => new NegociacaoDao(conexao))
      .then(dao => dao.adiciona(negociacao))
      .then(() => 'Negociação cadastrada com sucesso')
      .catch(erro => {
        console.log(erro);
        throw new Error('Não foi possível adicionar a negociação')
      });
  }

  lista() {
    return ConnectionFactory
      .getConnection()
      .then(connection => new NegociacaoDao(connection))
      .then(dao => dao.listaTodos())
      .catch(erro => {
        console.log(erro);
        throw new Error('Não foi possível obter as negociações')
      })
  }

  apaga() {
    return ConnectionFactory
      .getConnection()
      .then(connection => new NegociacaoDao(connection))
      .then(dao => dao.apagaTodos())
      .then(() => 'Negociações apagadas com sucesso')
      .catch(erro => {
        console.log(erro);
        throw new Error('Não foi possível apagar as negociações');
      })
  }

  importa(listaAtual) {
    return this.obterNegociacoes()
      .then(negociacoes =>
        negociacoes.filter(negociacao =>
          !listaAtual.some(negociacaoExistente =>
            negociacao.isEqual(negociacaoExistente)))
      )
      .catch(erro => {
        console.log(erro);
        throw new Error('Não foi possível importar as negociações');
      })
  }
}
