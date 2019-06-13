import {axios} from '../axios';
import config from '../config';
// tslint:disable-next-line
const Ipfs = require('ipfs');

const options = {
    repo: 'ipfs-' + String(Math.random() + Date.now()),
    config: {
        Addresses: {
            API: '/ip4/127.0.0.1/tcp/5001',
            Gateway: '/ip4/127.0.0.1/tcp/8080'
        },
        API: {
            HTTPHeaders: {
                'Access-Control-Allow-Methods': ['PUT', 'GET', 'POST'],
                // tslint:disable-next-line: no-http-string
                'Access-Control-Allow-Origin': ['http://localhost:5001', 'http://127.0.0.1:5001', 'https://webui.ipfs.io']
            }
        }
    }
};

export const node = new Ipfs(options);

// Add and retrive content from IPFS
export const addToIpfs = async (_title: String, _text: String) => {
    // const textToBeAdded = `Going to add title ${title} and text ${text}`;
    const textObj = {title: _title, content: _text};
    const textToBeAdded = JSON.stringify(textObj);
    console.log(textToBeAdded);
    const files = [
        {
            path: '/tmp/myfile.txt',
            content: Ipfs.Buffer.from(textToBeAdded)
        }
    ];

    const filesAdded = await node.add(files);
    console.log(' [ ipfs add ] Added file:', filesAdded);

    // try to retrieve both hashes now
    const fileBuffer = await node.cat(filesAdded[1].hash); //filesAdded[0].hash
    console.log('[ ipfs retrieve ] Content from hash:', fileBuffer.toString());
    const directoryFile = await filesAdded.find((f: any) => f.path === 'tmp');
    const directoryBuffer = await node.cat(`/ipfs/${directoryFile.hash}/myfile.txt`);
    console.log('[ ipfs retrieve ] Content from dir:', directoryBuffer.toString());
    return filesAdded[1].hash;
};

export const initializeIpfs = () => {
    // getRemoteID
    try {
        axios.get<any>(`${config.APP_API_ENDPOINT}/ipfs/id`, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
                // Authorization: `Bearer ${authState.token}`
            }
        }).then((response) => {
            console.log(' [ initialize ipfs ] remote ipfs ID', response.data);
            console.log(' [ initialize ipfs ] Online status: ', node.isOnline() ? 'online' : 'offline');
            node.once('ready', () => {
                console.log(' [ initialize ipfs ] IPFS node is ready');
                node.id((err: any, res: any) => {
                    if (err) {
                        console.error(' [initialize ipfs] id query failed', err);
                        throw err;
                    }
                    console.log(' [ initialize ipfs ] Online status: ', node.isOnline() ? 'online' : 'offline');
                    console.log(' [ initialize ipfs ]  The node identity is: ', res.id);
                });
                try {
                    node.swarm.connect(
                        // // trying to connect to an ipfs daemon running on localhost
                        // '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmVJQDXoLqfBpBwBVmi96zbuD3eQazQf274EEwLB6BNWaZ'
                        // trying to connect to the websocket of backend ipfs daemon
                        // '/ip4/172.20.0.3/tcp/8081/wss/ipfs/QmXj2T16CdqruPPQ7WSseHDyXyeex29i6LmqDiVacMhkkW'
                        // or 127.0.0.1
                        `/ip4/127.0.0.1/tcp/8081/ws/ipfs/${response.data}`
                        // // This information is in align with the daemon. Connecting through websocket by the hash. Config could be found and set at "~/.ipfs/config"
                        // , (err: any, res: any) => {
                        //     if (err) {
                        //         console.error(' [initialize ipfs ] Websocket connection tempt failed', err);
                        //         throw err;
                        //     }
                        //     // if no err is present, connection is now open
                        //     console.log(' [ initialize ipfs ] Websocket connection is added', res);
                        // }
                    );
                } catch (e) {
                    console.error(' [ initialize ipfs try] ', e);
                    throw e;
                }
            });
            node.once('error', (error: any) => {
                console.error('Something went terribly wrong!', error);
            });
            node.once('start', () => console.log('Node started!'));
        });
        // const results = response.data[0].hits.hits.map((item: any) => {
        //     return item._source;
    } catch (error) {
        console.log(' >>> submit failed!', error);
    }
    
};
