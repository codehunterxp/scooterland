import React from 'react';
import {
  NativeModules,
  AppRegistry,
} from 'react-360';
import config from '../../config';
import ServiceUser from './user';
import LayoutBarraUsuario from '../layout/barraUsuario';
const SessionStorage = NativeModules.SessionStorage;
const facebook = NativeModules.fbAuth;



export default class ServiceLogin extends React.Component {

  constructor(props) {
    super(props);
  }

  async postAutenticar(data) {
    return new Promise((resolve, reject) => {
      let url = `${config.api.host}/user/autenticar`;

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(async (response) => {
        let body = await response.json();

        if (response.status == 200) {
          this.salvarToken(body.token);
          global.UserLogado = true;
          global.UserData = body;
          resolve(body);
        } else {
          reject(response);
        }

      }).catch((erro) => {
        console.log(erro)
        reject(erro)
      })

    });
  }

  async verificarLogin() {
    let token = await this.getToken();
    let response = await ServiceUser.prototype.getUnico(token);
    if (String(token) == String(response.data.token)) {
      global.UserLogado = true;
      LayoutBarraUsuario.prototype.render();
      global.PanelFrenteTelaAtual = "ATUALIZAR";
      global.PanelTrasTelaAtual = "ATUALIZAR";
      global.PanelDireitaTelaAtual = "ATUALIZAR";
      global.PanelEsquerdaTelaAtual = "ATUALIZAR";
    } else {
      global.UserLogado = false;
      LayoutBarraUsuario.prototype.render();
      global.PanelFrenteTelaAtual = "ATUALIZAR";
      global.PanelTrasTelaAtual = "ATUALIZAR";
      global.PanelDireitaTelaAtual = "ATUALIZAR";
      global.PanelEsquerdaTelaAtual = "ATUALIZAR";
    }
  }

  sairDaConta() {
    SessionStorage.delete("token");
    global.UserLogado = false;
    global.LayoutBarraUsuario = "ATUALIZAR"
    global.PanelFrenteTelaAtual = "ATUALIZAR";
    global.PanelTrasTelaAtual = "ATUALIZAR";
    global.PanelDireitaTelaAtual = "ATUALIZAR";
    global.PanelEsquerdaTelaAtual = "ATUALIZAR";
    facebook.sair();
  }

  salvarToken(token) {
    SessionStorage.set("token", token);
  }

  async getToken() {
    return new Promise((resolve, reject) => {
      SessionStorage.get("token", async (token) => {
        if (token) {
          resolve(token);
        } else {
          reject(token);
        }
      });
    });
  }


};
AppRegistry.registerComponent('ServiceLogin', () => ServiceLogin);
