#!/usr/bin/env node
import * as path from "path";
import {ServerApp} from "./ServerApp";

export interface IStaticServerSetting {
    dir: {
        html: string;
        upload: string;
    };
    http2?: boolean;
    ssl?: { key: string, cert: string }
    port: number;
    env: string;
}

const setting: IStaticServerSetting = {
    dir: {
        html: path.join('/app/client/web/www'),
        upload: '/upload'
    },
    http2: false,
    ssl: {
        key: '/ssl/server.key',
        cert: '/ssl/server.crt'
    },
    port: process.env.PORT || 80,
    env: process.env.NODE_ENV
};

let server = new ServerApp(setting);
server.init();
server.start();
