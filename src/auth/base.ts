import { Request } from '../lib/request';
import { Cache } from '../lib/cache';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_Expire,
  REFRESH_TOKEN,
  Config
} from '../types';

export default class {
  httpRequest: Request;
  cache: Cache;
  accessTokenKey: string;
  accessTokenExpireKey: string;
  refreshTokenKey: string;

  constructor(config: Config) {
    this.httpRequest = new Request(config);
    this.cache = new Cache(config.persistence);

    this.accessTokenKey = `${ACCESS_TOKEN}_${config.env}`;
    this.accessTokenExpireKey = `${ACCESS_TOKEN_Expire}_${config.env}`;
    this.refreshTokenKey = `${REFRESH_TOKEN}_${config.env}`;
  }

  setRefreshToken(refreshToken) {
    this.cache.setStore(this.refreshTokenKey, refreshToken);
  }

  public getRefreshTokenByWXCode(appid: string, loginType: string, code: string): any {
    const action = 'auth.getJwt';

    let self = this;
    return this.httpRequest.send(action, { appid, loginType, code }).then(res => {
      if (res.code) {
        throw new Error(`[tcb-js-sdk] 微信登录失败: ${res.code}`);
      }
      if (res.refresh_token) {
        self.cache.setStore(self.refreshTokenKey, res.refresh_token);
      }
      return res;
    });
  }
}
