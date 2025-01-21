export const LeafConfig = {
  log: {
    level: 'trace',
  },
  dns: {
    servers: ['8.8.8.8', '8.8.4.4'],
  },
  inbounds: [
    {
      protocol: 'tun',
      settings: {
        name: 'REPLACE-ME-WITH-THE-ADAPTER-NAME',
        mtu: 1500,
        address: '10.0.0.2',
        gateway: '10.0.0.1',
        netmask: '255.255.255.0',
        dns: ['8.8.8.8', '8.8.4.4'],
        persist: true,
        skipMulticast: false,
      },
    },
  ],
  outbounds: [
    {
      protocol: 'failover',
      settings: {
        actors: ['vless_ws'],
        failTimeout: 3,
        checkInterval: 60,
        failover: true,
        fallbackCache: false,
        cacheSize: 256,
        cacheTimeout: 60,
        healthCheck: true,
        healthCheckTimeout: 6,
        healthCheckOnStart: true,
        healthCheckWait: false,
        healthCheckAttempts: 6,
        healthCheckSuccessPercentage: 60,
        healthCheckPrefers: ['vless_ws'],
      },
      tag: 'shadowsocks_out',
    },
    {
      protocol: 'shadowsocks',
      settings: {
        address: '95.216.27.40',
        method: 'chacha20-ietf-poly1305',
        password: 'NyIze2YkXVpyTWB3UnF+bFhvZEdBYERNSExZXEpteTw=',
        port: 3587,
        prefix: 'HTTP%2F1.1%20',
      },
      tag: 'shadowsocks',
    },
    {
      protocol: 'chain',
      settings: {
        actors: ['vless_chain_ws', 'vless_chain'],
      },
      tag: 'vless_ws',
    },
    {
      protocol: 'ws',
      settings: {
        path: '/websocket/vl/',
      },
      tag: 'vless_chain_ws',
    },
    {
      protocol: 'vless',
      settings: {
        address: '190.2.150.125',
        uuid: '352ec8f9-816c-5a65-9f54-0edb2378db9b',
        port: 443,
      },
      tag: 'vless_chain',
    },
    {
      protocol: 'vless',
      settings: {
        address: '23.158.56.37',
        uuid: '6ac89e3d-9d9a-59cc-a99d-f377f8bc2fb1',
        port: 4091,
      },
      tag: 'vless',
    },

    {
      protocol: 'chain',
      settings: {
        actors: ['shadowsocks_chain_ws', 'shadowsocks_chain'],
      },
      tag: 'shadowsocks_ws',
    },
    {
      protocol: 'ws',
      settings: {
        path: '/websocket/',
      },
      tag: 'shadowsocks_chain_ws',
    },
    {
      protocol: 'shadowsocks',
      settings: {
        address: '95.216.27.40',
        method: 'chacha20-ietf-poly1305',
        password: 'NyIze2YkXVpyTWB3UnF+bFhvZEdBYERNSExZXEpteTw=',
        port: 6489,
      },
      tag: 'shadowsocks_chain',
    },
    {
      protocol: 'vmess',
      settings: {
        address: '95.216.27.40',
        port: 4283,
        uuid: '47a62c64-cee9-5c51-b0f6-a7f94f07ac12',
        security: 'chacha20-ietf-poly1305',
      },
      tag: 'vmess',
    },
    {
      protocol: 'chain',
      settings: {
        actors: ['vmess_chain_ws', 'vmess_chain'],
      },
      tag: 'vmess_ws',
    },
    {
      protocol: 'ws',
      settings: {
        path: '/websocket/',
      },
      tag: 'vmess_ws',
    },
    {
      protocol: 'vmess',
      settings: {
        address: '95.216.27.40',
        port: 8835,
        uuid: '47a62c64-cee9-5c51-b0f6-a7f94f07ac12',
        security: 'chacha20-ietf-poly1305',
      },
      tag: 'vmess_chain',
    },
    {
      protocol: 'direct',
      tag: 'direct_out',
    },
    {
      protocol: 'drop',
      tag: 'drop_out',
    },
  ],
  router: {
    domainResolve: true,
    rules: [
      {
        ip: [
          '0.0.0.0/8',
          '10.0.0.0/8',
          '100.64.0.0/10',
          '172.16.0.0/12',
          '192.0.0.0/24',
          '192.168.0.0/16',
          '224.0.0.0/4',
          '240.0.0.0/4',
          '255.255.255.255/32',
          '224.0.0.0/3',
          '208.54.0.0/16',
          '129.192.166.0/24',
          '109.249.0.0/16',
          '68.31.26.0/24',
          '141.207.0.0/16',
          '217.116.96.0/20',
        ],
        target: 'direct_out',
      },
      {
        domainKeyword: [
          'app-wizard.io',
          'link.app-wizard.io',
          'geojs.io',
          'get.geojs.io',
        ],
        target: 'direct_out',
      },
    ],
  },
};
